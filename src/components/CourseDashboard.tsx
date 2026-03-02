"use client";

import * as React from "react";
import Link from "next/link";
import type { LessonMeta } from "@/lib/course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { loadCompleted, getLastLesson, lessonKey } from "@/lib/progress";

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

export function CourseDashboard({ lessons }: { lessons: LessonMeta[] }) {
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

  const byModule = React.useMemo(() => {
    const map = new Map<string, { label: string; total: number; done: number; href?: string }>();

    for (const l of lessons) {
      const bucket =
        l.track === "core" ? `core:module:${l.module}` : `springboard:week:${l.week}`;
      const label = l.track === "core" ? `Module ${l.module}` : String(l.week);

      const k = lessonKey({
        track: l.track,
        module: l.module,
        week: l.week,
        slug: l.slug,
      });

      const entry = map.get(bucket) ?? {
        label,
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

    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [lessons, completed]);

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
            {completed.size}/{lessons.length} lessons completed
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
