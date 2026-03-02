"use client";

import * as React from "react";
import Link from "next/link";

import type { LessonMeta } from "@/lib/course";
import { LessonInlinePreview } from "@/components/LessonInlinePreview";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CourseAccordionClient } from "@/components/CourseAccordionClient";

function safeId(s: string) {
  return s.replace(/[^a-zA-Z0-9_-]/g, "-");
}

export function CourseAccordionShell({
  groups,
  hrefTemplate,
}: {
  groups: Array<{ label: string; lessons: LessonMeta[] }>;
  hrefTemplate: string; // supports tokens: {module},{week},{slug}
}) {
  const groupIds = groups.map((g) => safeId(g.label));
  const [openGroups, setOpenGroups] = React.useState<string[]>([]);
  const [autoOpenSlug, setAutoOpenSlug] = React.useState<string | null>(null);

  React.useEffect(() => {
    const applyHash = () => {
      const m = window.location.hash.match(/open=([^&]+)/);
      if (m?.[1]) setAutoOpenSlug(decodeURIComponent(m[1]));
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <div>
      <CourseAccordionClient groupIds={groupIds} onOpenGroupsChange={setOpenGroups} />

      <Accordion type="multiple" className="w-full" value={openGroups} onValueChange={setOpenGroups}>
        {groups.map((g) => {
          const gid = safeId(g.label);
          return (
            <AccordionItem key={g.label} value={gid}>
              <AccordionTrigger className="text-base">{g.label}</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2">
                  {g.lessons.map((l) => {
                    const shouldOpen = autoOpenSlug === l.slug;
                    return (
                      <details
                        key={`${g.label}-${l.slug}-${l.lesson ?? ""}`}
                        className="rounded-xl border bg-background/40 p-4"
                        open={shouldOpen ? true : undefined}
                      >
                        <summary className="cursor-pointer list-none">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-semibold">{l.title}</div>
                              <div className="text-xs text-muted-foreground">{l.slug}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <a
                                className="text-xs text-muted-foreground hover:text-foreground"
                                href={`#open=${encodeURIComponent(l.slug)}`}
                                title="Open preview"
                              >
                                Preview
                              </a>
                              <Link
                                className="text-sm text-primary hover:underline"
                                href={hrefTemplate
                                  .replace("{module}", String(l.module ?? ""))
                                  .replace("{week}", String(l.week ?? ""))
                                  .replace("{slug}", l.slug)}
                              >
                                Open →
                              </Link>
                            </div>
                          </div>
                        </summary>

                        <LessonInlinePreview slug={l.slug} />
                      </details>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
