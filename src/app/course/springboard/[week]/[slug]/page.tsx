import Link from "next/link";
import { notFound } from "next/navigation";

import { getLesson } from "@/lib/course";
import { getNeighbors } from "@/lib/nav";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

import { LessonHeader } from "@/components/LessonHeader";
import { FiguresHydrator } from "@/components/FiguresHydrator";
import { MdEmbedsHydrator } from "@/components/MdEmbedsHydrator";
import { Button } from "@/components/ui/button";

export default async function SpringboardLessonPage({
  params,
}: {
  params: Promise<{ week: string; slug: string }>;
}) {
  const { week, slug } = await params;

  const lesson = getLesson("springboard", week, slug);
  if (!lesson) return notFound();

  const neighbors = getNeighbors({ track: "springboard", week, slug });

  const processed = await remark().use(gfm).use(html).process(lesson.content);
  let contentHtml = processed.toString();

  contentHtml = contentHtml.replace(
    /<p>FIGURE:\s*([^<]+)<\/p>/g,
    (_m, name) => `<div data-figure="${String(name).trim()}"></div>`
  );

  // Replace .md references with an inline viewer.
  contentHtml = contentHtml.replace(
    /<p><code>([^<]+\.md)<\/code><\/p>/g,
    (_m, mdPath) => `<div data-md=\"${String(mdPath).trim()}\"></div>`
  );
  contentHtml = contentHtml.replace(
    /<li><code>([^<]+\.md)<\/code><\/li>/g,
    (_m, mdPath) => `<li><div data-md=\"${String(mdPath).trim()}\"></div></li>`
  );
  contentHtml = contentHtml.replace(
    /<a href=\"([^\"]+\.md)\">([^<]+)<\/a>/g,
    (_m, href, _label) => `<div data-md=\"${String(href).replace(/^\.\//, "").trim()}\"></div>`
  );
  contentHtml = contentHtml.replace(
    /(04_sops\/[^\s<]+\.md|02_chemicals\/[^\s<]+\.md|03_curriculum\/printables\/[^\s<]+\.md|06_ops\/[^\s<]+\.md|05_sales_marketing\/[^\s<]+\.md)/g,
    (m) => `<span data-md=\"${m}\"></span>`
  );

  return (
    <main className="mx-auto max-w-4xl px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.18),transparent_55%)]" />

      <LessonHeader
        kicker={`Springboard • ${week}`}
        title={lesson.title}
        prev={neighbors.prev}
        next={neighbors.next}
        progress={{ track: "springboard", week, slug }}
      />

      <div className="markdown" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <FiguresHydrator />
      <MdEmbedsHydrator />

      <div className="mt-10 flex flex-wrap gap-2">
        {neighbors.prev ? (
          <Button asChild variant="outline">
            <Link href={neighbors.prev.href}>← {neighbors.prev.label}</Link>
          </Button>
        ) : null}
        {neighbors.next ? (
          <Button asChild>
            <Link href={neighbors.next.href}>{neighbors.next.label} →</Link>
          </Button>
        ) : null}
      </div>
    </main>
  );
}
