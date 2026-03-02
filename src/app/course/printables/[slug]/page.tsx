import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

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
  const filePath = path.join(
    process.cwd(),
    "tbsoftwash-course",
    "03_curriculum",
    "printables",
    filename
  );

  if (!fs.existsSync(filePath)) return notFound();

  const md = fs.readFileSync(filePath, "utf8");
  const processed = await remark().use(gfm).use(html).process(md);
  const contentHtml = processed.toString();

  return (
    <main className="mx-auto max-w-4xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.14),transparent_55%)]" />
      <div className="markdown" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}
