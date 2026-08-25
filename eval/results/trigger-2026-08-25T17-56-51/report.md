# Trigger evaluation — 2026-08-25T17-56-51

Model `sonnet`, 3 reps, 60 runs.
Default setting sources (installed skills visible), empty cwd outside the repo.
Activation detected from a `Skill` tool_use event in stream-json.

## system-triage

**Recall: 33%** (6/18 runs on prompts it should catch)

| Prompt | Fired |
|---|---|
| Production is down after a deploy, errors are climbing and we don't know why. … | 0/3 |
| We're three weeks late. The API is flaky under load, design keeps changing the… | 0/3 |
| I've tried four different fixes for this bug and none of them stuck. What now? | 3/3 |
| Should we rewrite this service from scratch or refactor it incrementally? | 0/3 |
| We need to migrate 50,000 users to a new auth provider and behaviour varies wi… | 0/3 |
| The same test keeps failing intermittently and every fix we try doesn't hold. | 3/3 |

## incentive-check

**Recall: 89%** (16/18 runs on prompts it should catch)

| Prompt | Fired |
|---|---|
| We're setting a team SLO of p50 API latency under 200ms. Sound good? | 3/3 |
| I'm adding a CI gate that fails the build if test coverage drops below 80%. An… | 3/3 |
| Our nightly backup script prints 'Backup OK' and it's been green for six month… | 3/3 |
| I want to pay the support team a quarterly bonus based on tickets closed per w… | 2/3 |
| Let's auto-reject any PR whose diff coverage is under 80%. | 2/3 |
| How should we measure whether the new onboarding flow is actually working? | 3/3 |

## Negatives — should fire nothing

**Silence: 100%** (24/24 runs clean)

| Prompt | False fires |
|---|---|
| What's the difference between a B-tree index and a GIN index in Postgres? | 0/3 |
| Rename the variable `usr` to `user` in src/auth.ts. | 0/3 |
| Write a regex that matches an ISO 8601 date. | 0/3 |
| What does `git rebase -i` actually do? | 0/3 |
| Convert this JSON file to CSV. | 0/3 |
| Add a loading spinner to this React button component. | 0/3 |
| Explain how TCP slow start works. | 0/3 |
| What's the syntax for a Python list comprehension with a conditional? | 0/3 |

A false fire means the skill loaded on a prompt it has no business on, spending context and steering an unrelated answer.
