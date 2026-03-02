import Link from "next/link";
import { notFound } from "next/navigation";

import { getLesson } from "@/lib/course";
import { getNeighbors } from "@/lib/nav";
import { buildLessonSections } from "@/lib/lessonSections";

import { LessonHeader } from "@/components/LessonHeader";
import { LessonTabs } from "@/components/LessonTabs";
import { FiguresHydrator } from "@/components/FiguresHydrator";
import { MdEmbedsHydrator } from "@/components/MdEmbedsHydrator";
import { Button } from "@/components/ui/button";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ module: string; slug: string }>;
}) {
  const { module, slug } = await params;

  const lesson = getLesson("core", module, slug);
  if (!lesson) return notFound();

  const neighbors = getNeighbors({ track: "core", module: Number(module), slug });

  const sections = await buildLessonSections(lesson.content);

  // Replace FIGURE and MD-embed callouts inside each section.
  const patched = sections.map((s) => {
    let h = s.html;

    h = h.replace(
      /<p>FIGURE:\s*([^<]+)<\/p>/g,
      (_m, name) => `<div data-figure="${String(name).trim()}"></div>`
    );

    // Backticked md paths like: <p><code>04_sops/proof-pack/proof-pack-sop-v1.md</code></p>
    h = h.replace(
      /<p><code>([^<]+\.md)<\/code><\/p>/g,
      (_m, mdPath) => `<div data-md=\"${String(mdPath).trim()}\"></div>`
    );

    // Markdown links to .md files
    h = h.replace(
      /<a href=\"([^\"]+\.md)\">([^<]+)<\/a>/g,
      (_m, href, _label) => `<div data-md=\"${String(href).replace(/^\.\//, "").trim()}\"></div>`
    );

    return { ...s, html: h };
  });

  return (
    <main className="mx-auto max-w-4xl px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.18),transparent_55%)]" />

      <LessonHeader
        kicker={`Core • Module ${module}`}
        title={lesson.title}
        prev={neighbors.prev}
        next={neighbors.next}
        progress={{ track: "core", module: Number(module), slug }}
      />

      <LessonTabs sections={patched} />
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
