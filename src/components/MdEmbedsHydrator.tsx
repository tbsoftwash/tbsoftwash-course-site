"use client";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { MdEmbed } from "@/components/MdEmbed";

export function MdEmbedsHydrator() {
  React.useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("[data-md]") as any as HTMLElement[]);
    for (const el of nodes) {
      const p = el.getAttribute("data-md");
      if (!p) continue;
      // mount once
      if ((el as any).__mdMounted) continue;
      (el as any).__mdMounted = true;
      const root = createRoot(el);
      root.render(<MdEmbed path={p} />);
    }
  }, []);

  return null;
}
