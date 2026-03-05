import fs from "fs";
import path from "path";

export type PrintableMeta = {
  slug: string;
  filePath: string;
};

// On Vercel, process.cwd() during prerender can differ; prefer VERCEL_PROJECT_DIR when available.
const PROJECT_ROOT = process.env.VERCEL_PROJECT_DIR || process.cwd();
const PRINTABLES_ROOT = path.join(PROJECT_ROOT, "tbsoftwash-course", "03_curriculum", "printables");

export function listPrintables(): PrintableMeta[] {
  if (!fs.existsSync(PRINTABLES_ROOT)) return [];
  const files = fs
    .readdirSync(PRINTABLES_ROOT)
    .filter((f) => f.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b));

  return files.map((f) => ({
    slug: f.replace(/\.md$/i, ""),
    filePath: path.join(PRINTABLES_ROOT, f),
  }));
}
