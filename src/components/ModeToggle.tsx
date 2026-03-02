"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // cycle: dark -> light -> system
  const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";

  // Avoid hydration mismatch: theme is client-resolved.
  if (!mounted) {
    return (
      <Button variant="outline" size="sm" disabled title="Toggle theme">
        Theme
      </Button>
    );
  }

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
