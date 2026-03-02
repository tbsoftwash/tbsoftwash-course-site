"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LessonMeta } from "@/lib/course";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/lib/utils";

function cleanTitle(t: string) {
  return t
    .replace(/^Module\s+\d+\s+—\s+/i, "")
    .replace(/^Week\s+\d+\s+—\s+/i, "")
    .replace(/\s*\(Lesson\)\s*$/i, "")
    .trim();
}

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "block rounded-lg px-3 py-2 text-sm transition",
        active
          ? "bg-accent/70 text-foreground font-semibold"
          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
      )}
    >
      {label}
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

export function SidebarNav({ lessons }: { lessons: LessonMeta[] }) {
  const coreModules = groupCore(lessons);
  const springWeeks = groupSpringboard(lessons);

  return (
    <aside className="sticky top-0 h-screen overflow-y-auto border-r bg-background/60 backdrop-blur-xl">
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <NavItem href="/" label="TBSoftWash" />
          <ModeToggle />
        </div>

        <div className="mb-4">
          <NavItem href="/course" label="Course Index" />
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Core Modules
            </h3>
            <div className="space-y-4">
              {coreModules.map(([module, items]) => (
                <div key={module}>
                  <div className="mb-2 text-xs font-semibold text-foreground/90">Module {module}</div>
                  <div className="grid gap-1">
                    {items.map((l) => (
                      <NavItem
                        key={`c-${module}-${l.slug}`}
                        href={`/course/core/${module}/${l.slug}`}
                        label={cleanTitle(l.title)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Springboard
            </h3>
            <div className="space-y-4">
              {springWeeks.map(([week, items]) => (
                <div key={week}>
                  <div className="mb-2 text-xs font-semibold text-foreground/90">{week}</div>
                  <div className="grid gap-1">
                    {items.map((l) => (
                      <NavItem
                        key={`s-${week}-${l.slug}`}
                        href={`/course/springboard/${week}/${l.slug}`}
                        label={cleanTitle(l.title)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Printables
            </h3>
            <div className="grid gap-1">
              <NavItem href="/course/printables/operator-checklist-pack" label="Operator Checklist Pack" />
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
}
