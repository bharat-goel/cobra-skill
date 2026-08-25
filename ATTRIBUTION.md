# Attribution

**No idea in this repository is original to it.** This file records who each part belongs to.
Per-skill detail, including what this adaptation changed and why, is in
`skills/cobra/references/attribution.md`.

## The video that started it

**Sandeep Swadia**, ["How To Think SO Clearly People Assume You're Brilliant"](https://www.youtube.com/watch?v=mjTgkm-h__M)
(YouTube, 2026). The cobra-effect segment and the framing of delayed feedback loops — reward
arriving in seconds while damage arrives in decades — are his. This skill is an adaptation of
one idea from that video into a form an agent can act on.

## Primary sources

| Idea | Credit | Source |
|---|---|---|
| "Cobra effect" as a name for perverse incentives | **Horst Siebert** | *Der Kobra-Effekt. Wie man Irrwege der Wirtschaftspolitik vermeidet*, Deutsche Verlags-Anstalt, 2001. ISBN 3-421-05562-9 |
| Delayed feedback framing; the synthesis this adapts | **Sandeep Swadia** | the video above |
| "When a measure becomes a target, it ceases to be a good measure" | **Charles Goodhart** (1975); this phrasing usually credited to **Marilyn Strathern** (1997) | Goodhart's Law |
| Quantitative indicators corrupt the processes they monitor | **Donald T. Campbell** (1979) | Campbell's Law |
| Reward hacking / specification gaming | AI safety literature | Amodei et al., "Concrete Problems in AI Safety" (2016), and later work |
| Brown M&M's as a compliance canary | **David Lee Roth** | *Crazy From the Heat*, 1997 |
| Paired evaluation, deterministic verifiers, deltas in percentage points | **SkillsBench** | arXiv [2602.12670](https://arxiv.org/abs/2602.12670), 2026 |

## The name

The skill is named for the cobra effect, borrowing Siebert's coinage. The skill is not his
work and makes no claim to be.

## Historicity caveat

The Delhi cobra-bounty story is described in the literature as an **anecdote**, not a
documented historical event. Siebert used it to name the phenomenon. It is worth repeating as
an illustration and worth not asserting as history — the README says so where it tells the
story.

## This repository's own contribution

Only the following, and they are adaptations rather than ideas:

- The mapping onto software and agentic work: the table of common measures and their cheapest
  cheats, and the delayed-damage patterns list.
- **Safeguards as a measure class.** Siebert, Goodhart and Campbell concern metrics that get
  *optimised*; a safeguard is a binary that gets *reported*. Added after exercising the skill
  against a real backup script, where the decisive defect was visible only by running it.
- The section on being the party under measurement, which follows from applying the cobra
  effect to an agent rather than to a population.
- The evaluation harness and its results.
