"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { getDiagramStyle, setDiagramStyle, type DiagramStyle } from "@/lib/diagramStyle";

const OPTIONS: Array<{ id: DiagramStyle; label: string }> = [
  { id: "A-clean", label: "Clean" },
  { id: "B-dark-glassy", label: "Glassy" },
  { id: "C-hybrid", label: "Hybrid" },
];

export function DiagramStyleToggle() {
  const [mounted, setMounted] = React.useState(false);
  const [style, setStyle] = React.useState<DiagramStyle>("B-dark-glassy");

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
      <div className="grid grid-cols-3 gap-1">
        <Button size="sm" variant="outline" disabled>
          Clean
        </Button>
        <Button size="sm" variant="outline" disabled>
          Glassy
        </Button>
        <Button size="sm" variant="outline" disabled>
          Hybrid
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {OPTIONS.map((o) => (
        <Button
          key={o.id}
          size="sm"
          variant={style === o.id ? "default" : "outline"}
          onClick={() => {
            setDiagramStyle(o.id);
            setStyle(o.id);
          }}
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
}
