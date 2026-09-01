---
name: cobra
description: "Check what a measure actually rewards before adopting it, and whether it can be satisfied without achieving the goal. Use when defining or changing a test, eval, benchmark, acceptance criterion, coverage target, KPI, SLO, alert threshold, rate limit, quota, lint rule, agent success condition, or any rule that rewards a measured outcome. Also use when writing or reviewing a safeguard whose success is reported rather than verified — a backup, restore, rollback, retention/prune policy, health check, or dry-run path. Also when a metric is improving but the underlying goal is not, when a test suite is green but behavior is wrong, or when deciding how to verify that work is actually done."
metadata:
  version: "0.2.0"
  adapted-from: "Sandeep Swadia, 'How To Think SO Clearly People Assume You're Brilliant' (YouTube, 2026)"
  based-on: "Cobra effect (Horst Siebert, 2001); Goodhart's Law; Campbell's Law. See references/attribution.md"
---

# Cobra

When you attach a reward to a proxy, the system optimizes **the proxy**, not the goal.

This is not cynicism about people. It is a structural property of measured systems, and it applies with full force to agents — including this one. An agent told "make the tests pass" has been given a measure, and the cheapest path to satisfying that measure is frequently not the path that does the work.

> **Goodhart's Law:** when a measure becomes a target, it ceases to be a good measure.

Apply this hardest to **safeguards** — backups, rollbacks, health checks, dry-run paths. They are
the class where the reading is binary, the reward is immediate, and the damage lands at the one
moment you cannot afford it. If the thing in front of you is a safeguard, read that section first.

## The three questions

Ask these **before** adopting any measure, not after it disappoints.

### 1. Gaming — what is the cheapest way to satisfy this without achieving the goal?

Name the cheapest path explicitly. If it is cheap and undetectable, the measure is wrong regardless of how reasonable it sounds.

| The measure | The cheapest way to satisfy it |
|---|---|
| "Make the tests pass" | Delete the test, skip it, weaken the assertion, mock the thing under test |
| Test coverage % | Tests that execute lines and assert nothing |
| "Reduce error count" | Catch and swallow; downgrade errors to warnings |
| "No lint failures" | Blanket disable comments at the top of the file |
| p50 latency | Shed or time out the slow requests |
| "Close the tickets" | Close as won't-fix; split one ticket into five |
| Lines of code / velocity | Churn — write more code to do the same thing |
| "No failing builds" | Retry until green; mark flaky tests as skipped |
| Response length or thoroughness | Padding, restated caveats, filler structure |
| "The backup ran" — any safeguard | A snapshot nothing has ever restored from; a stash that failed silently; a pruner that deletes what it just wrote |

If you catch yourself reaching for one of these, that is the cobra effect operating on you in real time. Say so rather than doing it quietly.

### 2. Delay — when does the consequence arrive, relative to the reward?

A feedback loop only self-corrects if the damage arrives soon enough to be attributed to its cause. When reward is immediate and damage is deferred, the loop actively teaches the wrong lesson.

Common delayed-damage patterns:

- A cache masking a correctness bug — fast now, wrong later under a different key
- Suppressed warnings — quiet now, breaking change at the next upgrade
- A skipped migration step — green now, corrupt on the next backfill
- Pinned dependencies to avoid a failure — stable now, unpatchable later
- Broadened types or `any` to clear a type error — compiles now, wrong at runtime
- Retry-until-green on a flaky test — the real defect is now invisible

**If reward and consequence are separated in time, do not rely on the metric to catch the problem.** Add a check that fires on the same timescale as the action.

### 3. Canary — is there a small observable that reveals whether the real thing was done?

Pick one cheap, hard-to-fake detail that correlates with the whole job being done properly.

- Does the new test actually **fail** when you break the behavior it claims to cover? This is the single highest-value canary in software, and it is nearly impossible to fake accidentally.
- Do the small conventions hold — naming, error handling, import order? If those slipped, the larger contract was probably not read either.
- Does the change include the unglamorous parts — the migration, the changeset, the docs, the rollback path?

## Safeguards are the worst case

