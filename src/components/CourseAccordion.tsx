import Link from "next/link";

import type { LessonMeta } from "@/lib/course";
import { LessonInlinePreview } from "@/components/LessonInlinePreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function CourseAccordion({
  title,
  groups,
  makeHref,
}: {
  title: string;
  groups: Array<{ label: string; lessons: LessonMeta[] }>;
  makeHref: (l: LessonMeta) => string;
}) {
  return (
    <Card className="bg-card/70 backdrop-blur-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {groups.map((g) => (
            <AccordionItem key={g.label} value={g.label}>
              <AccordionTrigger className="text-base">{g.label}</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2">
                  {g.lessons.map((l) => (
                    <details
                      key={`${g.label}-${l.slug}-${l.lesson ?? ""}`}
                      className="rounded-xl border bg-background/40 p-4"
                    >
                      <summary className="cursor-pointer list-none">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold">{l.title}</div>
                            <div className="text-xs text-muted-foreground">{l.slug}</div>
                          </div>
                          <Link
                            className="text-sm text-primary hover:underline"
                            href={makeHref(l)}
                          >
                            Open →
                          </Link>
                        </div>
                      </summary>

                      <LessonInlinePreview slug={l.slug} />
                    </details>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
