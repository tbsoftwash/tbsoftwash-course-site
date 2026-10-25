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

const SPRINGBOARD_LABELS: Record<string, string> = {
  "week-0-first-7-days": "Week 0 — Your First 7 Days",
  "week-1-gutters": "Week 1 — Gutters (Fast-Start)",
  "week-2-traditional-windows": "Week 2 — Traditional Windows",
  "week-3-wfp-rodi": "Week 3 — Pure Water (WFP / RO-DI)",
};

export function springboardWeekLabel(week: string): string {
  if (SPRINGBOARD_LABELS[week]) return SPRINGBOARD_LABELS[week];
  const m = week.match(/^week-(\d+)-(.+)$/i);
  if (m) {
    const num = parseInt(m[1], 10);
    const title = m[2].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return `Week ${num} — ${title}`;
  }
  return week;
}
