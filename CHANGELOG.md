# Changelog

Every figure quoted here has a run behind it. Where a number moved because the
measurement improved rather than the skill did, that is stated.

## 1.1.0 — 2026-08-31

Skill version `0.2.0`.

### The published effect was overstated

The content effect falls from **+40.0pp to +26.7pp**. The skill did not get worse; the
evaluation stopped rewarding the wrong thing.

Two of the three signal tasks were graded by substring matching, and the patterns leaked
from the skill's own text:

- `ic-agent-under-pressure` passed **every** treatment run on the single word *"weaken"* —
  a word `SKILL.md` supplies verbatim in its gaming table. Six of that task's thirteen
  patterns came from the skill, so the treatment arm was scored against words it had been
  handed. Nine of ten control replies correctly diagnosed the real bug and scored 0% for not
  using that word. Re-graded against a rubric, **both arms sit at 100%** — the +70.0pp
  never existed.
- `ic-smoke-denominator` passed on the bare substring `"miss"`, which matches `missing` and
  `dismissed` in replies that never made the argument. Re-graded, it went **up**: 10% → 90%.

Both are now judged against written rubrics that explicitly refuse credit for terminology.

Trigger recall moved 78% → **83%** (noise at n=18). False fires moved 0/24 → **3/39**,
because harder negatives were added — see below.

### Changed — skill content

- **Safeguards promoted** from a subsection to a top-level section, with a pointer in the
  intro. Backups, rollbacks, health checks and dry-run paths are the class where the reading
  is binary and the damage is most deferred, and it is the only task class where the skill
  shows a measurable effect.
- **Added an output shape** — measure / gaming path / delay / canary / verdict — with an exit
  criterion: *a measure survives when the cheapest path to satisfying it costs more than
  doing the work.*
- **Added two worked examples**, one measure that fails and one that survives. The file
  previously contained no case where the correct verdict was "this is fine", which made
  "flag everything" the cheapest way to satisfy it.
- The trigger description is **unchanged**. Existing activation behaviour is unaffected.

### Added — evaluation

- `ic-sound-measure`, a **negative control**: a sound N-version ETL gate that should be
  endorsed rather than picked apart. Control 95%, treatment 90% at n=20 (p=0.605).
- Five **near-miss trigger negatives** — prompts naming a unit test, a rate limit, a failing
  assertion, a coverage tool and an alert threshold, each asking for execution or config
  rather than whether to adopt the measure. Four of five stay silent. This is why the
  false-fire denominator grew from 24 to 39; the old negatives were all off-topic and could
  not test whether the description was too broad.
- A blind rubric judge (`judge-prompt.mjs`), and `judge-canary.mjs`, which checks the judge
  against replies whose verdicts are known — including one stuffed with the skill's own
  vocabulary that must FAIL.

### Fixed — evaluation harness

- **A dead batch could print a number.** A run returning no reply was counted as a failed
  answer. When an API session limit killed 83 of 100 runs, the harness reported a tidy
  `-13.3pp` that looked like a real regression. Reply-less runs are now excluded, cells below
  80% graded report `n/a`, a voided batch prints no average, and the process exits non-zero.
- `run.mjs` kept its own copy of the judge prompt instead of importing it, so the canary was
  validating a copy. Now imported.

### Known limits

- `+26.7pp` is `(80 + 0 + 0) / 3`. Two of three signal tasks sit at 100% in **both** arms and
  can only contribute zero. The per-task table in `eval/RESULTS.md` is the honest reading.
- Sonnet only. The judge is the same model family as the subject, so a shared blind spot
  would not show up in the canary.
- n=10 in a single batch is not sufficient for this suite; see Batch reliability in
  `eval/RESULTS.md`.

## 1.0.0

Initial public release.
