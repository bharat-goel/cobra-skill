---
name: system-triage
description: "Classify a problem as clear, complicated, complex, or chaotic before choosing an approach, then apply the protocol that matches. Use at the START of an ambiguous or multi-step task: an unfamiliar bug, an architecture or design decision, a migration, a refactor with unclear blast radius, an incident, or an integration between systems you do not control. Also use when work is looping, when repeated fixes are not holding, when a root cause is being demanded before anything can be tried, or when a task looks routine but the stakes are high. Do NOT use for tasks that already have an obvious established path."
metadata:
  version: "0.1.0"
  adapted-from: "Sandeep Swadia, 'How To Think SO Clearly People Assume You're Brilliant' (YouTube, 2026)"
  based-on: "The Cynefin framework, Dave Snowden (1999). See references/attribution.md"
---

# System triage

Most expensive mistakes are not caused by a bad answer. They are caused by a **good answer applied to the wrong kind of problem** — a checklist used on emergent behavior, or a root-cause investigation demanded while the build is on fire.

Before choosing an approach, classify the problem. Then apply the protocol that matches.

## The one question that decides everything

> **What is the relationship between cause and effect here?**

| Answer | Domain | Protocol |
|---|---|---|
| Obvious — anyone can see it | **Clear** | Follow the established pattern |
| Hidden, but knowable if I dig | **Complicated** | Analyze; get the right specialist |
| Only visible in hindsight | **Complex** | Small reversible probes; iterate |
| Broken — cannot be known now | **Chaotic** | Stabilize first; understand later |

If you cannot answer this question, you are in **disorder** — see below. That is the most common and most dangerous state.

## The ordered / unordered line

This is the deep structure, and crossing it wrongly is the expensive error.

- **Ordered** (clear, complicated): cause and effect are knowable *before* you act. Analysis works.
- **Unordered** (complex, chaotic): cause and effect are knowable only *after* you act, or not at all. Analysis alone will never get you there.

**Treating an unordered problem as ordered** is the single most common failure: demanding a complete root cause before touching anything, building a big-bang change from a design doc, or expecting an expert to hand you a guaranteed answer for emergent behavior.

**Treating an ordered problem as unordered** is the mirror error: guessing and iterating on something you could have simply read the source for.

## DART — how to decide which domain you are in

**D — Deconstruct.** Break the problem into parts. Are the parts stable, or shifting while you look at them? Shifting parts push you right-to-left across the table above.

> **Then check whether the parts belong in *different* domains.** They routinely do, and this is the highest-value move in the whole diagnostic. A problem that has stalled is very often one being treated as a single decision when it is really three sub-problems wanting three different protocols. Triage them separately rather than forcing one protocol across the whole thing.

**A — Analyze.** Ask the cause-and-effect question. This single question assigns the domain.

**R — Recognize.** Have I seen this pattern before — here, or in another system? Cross-system pattern recognition is often faster than fresh analysis.

**T — Test.** Run the smallest test that could disconfirm your classification, before committing to a full response. *Exception: in a chaotic system there is no time to test — stabilize first.*

## Protocols

### Clear — an established pattern exists

Cause and effect are obvious. There is a known-good way to do this.

- Find the existing pattern in the codebase and **match it exactly**. Read a neighboring implementation before writing a new one.
- Your job here is precision, not creativity. **Inventing a novel approach in a clear system is itself the defect.**
- Follow the checklist. A checklist is not an insult to expertise — it is insurance against being human.
- **Canary check:** if small conventions are violated (formatting, naming, import order, a missing changeset), assume the larger contract was not read either. One visible detail reveals the state of the whole system.
- **Danger — the cliff.** Complacency here is what causes sudden collapse into chaotic. "This is routine" is exactly the belief that precedes the outage. When stakes are high, verify even the obvious.

### Complicated — knowable, but not yet known

The answer exists and is discoverable. It is not visible from where you stand.

- **Do not guess.** The failure mode here is pattern-matching a plausible fix before understanding the mechanism.
- Read the actual source, trace the real call path, check the deployed config, inspect the actual data. Not what the docs claim, not what you remember.
- Get the **right** specialist, not any specialist — a targeted subagent, the primary source, the specific reference. Expertise in an adjacent area is not expertise in this one.
- Budget the analysis. If two or three serious attempts do not converge, re-triage: it may actually be complex.

### Complex — cause and effect emerge only in hindsight

Behavior arises from interaction. No amount of upfront analysis will predict it.

- **Smallest reversible probe first.** A failing test, a feature flag, one component, a canary deploy, a single migrated record.
- Sequence: probe → observe what actually happened → amplify what worked, damp what did not → repeat.
- **Directionally right beats precisely right.** A correct heading with course correction beats a perfect plan built on assumptions.
- Keep every step revertible. Optimize for the cost of being wrong, not the odds of being right.
- Experts still help here — they sharpen your probes and read results faster. What they *cannot* give you is a guaranteed prescription. Use them for better experiments, not for certainty.

### Chaotic — the link is broken

The build is red, production is down, data is actively at risk, or the ground is moving faster than you can observe it.

- **Stabilize first.** Revert the deploy, restore the last green state, stop the write, take the endpoint out of rotation, halt the migration.
- **For an agent, "act first" means the safe, reversible, stabilizing action — never a drastic unverified one.** Reverting to a known-good state is acting. Rewriting the subsystem from memory under time pressure is not.
- Do not investigate root cause while bleeding. Analysis paralysis is the characteristic failure here: waiting for a full picture that chaos will never provide.
- Once stable, the problem becomes complex or complicated. **Re-triage** — do not keep operating in crisis mode after the crisis ends.

## Disorder — the default state

Disorder is not knowing which domain you are in. Snowden calls it the most common condition, and it is dangerous because it is invisible from the inside: everyone simply applies their favorite approach. The analyst analyzes, the firefighter fights fires, the process person writes a checklist.

**Symptoms:** the same fix applied repeatedly without holding; disagreement about whether to investigate or just try something; confident proposals that do not address a stated mechanism.

**Exit:** deconstruct further until you can answer the cause-and-effect question for at least one sub-part, then triage the sub-parts separately — see **D — Deconstruct** above.

## Before accepting a forced tradeoff

When a problem is framed as either/or — fast or correct, simple or general, cheap or reliable — ask whether that is a limit of **reality** or a limit of the **current design**. Many binaries are artifacts of an existing structure rather than laws. Say which one you concluded it is, and why.

## What to actually output

When triage meaningfully changes the approach, state it in one line before proceeding — for example: *"Treating this as complex: cause and effect won't be clear until we try it, so I'm starting with a failing test and one reversible change rather than a full design."*

Do not narrate the framework, recite DART, or produce a classification section for problems that were never ambiguous. If the domain was obvious, skip straight to the work.

## Attribution

The four-domain model is **Cynefin**, created by **Dave Snowden** (1999). **DART** is Sandeep Swadia's. Full credit, sources, and what this adaptation changed: [references/attribution.md](references/attribution.md).
