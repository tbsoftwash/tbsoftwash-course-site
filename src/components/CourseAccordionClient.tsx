"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import type { LessonMeta } from "@/lib/course";

export function CourseAccordionClient({
  groupIds,
  onOpenGroupsChange,
}: {
  groupIds: string[];
  onOpenGroupsChange: (openGroups: string[]) => void;
}) {
  const [openGroups, setOpenGroups] = React.useState<string[]>([]);
  const [autoOpenSlug, setAutoOpenSlug] = React.useState<string | null>(null);

  // If someone searches in the sidebar and clicks a lesson, we can set a hash like #open=<slug>
  React.useEffect(() => {
    const applyHash = () => {
      const m = window.location.hash.match(/open=([^&]+)/);
      if (m?.[1]) setAutoOpenSlug(decodeURIComponent(m[1]));
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  // expose to parent via callback
  React.useEffect(() => {
    onOpenGroupsChange(openGroups);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openGroups.join("|")]);

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setOpenGroups(groupIds)}
        >
          Expand all
        </Button>
        <Button size="sm" variant="outline" onClick={() => setOpenGroups([])}>
          Collapse all
        </Button>
      </div>

      {/* auto-open hint: set hash #open=<slug> */}
      {autoOpenSlug ? (
        <div className="text-xs text-muted-foreground">
          Auto-opening preview for: <code>{autoOpenSlug}</code>
        </div>
      ) : null}
    </div>
  );
}
