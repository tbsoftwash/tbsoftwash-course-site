"use client";

import * as React from "react";
import { getDiagramStyle } from "@/lib/diagramStyle";

export function FigureClient({ baseName }: { baseName: string }) {
  const [mounted, setMounted] = React.useState(false);
  const [style, setStyle] = React.useState(getDiagramStyle());

  React.useEffect(() => {
    setMounted(true);
    const refresh = () => setStyle(getDiagramStyle());
    refresh();
    window.addEventListener("tbsa:diagramStyle", refresh as any);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("tbsa:diagramStyle", refresh as any);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-xl border bg-card/50 p-4 text-sm text-muted-foreground">
        Loading figure…
      </div>
    );
  }

  const href = `/api/figure?name=${encodeURIComponent(baseName)}&style=${encodeURIComponent(style)}`;

  return (
    <div className="overflow-hidden rounded-2xl glass-panel">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={href} src={href} alt={baseName} className="h-auto w-full" />
    </div>
  );
}
