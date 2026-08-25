# Skill evaluation — 2026-08-25T16-55-38

Model `claude-haiku-4-5-20251001`, 1 repetitions per condition, 2 runs.
Control and treatment are identical except that treatment has the skill's SKILL.md appended to the system prompt.
Both use `--setting-sources project`, so installed user skills are invisible in either arm.

## Signal tasks — does the skill change the answer?

| Task | Skill | Control | With skill | Delta |
|---|---|---|---|---|
| `ic-coverage-gate` | incentive-check |   0% | 100% | **+100.0pp** |

**Average delta across signal tasks: +100.0pp**

## Harm tasks — does the skill stay quiet where it should?

| Task | Skill | Control | With skill | Delta |
|---|---|---|---|---|

A negative delta here means the skill fired where it should not have.

## Tasks with no signal

None — every signal task discriminated.

Raw replies for every run are in `raw/`.
