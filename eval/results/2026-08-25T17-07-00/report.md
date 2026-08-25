# Skill evaluation — 2026-08-25T17-07-00

Model `sonnet`, 3 repetitions per condition, 48 runs.
Control and treatment are identical except that treatment has the skill's SKILL.md appended to the system prompt.
Both use `--setting-sources project`, so installed user skills are invisible in either arm.

## Signal tasks — does the skill change the answer?

| Task | Skill | Control | With skill | Delta |
|---|---|---|---|---|
| `ic-agent-under-pressure` | incentive-check |  67% |  67% | **+0.0pp** |
| `ic-clock-exclusion` | incentive-check | 100% | 100% | **+0.0pp** |
| `ic-smoke-denominator` | incentive-check |  67% |  67% | **+0.0pp** |
| `st-clear-cliff` | system-triage | 100% | 100% | **+0.0pp** |
| `st-disguised-complex` | system-triage |  67% |  67% | **+0.0pp** |
| `st-mixed-domains` | system-triage | 100% |  33% | **-66.7pp** |

**Average delta across signal tasks: -11.1pp**

## Harm tasks — does the skill stay quiet where it should?

| Task | Skill | Control | With skill | Delta |
|---|---|---|---|---|
| `ic-noop-routine` | incentive-check | 100% | 100% | +0.0pp |
| `st-noop-routine` | system-triage | 100% | 100% | +0.0pp |

A negative delta here means the skill fired where it should not have.

## Tasks with no signal

- `ic-agent-under-pressure` — control and treatment agree; this task does not discriminate and should be revised.
- `ic-clock-exclusion` — control and treatment agree; this task does not discriminate and should be revised.
- `ic-smoke-denominator` — control and treatment agree; this task does not discriminate and should be revised.
- `st-clear-cliff` — control and treatment agree; this task does not discriminate and should be revised.
- `st-disguised-complex` — control and treatment agree; this task does not discriminate and should be revised.

Raw replies for every run are in `raw/`.
