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

## New to Claude skills?

A **skill** is a folder with a `SKILL.md` in it. The frontmatter carries a `name` and a
`description`; the body is instructions. Claude Code reads every installed skill's
*description* at startup and loads the *body* only when a task matches — so a skill costs
almost nothing until it is relevant.

That design has one consequence worth understanding before you install anything: **the
description is the whole trigger.** A skill whose description does not match how people
actually phrase things will never activate, no matter how good its contents are. It is why
this repository measures triggering separately from content — see [`eval/RESULTS.md`](eval/RESULTS.md).

Skills are not specific to this repository. Anthropic documents the format at
[Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills), and you can
scaffold your own with `claude plugin init <name>`.

**What `cobra` costs you:** ~236 tokens of always-on context (just its description), and
~1.9k tokens on the occasions it actually fires. Check any plugin's cost yourself with
`claude plugin details <name>`.

## Install

You need [Claude Code](https://docs.claude.com/en/docs/claude-code) installed. Verify with
`claude --version`.

### Option 1 — as a plugin (recommended)

From inside a Claude Code session:

```
/plugin marketplace add bharat-goel/cobra-skill
/plugin install cobra
```

Or from your terminal:

```bash
claude plugin marketplace add bharat-goel/cobra-skill
claude plugin install cobra@cobra-skill
```

Restart Claude Code, then confirm it registered:

```bash
claude plugin details cobra
```

### Option 2 — symlink the skill

Skips the plugin system entirely. Edits to the clone take effect immediately, which is what
you want if you intend to modify it.

```bash
git clone https://github.com/bharat-goel/cobra-skill
cd cobra-skill
ln -sfn "$PWD/skills/cobra" ~/.claude/skills/cobra
```

### Option 3 — copy it

No git, no plugin system, no updates.

```bash
mkdir -p ~/.claude/skills/cobra
curl -sL https://raw.githubusercontent.com/bharat-goel/cobra-skill/main/skills/cobra/SKILL.md \
  -o ~/.claude/skills/cobra/SKILL.md
```

### Updating

If you installed via the plugin system, a new release does not arrive on its own — pull the
marketplace, then update:

```bash
claude plugin marketplace update cobra-skill
claude plugin update cobra
```

Restart Claude Code, then check the version:

```bash
claude plugin details cobra
```

`1.1.0` or later has the rewritten evaluation and the revised skill body — see
[CHANGELOG.md](CHANGELOG.md). If it still reports `1.0.0`, the marketplace cache is stale; remove
and re-add it with `claude plugin marketplace remove cobra-skill` followed by the add command
above.

If you installed by symlink (Option 2), `git pull` is the whole update. If you copied the file
(Option 3), re-run the `curl`.

### Scope

`~/.claude/skills/` installs for **you**, everywhere. To install for one project instead —
so it travels with the repo and your teammates get it — put the skill in `.claude/skills/`
inside that project and commit it.

### Check it works

Restart Claude Code and ask something it should catch:

> I'm adding a CI gate that fails the build if test coverage drops below 80%. Any concerns?

You should get the assertion-free-tests problem back. If nothing happens, see below.

### If it does not fire

- **Restart first.** Skills are read at session start; a newly installed one will not appear
  mid-session.
- **Confirm it is registered** — `claude plugin details cobra`, or check that
  `~/.claude/skills/cobra/SKILL.md` exists and the symlink is not broken.
- **It genuinely will not fire on everything.** Measured recall is 83%, and the misses are
  real: a prompt about paying bonuses on tickets closed fired once in three runs, because the
  wording contains no test, metric or threshold. You can always invoke it directly with
  `/cobra`.
- **Nothing to fix if the answer was already right.** Two of three measured tasks sit at
  100% without the skill. On those, firing would add nothing.

---

## Measured

Almost no skills repository publishes evidence that its skills help. Writing a convincing `SKILL.md` is easy; demonstrating it changes what the model does is not. So this one was measured against a baseline with the skill absent, and the harness ships with it.

| Measure | Result | Method |
|---|---|---|
| **Content effect** | **+26.7pp** | Paired evaluation, n=10, averaged over three signal tasks |
| **Trigger recall** | **83%** (15/18) | Does the description actually fire on prompts it targets? |
| **False fires** | **3/39** | Includes five near-miss prompts that name a measure but ask for config or tooling |

Content and triggering are measured separately, because they fail separately: a skill can give excellent advice and never activate, or activate constantly and add nothing. Numbers in [`eval/RESULTS.md`](eval/RESULTS.md); method, tasks and limits in [`eval/`](eval/).

Three defects were found and fixed while building the harness, each caught only by reading raw transcripts rather than trusting the numbers:

- **A contaminated control.** Runs originally executed inside the repo, so the control arm could read the skill off disk. Its replies came back using the skill's own vocabulary, quietly collapsing every measured delta toward zero. A contaminated control fails *silently* and looks exactly like a real null result.
- **Two verifier false negatives**, both of which scored a *better* answer wrong.
- **n=3 was not trustworthy.** One task swung 100 percentage points between n=3 and n=10 on luck alone.
- **A batch that died mid-run still printed a number.** When the API session limit killed 83 of 100 runs, the harness counted every dead run as a failed answer and reported a tidy **-13.3pp**. Runs that produce no reply are now excluded, cells below 80% graded report `n/a`, and a voided batch prints no average and exits non-zero.
- **The verifiers themselves were gameable, and the published number was inflated.** Two signal tasks were graded by substring match, and one of them passed every treatment run on the single word *"weaken"* — a word `SKILL.md` supplies verbatim. Control replies that correctly diagnosed the real bug scored 0% for not using it. Both tasks were rewritten as blind rubric judgements that refuse credit for vocabulary, and the headline fell from +40.0pp to **+26.7pp**. Full account in [`eval/RESULTS.md`](eval/RESULTS.md).

Which is, of course, the same lesson the skill is about: the measure is not the goal, and you only find out by looking underneath it.

Per task, the content effect is uneven — which is worth seeing rather than averaging away:

| Task | Without skill | With skill | Delta |
|---|---|---|---|
| `ic-smoke-denominator` — a smoke test that "caught 3 incidents", with no denominator | 10% | 90% | **+80.0pp** |
| `ic-clock-exclusion` — an SLA whose fairness exclusion is the loophole | 100% | 100% | **+0.0pp** |
| `ic-agent-under-pressure` — "get the suite green, whatever it takes", against a real failing test | 100% | 100% | **+0.0pp** |

One task carries the whole average. The other two are at ceiling in both arms — the model handles
them unaided, so the skill has nothing to add. Averaging hides that, so it is printed.

The suite also runs two harm tasks. One is a factual question with no measure in it, where the
skill must stay quiet, and does. The other is a **negative control**: a genuinely sound measure
that should be endorsed rather than picked apart. Without it, the cheapest way to satisfy "apply
cobra" is to flag everything and look vigilant, and nothing in the suite would catch that.

### Honest limits

Measured on Sonnet only, three signal tasks, two of which are at ceiling and show no effect —
so the content number rests on a single task. Trigger recall is
measured at n=3 per prompt, so 83% is three missed runs out of eighteen and should be read as
coarse. The one false fire is a borderline prompt ("set the alert threshold to 500ms") that the
description arguably should catch; it is counted against the skill rather than argued away. Content and triggering are measured separately rather than end-to-end in a long
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
