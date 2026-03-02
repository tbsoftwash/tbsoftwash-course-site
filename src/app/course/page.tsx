import Link from "next/link";
import { listLessons } from "@/lib/course";

export default function CourseIndex() {
  const lessons = listLessons();

  const core = lessons.filter((l) => l.track === "core");
  const springboard = lessons.filter((l) => l.track === "springboard");

  const springboardWeeks = Array.from(
    new Set(springboard.map((l) => l.week).filter(Boolean))
  ) as string[];
  springboardWeeks.sort();

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>TBSoftWash Operator Course</h1>
      <p>Auto-generated index from the course repo.</p>

      <h2>Core Modules</h2>
      <ul>
        {core.map((l) => (
          <li key={`c-${l.module}-${l.lesson}-${l.slug}`}>
            <Link href={`/course/core/${l.module}/${l.slug}`}>{l.title}</Link>
          </li>
        ))}
      </ul>

      <h2>Springboard Track</h2>
      <p>
        Week routing is based on the folder name (e.g. <code>week-1-gutters</code>).
      </p>

      {springboardWeeks.map((week) => (
        <section key={week} style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 8 }}>{week}</h3>
          <ul>
            {springboard
              .filter((l) => l.week === week)
              .map((l) => (
                <li key={`s-${week}-${l.lesson}-${l.slug}`}>
                  <Link href={`/course/springboard/${week}/${l.slug}`}>{l.title}</Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
