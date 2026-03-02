import Link from "next/link";
import { listLessons } from "@/lib/course";

export default function CourseIndex() {
  const lessons = listLessons();

  const core = lessons.filter((l) => l.track === "core");
  const springboard = lessons.filter((l) => l.track === "springboard");

  const coreModules = Array.from(new Set(core.map((l) => l.module).filter(Boolean))) as number[];
  coreModules.sort((a, b) => a - b);

  const springboardWeeks = Array.from(
    new Set(springboard.map((l) => l.week).filter(Boolean))
  ) as string[];
  springboardWeeks.sort();

  return (
    <main style={{ maxWidth: 900 }}>
      <h1>Course Index</h1>
      <p>
        This index is generated from the lesson frontmatter. Use the sidebar for fast navigation.
      </p>

      <h2>Core Modules</h2>
      {coreModules.map((m) => (
        <section key={m} style={{ marginBottom: 16 }}>
          <h3>Module {m}</h3>
          <ul>
            {core
              .filter((l) => l.module === m)
              .map((l) => (
                <li key={`c-${m}-${l.lesson}-${l.slug}`}>
                  <Link href={`/course/core/${m}/${l.slug}`}>{l.title}</Link>
                </li>
              ))}
          </ul>
        </section>
      ))}

      <h2>Springboard Track</h2>
      <p>
        Week routing is based on the folder name (e.g. <code>week-1-gutters</code>).
      </p>

      {springboardWeeks.map((week) => (
        <section key={week} style={{ marginBottom: 16 }}>
          <h3>{week}</h3>
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

      <h2>Printables</h2>
      <ul>
        <li>
          <Link href="/course/printables/operator-checklist-pack">Operator Checklist Pack</Link>
        </li>
      </ul>
    </main>
  );
}
