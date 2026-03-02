"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { getPreviewMode, setPreviewMode, type PreviewMode } from "@/lib/coursePreview";

export function PreviewModeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const [mode, setMode] = React.useState<PreviewMode>("preview");

  React.useEffect(() => {
    setMounted(true);
    const refresh = () => setMode(getPreviewMode());
    refresh();
    window.addEventListener("tbsa:previewMode", refresh as any);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("tbsa:previewMode", refresh as any);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-1">
        <Button size="sm" variant="outline" disabled>
          Preview
        </Button>
        <Button size="sm" variant="outline" disabled>
          Full
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1">
      <Button
        size="sm"
        variant={mode === "preview" ? "default" : "outline"}
        onClick={() => {
          setPreviewMode("preview");
          setMode("preview");
        }}
      >
        Preview
      </Button>
      <Button
        size="sm"
        variant={mode === "full" ? "default" : "outline"}
        onClick={() => {
          setPreviewMode("full");
          setMode("full");
        }}
      >
        Full
      </Button>
    </div>
  );
}
