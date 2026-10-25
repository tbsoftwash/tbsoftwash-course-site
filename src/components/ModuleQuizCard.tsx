"use client";

import * as React from "react";
import { getQuizForTrack } from "@/lib/quizzes";
import { loadQuizScores, saveQuizScore } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function ModuleQuizCard(props: {
  track: "core" | "springboard";
  module?: number;
  week?: string;
}) {
  const quiz = getQuizForTrack(props);
  const [selected, setSelected] = React.useState<Record<string, number>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [bestScore, setBestScore] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!quiz) return;
    const refresh = () => {
      const scores = loadQuizScores();
      setBestScore(scores[quiz.quizId] ?? null);
    };
    refresh();
    window.addEventListener("tbsa:progress", refresh as any);
    return () => window.removeEventListener("tbsa:progress", refresh as any);
  }, [quiz]);

  if (!quiz) return null;

  const totalQ = quiz.questions.length;
  const correctCount = quiz.questions.filter(
    (q) => selected[q.id] === q.correctIndex
  ).length;
  const currentPct = totalQ ? Math.round((correctCount / totalQ) * 100) : 0;
  const passed = (bestScore ?? 0) >= 80 || (submitted && currentPct >= 80);

  function handleSubmit() {
    if (!quiz) return;
    setSubmitted(true);
    saveQuizScore(quiz.quizId, currentPct, true);
    setBestScore((prev) => Math.max(prev ?? 0, currentPct));
  }

  return (
    <Card className="mt-10 border-primary/30 bg-card/80 backdrop-blur-xl">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">🛡️ {quiz.title}</CardTitle>
          <Badge variant={passed ? "default" : "secondary"}>
            {passed
              ? `Passed ✓ (${bestScore ?? currentPct}%)`
              : bestScore !== null
              ? `Best: ${bestScore}% (80% Required)`
              : "Safety Gate Check"}
          </Badge>
        </div>
        <CardDescription>
          Pass this quick operator knowledge check (80%+) to verify SOP mastery and unlock your track certification.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-5">
        {quiz.questions.map((q, idx) => {
          const picked = selected[q.id];
          const isCorrect = picked === q.correctIndex;
          return (
            <div key={q.id} className="rounded-xl border bg-background/40 p-4">
              <div className="mb-2.5 text-sm font-semibold">
                {idx + 1}. {q.question}
              </div>
              <div className="grid gap-2">
                {q.options.map((opt, oIdx) => {
                  const active = picked === oIdx;
                  let borderCls = "border-border hover:bg-accent/40";
                  if (submitted) {
                    if (oIdx === q.correctIndex) {
                      borderCls = "border-primary bg-primary/15 text-foreground font-semibold";
                    } else if (active && !isCorrect) {
                      borderCls = "border-destructive bg-destructive/15 text-destructive";
                    }
                  } else if (active) {
                    borderCls = "border-primary bg-primary/10 font-medium";
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setSelected((s) => ({ ...s, [q.id]: oIdx }));
                      }}
                      className={`rounded-lg border px-3 py-2 text-left text-xs transition ${borderCls}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted ? (
                <div className="mt-2.5 rounded-lg bg-muted/60 p-2.5 text-xs text-muted-foreground">
                  <strong className={isCorrect ? "text-primary" : "text-destructive"}>
                    {isCorrect ? "✓ Correct:" : "✗ Field Note:"}
                  </strong>{" "}
                  {q.explanation}
                </div>
              ) : null}
            </div>
          );
        })}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-muted-foreground">
          {submitted
            ? `Score: ${correctCount}/${totalQ} (${currentPct}%) — ${
                currentPct >= 80
                  ? "Safety Gate Passed & Synced to Cloud ✓"
                  : "Review the explanations above and retry."
              }`
            : `Select an answer for all ${totalQ} questions, then click Verify Answers.`}
        </div>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={Object.keys(selected).length < totalQ}
        >
          {submitted ? "Re-Score Quiz" : "Verify Answers"}
        </Button>
      </CardFooter>
    </Card>
  );
}
