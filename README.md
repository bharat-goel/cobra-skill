# agent-systems-thinking

Two Claude Code skills that turn a systems-thinking framework into how an agent approaches work.

Adapted from Sandeep Swadia's video
["How To Think SO Clearly People Assume You're Brilliant"](https://www.youtube.com/watch?v=mjTgkm-h__M),
which is itself built on **Dave Snowden's Cynefin framework** (1999).
**No idea here is original to this repository.** See [ATTRIBUTION.md](ATTRIBUTION.md).

## The skills

| Skill | Fires when | Does |
|---|---|---|
| [`system-triage`](skills/system-triage/SKILL.md) | Starting an ambiguous or multi-step problem; work is looping; stakes are high | Classifies the problem as clear / complicated / complex / chaotic, then applies the matching protocol |
| [`incentive-check`](skills/incentive-check/SKILL.md) | Defining a test, eval, metric, threshold, or success criterion | Finds the cheapest way the measure can be satisfied without achieving the goal |

They are deliberately narrow. A "systems thinking" skill that fired on every task would load
on every task, consume context, and degrade unrelated work. Each of these has a concrete
trigger situation and `system-triage` carries an explicit negative trigger.

## Install

Symlinked, so edits here take effect immediately:

```bash
ln -sfn "$PWD/skills/system-triage"   ~/.claude/skills/system-triage
ln -sfn "$PWD/skills/incentive-check" ~/.claude/skills/incentive-check
```

Restart Claude Code, then confirm both appear in the skills list.

## Layout

```
skills/<name>/SKILL.md                    the skill itself
skills/<name>/references/attribution.md   sources, and what this adaptation changed
reference/source-transcript.md            the video transcript, captured 2026-08-25
ATTRIBUTION.md                            consolidated credit
```

## Promoting this to a shareable plugin later

Currently personal-only. To distribute, add `.claude-plugin/marketplace.json` at the root and
a `plugins/<name>/` wrapper around `skills/`; others then install with
`/plugin marketplace add <owner>/<repo>`. Nothing in the skills themselves needs to change.
