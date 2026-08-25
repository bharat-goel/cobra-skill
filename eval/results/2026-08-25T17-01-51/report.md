# Skill evaluation — 2026-08-25T17-01-51

Model `claude-haiku-4-5-20251001`, 3 repetitions per condition, 48 runs.
Control and treatment are identical except that treatment has the skill's SKILL.md appended to the system prompt.
Both use `--setting-sources project`, so installed user skills are invisible in either arm.

## Signal tasks — does the skill change the answer?

| Task | Skill | Control | With skill | Delta |
|---|---|---|---|---|
| `ic-backup-safeguard` | incentive-check | 100% | 100% | **+0.0pp** |
| `ic-coverage-gate` | incentive-check |   0% | 100% | **+100.0pp** |
| `ic-latency-slo` | incentive-check |  67% | 100% | **+33.3pp** |
| `st-chaotic-incident` | system-triage | 100% |  67% | **-33.3pp** |
| `st-clear-pattern` | system-triage |  33% |  33% | **+0.0pp** |
| `st-complex-migration` | system-triage | 100% | 100% | **+0.0pp** |

**Average delta across signal tasks: +16.7pp**

## Harm tasks — does the skill stay quiet where it should?

| Task | Skill | Control | With skill | Delta |
|---|---|---|---|---|
| `ic-noop-routine` | incentive-check | 100% | 100% | +0.0pp |
| `st-noop-routine` | system-triage | 100% | 100% | +0.0pp |

A negative delta here means the skill fired where it should not have.

## Tasks with no signal

- `ic-backup-safeguard` — control and treatment agree; this task does not discriminate and should be revised.
- `st-clear-pattern` — control and treatment agree; this task does not discriminate and should be revised.
- `st-complex-migration` — control and treatment agree; this task does not discriminate and should be revised.

Raw replies for every run are in `raw/`.
