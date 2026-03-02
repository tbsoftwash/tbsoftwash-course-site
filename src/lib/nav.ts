import { listLessons, type LessonMeta } from "@/lib/course";

export type LessonKey = {
  track: "core" | "springboard";
  module?: number;
  week?: string;
  slug: string;
};

export type Neighbor = {
  label: string;
  href: string;
};

function sortLessons(a: LessonMeta, b: LessonMeta) {
  if (a.track !== b.track) return a.track.localeCompare(b.track);

  if (a.track === "core") {
    if ((a.module ?? 999) !== (b.module ?? 999)) return (a.module ?? 999) - (b.module ?? 999);
    if ((a.lesson ?? 999) !== (b.lesson ?? 999)) return (a.lesson ?? 999) - (b.lesson ?? 999);
  } else {
    if ((a.week ?? "") !== (b.week ?? "")) return (a.week ?? "").localeCompare(b.week ?? "");
    if ((a.lesson ?? 999) !== (b.lesson ?? 999)) return (a.lesson ?? 999) - (b.lesson ?? 999);
  }

  return a.title.localeCompare(b.title);
}

export function getNeighbors(key: LessonKey): { prev?: Neighbor; next?: Neighbor } {
  const lessons = listLessons().sort(sortLessons);

  const idx = lessons.findIndex((l) => {
    if (l.track !== key.track) return false;
    if (l.slug !== key.slug) return false;
    if (key.track === "core") return String(l.module) === String(key.module);
    return l.week === key.week;
  });

  const mkHref = (l: LessonMeta) => {
    if (l.track === "core") return `/course/core/${l.module}/${l.slug}`;
    return `/course/springboard/${l.week}/${l.slug}`;
  };

  const prevL = idx > 0 ? lessons[idx - 1] : undefined;
  const nextL = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : undefined;

  return {
    prev: prevL ? { label: prevL.title, href: mkHref(prevL) } : undefined,
    next: nextL ? { label: nextL.title, href: mkHref(nextL) } : undefined,
  };
}
