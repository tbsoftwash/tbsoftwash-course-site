import Link from "next/link";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function slugToFilename(slug: string) {
  if (slug === "operator-checklist-pack") return "operator-checklist-pack-v1.md";
  return `${slug}.md`;
}

const PRINTABLES = [
  {
    slug: "operator-checklist-pack",
    title: "Operator Checklist Pack",
    desc: "Truck-ready QA + closeout checklists.",
  },
  {
    slug: "safety-loadout-checklist-v1",
    title: "Safety Loadout Checklist v1",
    desc: "Non-negotiable truck safety loadout (PPE + site safety).",
  },
  {
    slug: "spill-and-exposure-response-card-v1",
    title: "Spill + Exposure Response Card v1",
    desc: "Quick reference for splash/spill/exposure response + SDS reminder.",
  },
];

export default function PrintablesIndexPage() {
  return (
    <main className="mx-auto max-w-4xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.14),transparent_55%)]" />

      <h1 className="text-3xl font-semibold tracking-tight">Printables</h1>
      <p className="mt-2 text-muted-foreground">
        Print these and keep them in the truck. (PDF/DOCX downloads can be added next.)
      </p>

      <div className="mt-6 grid gap-4">
        {PRINTABLES.map((p) => (
          <Card key={p.slug} className="bg-card/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.desc}</CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href={`/course/printables/${p.slug}`}>Open</Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={`/api/md?path=${encodeURIComponent(
                    `03_curriculum/printables/${slugToFilename(p.slug)}`
                  )}&download=1`}
                >
                  Download
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
