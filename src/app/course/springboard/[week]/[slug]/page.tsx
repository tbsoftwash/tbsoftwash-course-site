import Link from "next/link";
import { notFound } from "next/navigation";
import { getLesson } from "@/lib/course";
import { getNeighbors } from "@/lib/nav";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

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
  const contentHtml = processed.toString();

  return (
    <main style={{ maxWidth: 900 }}>
      <h1>{lesson.title}</h1>
      <div style={{ display: "flex", gap: 12, margin: "12px 0 20px" }}>
        {neighbors.prev ? <Link href={neighbors.prev.href}>← Prev</Link> : <span />}
        {neighbors.next ? <Link href={neighbors.next.href}>Next →</Link> : <span />}
      </div>
      <div className="markdown" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        {neighbors.prev ? <Link href={neighbors.prev.href}>← {neighbors.prev.label}</Link> : <span />}
        {neighbors.next ? <Link href={neighbors.next.href}>{neighbors.next.label} →</Link> : <span />}
      </div>
    </main>
  );
}
