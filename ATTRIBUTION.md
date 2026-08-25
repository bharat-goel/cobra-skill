# Attribution

The shipped skill is named **cobra**, after the cobra effect. The name borrows Horst
Siebert's coinage; the skill is not his work and makes no claim to be. The retired
`system-triage` skill and its sources are documented the same way in `retired/`.

**No idea in this repository is original to it.** This file records who each part belongs to.
Per-skill detail, including what this adaptation changed and why, lives in
`skills/<name>/references/attribution.md`.

## Primary sources

| Idea | Credit | Source |
|---|---|---|
| Four domains: clear / complicated / complex / chaotic; disorder; ordered vs. unordered; the four response sequences | **Dave Snowden** — the Cynefin framework, 1999 | Kurtz & Snowden, *IBM Systems Journal* 42(3), 2003; Snowden & Boone, *Harvard Business Review*, Nov 2007 |
| **DART** (Deconstruct / Analyze / Recognize / Test) | **Sandeep Swadia** | ["How To Think SO Clearly People Assume You're Brilliant"](https://www.youtube.com/watch?v=mjTgkm-h__M), YouTube, 2026 |
| Delayed feedback loops framing; the overall synthesis this repo adapts | **Sandeep Swadia** | same video |
| "Cobra effect" as a name for perverse incentives | **Horst Siebert** | *Der Kobra-Effekt*, Deutsche Verlags-Anstalt, 2001 |
| "When a measure becomes a target, it ceases to be a good measure" | **Charles Goodhart** (1975); this phrasing usually credited to **Marilyn Strathern** (1997) | Goodhart's Law |
| Quantitative indicators corrupt the processes they monitor | **Donald T. Campbell** (1979) | Campbell's Law |
| Reward hacking / specification gaming | AI safety literature | Amodei et al., "Concrete Problems in AI Safety" (2016), and later work |
| Brown M&M's as a compliance canary | **David Lee Roth** | *Crazy From the Heat*, 1997 |
| Checklists as protection against human error | **Atul Gawande** | *The Checklist Manifesto*, 2009 |

## Sourcing note on the video

Swadia's video presents the four domains as "the four types of systems" without naming Cynefin
or Snowden. The correspondence is exact — the same four domain names, including the
post-2015 "clear", and the same four prescriptions. The domains are therefore credited to
Snowden throughout this repository. **DART** does appear to be Swadia's own contribution:
Cynefin describes the domains but says less about how you determine which one you are in.

This is recorded as a sourcing observation, not an accusation.

## Historicity caveat

The Delhi cobra-bounty story is described in the literature as an **anecdote**, not a
documented historical event. Siebert used it to name the phenomenon. It is used here as an
illustration and should not be asserted as history. The Van Halen and Tylenol cases, by
contrast, are well documented.

## This repository's own contribution

Only the following are original here, and they are adaptations rather than ideas:

- The mapping of each domain's protocol onto software and agentic work.
- The table of common software measures and their cheapest cheats.
- Restoring disorder, the ordered/unordered distinction, and the clear→chaotic cliff, which
  Snowden includes and the video omits.
- Two corrections to the video, argued in the per-skill attribution files: experts are not
  useless in complex systems, and "act first" in chaos must be scoped to safe reversible
  actions when the actor is an agent.
