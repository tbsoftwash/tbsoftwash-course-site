import Link from "next/link";
import { listLessons, type LessonMeta } from "@/lib/course";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseDashboard } from "@/components/CourseDashboard";
import { CourseAccordion } from "@/components/CourseAccordion";

import { getCoreModuleTitles } from "@/lib/moduleTitles";

function groupCore(lessons: LessonMeta[], moduleTitles: Record<number, string>) {
  const byModule = new Map<number, LessonMeta[]>();
  for (const l of lessons.filter((x) => x.track === "core")) {
    const m = l.module ?? 0;
    byModule.set(m, [...(byModule.get(m) ?? []), l]);
  }
  const modules = Array.from(byModule.entries()).sort((a, b) => a[0] - b[0]);
  for (const [, items] of modules) items.sort((a, b) => (a.lesson ?? 999) - (b.lesson ?? 999));
  return modules.map(([module, items]) => ({
    label: moduleTitles?.[module] ? `Module ${module} — ${moduleTitles[module]}` : `Module ${module}`,
    lessons: items,
  }));
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
  const moduleTitles = getCoreModuleTitles();

  const coreGroups = groupCore(lessons, moduleTitles);
  const springGroups = groupSpringboard(lessons);

  return (
    <main className="mx-auto max-w-4xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.14),transparent_55%)]" />

      <div className="mb-8">
        <Badge variant="secondary">Tampa Bay Soft Wash Academy</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Operator training</h1>
        <p className="mt-2 text-muted-foreground">
          SOP-driven training for premium exterior cleaning — Proof Packs, QA checklists, and systems.
        </p>

        <div className="mt-4 rounded-2xl border bg-background/30 p-4">
          <h2 className="text-base font-semibold">Why this Academy is free</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Exterior cleaning has a low barrier to entry — which is a gift and a double‑edged sword. Easy entry means heavy
            competition and a lot of gatekeeping. We built this Academy to set a baseline standard for soft washing and
            pressure washing: safer methods, repeatable workflows, proof you can stand behind, and closeouts that protect
            your reputation.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            We’re transparent: publishing this also builds trust and authority for Tampa Bay Soft Wash. Use the training either
            way.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/course/core/0/welcome-and-how-to-use">Start Here (Module 0)</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/course/springboard/week-1-gutters/gutters-overview">Start Springboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/course/printables">Printables</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <CourseDashboard lessons={lessons} moduleTitles={moduleTitles} />
        <CourseAccordion
          title="Core Modules (accordion reader)"
          groups={coreGroups}
          hrefTemplate="/course/core/{module}/{slug}"
        />
        <CourseAccordion
          title="Springboard (accordion reader)"
          groups={springGroups}
          hrefTemplate="/course/springboard/{week}/{slug}"
        />
      </div>
    </main>
  );
}
