"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { lessonKey, loadCompleted, saveCompleted, setLastLesson } from "@/lib/progress";

export function MarkCompleteButton(props: {
  track: "core" | "springboard";
  module?: number;
  week?: string;
  slug: string;
}) {
  const key = lessonKey(props);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const set = loadCompleted();
    setDone(set.has(key));
    setLastLesson(key);
  }, [key]);

  function toggle() {
    const set = loadCompleted();
    if (set.has(key)) set.delete(key);
    else set.add(key);

    // activity day tracking for streaks
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
    setDone(set.has(key));
    window.dispatchEvent(new CustomEvent("tbsa:progress"));
  }

  return (
    <Button variant={done ? "secondary" : "outline"} size="sm" onClick={toggle}>
      {done ? "Completed" : "Mark complete"}
    </Button>
  );
}
