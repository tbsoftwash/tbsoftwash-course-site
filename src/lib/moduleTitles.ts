import fs from "fs";
import path from "path";

function courseRoot() {
  return path.join(process.cwd(), "tbsoftwash-course");
}

export function getCoreModuleTitles(): Record<number, string> {
  // Reads tbsoftwash-course/03_curriculum/module-map.md
  const p = path.join(courseRoot(), "03_curriculum", "module-map.md");
  if (!fs.existsSync(p)) return {};
  const md = fs.readFileSync(p, "utf8");

  const titles: Record<number, string> = {};
  const re = /^##\s+Module\s+(\d+)\s+—\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) {
    const num = Number(m[1]);
    const title = String(m[2] || "").trim();
    if (!Number.isNaN(num) && title) titles[num] = title;
  }
  return titles;
}

export function coreModuleLabel(module: number, titles?: Record<number, string>) {
  const t = titles?.[module];
  return t ? `Module ${module} — ${t}` : `Module ${module}`;
}
