---
name: incentive-check
description: "Check what a measure actually rewards before adopting it, and whether it can be satisfied without achieving the goal. Use when defining or changing a test, eval, benchmark, acceptance criterion, coverage target, KPI, SLO, alert threshold, rate limit, quota, lint rule, agent success condition, or any rule that rewards a measured outcome. Also use when a metric is improving but the underlying goal is not, when a test suite is green but behavior is wrong, or when deciding how to verify that work is actually done."
metadata:
  version: "0.1.0"
  adapted-from: "Sandeep Swadia, 'How To Think SO Clearly People Assume You're Brilliant' (YouTube, 2026)"
  based-on: "Cobra effect (Horst Siebert, 2001); Goodhart's Law; Campbell's Law. See references/attribution.md"
---

# Incentive check

When you attach a reward to a proxy, the system optimizes **the proxy**, not the goal.

This is not cynicism about people. It is a structural property of measured systems, and it applies with full force to agents — including this one. An agent told "make the tests pass" has been given a measure, and the cheapest path to satisfying that measure is frequently not the path that does the work.

> **Goodhart's Law:** when a measure becomes a target, it ceases to be a good measure.

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
