"use client";

import * as React from "react";

import { ModeToggle } from "@/components/ModeToggle";
import { DiagramStyleToggle } from "@/components/DiagramStyleToggle";
import { PreviewModeToggle } from "@/components/PreviewModeToggle";
import { clearProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

function readLS(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = window.localStorage.getItem(key);
  return v ?? fallback;
}

function friendlyDiagramStyle(v: string) {
  if (v.startsWith("A")) return "A (Clean)";
  if (v.startsWith("B")) return "B (Glassy)";
  if (v.startsWith("C")) return "C (Hybrid)";
  return v;
}

export function UserCardMenu({ collapsed }: { collapsed?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [theme, setTheme] = React.useState("dark");
  const [diagramStyle, setDiagramStyle] = React.useState("B-dark-glassy");
  const [readerMode, setReaderMode] = React.useState("preview");
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const refresh = () => {
      // next-themes uses localStorage key "theme"
      setTheme(readLS("theme", "dark"));
      setDiagramStyle(readLS("tbsa.diagramStyle.v1", "B-dark-glassy"));
      setReaderMode(readLS("tbsa.previewMode.v1", "preview"));
    };

    refresh();

    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node)) return;
      setOpen(false);
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (collapsed) {
    return (
      <div ref={ref} className="relative">
        <button
          title={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border bg-background/30 text-sm text-foreground/80 hover:bg-accent/40",
            open ? "bg-accent/60" : ""
          )}
        >
          👤
        </button>

        {open ? (
          <div className="absolute bottom-12 left-0 z-50 w-64 rounded-xl border bg-background/95 p-3 shadow-xl backdrop-blur">
            <div className="mb-2 text-sm font-semibold">TBSoftWash</div>
            <div className="grid gap-3">
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Theme</div>
                <ModeToggle />
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Diagram style</div>
                <DiagramStyleToggle />
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Accordion reader</div>
                <PreviewModeToggle />
              </div>
              <button
                onClick={() => {
                  if (confirm("Reset course progress on this device?")) {
                    clearProgress();
                    window.dispatchEvent(new Event("tbsa:progress"));
                  }
                }}
                className="rounded-lg border bg-background/30 px-3 py-2 text-sm text-muted-foreground hover:bg-accent/40 hover:text-foreground"
              >
                Reset progress
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-xl border bg-background/30 px-3 py-3 text-left hover:bg-accent/40",
          open ? "bg-accent/50" : ""
        )}
      >
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">TBSoftWash Operator</div>
          <div className="truncate text-xs text-muted-foreground">
            Theme: {theme} • Style: {friendlyDiagramStyle(diagramStyle)} • Reader: {readerMode}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">{open ? "▲" : "▼"}</div>
      </button>

      {open ? (
        <div className="absolute bottom-14 left-0 z-50 w-full rounded-xl border bg-background/95 p-3 shadow-xl backdrop-blur">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Settings</div>
          <div className="mb-3 text-xs text-muted-foreground">
            Current: Theme <span className="text-foreground">{theme}</span> • Style{" "}
            <span className="text-foreground">{friendlyDiagramStyle(diagramStyle)}</span> • Reader{" "}
            <span className="text-foreground">{readerMode}</span>
          </div>
          <div className="grid gap-3">
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Theme</div>
              <ModeToggle />
            </div>
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Diagram style</div>
              <DiagramStyleToggle />
            </div>
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Accordion reader</div>
              <PreviewModeToggle />
            </div>
            <button
              onClick={() => {
                if (confirm("Reset course progress on this device?")) {
                  clearProgress();
                  window.dispatchEvent(new Event("tbsa:progress"));
                }
              }}
              className="rounded-lg border bg-background/30 px-3 py-2 text-sm text-muted-foreground hover:bg-accent/40 hover:text-foreground"
            >
              Reset progress
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
