"use client";

import * as React from "react";
import Link from "next/link";
import type { LessonMeta } from "@/lib/course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { loadCompleted, getLastLesson, lessonKey, clearProgress } from "@/lib/progress";

const SPRINGBOARD_LABELS: Record<string, string> = {
  "week-0-first-7-days": "Week 0 — Your First 7 Days",
  "week-1-gutters": "Week 1 — Gutters (Fast-Start)",
  "week-2-traditional-windows": "Week 2 — Traditional Windows",
  "week-3-wfp-rodi": "Week 3 — Pure Water (WFP / RO-DI)",
};

function springboardWeekLabel(weekId: string): string {
  if (SPRINGBOARD_LABELS[weekId]) return SPRINGBOARD_LABELS[weekId];
  const m = weekId.match(/^week-(\d+)-(.+)$/i);
  if (m) {
    const num = parseInt(m[1], 10);
    const title = m[2].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return `Week ${num} — ${title}`;
  }
  return weekId;
}

function hrefForLesson(l: LessonMeta) {
  if (l.track === "core") return `/course/core/${l.module}/${l.slug}`;
  return `/course/springboard/${l.week}/${l.slug}`;
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className="h-2 rounded-full bg-primary"
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  );
}

export function CourseDashboard({
  lessons,
  moduleTitles,
}: {
  lessons: LessonMeta[];
  moduleTitles: Record<number, string>;
}) {
  const [completed, setCompleted] = React.useState<Set<string>>(new Set());
  const [last, setLast] = React.useState<string | null>(null);

  React.useEffect(() => {
    const refresh = () => {
      setCompleted(loadCompleted());
      setLast(getLastLesson());
    };
    refresh();
    window.addEventListener("tbsa:progress", refresh as any);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("tbsa:progress", refresh as any);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const overall = lessons.length ? completed.size / lessons.length : 0;

  const overallPct = Math.round(overall * 100);

  const [streak, setStreak] = React.useState<{ days: number; today: boolean }>({
    days: 0,
    today: false,
  });

  React.useEffect(() => {
    // Avoid hydration mismatch: streak depends on localStorage + current date.
    try {
      const raw = window.localStorage.getItem("tbsa.activityDays.v1");
      const obj = raw ? JSON.parse(raw) : {};
      const keys = Object.keys(obj).sort();
      if (!keys.length) {
        setStreak({ days: 0, today: false });
        return;
      }

      const today = new Date();
      const iso = today.toISOString().slice(0, 10);
      const hasToday = Boolean(obj[iso]);

      let days = 0;
      for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const k = d.toISOString().slice(0, 10);
        if (obj[k]) days += 1;
        else break;
      }

      setStreak({ days, today: hasToday });
    } catch {
      setStreak({ days: 0, today: false });
    }
  }, [completed]);

  const byModule = React.useMemo(() => {
    const map = new Map<string, { label: string; sortKey: number; total: number; done: number; href?: string }>();

    for (const l of lessons) {
      const isCore = l.track === "core";
      const modNum = Number(l.module ?? 0);
      const weekStr = String(l.week ?? "");
      const weekMatch = weekStr.match(/week-(\d+)/);
      const weekNum = weekMatch ? Number(weekMatch[1]) : 99;

      const bucket = isCore ? `core:module:${modNum}` : `springboard:week:${weekStr}`;
      const label = isCore
        ? `Module ${modNum}${moduleTitles?.[modNum] ? ` — ${moduleTitles[modNum]}` : ""}`
        : springboardWeekLabel(weekStr);
      const sortKey = isCore ? modNum : 100 + weekNum;

      const k = lessonKey({
        track: l.track,
        module: l.module,
        week: l.week,
        slug: l.slug,
      });

      const entry = map.get(bucket) ?? {
        label,
        sortKey,
        total: 0,
        done: 0,
        href: hrefForLesson(l),
      };

      entry.total += 1;
      if (completed.has(k)) entry.done += 1;

      // keep first lesson href as "start"
      if (!entry.href) entry.href = hrefForLesson(l);

      map.set(bucket, entry);
    }

    return Array.from(map.values()).sort((a, b) => a.sortKey - b.sortKey);
  }, [lessons, completed, moduleTitles]);

  const lastHref = React.useMemo(() => {
    if (!last) return null;
    const match = lessons.find((l) => {
      const k = lessonKey({ track: l.track, module: l.module, week: l.week, slug: l.slug });
      return k === last;
    });
    return match ? hrefForLesson(match) : null;
  }, [lessons, last]);

  return (
    <div className="grid gap-6">
      <Card className="bg-card/70 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Your progress</CardTitle>
          <CardDescription>
            {completed.size}/{lessons.length} lessons completed • {overallPct}% • streak: {streak.days}d
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar value={overall} />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {lastHref ? (
            <Button asChild>
              <Link href={lastHref}>Continue</Link>
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <Link href="/course/printables/operator-checklist-pack">Printables</Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">Reset progress</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  This clears your completed checkmarks and your “Continue” position for this browser.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    clearProgress();
                    setCompleted(new Set());
                    setLast(null);
                    window.dispatchEvent(new CustomEvent("tbsa:progress"));
                  }}
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {byModule.map((m) => {
          const pct = m.total ? m.done / m.total : 0;
          return (
            <Card key={m.label} className="bg-card/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base">{m.label}</CardTitle>
                <CardDescription>
                  {m.done}/{m.total} completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressBar value={pct} />
              </CardContent>
              <CardFooter>
                {m.href ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={m.href}>Open</Link>
                  </Button>
                ) : null}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
