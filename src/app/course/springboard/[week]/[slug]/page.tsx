import { notFound } from "next/navigation";
import { getLesson } from "@/lib/course";
import { remark } from "remark";
import html from "remark-html";

export default async function SpringboardLessonPage({
  params,
}: {
  params: Promise<{ week: string; slug: string }>;
}) {
  const { week, slug } = await params;

  const lesson = getLesson("springboard", week, slug);
  if (!lesson) return notFound();

  const processed = await remark().use(html).process(lesson.content);
  const contentHtml = processed.toString();

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>{lesson.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}
