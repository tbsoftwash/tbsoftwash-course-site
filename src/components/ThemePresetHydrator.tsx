"use client";

import * as React from "react";
import { applyThemePreset, loadThemePreset } from "@/lib/themePreset";

export function ThemePresetHydrator() {
  React.useEffect(() => {
    const sync = () => applyThemePreset(loadThemePreset());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("tbsa:themePreset", sync as any);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("tbsa:themePreset", sync as any);
    };
  }, []);

  return null;
}
