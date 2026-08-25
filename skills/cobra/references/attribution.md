# Attribution — cobra

Nothing in this skill is an original idea. This file records where each part came from.

## The cobra effect — Horst Siebert

The term was coined by German economist **Horst Siebert** in
*Der Kobra-Effekt. Wie man Irrwege der Wirtschaftspolitik vermeidet*
(Deutsche Verlags-Anstalt, Munich, 2001). ISBN 3-421-05562-9.

**Historicity caveat:** the story of British officials in Delhi paying a bounty for dead
cobras, prompting people to breed them, is described in the literature as an *anecdote*
rather than a documented historical event. Siebert used it to name the phenomenon. It is
worth repeating as an illustration and worth not asserting as history.

Reference: https://en.wikipedia.org/wiki/Perverse_incentive

## The underlying laws

The cobra effect is a memorable name for a well-studied phenomenon. The rigorous statements:

- **Goodhart's Law** — Charles Goodhart (1975). Commonly stated as: *"When a measure becomes
  a target, it ceases to be a good measure."* Goodhart's original was narrower and concerned
  monetary policy; the general phrasing above is usually credited to
  **Marilyn Strathern (1997)**.
- **Campbell's Law** — Donald T. Campbell (1979): the more a quantitative indicator is used
  for social decision-making, the more it will distort and corrupt the processes it monitors.

## Reward hacking / specification gaming

The agentic framing — an AI system satisfying the letter of a stated objective rather than
its intent — is an established concern in AI safety literature, where it is generally called
**reward hacking** or **specification gaming**. See, among others, Amodei et al.,
"Concrete Problems in AI Safety" (2016), and DeepMind's subsequent work cataloguing
specification-gaming examples.

This skill applies that lens to everyday software measures. The framing is borrowed; the
specific gaming table in the skill is this adaptation's own compilation of common cases.

## Delayed feedback loops — Sandeep Swadia

The point that a system stays confusing when reward is immediate and damage is deferred, and
the cigarette illustration ("satisfaction arrived in seconds, damage arrived in decades"),
are from **Sandeep Swadia**, "How To Think SO Clearly People Assume You're Brilliant"
(YouTube, 2026) — https://www.youtube.com/watch?v=mjTgkm-h__M

## The M&M's canary — David Lee Roth

The Van Halen brown-M&M's contract clause, used here as the "small observable that reveals
the state of the whole system," was explained by **David Lee Roth** in his autobiography
*Crazy From the Heat* (1997). Swadia's video uses it to illustrate clear systems; this skill
reuses it as a verification heuristic.

## What this adaptation added

- The gaming table of common software measures and their cheapest cheats.
- The delayed-damage patterns list.
- The "break it and confirm the test catches it" canary as the highest-value check.
- The closing section on being the party under measurement, which follows directly from
  applying the cobra effect to an agent rather than to a population.

## The name

The skill is named for the **cobra effect**, Horst Siebert's term (see above). The name
borrows his coinage; the skill is not his work and makes no claim to be.

## Added from a usage test

The **"Safeguards are the worst case"** section, the safeguard row in the gaming table, and the
widened trigger came from exercising this skill against a real backup/restore pair. The audit
found three defects, the decisive one visible only by *running* the scripts rather than reading
them — a stash directory that shared a namespace and sort order with the backups it sat beside,
so the pruner deleted every real backup while reporting success.

Neither source covers safeguards as a measure class. Siebert, Goodhart and Campbell concern
metrics that get optimized; a safeguard is a binary that gets *reported*. The extension is this
adaptation's, and it is recorded here because it was driven by evidence rather than by either
source. The underlying structure — reward attached to a proxy for the goal — is unchanged.
