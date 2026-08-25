#!/usr/bin/env node
// Does the description actually fire?
//
// The paired harness in run.mjs measures skill *content* -- it injects SKILL.md
// directly. That says nothing about whether a skill activates on its own, which for
// an installed skill is the thing that matters most: one that never fires is
// indistinguishable from one that does not exist.
//
// This is a classifier evaluation. Positive prompts should activate the named skill;
// negative prompts should activate neither. Runs use default setting sources (so the
// installed user skills are visible) from an empty directory outside the repo (so no
// CLAUDE.md or repo file can hint). Activation is detected from stream-json: a
// tool_use event for the Skill tool naming the skill.
//
//   node eval/trigger.mjs --reps 3 --model sonnet

import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SANDBOX = mkdtempSync(join(tmpdir(), "trigger-eval-"));
const OURS = ["system-triage", "cobra"];

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : d;
};
const REPS = Number(arg("reps", 3));
const MODEL = arg("model", "sonnet");
const CONC = Number(arg("concurrency", 5));

const { prompts } = JSON.parse(readFileSync(join(HERE, "trigger-prompts.json"), "utf8"));

function firedSkills(streamJson) {
  const fired = new Set();
  for (const line of streamJson.split("\n")) {
    let e;
    try { e = JSON.parse(line); } catch { continue; }
    const items = e?.message?.content;
    if (!Array.isArray(items)) continue;
    for (const c of items) {
      if (c.type === "tool_use" && c.name === "Skill" && c.input?.skill) fired.add(c.input.skill);
    }
  }
  return [...fired];
}

// NOTE: default setting sources here, unlike run.mjs. The whole point is to let the
// installed skills be visible and see whether they activate unprompted.
const run = (prompt) =>
  new Promise((res) => {
    const p = spawn("claude", ["-p", "--output-format", "stream-json", "--verbose", "--model", MODEL, prompt], { cwd: SANDBOX });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.on("close", (code) => res({ out, code }));
    p.on("error", () => res({ out: "", code: -1 }));
  });

const jobs = [];
prompts.forEach((p, i) => { for (let r = 1; r <= REPS; r++) jobs.push({ p, i, rep: r }); });

const STAMP = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const OUT = join(HERE, "results", `trigger-${STAMP}`);
mkdirSync(join(OUT, "raw"), { recursive: true });
console.log(`${jobs.length} runs (${prompts.length} prompts x ${REPS} reps) | model=${MODEL}`);

const recs = [];
let done = 0;
async function worker(q) {
  while (q.length) {
    const { p, i, rep } = q.shift();
    const { out, code } = await run(p.text);
    writeFileSync(join(OUT, "raw", `p${String(i).padStart(2, "0")}__rep${rep}.jsonl`), out);
    const fired = code === 0 ? firedSkills(out).filter((s) => OURS.includes(s)) : [];
    recs.push({ i, rep, expect: p.expect, text: p.text, fired, ok: p.expect ? fired.includes(p.expect) : fired.length === 0 });
    done++;
    process.stdout.write(`\r  ${done}/${jobs.length}`);
  }
}
const q = [...jobs];
await Promise.all(Array.from({ length: Math.min(CONC, q.length) }, () => worker(q)));
process.stdout.write("\n\n");

const pct = (n, d) => (d ? `${((n / d) * 100).toFixed(0)}%` : "n/a");
let md = `# Trigger evaluation — ${STAMP}\n\nModel \`${MODEL}\`, ${REPS} reps, ${jobs.length} runs.\nDefault setting sources (installed skills visible), empty cwd outside the repo.\nActivation detected from a \`Skill\` tool_use event in stream-json.\n\n`;

for (const skill of OURS) {
  const pos = recs.filter((r) => r.expect === skill);
  const hit = pos.filter((r) => r.ok).length;
  md += `## ${skill}\n\n**Recall: ${pct(hit, pos.length)}** (${hit}/${pos.length} runs on prompts it should catch)\n\n`;
  md += `| Prompt | Fired |\n|---|---|\n`;
  const byPrompt = [...new Set(pos.map((r) => r.i))];
  for (const i of byPrompt) {
    const rs = pos.filter((r) => r.i === i);
    md += `| ${rs[0].text.slice(0, 78)}${rs[0].text.length > 78 ? "…" : ""} | ${rs.filter((r) => r.ok).length}/${rs.length} |\n`;
  }
  md += `\n`;
}

const negs = recs.filter((r) => r.expect === null);
const clean = negs.filter((r) => r.ok).length;
md += `## Negatives — should fire nothing\n\n**Silence: ${pct(clean, negs.length)}** (${clean}/${negs.length} runs clean)\n\n| Prompt | False fires |\n|---|---|\n`;
for (const i of [...new Set(negs.map((r) => r.i))]) {
  const rs = negs.filter((r) => r.i === i);
  const bad = rs.filter((r) => !r.ok);
  md += `| ${rs[0].text.slice(0, 78)} | ${bad.length}/${rs.length}${bad.length ? ` (${[...new Set(bad.flatMap((b) => b.fired))].join(", ")})` : ""} |\n`;
}
md += `\nA false fire means the skill loaded on a prompt it has no business on, spending context and steering an unrelated answer.\n`;

writeFileSync(join(OUT, "report.md"), md);
writeFileSync(join(OUT, "summary.json"), JSON.stringify({ stamp: STAMP, model: MODEL, reps: REPS, recs }, null, 2));

for (const skill of OURS) {
  const pos = recs.filter((r) => r.expect === skill);
  console.log(`${skill.padEnd(18)} recall ${pct(pos.filter((r) => r.ok).length, pos.length).padStart(4)}  (${pos.filter((r) => r.ok).length}/${pos.length})`);
}
console.log(`${"negatives".padEnd(18)} silent ${pct(clean, negs.length).padStart(4)}  (${clean}/${negs.length})`);
console.log(`\nReport: eval/results/trigger-${STAMP}/report.md`);
