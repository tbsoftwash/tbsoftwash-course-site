"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import type { LessonMeta } from "@/lib/course";
import { DiagramStyleToggle } from "@/components/DiagramStyleToggle";
import { PreviewModeToggle } from "@/components/PreviewModeToggle";
import { CourseViewToggle } from "@/components/CourseViewToggle";
import { SearchInput } from "@/components/SearchInput";
import { UserCardMenu } from "@/components/UserCardMenu";
import { cn } from "@/lib/utils";
import { lessonKey, loadCompleted } from "@/lib/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

function cleanTitle(t: string) {
  return t
    .replace(/^Module\s+\d+\s+—\s+/i, "")
    .replace(/^Week\s+\d+\s+—\s+/i, "")
    .replace(/\s*\(Lesson\)\s*$/i, "")
    .trim();
}

function NavItem({ href, label, done }: { href: string; label: string; done?: boolean }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition",
        active
          ? "bg-accent/70 text-foreground font-semibold"
          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
      )}
    >
      <span className="min-w-0 truncate">{label}</span>
      {done ? <span className="shrink-0 text-xs font-semibold text-primary">✓</span> : null}
    </Link>
  );
}

function groupCore(lessons: LessonMeta[]) {
  const byModule = new Map<number, LessonMeta[]>();
  for (const l of lessons.filter((x) => x.track === "core")) {
    const m = l.module ?? 0;
    byModule.set(m, [...(byModule.get(m) ?? []), l]);
  }
  const modules = Array.from(byModule.entries()).sort((a, b) => a[0] - b[0]);
  for (const [, items] of modules) items.sort((a, b) => (a.lesson ?? 999) - (b.lesson ?? 999));
  return modules;
}

function groupSpringboard(lessons: LessonMeta[]) {
  const byWeek = new Map<string, LessonMeta[]>();
  for (const l of lessons.filter((x) => x.track === "springboard")) {
    const w = l.week ?? "springboard";
    byWeek.set(w, [...(byWeek.get(w) ?? []), l]);
  }
  const weeks = Array.from(byWeek.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  for (const [, items] of weeks) items.sort((a, b) => (a.lesson ?? 999) - (b.lesson ?? 999));
  return weeks;
}

const OPEN_KEY = "tbsa.sidebarOpen.v1";
function loadOpen(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(OPEN_KEY) || "{}") || {};
  } catch {
    return {};
  }
}
function saveOpen(state: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(OPEN_KEY, JSON.stringify(state));
}

function RailButton({
  label,
  onClick,
  active,
  glyph,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  glyph: string;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl border bg-background/30 text-sm text-foreground/80 hover:bg-accent/40",
        active ? "bg-accent/60" : ""
      )}
    >
      {glyph}
    </button>
  );
}

