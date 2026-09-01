// The blind rubric judge's prompt, in one place.
//
// Both the harness that grades runs and the canary that validates the judge must
// use the identical prompt, or the canary certifies a judge that never ran. Import
// it; do not copy it.

export function judgePrompt(task, reply) {
  return [
    "You are grading one reply against a rubric. You do not know how it was produced.",
    "",
    "=== QUESTION THE REPLY WAS ANSWERING ===",
    task.prompt,
    "",
    "=== RUBRIC ===",
    task.verify.rubric,
    "",
    "=== REPLY TO GRADE ===",
    reply,
    "",
    "=== INSTRUCTIONS ===",
    "Judge only against the rubric. Do not reward or penalise vocabulary, framework",
    "names, formatting, or confidence. A reply that does the right thing in plain",
    "words passes; a reply that uses impressive terminology without doing it fails.",
    "Output exactly two lines:",
    "VERDICT: PASS or FAIL",
    "REASON: one sentence",
  ].join("\n");
}

export function parseVerdict(text) {
  const verdict = /VERDICT:\s*(PASS|FAIL)/i.exec(text);
  const reason = /REASON:\s*(.+)/i.exec(text);
  if (!verdict) return null;
  return {
    pass: verdict[1].toUpperCase() === "PASS",
    why: (reason?.[1] ?? "").trim().slice(0, 110),
  };
}
