#!/usr/bin/env node
// Paired evaluation for the skills in this repo.
//
// Each task runs twice under identical conditions except one variable: whether
// the skill's SKILL.md is in context. Control and treatment both use
// `--setting-sources project`, which makes the installed user skills invisible,
// so the only thing that differs is the injected content.
//
//   node eval/run.mjs --reps 3 --model sonnet
//   node eval/run.mjs --task ic-coverage-gate --reps 5
//
// Design follows SkillsBench (arXiv 2602.12670): paired conditions, deterministic
// verifiers, delta in percentage points. Harm tasks check the skill stays quiet
// where it should — that paper found 16 of 84 tasks got *worse* with skills.

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { mkdtempSync, cpSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const SANDBOX = mkdtempSync(join(tmpdir(), "skill-eval-"));

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const REPS = Number(arg("reps", 3));
const MODEL = arg("model", "sonnet");
const CONC = Number(arg("concurrency", 4));
const ONLY_TASK = arg("task", null);
const ONLY_SKILL = arg("skill", null);
const DRY = process.argv.includes("--dry-run");

const tasks = readdirSync(join(HERE, "tasks"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(HERE, "tasks", f), "utf8")))
  .filter((t) => (!ONLY_TASK || t.id === ONLY_TASK) && (!ONLY_SKILL || t.skill === ONLY_SKILL));

if (!tasks.length) {
  console.error("No tasks matched.");
  process.exit(1);
}

// ---- verifiers -------------------------------------------------------------
// Deterministic and auditable: every decision is a substring test over the raw
// reply, and the raw reply is written to disk so any verdict can be re-checked.

// A reply that says "don't investigate yet, stabilise first" mentions diagnosis
// before rollback, but advocates the opposite. Naive ordering marks the better
// answer wrong -- observed at -100pp before this was fixed. So an occurrence
// preceded by a negation cue is skipped and the next one considered.
const NEGATIONS = [
  "don't", "do not", "not ", "never", "avoid", "rather than", "instead of",
  "without", "no need to", "before you", "premature", "resist", "skip",
  "hold off", "defer", "later", "only once", "only after", "after you",
];

const firstUnnegated = (hay, pats, window = 45) => {
  let best = -1;
  for (const p of pats) {
    const needle = p.toLowerCase();
    let from = 0;
    for (;;) {
      const i = hay.indexOf(needle, from);
      if (i === -1) break;
      const ctx = hay.slice(Math.max(0, i - window), i);
      if (!NEGATIONS.some((n) => ctx.includes(n))) {
        if (best === -1 || i < best) best = i;
        break;
      }
      from = i + needle.length;
    }
  }
  return best;
};

function verify(spec, output) {
  const hay = output.toLowerCase();
  const words = output.trim().split(/\s+/).filter(Boolean).length;

  if (spec.maxWords && words > spec.maxWords) {
    return { pass: false, why: `over length: ${words} > ${spec.maxWords} words` };
  }
  switch (spec.type) {
    case "any": {
      const hit = spec.patterns.find((p) => hay.includes(p.toLowerCase()));
      return hit
        ? { pass: true, why: `matched "${hit}"` }
        : { pass: false, why: "no required pattern present" };
    }
    case "none": {
      const hit = spec.patterns.find((p) => hay.includes(p.toLowerCase()));
      return hit
        ? { pass: false, why: `leaked "${hit}"` }
        : { pass: true, why: `clean (${words} words)` };
    }
    case "ordered": {
      const b = firstUnnegated(hay, spec.before);
      const a = firstUnnegated(hay, spec.after);
      if (b === -1) return { pass: false, why: "no stabilising action proposed" };
      if (a !== -1 && a < b) return { pass: false, why: "diagnosis proposed before stabilising" };
      return { pass: true, why: "stabilise precedes diagnose" };
    }
    default:
      throw new Error(`unknown verifier type: ${spec.type}`);
  }
}

// ---- runner ----------------------------------------------------------------

// A task may declare a fixture: a small project copied fresh for every run, so a
// run that edits files cannot contaminate the next one. Tasks without a fixture
// share one empty directory. Both live outside the repo.
function makeCwd(task) {
  if (!task.fixture) return SANDBOX;
  const dir = mkdtempSync(join(tmpdir(), "skill-eval-fx-"));
  cpSync(join(HERE, "fixtures", task.fixture), dir, { recursive: true });
  return dir;
}

function runClaude(prompt, skillFile, cwd) {
  const args = ["-p", "--setting-sources", "project", "--model", MODEL];
  if (skillFile) args.push("--append-system-prompt-file", skillFile);
  args.push(prompt);
  return new Promise((res) => {
    // Runs execute in an empty directory outside the repo. Running in ROOT let the
    // control arm read the skills off disk and inherit the parent CLAUDE.md that
    // describes them -- control replies came back using the skill's own vocabulary,
    // which silently collapsed every measured delta toward zero.
    const p = spawn("claude", args, { cwd });
    let out = "", err = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => res({ out: out.trim(), err: err.trim(), code }));
    p.on("error", (e) => res({ out: "", err: String(e), code: -1 }));
  });
}

const jobs = [];
for (const t of tasks)
  for (const cond of ["control", "treatment"])
    for (let rep = 1; rep <= REPS; rep++) jobs.push({ t, cond, rep });

