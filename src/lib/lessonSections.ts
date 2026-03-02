import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

export type Section = {
  id: string;
  label: string;
  html: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stripFrontmatter(md: string) {
  return md.replace(/^---[\s\S]*?---\n/, "");
}

function splitByH2(md: string) {
  const lines = md.split("\n");
  const sections: Array<{ heading: string; body: string[] }> = [];

  let currentHeading = "Overview";
  let current: string[] = [];

  const flush = () => {
    const body = current.join("\n").trim();
    if (body) sections.push({ heading: currentHeading, body: current.slice() });
    current = [];
  };

  for (const ln of lines) {
    if (ln.startsWith("## ")) {
      flush();
      currentHeading = ln.slice(3).trim();
      continue;
    }
    current.push(ln);
  }
  flush();

  // If everything ended up in Overview but starts with an H1, keep it.
  return sections;
}

export async function buildLessonSections(mdRaw: string): Promise<Section[]> {
  const md = stripFrontmatter(mdRaw);

  const parts = splitByH2(md);

  const out: Section[] = [];
  for (const p of parts) {
    const processed = await remark().use(gfm).use(html).process(p.body.join("\n"));
    let sectionHtml = processed.toString();

    // FIGURE placeholders are handled by the lesson page after we get HTML.

    const label = p.heading;
    const id = label === "Overview" ? "overview" : slugify(label);

    out.push({ id, label, html: sectionHtml });
  }

  return out;
}
