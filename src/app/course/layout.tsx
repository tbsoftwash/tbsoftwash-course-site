import Link from "next/link";
import { listLessons, type LessonMeta } from "@/lib/course";

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

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const lessons = listLessons();
  const coreModules = groupCore(lessons);
  const springWeeks = groupSpringboard(lessons);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "100vh" }}>
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
          <Link href="/" style={{ fontWeight: 700 }}>
            TBSoftWash
          </Link>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Link href="/course">Course Index</Link>
        </div>

        <h3 style={{ margin: "16px 0 8px" }}>Core Modules</h3>
        {coreModules.map(([module, items]) => (
          <div key={module} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
              Module {module}
            </div>
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              {items.map((l) => (
                <li key={`c-${module}-${l.slug}`} style={{ marginBottom: 6 }}>
                  <Link href={`/course/core/${module}/${l.slug}`}>{l.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h3 style={{ margin: "16px 0 8px" }}>Springboard</h3>
        {springWeeks.map(([week, items]) => (
          <div key={week} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{week}</div>
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              {items.map((l) => (
                <li key={`s-${week}-${l.slug}`} style={{ marginBottom: 6 }}>
                  <Link href={`/course/springboard/${week}/${l.slug}`}>{l.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h3 style={{ margin: "16px 0 8px" }}>Printables</h3>
        <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
          <li>
            <Link href="/course/printables/operator-checklist-pack">Operator Checklist Pack</Link>
          </li>
        </ul>
      </aside>

      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}
