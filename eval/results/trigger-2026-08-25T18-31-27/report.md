# Trigger evaluation — 2026-08-25T18-31-27

Model `sonnet`, 3 reps, 42 runs.
Default setting sources (installed skills visible), empty cwd outside the repo.
Activation detected from a `Skill` tool_use event in stream-json.

## cobra

**Recall: 78%** (14/18 runs on prompts it should catch)

| Prompt | Fired |
|---|---|
| We're setting a team SLO of p50 API latency under 200ms. Sound good? | 3/3 |
| I'm adding a CI gate that fails the build if test coverage drops below 80%. An… | 3/3 |
| I want to pay the support team a quarterly bonus based on tickets closed per w… | 0/3 |
| Our nightly backup script prints 'Backup OK' and it's been green for six month… | 3/3 |
| How should we measure whether the new onboarding flow is actually working? | 2/3 |
| Let's auto-reject any PR whose diff coverage is under 80%. | 3/3 |

## Negatives — should fire nothing

**Silence: 100%** (24/24 runs clean)

| Prompt | False fires |
|---|---|
| What's the difference between a B-tree index and a GIN index in Postgres? | 0/3 |
| Rename the variable `usr` to `user` in src/auth.ts. | 0/3 |
| Write a regex that matches an ISO 8601 date. | 0/3 |
| What does `git rebase -i` actually do? | 0/3 |
| Convert this JSON file to CSV. | 0/3 |
| Explain how TCP slow start works. | 0/3 |
| Add a loading spinner to this React button component. | 0/3 |
| What's the syntax for a Python list comprehension with a conditional? | 0/3 |

A false fire means the skill loaded on a prompt it has no business on, spending context and steering an unrelated answer.
