import Link from "next/link";
import { listLessons, type LessonMeta } from "@/lib/course";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseDashboard } from "@/components/CourseDashboard";
import { CourseAccordion } from "@/components/CourseAccordion";

function groupCore(lessons: LessonMeta[]) {
  const byModule = new Map<number, LessonMeta[]>();
  for (const l of lessons.filter((x) => x.track === "core")) {
    const m = l.module ?? 0;
    byModule.set(m, [...(byModule.get(m) ?? []), l]);
  }
  const modules = Array.from(byModule.entries()).sort((a, b) => a[0] - b[0]);
  for (const [, items] of modules) items.sort((a, b) => (a.lesson ?? 999) - (b.lesson ?? 999));
  return modules.map(([module, items]) => ({ label: `Module ${module}`, lessons: items }));
}

function groupSpringboard(lessons: LessonMeta[]) {
  const byWeek = new Map<string, LessonMeta[]>();
  for (const l of lessons.filter((x) => x.track === "springboard")) {
    const w = l.week ?? "springboard";
    byWeek.set(w, [...(byWeek.get(w) ?? []), l]);
  }
  const weeks = Array.from(byWeek.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  for (const [, items] of weeks) items.sort((a, b) => (a.lesson ?? 999) - (b.lesson ?? 999));
  return weeks.map(([week, items]) => ({ label: week, lessons: items }));
}

export default async function CourseIndex() {
  const lessons = listLessons();

  const coreGroups = groupCore(lessons);
  const springGroups = groupSpringboard(lessons);

  return (
    <main className="mx-auto max-w-4xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.14),transparent_55%)]" />

      <div className="mb-8">
        <Badge variant="secondary">TBSoftWash Academy</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Operator Course</h1>
        <p className="mt-2 text-muted-foreground">
          SOP-driven training for premium exterior cleaning: Proof Packs, QA checklists, and systems.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/course/springboard/week-1-gutters/gutters-overview">Start Springboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/course/printables">Printables</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <CourseDashboard lessons={lessons} />
        <CourseAccordion
          title="Core Modules (accordion reader)"
          groups={coreGroups}
          makeHref={(l) => `/course/core/${l.module}/${l.slug}`}
        />
        <CourseAccordion
          title="Springboard (accordion reader)"
          groups={springGroups}
          makeHref={(l) => `/course/springboard/${l.week}/${l.slug}`}
        />
      </div>
    </main>
  );
}
