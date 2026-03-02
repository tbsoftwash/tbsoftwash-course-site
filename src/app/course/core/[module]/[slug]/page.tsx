import Link from "next/link";
import { notFound } from "next/navigation";
import { getLesson } from "@/lib/course";
import { getNeighbors } from "@/lib/nav";
import { LessonHeader } from "@/components/LessonHeader";
import { FiguresHydrator } from "@/components/FiguresHydrator";
import { Button } from "@/components/ui/button";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ module: string; slug: string }>;
}) {
  const { module, slug } = await params;

  const lesson = getLesson("core", module, slug);
  if (!lesson) return notFound();

  const neighbors = getNeighbors({ track: "core", module: Number(module), slug });

  const processed = await remark().use(gfm).use(html).process(lesson.content);
  let contentHtml = processed.toString();
  // Replace FIGURE callouts with placeholders hydrated on the client.
  // Expected markdown line: `FIGURE: mock-fig-103-psi-vs-gpm`
  contentHtml = contentHtml.replace(
    /<p>FIGURE:\s*([^<]+)<\/p>/g,
    (_m, name) => `<div data-figure="${String(name).trim()}"></div>`
  );

  return (
    <main className="mx-auto max-w-4xl px-6">
      {/** glass header */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.18),transparent_55%)]" />

      <LessonHeader
        kicker={`Core • Module ${module}`}
        title={lesson.title}
        prev={neighbors.prev}
        next={neighbors.next}
        progress={{ track: "core", module: Number(module), slug }}
      />

      <div className="markdown" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <FiguresHydrator />

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