export function SidebarNav({
  lessons,
  moduleTitles,
  collapsed,
  setCollapsed,
}: {
  lessons: LessonMeta[];
  moduleTitles: Record<number, string>;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = React.useState("");
  const [completed, setCompleted] = React.useState<Set<string>>(new Set());
  const [open, setOpen] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const refresh = () => setCompleted(loadCompleted());
    refresh();
    window.addEventListener("tbsa:progress", refresh as any);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("tbsa:progress", refresh as any);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  React.useEffect(() => {
    setOpen(loadOpen());
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lessons;
    return lessons.filter((l) => (l.title + " " + l.slug).toLowerCase().includes(q));
  }, [lessons, query]);

  const coreModules = groupCore(filtered);
  const springWeeks = groupSpringboard(filtered);

  const toggle = (key: string, value: boolean) => {
    const next = { ...open, [key]: value };
    setOpen(next);
    saveOpen(next);
  };

  // Collapsed rail
  if (collapsed) {
    return (
      <div className="flex h-screen flex-col items-center gap-3 p-3">
        <RailButton
          label="Open sidebar"
          glyph="⟩"
          onClick={() => setCollapsed(false)}
        />
        <div className="h-px w-full bg-border" />

        <RailButton
          label="Course"
          glyph="⌂"
          active={pathname === "/course"}
          onClick={() => {
            setCollapsed(false);
            router.push("/course");
          }}
        />
        <RailButton
          label="Search"
          glyph="⌕"
          onClick={() => {
            setCollapsed(false);
            // focus will be manual after open
          }}
        />
        <RailButton
          label="Printables"
          glyph="⎙"
          onClick={() => {
            setCollapsed(false);
            router.push("/course/printables");
          }}
        />
        <RailButton
          label="Settings"
          glyph="⚙"
          onClick={() => {
            setCollapsed(false);
          }}
        />

        <div className="mt-auto pt-2">
          <UserCardMenu collapsed />
        </div>
      </div>
    );
  }

  return (
    <aside className="flex h-screen flex-col">
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand-icon.png"
              alt="Tampa Bay Soft Wash & Pressure Cleaning"
              className="h-7 w-7"
            />
            <span className="text-sm font-semibold">@tbsoftwash</span>
          </Link>
          <button
            title="Close sidebar"
            onClick={() => setCollapsed(true)}
            className="rounded-lg border bg-background/30 px-2 py-1 text-xs text-muted-foreground hover:bg-accent/40"
          >
            ⟨
          </button>
        </div>

        <SearchInput value={query} onChange={setQuery} placeholder="Search lessons…" />

        <div className="mb-4">
          <NavItem href="/course" label="Course Index" />
        </div>

      </div>

      {/* Scroll area (independent of pinned user card) */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-6">
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Core Modules</h3>
            <div className="space-y-2">
              {coreModules.map(([module, items]) => {
                const key = `core:${module}`;
                const isOpen = open[key] ?? false;
                return (
                  <div key={module} className="rounded-xl border bg-background/30">
                    <Collapsible open={isOpen} onOpenChange={(v) => toggle(key, v)}>
                      <CollapsibleTrigger>
                        <span className="truncate">
                          Module {module}
                          {moduleTitles?.[module] ? ` — ${moduleTitles[module]}` : ""}
                        </span>
                        <span className="text-xs text-muted-foreground">{isOpen ? "Hide" : "Show"}</span>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="grid gap-1 px-2 pb-2">
                          {items.map((l) => (
                            <NavItem
                              key={`c-${module}-${l.slug}`}
                              href={`/course/core/${module}/${l.slug}`}
                              label={cleanTitle(l.title)}
                              done={completed.has(lessonKey({ track: "core", module, slug: l.slug }))}
                            />
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Springboard</h3>
            <div className="space-y-2">
              {springWeeks.map(([week, items]) => {
                const key = `spring:${week}`;
                const isOpen = open[key] ?? false;
                return (
                  <div key={week} className="rounded-xl border bg-background/30">
                    <Collapsible open={isOpen} onOpenChange={(v) => toggle(key, v)}>
                      <CollapsibleTrigger>
                        <span className="truncate">{week}</span>
                        <span className="text-xs text-muted-foreground">{isOpen ? "Hide" : "Show"}</span>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="grid gap-1 px-2 pb-2">
                          {items.map((l) => (
                            <NavItem
                              key={`s-${week}-${l.slug}`}
                              href={`/course/springboard/${week}/${l.slug}`}
                              label={cleanTitle(l.title)}
                              done={completed.has(lessonKey({ track: "springboard", week, slug: l.slug }))}
                            />
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Printables</h3>
            <div className="grid gap-1">
              <NavItem href="/course/printables" label="Printables (Index)" />
              <NavItem href="/course/printables/operator-checklist-pack" label="Operator Checklist Pack" />
              <NavItem href="/course/printables/safety-loadout-checklist-v1" label="Safety Loadout Checklist" />
              <NavItem href="/course/printables/spill-and-exposure-response-card-v1" label="Spill + Exposure Card" />
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tools</h3>
            <div className="grid gap-1">
              <NavItem href="/course/figures/psi-vs-gpm" label="Figure demo" />
            </div>
          </section>

        </div>
      </div>

      {/* Pinned user card */}
      <div className="border-t bg-background/60 p-3 backdrop-blur-xl">
        <UserCardMenu />
      </div>
    </aside>
  );
}
