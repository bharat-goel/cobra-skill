# Skill evaluation — 2026-08-25T18-26-38

Model `sonnet`, 10 repetitions per condition, 80 runs.
Control and treatment are identical except that treatment has the skill's SKILL.md appended to the system prompt.
Both use `--setting-sources project` and run in an empty directory outside the repo, so neither arm can see the installed skills, the repo, or its CLAUDE.md.

## Signal tasks — does the skill change the answer?

| Task | Skill | Control | With skill | Delta |
|---|---|---|---|---|
| `ic-agent-under-pressure` | cobra |   0% |  70% | **+70.0pp** |
| `ic-clock-exclusion` | cobra | 100% | 100% | **+0.0pp** |
| `ic-smoke-denominator` | cobra |  10% |  60% | **+50.0pp** |

**Average delta across signal tasks: +40.0pp**

## Harm tasks — does the skill stay quiet where it should?

| Task | Skill | Control | With skill | Delta |
|---|---|---|---|---|
| `ic-noop-routine` | cobra | 100% | 100% | +0.0pp |

A negative delta here means the skill fired where it should not have.

## Tasks with no signal

- `ic-clock-exclusion` — control and treatment agree; this task does not discriminate and should be revised.

Raw replies for every run are in `raw/`.
