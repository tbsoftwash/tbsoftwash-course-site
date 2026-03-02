export type PreviewMode = "preview" | "full";

const KEY = "tbsa.previewMode.v1";

export function getPreviewMode(): PreviewMode {
  if (typeof window === "undefined") return "preview";
  const raw = window.localStorage.getItem(KEY);
  return raw === "full" ? "full" : "preview";
}

export function setPreviewMode(mode: PreviewMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, mode);
  window.dispatchEvent(new CustomEvent("tbsa:previewMode"));
}
