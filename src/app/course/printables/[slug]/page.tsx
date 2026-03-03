import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

import { FiguresHydrator } from "@/components/FiguresHydrator";
import { PhotosHydrator } from "@/components/PhotosHydrator";
import { VideosHydrator } from "@/components/VideosHydrator";
import { MdEmbedsHydrator } from "@/components/MdEmbedsHydrator";
import { GlossaryHydrator } from "@/components/GlossaryHydrator";
import { PrintableActions } from "@/components/PrintableActions";

function slugToFilename(slug: string) {
  if (slug === "operator-checklist-pack") return "operator-checklist-pack-v1.md";
  return `${slug}.md`;
}

export default async function PrintablePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const filename = slugToFilename(slug);
  const relPath = path.posix.join("03_curriculum", "printables", filename);
  const filePath = path.join(process.cwd(), "tbsoftwash-course", relPath);

  if (!fs.existsSync(filePath)) return notFound();

  const md = fs.readFileSync(filePath, "utf8");
  const processed = await remark().use(gfm).use(html).process(md);
  let contentHtml = processed.toString();

  // Enable FIGURE / PHOTO / VIDEO + inline .md viewers in printables too.
  contentHtml = contentHtml.replace(
    /<p>FIGURE:\s*([^<]+)<\/p>/g,
    (_m, name) => `<div data-figure="${String(name).trim()}"></div>`
  );
  contentHtml = contentHtml.replace(
    /<p>PHOTO:\s*([^<|]+?)(?:\s*\|\s*([^<]+))?<\/p>/g,
    (_m, file, cap) => {
      const f = String(file).trim();
      const c = String(cap ?? "").trim();
      return `<div data-photo="${f}" data-caption="${c.replace(/\"/g, "&quot;")}"></div>`;
    }
  );
  contentHtml = contentHtml.replace(
    /<p>VIDEO:\s*([^<|]+?)(?:\s*\|\s*([^<]+))?<\/p>/g,
    (_m, url, cap) => {
      const u = String(url).trim();
      const c = String(cap ?? "").trim();
      return `<div data-video="${u}" data-caption="${c.replace(/\"/g, "&quot;")}"></div>`;
    }
  );

  // Backticked md paths (inline or standalone)
  contentHtml = contentHtml.replace(
    /<p><code>([^<]+\.md)<\/code><\/p>/g,
    (_m, mdPath) => `<div data-md=\"${String(mdPath).trim()}\"></div>`
  );
  contentHtml = contentHtml.replace(
    /<li><code>([^<]+\.md)<\/code><\/li>/g,
    (_m, mdPath) => `<li><div data-md=\"${String(mdPath).trim()}\"></div></li>`
  );
  contentHtml = contentHtml.replace(
    /<code>((?:04_sops|02_chemicals|03_curriculum|06_ops|05_sales_marketing|01_business_profile)\/[^<\s]+\.md)<\/code>/g,
    (_m, mdPath) => `<span data-md=\"${String(mdPath).trim()}\"></span>`
  );
  contentHtml = contentHtml.replace(
    /<a href=\"([^\"]+\.md)\">([^<]+)<\/a>/g,
    (_m, href, _label) => `<div data-md=\"${String(href).replace(/^\.\//, "").trim()}\"></div>`
  );

  const mdPathRegex =
    /(04_sops\/[^\s<]+\.md|02_chemicals\/[^\s<]+\.md|03_curriculum\/[^\s<]+\.md|06_ops\/[^\s<]+\.md|05_sales_marketing\/[^\s<]+\.md|01_business_profile\/[^\s<]+\.md)/g;
  contentHtml = contentHtml.replace(/>([^<]+)</g, (full, text) => {
    const replaced = String(text).replace(mdPathRegex, (m) => `<span data-md=\"${m}\"></span>`);
    return `>${replaced}<`;
  });

  return (
    <main className="mx-auto max-w-4xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.14),transparent_55%)]" />
      <PrintableActions downloadUrl={`/api/md?path=${encodeURIComponent(relPath)}&download=1`} />
      <div className="markdown" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <FiguresHydrator />
      <PhotosHydrator />
      <VideosHydrator />
      <MdEmbedsHydrator />
      <GlossaryHydrator />
    </main>
  );
}
