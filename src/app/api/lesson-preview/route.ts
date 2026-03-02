import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

async function mdToHtml(md: string) {
  const processed = await remark().use(gfm).use(html).process(md);
  return processed.toString();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const mode = searchParams.get("mode") || "preview";

  if (!slug) return new Response("Missing slug", { status: 400 });

  const base = path.join(process.cwd(), "tbsoftwash-course", "03_curriculum");

  // brute force search for matching frontmatter slug
  const stack: string[] = [base];
  while (stack.length) {
    const dir = stack.pop()!;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && entry.name.endsWith(".md")) {
        const raw = fs.readFileSync(full, "utf8");
        if (raw.includes(`slug: \"${slug}\"`) || raw.includes(`slug: "${slug}"`)) {
          const md = raw.replace(/^---[\s\S]*?---\n/, "");
          const content =
            mode === "full" ? md : md.split("\n").slice(0, 120).join("\n");
          const out = await mdToHtml(content);
          return new Response(out, {
            status: 200,
            headers: {
              "Content-Type": "text/html; charset=utf-8",
              "Cache-Control": "public, max-age=60",
            },
          });
        }
      }
    }
  }

  return new Response("Not found", { status: 404 });
}
