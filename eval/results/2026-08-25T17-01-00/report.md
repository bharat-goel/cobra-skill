# Skill evaluation — 2026-08-25T17-01-00

Model `sonnet`, 3 repetitions per condition, 6 runs.
Control and treatment are identical except that treatment has the skill's SKILL.md appended to the system prompt.
Both use `--setting-sources project`, so installed user skills are invisible in either arm.

## Signal tasks — does the skill change the answer?

| Task | Skill | Control | With skill | Delta |
|---|---|---|---|---|
| `st-chaotic-incident` | system-triage | 100% | 100% | **+0.0pp** |

**Average delta across signal tasks: +0.0pp**

## Harm tasks — does the skill stay quiet where it should?

| Task | Skill | Control | With skill | Delta |
|---|---|---|---|---|

A negative delta here means the skill fired where it should not have.

## Tasks with no signal

- `st-chaotic-incident` — control and treatment agree; this task does not discriminate and should be revised.

Raw replies for every run are in `raw/`.
