"use client";

import * as React from "react";
import Link from "next/link";
import type { LessonMeta } from "@/lib/course";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  applyCloudProfileToLocal,
  clearProgress,
  getLastLesson,
  lessonKey,
  loadBookmarks,
  loadCompleted,
  loadNotes,
  type RosterEntry,
  STORAGE_EMAIL,
  syncProgressToCloud,
} from "@/lib/progress";

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
        className="h-2 rounded-full bg-primary transition-all duration-300"
        style={{ width: `${Math.min(100, Math.round(value * 100))}%` }}
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
  const [bookmarks, setBookmarks] = React.useState<Set<string>>(new Set());
  const [notes, setNotes] = React.useState<Record<string, string>>({});
  const [last, setLast] = React.useState<string | null>(null);
  const [memberEmail, setMemberEmail] = React.useState<string | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [roster, setRoster] = React.useState<RosterEntry[] | null>(null);
  const [syncing, setSyncing] = React.useState(false);

  React.useEffect(() => {
    const refresh = () => {
      setCompleted(loadCompleted());
      setBookmarks(loadBookmarks());
      setNotes(loadNotes());
      setLast(getLastLesson());
      if (typeof window !== "undefined") {
        setMemberEmail(window.localStorage.getItem(STORAGE_EMAIL));
      }
    };
    refresh();
    window.addEventListener("tbsa:progress", refresh as any);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("tbsa:progress", refresh as any);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Cloud profile check & auto-merge on mount
  React.useEffect(() => {
    let active = true;
    setSyncing(true);
    syncProgressToCloud("merge")
      .then((res) => {
        if (!active) return;
        if (res.authenticated && res.email) {
          setMemberEmail(res.email);
          setIsAdmin(Boolean(res.isAdmin));
          if (res.roster) setRoster(res.roster);
          if (res.profile) {
            applyCloudProfileToLocal(res.profile, "merge");
          }
        }
      })
      .finally(() => {
        if (active) setSyncing(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const overall = lessons.length ? completed.size / lessons.length : 0;
  const overallPct = Math.round(overall * 100);

  const [streak, setStreak] = React.useState<{ days: number; today: boolean }>({
    days: 0,
    today: false,
  });

  React.useEffect(() => {
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

  const lessonByKey = React.useMemo(() => {
    const map = new Map<string, LessonMeta>();
    for (const l of lessons) {
      map.set(lessonKey({ track: l.track, module: l.module, week: l.week, slug: l.slug }), l);
    }
    return map;
  }, [lessons]);

  // 4 Operator Certification Milestones
  const milestones = React.useMemo(() => {
    const calc = (predicate: (l: LessonMeta) => boolean) => {
      const subset = lessons.filter(predicate);
      const doneCount = subset.filter((l) =>
        completed.has(lessonKey({ track: l.track, module: l.module, week: l.week, slug: l.slug }))
      ).length;
      return { total: subset.length, done: doneCount, pct: subset.length ? Math.round((doneCount / subset.length) * 100) : 0 };
    };

    return [
      {
        id: "springboard",
        title: "Springboard Fast-Start",
        subtitle: "Weeks 0–3: Gutters, Windows & RO/DI",
        ...calc((l) => l.track === "springboard"),
      },
      {
        id: "softwash-safety",
        title: "Soft Wash & Roof Safety",
        subtitle: "Modules 0–4: SH Ratios, ARMA Roof & House Wash",
        ...calc((l) => l.track === "core" && (l.module ?? 0) >= 0 && (l.module ?? 0) <= 4),
      },
      {
        id: "specialty-trident",
        title: "Specialty & Paver Sealing",
        subtitle: "Modules 5–8: Flatwork, Drains, Rust & Trident Sealing",
        ...calc((l) => l.track === "core" && (l.module ?? 0) >= 5 && (l.module ?? 0) <= 8),
      },
      {
        id: "master-operator",
        title: "TBSoftWash Master Operator",
        subtitle: "100% Core Curriculum + Springboard",
        ...calc(() => true),
      },
    ];
  }, [lessons, completed]);

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

      if (!entry.href) entry.href = hrefForLesson(l);

      map.set(bucket, entry);
    }

    return Array.from(map.values()).sort((a, b) => a.sortKey - b.sortKey);
  }, [lessons, completed, moduleTitles]);

  const lastLessonMeta = last ? lessonByKey.get(last) ?? null : null;
  const lastHref = lastLessonMeta ? hrefForLesson(lastLessonMeta) : null;

  const savedBookmarkItems = React.useMemo(() => {
    return Array.from(bookmarks)
      .map((k) => ({ key: k, meta: lessonByKey.get(k) }))
      .filter((x): x is { key: string; meta: LessonMeta } => Boolean(x.meta));
  }, [bookmarks, lessonByKey]);

  const savedNoteItems = React.useMemo(() => {
    return Object.entries(notes)
      .filter(([, txt]) => Boolean(txt && txt.trim()))
      .map(([k, txt]) => ({ key: k, text: txt, meta: lessonByKey.get(k) }));
  }, [notes, lessonByKey]);

  async function handleManualSync() {
    setSyncing(true);
    try {
      const res = await syncProgressToCloud("merge");
      if (res.authenticated && res.email) {
        setMemberEmail(res.email);
        setIsAdmin(Boolean(res.isAdmin));
        if (res.roster) setRoster(res.roster);
      }
    } finally {
      setSyncing(false);
    }
  }

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_EMAIL);
    }
    setMemberEmail(null);
    setIsAdmin(false);
    setRoster(null);
  }

  return (
    <div className="grid gap-6">
      {/* Cloud Sync & Member Banner */}
      <Card className="border-primary/30 bg-card/80 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">
                {memberEmail ? `Operator Account: ${memberEmail}` : "Guest Mode (Local Device Progress)"}
              </CardTitle>
              <Badge variant={memberEmail ? "default" : "secondary"}>
                {memberEmail ? (syncing ? "Syncing…" : "Cloud Synced ✓") : "Local Only"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {memberEmail ? (
                <>
                  <Button size="sm" variant="outline" onClick={handleManualSync} disabled={syncing}>
                    {syncing ? "Syncing…" : "Sync Now"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button asChild size="sm">
                  <Link href="/signin">Sign In with Email (6-Digit Code / Magic Link) →</Link>
                </Button>
              )}
            </div>
          </div>
          <CardDescription>
            {memberEmail
              ? "Your completed lessons, certification milestones, saved SOP bookmarks, and personal field notes automatically sync across phone, tablet, and desktop."
              : "Sign in with your email (no password required) to back up your progress to the cloud and sync across your truck phone and office computer."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Progress & Resume Card */}
      <Card className="bg-card/70 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Your Operator Progress</CardTitle>
          <CardDescription>
            {completed.size}/{lessons.length} lessons completed • {overallPct}% • active streak: {streak.days}d •{" "}
            {savedBookmarkItems.length} saved SOPs • {savedNoteItems.length} field notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar value={overall} />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {lastHref && lastLessonMeta ? (
            <Button asChild>
              <Link href={lastHref}>Resume: {lastLessonMeta.title}</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/course/core/0/welcome-and-how-to-use">Start Module 0 →</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/course/printables/operator-checklist-pack">Printables &amp; Checklists</Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">Reset progress</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  This clears your completed checkmarks and your “Continue” position.
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

      {/* 4 Operator Certification Milestones */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Operator Certification Milestones
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((ms) => {
            const unlocked = ms.total > 0 && ms.done >= ms.total;
            return (
              <Card
                key={ms.id}
                className={
                  unlocked
                    ? "border-primary/60 bg-primary/10 backdrop-blur-xl"
                    : "bg-card/60 backdrop-blur-xl"
                }
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={unlocked ? "default" : "secondary"}>
                      {unlocked ? "🏆 Certified" : `${ms.pct}%`}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {ms.done}/{ms.total}
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-sm">{ms.title}</CardTitle>
                  <CardDescription className="text-xs">{ms.subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProgressBar value={ms.total ? ms.done / ms.total : 0} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Saved SOP Bookmarks & Personal Field Notes */}
      {savedBookmarkItems.length > 0 || savedNoteItems.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-card/70 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">★ Saved SOP Bookmarks ({savedBookmarkItems.length})</CardTitle>
              <CardDescription>Quick-access field SOPs bookmarked from lesson headers.</CardDescription>
            </CardHeader>
            <CardContent>
              {savedBookmarkItems.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Click “☆ Save SOP” at the top of any lesson to pin it here for fast driveway reference.
                </p>
              ) : (
                <ul className="grid gap-2">
                  {savedBookmarkItems.map(({ key, meta }) => (
                    <li key={key}>
                      <Link
                        href={hrefForLesson(meta)}
                        className="flex items-center justify-between rounded-lg border bg-background/40 px-3 py-2 text-sm hover:bg-accent/40"
                      >
                        <span className="truncate font-medium">{meta.title}</span>
                        <span className="ml-2 shrink-0 text-xs text-primary">Open →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">📝 Personal Field &amp; Rig Notes ({savedNoteItems.length})</CardTitle>
              <CardDescription>Your custom manifold ratios, orifice notes, and crew reminders.</CardDescription>
            </CardHeader>
            <CardContent>
              {savedNoteItems.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Click “📝 Add Note” on any lesson to store personal rig notes synced to your account.
                </p>
              ) : (
                <ul className="grid gap-2">
                  {savedNoteItems.map(({ key, text, meta }) => (
                    <li key={key} className="rounded-lg border bg-background/40 p-2.5 text-xs">
                      {meta ? (
                        <Link href={hrefForLesson(meta)} className="font-semibold text-primary hover:underline">
                          {meta.title}
                        </Link>
                      ) : (
                        <span className="font-semibold">{key}</span>
                      )}
                      <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Admin Crew & Member Progress Roster (Brian & Jessica Only) */}
      {isAdmin && roster && roster.length > 0 ? (
        <Card className="border-primary/40 bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Crew &amp; Academy Member Roster ({roster.length} Registered)
              </CardTitle>
              <Badge>Admin View</Badge>
            </div>
            <CardDescription>
              Live training completion across all registered Academy operators (Module 11 Crew Training verification).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-2 pr-4">Operator Email</th>
                    <th className="py-2 pr-4">Completed</th>
                    <th className="py-2 pr-4">Completion %</th>
                    <th className="py-2 pr-4">Active Days</th>
                    <th className="py-2 pr-4">Saved SOPs / Notes</th>
                    <th className="py-2">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((r) => {
                    const pct = lessons.length ? Math.round((r.completedCount / lessons.length) * 100) : 0;
                    return (
                      <tr key={r.email} className="border-b border-border/50">
                        <td className="py-2 pr-4 font-medium">{r.email}</td>
                        <td className="py-2 pr-4">
                          {r.completedCount}/{lessons.length}
                        </td>
                        <td className="py-2 pr-4 font-semibold text-primary">{pct}%</td>
                        <td className="py-2 pr-4">{r.activeDays}d</td>
                        <td className="py-2 pr-4">
                          {r.bookmarksCount} ★ / {r.notesCount} 📝
                        </td>
                        <td className="py-2 text-muted-foreground">
                          {r.lastActiveAt ? r.lastActiveAt.slice(0, 10) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Module Breakdown Cards */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Module &amp; Springboard Progress
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {byModule.map((m) => {
            const pct = m.total ? m.done / m.total : 0;
            return (
              <Card key={m.label} className="bg-card/70 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base">{m.label}</CardTitle>
                  <CardDescription>
                    {m.done}/{m.total} completed ({Math.round(pct * 100)}%)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProgressBar value={pct} />
                </CardContent>
                <CardFooter>
                  {m.href ? (
                    <Button asChild size="sm" variant="outline">
                      <Link href={m.href}>Open Module</Link>
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
