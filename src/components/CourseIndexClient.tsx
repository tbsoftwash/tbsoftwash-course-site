"use client";

import * as React from "react";

import type { LessonMeta } from "@/lib/course";
import { loadCourseView } from "@/lib/courseView";
import { CourseDashboard } from "@/components/CourseDashboard";
import { CourseAccordion } from "@/components/CourseAccordion";

export function CourseIndexClient({
  lessons,
  coreGroups,
  springGroups,
  moduleTitles,
}: {
  lessons: LessonMeta[];
  coreGroups: { label: string; lessons: LessonMeta[] }[];
  springGroups: { label: string; lessons: LessonMeta[] }[];
  moduleTitles: Record<number, string>;
}) {
  const [view, setView] = React.useState<"dashboard" | "reader">("dashboard");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const refresh = () => setView(loadCourseView());
    refresh();
    window.addEventListener("tbsa:courseView", refresh as any);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("tbsa:courseView", refresh as any);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!mounted) {
    // SSR-safe default: dashboard
    return (
      <div className="grid gap-6">
        <CourseDashboard lessons={lessons} moduleTitles={moduleTitles} />
      </div>
    );
  }

  if (view === "reader") {
    return (
      <div className="grid gap-6">
        <CourseAccordion
          title="Core Modules (accordion reader)"
          groups={coreGroups}
          hrefTemplate="/course/core/{module}/{slug}"
        />
        <CourseAccordion
          title="Springboard Lessons (accordion reader)"
          groups={springGroups}
          hrefTemplate="/course/springboard/{week}/{slug}"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <CourseDashboard lessons={lessons} moduleTitles={moduleTitles} />
    </div>
  );
}