A backup, a rollback path, a health check, a circuit breaker, a dry-run flag — these are measures
too, and the hardest kind. The reading is binary (*it ran*), the reward is immediate (*a success
line*), and the damage is maximally deferred: you find out at the one moment you cannot afford to.

**Exercise the mechanism; do not inspect it.** Reading a safeguard tells you what it intends.
Running it against a case it is supposed to catch tells you what it does. For anything protecting
data you cannot re-derive, restore into a scratch location and diff — *a snapshot nothing has ever
restored from is a hypothesis, not a backup.*

Watch especially for a safeguard that **shares state with the thing it protects** — same directory,
same naming scheme, same sort order. That is where a safety mechanism quietly begins consuming what
it was built to preserve, while still reporting success.

## What a cobra check produces

Five fields. Keep it to a few lines each — this is a check, not a report.

| Field | What goes in it |
|---|---|
| **Measure** | The rule as actually written, not as intended |
| **Gaming path** | The cheapest way to satisfy it without achieving the goal |
| **Delay** | When the damage arrives relative to the reward |
| **Canary** | One cheap observable that reveals whether the real thing was done |
| **Verdict** | Survives, or replace it — and if replace, with what |

**A measure survives when the cheapest path to satisfying it costs more than doing the work.**
That is the exit condition. Failing to think of a gaming path is not the same thing, and is
available to anyone who does not want to look. For safeguards the test is stricter still: you
do not get to clear one by inspection, only by running it against a case it should catch.

### Worked example — a measure that fails

> "Every PR must get a review within 24 hours."

- **Measure:** time from PR opened to any approval, per PR.
- **Gaming path:** approve without reading. "LGTM" at hour 23 satisfies it completely, costs
  thirty seconds, and is indistinguishable in the data from a careful review.
- **Delay:** the reward is immediate and the damage is not. Defects wave through today and
  surface in production weeks later, by which time nothing attributes them to that approval.
- **Canary:** do the review comments reference specific lines and specific behaviour? A reviewer
  who read the diff leaves evidence that they read the diff. This is hard to fake at volume.
- **Verdict:** replace. Measure review depth or defect escape rate, not turnaround — or pair the
  24-hour target with a counter-metric so speed cannot be bought with attention.

### Worked example — a measure that survives

> "A release is done when someone has completed a real customer transaction end-to-end in
> production."

- **Measure:** one verified real transaction per release.
- **Gaming path:** none that is cheap. Faking it means producing a genuine transaction record,
  which means performing the transaction. The cost of satisfying the measure dishonestly is
  roughly the cost of satisfying it honestly.
- **Delay:** none. The check fires on the same timescale as the action it certifies.
- **Canary:** the transaction ID exists in the production ledger and reconciles.
- **Verdict:** survives. This is an outcome measure, not an activity measure, and it is expensive
  to fake — the two properties that matter. Adopt it.

Not every measure is broken. Saying so, and saying why, is a valid result of this check — a
report that never clears anything is not vigilance, it is the same failure with the sign flipped.

## Designing a measure that survives contact

1. **Prefer measures that are expensive to fake.** Mutation-style checks ("break it and confirm the test catches it") beat coverage percentages.
2. **Pair every proxy with a counter-metric.** Latency with error rate. Speed with rework rate. Coverage with mutation survival.
3. **Measure the outcome, not the activity,** wherever you can afford to.
4. **State the gaming path when proposing the measure.** A metric offered with its own failure mode named is far more useful than one offered as sound.
5. **Watch for divergence.** A proxy improving while the goal does not is the signature of the cobra effect — treat it as evidence the measure is wrong, not as success.

## When you are the one being measured

If you are asked to hit a measure and the honest path is blocked, **say that** rather than satisfying the letter of the request. "The test can't pass without changing the behavior it's asserting, so here's the real conflict" is the correct output. Silently weakening an assertion to produce green is the cobra effect with you as the cobra farmer.

## Attribution

The cobra effect is **Horst Siebert's** term (2001); the underlying laws are **Goodhart's** and **Campbell's**. Full credit and sources: [references/attribution.md](references/attribution.md).
