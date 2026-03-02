"use client";

import * as React from "react";
import { getPreviewMode } from "@/lib/coursePreview";

export function LessonInlinePreview({ slug }: { slug: string }) {
  const [html, setHtml] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      const mode = getPreviewMode();
      const res = await fetch(
        `/api/lesson-preview?slug=${encodeURIComponent(slug)}&mode=${encodeURIComponent(mode)}`
      );
      if (!res.ok) {
        setHtml(null);
        return;
      }
      const txt = await res.text();
      setHtml(txt);
    };

    const refresh = () => void load();
    refresh();

    window.addEventListener("tbsa:previewMode", refresh as any);
    return () => window.removeEventListener("tbsa:previewMode", refresh as any);
  }, [slug]);

  if (!html) {
    return <div className="mt-3 text-sm text-muted-foreground">(Preview unavailable)</div>;
  }

  return (
    <div
      className="markdown mt-4 rounded-xl border bg-card/40 p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
