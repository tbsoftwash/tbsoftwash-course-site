"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type LessonSection = {
  id: string;
  label: string;
  html: string;
};

export function LessonTabs({
  sections,
  defaultId,
}: {
  sections: LessonSection[];
  defaultId?: string;
}) {
  const safeDefault =
    defaultId && sections.some((s) => s.id === defaultId)
      ? defaultId
      : sections[0]?.id;

  if (!sections.length) {
    return (
      <div className="text-sm text-muted-foreground">(No content)</div>
    );
  }

  return (
    <div>
      <div className="flex justify-center">
        <Tabs defaultValue={safeDefault}>
          <TabsList>
            {sections.map((s) => (
              <TabsTrigger key={s.id} value={s.id}>
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((s) => (
            <TabsContent key={s.id} value={s.id}>
              <div
                className="markdown"
                dangerouslySetInnerHTML={{ __html: s.html }}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
