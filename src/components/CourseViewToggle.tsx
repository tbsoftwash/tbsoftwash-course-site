"use client";

import * as React from "react";

import { loadCourseView, saveCourseView, type CourseViewMode } from "@/lib/courseView";
import { cn } from "@/lib/utils";

export function CourseViewToggle() {
  const [mounted, setMounted] = React.useState(false);
  const [mode, setMode] = React.useState<CourseViewMode>("dashboard");

  React.useEffect(() => {
    setMounted(true);
    setMode(loadCourseView());
  }, []);

  if (!mounted) return null;

  const set = (m: CourseViewMode) => {
    setMode(m);
    saveCourseView(m);
    window.dispatchEvent(new CustomEvent("tbsa:courseView"));
  };

  return (
    <div className="rounded-xl border bg-background/30 p-3">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Course view</div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => set("dashboard")}
          className={cn(
            "rounded-lg border px-3 py-2 text-left text-sm transition",
            mode === "dashboard"
              ? "bg-accent/70 text-foreground font-semibold"
              : "bg-background/20 text-muted-foreground hover:bg-accent/40 hover:text-foreground"
          )}
        >
          <div className="font-semibold">Dashboard</div>
          <div className="text-xs opacity-80">Start buttons + progress</div>
        </button>
        <button
          type="button"
          onClick={() => set("reader")}
          className={cn(
            "rounded-lg border px-3 py-2 text-left text-sm transition",
            mode === "reader"
              ? "bg-accent/70 text-foreground font-semibold"
              : "bg-background/20 text-muted-foreground hover:bg-accent/40 hover:text-foreground"
          )}
        >
          <div className="font-semibold">Reader</div>
          <div className="text-xs opacity-80">Accordion browsing</div>
        </button>
      </div>
    </div>
  );
}
