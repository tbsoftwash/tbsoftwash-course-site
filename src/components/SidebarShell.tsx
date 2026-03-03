"use client";

import * as React from "react";
import { SidebarNav } from "@/components/SidebarNav";
import type { LessonMeta } from "@/lib/course";

const KEY = "tbsa.sidebarCollapsed.v1";

function loadCollapsed() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

function saveCollapsed(v: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, v ? "1" : "0");
}

export function SidebarShell({ lessons }: { lessons: LessonMeta[] }) {
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    setCollapsed(loadCollapsed());

    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((c) => {
          const next = !c;
          saveCollapsed(next);
          return next;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const set = (v: boolean) => {
    setCollapsed(v);
    saveCollapsed(v);
  };

  return (
    <div
      className={
        collapsed
          ? "w-16 border-r bg-background/60 backdrop-blur-xl transition-[width] duration-200"
          : "w-80 border-r bg-background/60 backdrop-blur-xl transition-[width] duration-200"
      }
    >
      <SidebarNav lessons={lessons} collapsed={collapsed} setCollapsed={set} />
    </div>
  );
}
