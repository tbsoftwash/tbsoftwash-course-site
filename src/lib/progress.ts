export type ProgressKey = string;

export function lessonKey(opts: {
  track: "core" | "springboard";
  module?: number;
  week?: string;
  slug: string;
}) {
  if (opts.track === "core") return `core:${opts.module}:${opts.slug}`;
  return `springboard:${opts.week}:${opts.slug}`;
}

const STORAGE_KEY = "tbsa.completedLessons.v1";
const STORAGE_LAST = "tbsa.lastLesson.v1";

export function loadCompleted(): Set<ProgressKey> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.map(String));
  } catch {
    return new Set();
  }
}

export function saveCompleted(keys: Set<ProgressKey>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(keys)));
  } catch {
    // ignore
  }
}

export function setLastLesson(key: ProgressKey) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_LAST, key);
  } catch {
    // ignore
  }
}

export function getLastLesson(): ProgressKey | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_LAST);
  } catch {
    return null;
  }
}
