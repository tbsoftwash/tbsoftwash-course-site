import type { LessonMeta } from "@/lib/course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseAccordionShell } from "@/components/CourseAccordionShell";

export function CourseAccordion({
  title,
  groups,
  hrefTemplate,
}: {
  title: string;
  groups: Array<{ label: string; lessons: LessonMeta[] }>;
  hrefTemplate: string; // {module},{week},{slug}
}) {
  return (
    <Card className="bg-card/70 backdrop-blur-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CourseAccordionShell groups={groups} hrefTemplate={hrefTemplate} />
      </CardContent>
    </Card>
  );
}
