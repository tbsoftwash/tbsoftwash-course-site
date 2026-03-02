export type DiagramStyle = "A-clean" | "B-dark-glassy" | "C-hybrid";

const KEY = "tbsa.diagramStyle.v1";

export function getDiagramStyle(): DiagramStyle {
  if (typeof window === "undefined") return "B-dark-glassy";
  const raw = window.localStorage.getItem(KEY);
  if (raw === "A-clean" || raw === "B-dark-glassy" || raw === "C-hybrid") return raw;
  return "B-dark-glassy";
}

export function setDiagramStyle(style: DiagramStyle) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, style);
  window.dispatchEvent(new CustomEvent("tbsa:diagramStyle"));
}
