import Link from "next/link";
import { notFound } from "next/navigation";

import { getLesson } from "@/lib/course";
import { getNeighbors } from "@/lib/nav";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

import { LessonHeader } from "@/components/LessonHeader";
import { FiguresHydrator } from "@/components/FiguresHydrator";
import { PhotosHydrator } from "@/components/PhotosHydrator";
import { VideosHydrator } from "@/components/VideosHydrator";
import { MdEmbedsHydrator } from "@/components/MdEmbedsHydrator";
import { GlossaryHydrator } from "@/components/GlossaryHydrator";
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

  contentHtml = contentHtml.replace(
    /<p>PHOTO:\s*([^<|]+?)(?:\s*\|\s*([^<]+))?<\/p>/g,
    (_m, file, cap) => {
      const f = String(file).trim();
      const c = String(cap ?? "").trim();
      return `<div data-photo="${f}" data-caption="${c.replace(/\"/g, "&quot;")}"></div>`;
    }
  );

  contentHtml = contentHtml.replace(
    /<(p|li)>VIDEO:\s*(?:(?:<a href=\"([^\"]+)\"[^>]*>[^<]*<\/a>)|([^<|]+?))(?:\s*\|\s*([^<]+))?<\/\1>/g,
    (_m, _tag, href, raw, cap) => {
      const u = String(href || raw || "").trim();
      const c = String(cap ?? "").trim();
      return `<div data-video=\"${u.replace(/\"/g, "&quot;")}\" data-caption=\"${c.replace(/\"/g, "&quot;")}\"></div>`;
    }
  );

  contentHtml = contentHtml.replace(
    /<p><a href=\"(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=[^\"&]+|youtu\.be\/[^\"?&]+|youtube\.com\/shorts\/[^\"?&]+)[^\"]*)\"[^>]*>[^<]*<\/a><\/p>/g,
    (_m, href) => `<div data-video=\"${String(href).trim()}\" data-caption=\"\"></div>`
  );

  // Replace .md references with an inline viewer.
  // Standalone backticked paths
  contentHtml = contentHtml.replace(
    /<p><code>([^<]+\.md)<\/code><\/p>/g,
    (_m, mdPath) => `<div data-md=\"${String(mdPath).trim()}\"></div>`
  );
  contentHtml = contentHtml.replace(
    /<li><code>([^<]+\.md)<\/code><\/li>/g,
    (_m, mdPath) => `<li><div data-md=\"${String(mdPath).trim()}\"></div></li>`
  );
  // Inline code paths
  contentHtml = contentHtml.replace(
    /<code>((?:04_sops|02_chemicals|03_curriculum\/printables|06_ops|05_sales_marketing|01_business_profile)\/[^<\s]+\.md)<\/code>/g,
    (_m, mdPath) => {
      const p = String(mdPath).trim();
      return `<span data-md=\"${p}\">${p}</span>`;
    }
  );
  // Links
  contentHtml = contentHtml.replace(
    /<a href=\"([^\"]+\.md)\">([^<]+)<\/a>/g,
    (_m, href, _label) => `<div data-md=\"${String(href).replace(/^\.\//, "").trim()}\"></div>`
  );
  // Plain-text occurrences (ONLY in text nodes, not inside attributes)
  const mdPathRegex =
    /(04_sops\/[^\s<]+\.md|02_chemicals\/[^\s<]+\.md|03_curriculum\/printables\/[^\s<]+\.md|06_ops\/[^\s<]+\.md|05_sales_marketing\/[^\s<]+\.md|01_business_profile\/[^\s<]+\.md)/g;

  contentHtml = contentHtml.replace(/>([^<]+)</g, (full, text) => {
    const replaced = String(text).replace(mdPathRegex, (m) => `<span data-md="${m}">${m}</span>`);
    return `>${replaced}<`;
  });

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
      <PhotosHydrator />
      <VideosHydrator />
      <MdEmbedsHydrator />
      <GlossaryHydrator />

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
