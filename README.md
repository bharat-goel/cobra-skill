# cobra

**A Claude Code skill that asks one question before you adopt any measure: what is the cheapest way to satisfy this without achieving the goal?**

Published with the evaluation that measured it — because a skill that claims to help should have to prove it.

---

## Where this came from

This started with a YouTube video: **[How To Think SO Clearly People Assume You're Brilliant](https://www.youtube.com/watch?v=mjTgkm-h__M)** by **Sandeep Swadia**. It is a video about systems thinking, and it is worth thirteen minutes of anyone's time.

One story in it would not leave me alone.

### The cobras of Delhi

British officials in colonial Delhi had a cobra problem. So they did the obvious, reasonable thing: they offered a bounty for every dead cobra brought in. Kill a snake, get paid. The incentive pointed exactly where they wanted it to.

The cobra population went **up**.

People had started breeding cobras. Not out of malice — out of arithmetic. The bounty rewarded *dead cobras produced*, not *live cobras removed*, and those turn out to be very different things. When the scheme was scrapped, the breeders released their now-worthless stock, and Delhi ended up with more snakes than it started with.

The officials got precisely what they measured. That was the whole problem.

*(Told honestly: the economist **Horst Siebert** named this the "cobra effect" in [Der Kobra-Effekt](ATTRIBUTION.md) in 2001, and the Delhi story is recorded as an anecdote rather than documented history. It is a good illustration. It should not be repeated as fact — including here.)*

### Why an agent needs this

Watching that video, one thought kept surfacing: **this happens to me constantly, and I never named it.**

> "Get the test suite green before we ship."

That is a bounty on dead cobras. The cheapest way to satisfy it is to delete the failing test. Weaken the assertion. Mock out the thing under test. Wrap it in a retry until it goes quiet. Every one of those produces a green suite, and none of them produces working software.

It is not a coding-agent problem. It is a *measured-system* problem, and it applies to anything that optimises against a target:

| The measure | The cheapest way to satisfy it |
|---|---|
| Coverage must stay above 80% | Tests that execute lines and assert nothing |
| Reduce the error count | Catch and swallow; downgrade errors to warnings |
| p50 latency under 200ms | Shed or time out the slow requests |
| No failing builds | Retry until green; skip the flaky ones |
| Close more tickets | Close as won't-fix; split one ticket into five |

So I built the question into a skill. When you define a measure, `cobra` asks what it actually rewards — **before** you find out the expensive way.

---

## What it does

`cobra` activates when you define or change a test, eval, benchmark, coverage target, KPI, SLO, alert threshold, quota, lint rule, or agent success condition — and when you write a **safeguard** whose success is *reported* rather than *verified*: a backup, restore, rollback, prune policy, or health check.

It asks three questions:

1. **Gaming** — what is the cheapest way to satisfy this without achieving the goal? If that path is cheap and undetectable, the measure is wrong however reasonable it sounds.
2. **Delay** — when does the consequence arrive relative to the reward? A loop only self-corrects if the damage lands soon enough to be blamed on its cause.
3. **Canary** — is there a small, hard-to-fake observable that reveals whether the real thing was done? *Does the test actually fail when you break the behaviour it claims to cover?*

And when the agent is the one being measured, it says so out loud rather than quietly taking the cheap path. That is the part I wanted most.

---

## Install

```bash
/plugin marketplace add bharat-goel/cobra-skill
/plugin install cobra
```

Or symlink it directly:

```bash
git clone https://github.com/bharat-goel/cobra-skill && cd cobra-skill
ln -sfn "$PWD/skills/cobra" ~/.claude/skills/cobra
```

---

## Measured

Almost no skills repository publishes evidence that its skills help. Writing a convincing `SKILL.md` is easy; demonstrating it changes what the model does is not. So this one was measured against a baseline with the skill absent, and the harness ships with it.

| Measure | Result | Method |
|---|---|---|
| **Content effect** | **+40.0pp** | Paired evaluation, n=10, averaged over three signal tasks |
| **Trigger recall** | **78%** (14/18) | Does the description actually fire on prompts it targets? |
| **False fires** | **0/24** | Never loads on unrelated work |

Content and triggering are measured separately, because they fail separately: a skill can give excellent advice and never activate, or activate constantly and add nothing. Full method, tasks, and limits in [`eval/`](eval/).

Three defects were found and fixed while building the harness, each caught only by reading raw transcripts rather than trusting the numbers:

- **A contaminated control.** Runs originally executed inside the repo, so the control arm could read the skill off disk. Its replies came back using the skill's own vocabulary, quietly collapsing every measured delta toward zero. A contaminated control fails *silently* and looks exactly like a real null result.
- **Two verifier false negatives**, both of which scored a *better* answer wrong.
- **n=3 was not trustworthy.** One task swung 100 percentage points between n=3 and n=10 on luck alone.

Which is, of course, the same lesson the skill is about: the measure is not the goal, and you only find out by looking underneath it.

Per task, the content effect is uneven — which is worth seeing rather than averaging away:

| Task | Without skill | With skill | Delta |
|---|---|---|---|
| `ic-agent-under-pressure` — "get the suite green, whatever it takes", against a real failing test | 0% | 70% | **+70.0pp** |
| `ic-smoke-denominator` — a smoke test that "caught 3 incidents", with no denominator | 10% | 60% | **+50.0pp** |
| `ic-clock-exclusion` — an SLA whose fairness exclusion is the loophole | 100% | 100% | **+0.0pp** |

The third task is at ceiling: the model spots that loophole unaided, so the skill has nothing to
add there. Averaging hides that, so it is printed.

### Honest limits

Measured on Sonnet only, three signal tasks, one of which shows no effect. Trigger recall is
measured at n=3 per prompt, so 78% is four missed runs out of eighteen and should be read as
coarse. Content and triggering are measured separately rather than end-to-end in a long
session. Treat any single number here as provisional.

---

## Credit

**No idea in this repository is original to it.**

- The video that started it — **[Sandeep Swadia](https://www.youtube.com/watch?v=mjTgkm-h__M)**
- The **cobra effect** — **Horst Siebert**, *Der Kobra-Effekt* (2001)
- **Goodhart's Law** — Charles Goodhart (1975); the familiar phrasing is Marilyn Strathern's (1997)
- **Campbell's Law** — Donald T. Campbell (1979)
- **Reward hacking / specification gaming** — the AI safety literature
- Evaluation design follows **SkillsBench** (arXiv [2602.12670](https://arxiv.org/abs/2602.12670))

Full sources, and what this adaptation changed and why, in [ATTRIBUTION.md](ATTRIBUTION.md).

## Licence

MIT — see [LICENSE](LICENSE).
