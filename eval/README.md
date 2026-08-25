# Paired evaluation

Measures whether these skills actually change what the agent does — the claim that
essentially no skills repository currently makes.

## Method

Each task runs under two conditions that are identical except for one variable:

| | Control | Treatment |
|---|---|---|
| Setting sources | `project` | `project` |
| Model, prompt, cwd | same | same |
| `SKILL.md` in context | no | appended to system prompt |

`--setting-sources project` makes the installed user skills invisible, so neither arm
picks up a skill by accident and the injected content is the only difference.

```bash
node eval/run.mjs --dry-run                 # list what would run
node eval/run.mjs --reps 3 --model sonnet   # full run
node eval/run.mjs --task ic-coverage-gate --reps 5
node eval/run.mjs --skill system-triage
```

Results land in `eval/results/<timestamp>/` — `report.md`, `summary.json`, and the raw
reply for every run in `raw/`. Raw replies are gitignored; the reports are committed.

## Task kinds

**`signal`** — the skill should change the answer. Delta is the measurement.

**`harm`** — the skill should stay quiet. A routine task with an obvious path, or a
factual question with no measure in it. A negative delta here means the skill fired
where it should not have, bloating the answer or narrating a framework nobody asked for.
SkillsBench found 16 of 84 tasks got *worse* with skills; harm tasks are how that shows
up here instead of in your actual work.

## Verifiers

Deterministic substring tests over the raw reply — no LLM judge, so a verdict never
drifts between runs. Three types:

- `any` — at least one required pattern present
- `none` — no forbidden pattern present, with an optional `maxWords` ceiling
- `ordered` — a `before` pattern must appear ahead of any `after` pattern
  (used for the incident task: stabilise must precede diagnose)

Every raw reply is written to disk, so any verdict can be re-checked by hand. That
matters: a keyword verifier can pass for the wrong reason, and the transcript is the
only way to catch it.

## Reading the output

`report.md` gives per-task control and treatment pass rates, the delta in percentage
points, and an average across signal tasks. It also lists **tasks with no signal** —
where control and treatment agree. Those tasks are not evidence of anything and should
be revised or dropped; SkillsBench applies the same filter during human review.

## Honest limits

- **This tests skill content, not skill triggering.** The treatment arm injects
  `SKILL.md` directly rather than relying on the `description` to fire. A skill can
  score well here and still never activate in real use. Trigger quality needs a
  separate check.
- **Small n.** Eight tasks, three repetitions. Enough to catch a skill that does
  nothing or actively harms; not enough for a confident effect size.
- **Verifiers reward vocabulary.** They detect whether the reply *names* the right
  move, which correlates with but is not identical to giving good advice.
- **Repo context leaks in.** Runs execute in the repo root, so both arms may pick up
  `CLAUDE.md`. It is constant across conditions, so the pairing holds, but it is not
  a clean-room.

## Prior art

Design follows **SkillsBench** (arXiv [2602.12670](https://arxiv.org/abs/2602.12670),
Feb 2026): paired conditions, deterministic verifiers, deltas in percentage points.
That paper measured +16.2pp for curated skills across 86 tasks, with wide variance by
domain and 16 of 84 tasks showing negative deltas. It also found 2–3 skills optimal and
4+ sharply worse, and that self-generated skills gave no benefit at all — the result
this repository is most exposed to, since a model drafted these skills.
