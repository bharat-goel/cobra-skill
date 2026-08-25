# cobra

A Claude Code skill that finds the cheapest way a measure can be satisfied **without achieving its goal** — published with the evaluation that measured it.

> Attach a reward to a proxy and the system optimises the proxy. A coverage gate gets
> satisfied by assertion-free tests. A p50 latency SLO gets satisfied by shedding slow
> requests. "Make the tests pass" gets satisfied by deleting the test.

Named for the **cobra effect** — [Horst Siebert's term](ATTRIBUTION.md) for a reward that
makes the problem worse. **No idea in this repository is original to it.** Every source is
credited in [ATTRIBUTION.md](ATTRIBUTION.md), including what this adaptation changed and why.

## Install

```bash
/plugin marketplace add bharat-goel/cobra-skill
/plugin install cobra
```

Or symlink it directly:

```bash
git clone https://github.com/bharat-goel/cobra-skill && cd cobra-skill
ln -sfn "$PWD/skills/cobra" ~/.claude/skills/cobra
```

## What it does

Fires when you define or change a test, eval, benchmark, coverage target, KPI, SLO, alert
threshold, quota, lint rule, or agent success condition — or a **safeguard** whose success is
reported rather than verified: a backup, restore, rollback, prune policy, or health check.

It asks three questions before the measure is adopted:

1. **Gaming** — what is the cheapest way to satisfy this without achieving the goal?
2. **Delay** — when does the consequence arrive relative to the reward?
3. **Canary** — is there a small observable that reveals whether the real thing was done?

## Measured

Almost no skills repository publishes evidence that its skills help. This one does, including
the parts that did not work.

| Measure | Result | Method |
|---|---|---|
| **Content effect** | **+33.3pp** | Paired eval, n=10, three tasks, all positive |
| **Trigger recall** | **89%** (16/18) | Does the description actually fire? |
| **False fires** | **0/24** | Never loads on unrelated work |

Content effect is measured against an identical run with the skill absent. Full method, task
definitions, raw transcripts and limits: [`eval/`](eval/).

### The skill that did not survive its own evaluation

This repository originally shipped two skills. The other one, `system-triage`, measured
**+0.0pp across four task shapes** at n=10 — the control was at ceiling every time. Frontier
models already do what it taught on problems that fit in a prompt. It also fired on only 33%
of prompts it targeted.

It has been [retired](retired/system-triage/), not deleted, and its evaluation is still
reproducible. Publishing the negative result is the point: it is the evidence that this
harness is not a marketing instrument.

Details in [`retired/README.md`](retired/README.md).

## Honest limits

- Measured on **Sonnet only**. A clean run on a smaller model has not been done, and
  [SkillsBench](https://arxiv.org/abs/2602.12670) found smaller models with skills can match
  larger models without them — so these numbers may not transfer in either direction.
- **Six signal tasks.** Enough to establish an effect, not enough for a precise effect size.
- Content and triggering are measured **separately**; nothing here measures them end-to-end
  in a long real session.
- Deltas moved substantially between n=3 and n=10, including one task that swung +100pp to
  0pp on luck. Treat any single number here as provisional.

## Prior art

Evaluation design follows **SkillsBench** (arXiv [2602.12670](https://arxiv.org/abs/2602.12670)):
paired conditions, deterministic verifiers, deltas in percentage points.

## Licence

MIT — see [LICENSE](LICENSE).
