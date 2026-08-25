# Skill evaluation — 2026-08-25T17-41-29

Model `sonnet`, 10 repetitions per condition, 80 runs.
Control and treatment are identical except that treatment has the skill's SKILL.md appended to the system prompt.
Both use `--setting-sources project` and run in an empty directory outside the repo, so neither arm can see the installed skills, the repo, or its CLAUDE.md.

## Signal tasks — does the skill change the answer?

| Task | Skill | Control | With skill | Delta |
|---|---|---|---|---|
| `st-clear-cliff` | system-triage | 100% | 100% | **+0.0pp** |
| `st-disguised-complex` | system-triage | 100% | 100% | **+0.0pp** |
| `st-mixed-domains` | system-triage | 100% | 100% | **+0.0pp** |

**Average delta across signal tasks: +0.0pp**

## Harm tasks — does the skill stay quiet where it should?

| Task | Skill | Control | With skill | Delta |
|---|---|---|---|---|
| `st-noop-routine` | system-triage | 100% | 100% | +0.0pp |

A negative delta here means the skill fired where it should not have.

## Tasks with no signal

- `st-clear-cliff` — control and treatment agree; this task does not discriminate and should be revised.
- `st-disguised-complex` — control and treatment agree; this task does not discriminate and should be revised.
- `st-mixed-domains` — control and treatment agree; this task does not discriminate and should be revised.

Raw replies for every run are in `raw/`.
