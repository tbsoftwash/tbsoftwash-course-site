"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LessonMeta } from "@/lib/course";

function cleanTitle(t: string) {
  // remove leading module/week prefixes for sidebar readability
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
      style={{
        display: "block",
        padding: "6px 8px",
        borderRadius: 8,
        textDecoration: "none",
        color: active ? "#111827" : "#374151",
        background: active ? "rgba(0,0,0,0.06)" : "transparent",
        fontWeight: active ? 700 : 500,
      }}
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
    <aside
      style={{
        borderRight: "1px solid #e5e7eb",
        padding: 16,
        overflowY: "auto",
        position: "sticky",
        top: 0,
        height: "100vh",
        background: "#fff",
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <NavItem href="/" label="TBSoftWash" />
      </div>

      <div style={{ marginBottom: 12 }}>
        <NavItem href="/course" label="Course Index" />
      </div>

      <h3 style={{ margin: "16px 0 8px" }}>Core Modules</h3>
      {coreModules.map(([module, items]) => (
        <div key={module} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
            Module {module}
          </div>
          <div style={{ display: "grid", gap: 4 }}>
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

      <h3 style={{ margin: "16px 0 8px" }}>Springboard</h3>
      {springWeeks.map(([week, items]) => (
        <div key={week} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{week}</div>
          <div style={{ display: "grid", gap: 4 }}>
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

      <h3 style={{ margin: "16px 0 8px" }}>Printables</h3>
      <div style={{ display: "grid", gap: 4 }}>
        <NavItem href="/course/printables/operator-checklist-pack" label="Operator Checklist Pack" />
      </div>
    </aside>
  );
}
