export type ThemePreset = "default" | "midnight" | "maclight";

const KEY = "tbsa.themePreset.v1";

export function loadThemePreset(): ThemePreset {
  if (typeof window === "undefined") return "default";
  const v = window.localStorage.getItem(KEY) as ThemePreset | null;
  if (v === "midnight" || v === "maclight" || v === "default") return v;
  return "default";
}

export function saveThemePreset(preset: ThemePreset) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, preset);
  // Let other components refresh their preview
  window.dispatchEvent(new Event("tbsa:themePreset"));
}

export function applyThemePreset(preset: ThemePreset) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  if (preset === "default") {
    delete (el as any).dataset.preset;
  } else {
    (el as any).dataset.preset = preset;
  }
}
