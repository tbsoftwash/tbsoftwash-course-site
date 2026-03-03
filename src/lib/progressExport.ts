export type AcademyExport = {
  schema: "tbsa.export.v1";
  exportedAt: string;
  data: Record<string, any>;
};

// Keys we care about. Keep explicit for stability.
export const EXPORT_KEYS = [
  "tbsa.completedLessons.v1",
  "tbsa.lastLesson.v1",
  "tbsa.activityDays.v1",
  "tbsa.diagramStyle.v1",
  "tbsa.previewMode.v1",
  "tbsa.themePreset.v1",
  // next-themes
  "theme",
] as const;

export function buildExportPayload(): AcademyExport {
  const data: Record<string, any> = {};
  if (typeof window !== "undefined") {
    for (const k of EXPORT_KEYS) {
      const v = window.localStorage.getItem(k);
      if (v !== null) data[k] = v;
    }
  }

  return {
    schema: "tbsa.export.v1",
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function applyImportPayload(payload: AcademyExport) {
  if (typeof window === "undefined") return;
  if (!payload || payload.schema !== "tbsa.export.v1" || !payload.data) {
    throw new Error("Invalid export file");
  }

  for (const k of Object.keys(payload.data)) {
    // Only allow known keys (avoid letting random JSON write arbitrary localStorage)
    if (!(EXPORT_KEYS as readonly string[]).includes(k)) continue;
    const v = payload.data[k];
    if (typeof v !== "string") continue;
    window.localStorage.setItem(k, v);
  }

  // refresh UI
  window.dispatchEvent(new Event("tbsa:progress"));
  window.dispatchEvent(new Event("tbsa:themePreset"));
  window.dispatchEvent(new Event("storage"));
}

export function downloadExport() {
  const payload = buildExportPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "tbsoftwash-academy-progress.json";
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}