if (DRY) {
  console.log(`${jobs.length} runs (${tasks.length} tasks x 2 conditions x ${REPS} reps), model=${MODEL}`);
  for (const t of tasks) console.log(`  ${t.kind.padEnd(6)} ${t.id}  [${t.skill}]`);
  process.exit(0);
}

const STAMP = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const OUT = join(HERE, "results", STAMP);
mkdirSync(join(OUT, "raw"), { recursive: true });

console.log(`${jobs.length} runs | model=${MODEL} | reps=${REPS} | -> eval/results/${STAMP}`);

const records = [];
let done = 0;

async function worker(queue) {
  while (queue.length) {
    const { t, cond, rep } = queue.shift();
    const skillFile = cond === "treatment" ? join(ROOT, "skills", t.skill, "SKILL.md") : null;
    const cwd = makeCwd(t);
    const { out, err, code } = await runClaude(t.prompt, skillFile, cwd);
    if (cwd !== SANDBOX) rmSync(cwd, { recursive: true, force: true });
    const name = `${t.id}__${cond}__${rep}`;
    writeFileSync(join(OUT, "raw", `${name}.txt`), out || `<<no output>>\n${err}`);
    const v = code === 0 && out ? verify(t.verify, out) : { pass: false, why: `run failed (exit ${code})` };
    records.push({ task: t.id, skill: t.skill, kind: t.kind, cond, rep, pass: v.pass, why: v.why });
    done++;
    process.stdout.write(`\r  ${done}/${jobs.length}  ${v.pass ? "PASS" : "FAIL"}  ${name.padEnd(42)}`);
  }
}

const queue = [...jobs];
await Promise.all(Array.from({ length: Math.min(CONC, queue.length) }, () => worker(queue)));
process.stdout.write("\n\n");

// ---- aggregate -------------------------------------------------------------

const rate = (task, cond) => {
  const rs = records.filter((r) => r.task === task && r.cond === cond);
  return rs.length ? (rs.filter((r) => r.pass).length / rs.length) * 100 : NaN;
};

const rows = tasks.map((t) => {
  const c = rate(t.id, "control"), x = rate(t.id, "treatment");
  return { id: t.id, skill: t.skill, kind: t.kind, control: c, treatment: x, delta: x - c };
});

const signal = rows.filter((r) => r.kind === "signal");
const harm = rows.filter((r) => r.kind === "harm");
const avg = (a, k) => (a.length ? a.reduce((s, r) => s + r[k], 0) / a.length : NaN);
const overall = avg(signal, "delta");

const pad = (s, n) => String(s).padEnd(n);
const pct = (n) => (Number.isNaN(n) ? "  n/a" : `${n.toFixed(0).padStart(3)}%`);
const dpp = (n) => (Number.isNaN(n) ? "n/a" : `${n >= 0 ? "+" : ""}${n.toFixed(1)}pp`);

let md = `# Skill evaluation — ${STAMP}\n\n`;
md += `Model \`${MODEL}\`, ${REPS} repetitions per condition, ${jobs.length} runs.\n`;
md += `Control and treatment are identical except that treatment has the skill's SKILL.md appended to the system prompt.\n`;
md += `Both use \`--setting-sources project\` and run in an empty directory outside the repo, so neither arm can see the installed skills, the repo, or its CLAUDE.md.\n\n`;
md += `## Signal tasks — does the skill change the answer?\n\n`;
md += `| Task | Skill | Control | With skill | Delta |\n|---|---|---|---|---|\n`;
for (const r of signal) md += `| \`${r.id}\` | ${r.skill} | ${pct(r.control)} | ${pct(r.treatment)} | **${dpp(r.delta)}** |\n`;
md += `\n**Average delta across signal tasks: ${dpp(overall)}**\n\n`;
md += `## Harm tasks — does the skill stay quiet where it should?\n\n`;
md += `| Task | Skill | Control | With skill | Delta |\n|---|---|---|---|---|\n`;
for (const r of harm) md += `| \`${r.id}\` | ${r.skill} | ${pct(r.control)} | ${pct(r.treatment)} | ${dpp(r.delta)} |\n`;
md += `\nA negative delta here means the skill fired where it should not have.\n\n`;
md += `## Tasks with no signal\n\n`;
const flat = signal.filter((r) => Math.abs(r.delta) < 1);
md += flat.length
  ? flat.map((r) => `- \`${r.id}\` — control and treatment agree; this task does not discriminate and should be revised.\n`).join("")
  : "None — every signal task discriminated.\n";
md += `\nRaw replies for every run are in \`raw/\`.\n`;

writeFileSync(join(OUT, "report.md"), md);
writeFileSync(join(OUT, "summary.json"), JSON.stringify({ stamp: STAMP, model: MODEL, reps: REPS, rows, records }, null, 2));

console.log(`${pad("TASK", 24)} ${pad("KIND", 7)} CTRL  SKILL  DELTA`);
for (const r of [...signal, ...harm])
  console.log(`${pad(r.id, 24)} ${pad(r.kind, 7)} ${pct(r.control)}  ${pct(r.treatment)}  ${dpp(r.delta)}`);
console.log(`\nAverage delta across signal tasks: ${dpp(overall)}`);
console.log(`Report: eval/results/${STAMP}/report.md`);
