import Link from "next/link";
import { listLessons } from "@/lib/course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function cleanTitle(t: string) {
  return t
    .replace(/^Module\s+\d+\s+—\s+/i, "")
    .replace(/^Week\s+\d+\s+—\s+/i, "")
    .replace(/\s*\(Lesson\)\s*$/i, "")
    .trim();
}

export default function CourseIndex() {
  const lessons = listLessons();

  const core = lessons.filter((l) => l.track === "core");
  const springboard = lessons.filter((l) => l.track === "springboard");

  const coreModules = Array.from(new Set(core.map((l) => l.module).filter(Boolean))) as number[];
  coreModules.sort((a, b) => a - b);

  const springboardWeeks = Array.from(new Set(springboard.map((l) => l.week).filter(Boolean))) as string[];
  springboardWeeks.sort();

  return (
    <main className="mx-auto max-w-4xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.14),transparent_55%)]" />

      <div className="mb-8">
        <Badge variant="secondary">TBSoftWash Academy</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Operator Course</h1>
        <p className="mt-2 text-muted-foreground">
          SOP-driven training for premium exterior cleaning: Proof Packs, QA checklists, and systems.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/course/springboard/week-1-gutters/gutters-overview">Start Springboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/course/printables/operator-checklist-pack">Download: Operator Checklist Pack</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Core Modules</h2>
          <div className="grid gap-4">
            {coreModules.map((m) => {
              const items = core
                .filter((l) => l.module === m)
                .sort((a, b) => (a.lesson ?? 999) - (b.lesson ?? 999));

              const first = items[0];
              return (
                <Card key={m} className="bg-card/70 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Module {m}</CardTitle>
                    <CardDescription>{items.length} lessons</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-1">
                      {items.slice(0, 4).map((l) => (
                        <Link
                          key={`c-${m}-${l.lesson}-${l.slug}`}
                          href={`/course/core/${m}/${l.slug}`}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {cleanTitle(l.title)}
                        </Link>
                      ))}
                      {items.length > 4 ? (
                        <div className="text-xs text-muted-foreground">…and {items.length - 4} more</div>
                      ) : null}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {first ? (
                      <Button asChild size="sm">
                        <Link href={`/course/core/${m}/${first.slug}`}>Start Module</Link>
                      </Button>
                    ) : null}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Springboard Track</h2>
          <p className="text-sm text-muted-foreground">
            Week routing is based on the folder name (e.g. <code>week-1-gutters</code>).
          </p>

          <div className="mt-3 grid gap-4">
            {springboardWeeks.map((week) => {
              const items = springboard
                .filter((l) => l.week === week)
                .sort((a, b) => (a.lesson ?? 999) - (b.lesson ?? 999));
              const first = items[0];

              return (
                <Card key={week} className="bg-card/70 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>{week}</CardTitle>
                    <CardDescription>{items.length} lessons</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-1">
                      {items.map((l) => (
                        <Link
                          key={`s-${week}-${l.lesson}-${l.slug}`}
                          href={`/course/springboard/${week}/${l.slug}`}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {cleanTitle(l.title)}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {first ? (
                      <Button asChild size="sm">
                        <Link href={`/course/springboard/${week}/${first.slug}`}>Start Week</Link>
                      </Button>
                    ) : null}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Printables</h2>
          <Card className="bg-card/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Operator Checklist Pack</CardTitle>
              <CardDescription>Truck-ready QA + closeout checklists.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/course/printables/operator-checklist-pack">Open</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </main>
  );
}
