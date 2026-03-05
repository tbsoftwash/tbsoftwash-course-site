export type CourseViewMode = "dashboard" | "reader";

const KEY = "tbsa.courseView.v1";

export function loadCourseView(): CourseViewMode {
  if (typeof window === "undefined") return "dashboard";
  const v = window.localStorage.getItem(KEY);
  return v === "reader" ? "reader" : "dashboard";
}

export function saveCourseView(mode: CourseViewMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, mode);
}
