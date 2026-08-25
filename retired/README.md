# Retired

Skills kept for their evidence, not shipped. They are excluded from `skills/`, so the
published plugin does not install them, and `eval/run.mjs` still resolves them here so
their results stay reproducible.

## system-triage

Classified a problem as clear / complicated / complex / chaotic before choosing an approach —
an adaptation of **Dave Snowden's Cynefin framework** (1999) by way of a Sandeep Swadia video.
Full credit in [`system-triage/references/attribution.md`](system-triage/references/attribution.md).

**Retired 2026-08-25 because it measured no effect.**

| Task | Control | With skill | Delta |
|---|---|---|---|
| `st-mixed-domains` | 100% | 100% | +0.0pp |
| `st-disguised-complex` | 100% | 100% | +0.0pp |
| `st-clear-cliff` | 100% | 100% | +0.0pp |
| `st-looping-fixes` | 100% | 100% | +0.0pp |

Judge-scored, n=10 each. The control arm was at ceiling on every task: Sonnet already
decomposes a stalled launch by problem type, already proposes reverting one change at a time
rather than analysing three confounded ones, already challenges a "routine" framing, and
already stops patching a flaky test after four failed fixes to go get a reproduction.

The rubric judge was validated against deliberately bad replies before the null was trusted —
including one stuffed with the skill's own vocabulary, which it correctly failed as "generic,
abstract meta-advice". Leniency is not the explanation.

It also fired on only **33%** of prompts it targeted, and the pattern was diagnostic: 3/3 on
prompts describing work that is looping, 0/3 on incidents, migrations and architecture
decisions — all of which its own description enumerated by name.

### What this cost, and what it is worth

A skill that fires rarely and adds nothing when it fires does not earn its context. But the
negative result is the most credible artifact in this repository, and it carries two
transferable lessons:

1. **Describe a situation, not a category.** "Repeated fixes are not holding" fires. "An
   architecture decision" does not — it labels half of engineering.
2. **A framework that helps humans need not help a model.** Cynefin is genuinely useful for
   people. That says nothing about whether a frontier model needs it spelled out.

### Not tested

Only Sonnet, and only problems that fit in a prompt. The case where this might still earn its
place — a long session where a model has drifted or is looping over a large codebase — is one
the harness structurally cannot reach.
