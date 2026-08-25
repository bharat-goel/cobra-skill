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
node eval/run.mjs --skill cobra
```

Runs write to `eval/results/`, which is not tracked. The committed summary of the latest run
is [RESULTS.md](RESULTS.md).

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

## Failed runs

A run that exits non-zero, or produces no parseable stream events, told you nothing. Both
harnesses score such a run as **not passing in either arm**, and `eval/trigger.mjs` prints a
warning and a banner in the report when any run fails.

This matters more than it sounds. On a negative prompt the success condition is *nothing
fired* — so scoring a failed run by its empty result would mean an outage reports a perfect
false-fire rate. Verified by forcing every run to fail: the harness reports 0% and
`!! 14/14 runs FAILED` rather than 100% silence.

`eval/run.mjs` also validates every task's skill path before spending an API call. A renamed
or misspelled skill otherwise makes each treatment run fail, and the report shows a large
negative delta that reads as "this skill is harmful" rather than "this file is missing".

## Validating the judge

A judge that passes everything produces a clean-looking null result. Before trusting one,
check that it fails when it should — the same canary `cobra` prescribes.

Check any rubric judge against deliberately bad replies — including one stuffed with the
skill's own vocabulary but no substance — before trusting a null result from it. Re-run that
check whenever a rubric changes.

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
  move, which correlates with but is not identical to giving good advice. This gets
  sharper as tasks get harder: with the skill in context the model is likelier to reach
  for the skill's own words, so some measured delta is genuine judgement and some is
  echo. The harm tasks are the guard -- pure echo would leak skill vocabulary into the
  rename and Postgres questions, and it does not.
- **Results are model-dependent.** Everything here is measured on Sonnet. A delta measured on
  one model says nothing about another, and SkillsBench found smaller models with skills can
  match larger models without them.
- **Runs are isolated, and this was not always true.** The first version executed in the
  repo root. That let the *control* arm read the skills off disk and inherit the parent
  `CLAUDE.md` describing them: control replies came back saying "Triage: this is
  complicated, not complex" and proposing "a small reversible probe" -- the skill's own
  vocabulary and its core move, in the arm that was supposed to have never seen it. It
  silently collapsed every measured delta toward zero and invalidated an entire round of
  results. Runs now execute in an empty directory outside the repo. **If you change how
  runs are spawned, re-check this first** -- a contaminated control fails quietly, looks
  like a clean null result, and is indistinguishable from "the skill does nothing".

## Prior art

Design follows **SkillsBench** (arXiv [2602.12670](https://arxiv.org/abs/2602.12670),
Feb 2026): paired conditions, deterministic verifiers, deltas in percentage points.
That paper measured +16.2pp for curated skills across 86 tasks, with wide variance by
domain and 16 of 84 tasks showing negative deltas. It also found 2–3 skills optimal and
4+ sharply worse, and that self-generated skills gave no benefit at all — the result
this repository is most exposed to, since a model drafted these skills.
