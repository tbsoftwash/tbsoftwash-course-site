"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { lessonKey, loadCompleted, saveCompleted, setLastLesson } from "@/lib/progress";

export function CompleteAndNextButton({
  nextHref,
  nextLabel,
  progress,
}: {
  nextHref: string;
  nextLabel?: string;
  progress: { track: "core" | "springboard"; module?: number; week?: string; slug: string };
}) {
  const router = useRouter();
  const key = lessonKey(progress);

  const label = nextLabel ? `Complete & Next: ${nextLabel}` : "Mark complete & Next";

  const onClick = () => {
    // Mark complete (idempotent)
    const set = loadCompleted();
    if (!set.has(key)) {
      set.add(key);

      // streak tracking
      try {
        const today = new Date().toISOString().slice(0, 10);
        const raw = window.localStorage.getItem("tbsa.activityDays.v1");
        const obj = raw ? JSON.parse(raw) : {};
        obj[today] = (obj[today] ?? 0) + 1;
        window.localStorage.setItem("tbsa.activityDays.v1", JSON.stringify(obj));
      } catch {
        // ignore
      }

      saveCompleted(set);
      window.dispatchEvent(new CustomEvent("tbsa:progress"));
    }

    setLastLesson(key);
    router.push(nextHref);
  };

  return (
    <Button variant="default" size="sm" onClick={onClick}>
      {label}
    </Button>
  );
}
