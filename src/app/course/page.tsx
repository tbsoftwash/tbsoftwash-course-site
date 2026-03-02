import Link from "next/link";
import { listLessons } from "@/lib/course";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseDashboard } from "@/components/CourseDashboard";

export default function CourseIndex() {
  const lessons = listLessons();

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
            <Link href="/course/printables/operator-checklist-pack">Printables</Link>
          </Button>
        </div>
      </div>

      <CourseDashboard lessons={lessons} />
    </main>
  );
}
