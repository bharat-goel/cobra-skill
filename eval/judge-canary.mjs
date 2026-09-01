#!/usr/bin/env node
// Does the judge actually discriminate?
//
// A judge that passes everything produces a clean-looking null, and a null is
// exactly what this repo keeps measuring. So before believing one, feed the judge
// replies whose verdicts are known in advance -- including a reply stuffed with the
// skill's own vocabulary that does none of the work -- and check it gets them right.
//
//   node eval/judge-canary.mjs --judge-model sonnet --reps 3
//
// Exits non-zero if any canary is graded wrongly. Re-run whenever a rubric changes.

import { readFileSync, readdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { mkdtempSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { judgePrompt, parseVerdict } from "./judge-prompt.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SANDBOX = mkdtempSync(join(tmpdir(), "judge-canary-"));

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const JUDGE_MODEL = arg("judge-model", "sonnet");
const REPS = Number(arg("reps", 3));
const CONC = Number(arg("concurrency", 6));

const canaries = JSON.parse(readFileSync(join(HERE, "judge-canaries.json"), "utf8"));
const tasks = Object.fromEntries(
  readdirSync(join(HERE, "tasks"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(HERE, "tasks", f), "utf8")))
    .map((t) => [t.id, t]),
);

const jobs = [];
for (const [taskId, cases] of Object.entries(canaries)) {
  if (taskId.startsWith("_")) continue;
  const task = tasks[taskId];
  if (!task) {
    console.error(`Canary references task "${taskId}", which does not exist in eval/tasks/.`);
    process.exit(1);
  }
  if (task.verify.type !== "judge") {
    console.error(`Task "${taskId}" is not judge-scored; a canary for it grades nothing.`);
    process.exit(1);
  }
  for (const c of cases) for (let rep = 1; rep <= REPS; rep++) jobs.push({ task, ...c, rep });
}

// A rubric with no failing canary is untested in the direction that matters: the
// only way a lenient judge shows up is a bad reply it waves through.
for (const [taskId, cases] of Object.entries(canaries)) {
  if (taskId.startsWith("_")) continue;
  if (!cases.some((c) => c.expect === "FAIL") || !cases.some((c) => c.expect === "PASS")) {
    console.error(`Task "${taskId}" needs at least one expected-FAIL and one expected-PASS canary.`);
    process.exit(1);
  }
}

function runClaude(prompt) {
  const args = ["-p", "--setting-sources", "project", "--model", JUDGE_MODEL, "--output-format", "json", prompt];
  return new Promise((res) => {
    const p = spawn("claude", args, { cwd: SANDBOX });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.on("close", () => {
      try {
        const j = JSON.parse(out);
        res(typeof j.result === "string" ? j.result.trim() : "");
      } catch { res(""); }
    });
    p.on("error", () => res(""));
  });
}

console.log(`${jobs.length} canary gradings | judge=${JUDGE_MODEL} | reps=${REPS}`);

const results = [];
let done = 0;
async function worker(queue) {
  while (queue.length) {
    const j = queue.shift();
    const text = await runClaude(judgePrompt(j.task, j.reply));
    const v = text ? parseVerdict(text) : null;
    const got = v === null ? "ERROR" : v.pass ? "PASS" : "FAIL";
    results.push({ task: j.task.id, label: j.label, expect: j.expect, got, rep: j.rep, why: v?.why ?? "no verdict returned" });
    done++;
    process.stdout.write(`\r  ${done}/${jobs.length}`);
  }
}
// One shared queue that every worker drains. Handing each worker its own copy
// runs the whole suite once per worker -- silently multiplying both the rep count
// and the bill by the concurrency.
const queue = [...jobs];
await Promise.all(Array.from({ length: Math.min(CONC, queue.length) }, () => worker(queue)));
process.stdout.write("\n\n");

// A call that never returned a verdict is not the judge disagreeing -- it told us
// nothing at all. Counting it as a misgrade condemns a sound rubric for a dropped
// HTTP request; counting it as agreement hides an outage behind a clean report.
// It is tracked as its own category and excluded from the denominator.
const groups = new Map();
for (const r of results) {
  const k = `${r.task}|${r.label}`;
  if (!groups.has(k)) groups.set(k, { task: r.task, label: r.label, expect: r.expect, agree: 0, graded: 0, errors: 0, wrong: [] });
  const g = groups.get(k);
  if (r.got === "ERROR") { g.errors++; continue; }
  g.graded++;
  if (r.got === r.expect) g.agree++;
  else g.wrong.push(r.why);
}

let bad = 0, errors = 0;
const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad("TASK", 22)} ${pad("CANARY", 26)} EXPECT  AGREE   VERDICT`);
for (const g of groups.values()) {
  errors += g.errors;
  const ok = g.graded > 0 && g.agree === g.graded;
  if (!ok) bad++;
  const note = g.graded === 0 ? "NO VERDICT EVER RETURNED" : ok ? "ok" : `MISGRADED — ${g.wrong[0]}`;
  console.log(`${pad(g.task, 22)} ${pad(g.label, 26)} ${pad(g.expect, 7)} ${pad(`${g.agree}/${g.graded}`, 7)} ${note}${g.errors ? `  (+${g.errors} failed to run)` : ""}`);
}

if (errors) console.log(`\n${errors}/${results.length} gradings failed to return a verdict and are excluded, not counted either way.`);
if (bad) {
  console.log(`\n!! ${bad} canary case(s) misgraded. Do not trust a null from this judge until the rubric is fixed.`);
  process.exit(1);
}
console.log(`\nAll ${groups.size} canary cases graded correctly at ${REPS} reps. The judge discriminates.`);
