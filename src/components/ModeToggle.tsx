"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // cycle: dark -> light -> system
  const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(next)}
      title="Toggle theme"
    >
      Theme: {theme ?? "system"}
    </Button>
  );
}
