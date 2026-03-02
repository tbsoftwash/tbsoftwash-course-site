"use client";

import * as React from "react";
import { getDiagramStyle } from "@/lib/diagramStyle";

function renderFigure(el: Element, style: string) {
  const name = el.getAttribute("data-figure");
  if (!name) return;
  const src = `/api/figure?name=${encodeURIComponent(name)}&style=${encodeURIComponent(style)}`;
  el.innerHTML = `
    <div class="overflow-hidden rounded-2xl border bg-card/40">
      <img src="${src}" alt="${name}" class="h-auto w-full" />
    </div>
  `;
}

export function FiguresHydrator() {
  React.useEffect(() => {
    const apply = () => {
      const style = getDiagramStyle();
      document.querySelectorAll("[data-figure]").forEach((el) => renderFigure(el, style));
    };

    apply();

    window.addEventListener("tbsa:diagramStyle", apply as any);
    window.addEventListener("storage", apply);
    return () => {
      window.removeEventListener("tbsa:diagramStyle", apply as any);
      window.removeEventListener("storage", apply);
    };
  }, []);

  return null;
}
