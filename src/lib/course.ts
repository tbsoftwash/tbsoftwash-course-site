import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type LessonMeta = {
  title: string;
  track: "core" | "springboard";
  slug: string;
  module?: number;
  lesson?: number;
  week?: string; // springboard only, e.g. "week-1-gutters"
};

export type Lesson = LessonMeta & {
  filePath: string;
  content: string;
};

// Course content is vendored as a git submodule at ./tbsoftwash-course
const COURSE_ROOT = path.join(process.cwd(), "tbsoftwash-course", "03_curriculum");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

export function listLessons(): LessonMeta[] {
  const mdFiles = walk(COURSE_ROOT)
    .filter((p) => /lesson-\d+-.*\.md$/.test(p));

  const metas: LessonMeta[] = [];
  for (const filePath of mdFiles) {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = matter(raw);
    const data = parsed.data as any;
    if (!data?.title || !data?.track || !data?.slug) continue;

    let week: string | undefined = undefined;
    if (String(data.track) === "springboard") {
      // Extract week folder from path: .../springboard/<week>/lesson-xx-...
      const parts = filePath.split(path.sep);
      const idx = parts.lastIndexOf("springboard");
      if (idx >= 0 && parts[idx + 1]) week = parts[idx + 1];
    }

    metas.push({
      title: String(data.title),
      track: data.track,
      slug: String(data.slug),
      module: data.module ? Number(data.module) : undefined,
      lesson: data.lesson ? Number(data.lesson) : undefined,
      week,
    });
  }

  // stable sort
  metas.sort((a, b) => {
    if (a.track !== b.track) return a.track.localeCompare(b.track);
    if ((a.module ?? 999) !== (b.module ?? 999)) return (a.module ?? 999) - (b.module ?? 999);
    if ((a.lesson ?? 999) !== (b.lesson ?? 999)) return (a.lesson ?? 999) - (b.lesson ?? 999);
    return a.title.localeCompare(b.title);
  });

  return metas;
}

export function getLesson(track: string, moduleOrWeek: string, slug: string): Lesson | null {
  // We don’t trust filenames; we search for matching frontmatter.
  const mdFiles = walk(COURSE_ROOT).filter((p) => /lesson-\d+-.*\.md$/.test(p));
  for (const filePath of mdFiles) {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = matter(raw);
    const data = parsed.data as any;

    if (String(data.track) !== track) continue;
    if (String(data.slug) !== slug) continue;

    if (track === "core") {
      const m = Number(data.module);
      if (String(m) !== moduleOrWeek) continue;
    } else {
      // springboard: moduleOrWeek is week folder (e.g. week-1-gutters)
      // We match via file path containing that week folder.
      if (!filePath.includes(path.join("springboard", moduleOrWeek))) continue;
    }

    return {
      title: String(data.title),
      track: data.track,
      slug: String(data.slug),
      module: data.module ? Number(data.module) : undefined,
      lesson: data.lesson ? Number(data.lesson) : undefined,
      filePath,
      content: parsed.content,
    };
  }
  return null;
}
