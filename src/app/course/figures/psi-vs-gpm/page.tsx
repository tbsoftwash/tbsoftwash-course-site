import { listLessons } from "@/lib/course";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DiagramStyleToggle } from "@/components/DiagramStyleToggle";
import { Figure } from "@/components/Figure";

// Server component. We can’t read localStorage here, so we render all 3 and hide/show with CSS in a client wrapper.
// Instead we’ll do a simple server render default (Glassy) and provide a note.

export default function FigureDemoPage() {
  // touch listLessons so page stays connected to content layer (no-op)
  listLessons();

  return (
    <main className="mx-auto max-w-4xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.14),transparent_55%)]" />

      <h1 className="text-3xl font-semibold tracking-tight">Figure Demo: PSI vs GPM</h1>
      <p className="mt-2 text-muted-foreground">
        This page exists to verify the diagram-style toggle. Lesson pages will automatically use your selected style once we wire
        figures into lessons.
      </p>

      <Card className="mt-6 bg-card/70 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Diagram style</CardTitle>
          <CardDescription>Choose how course illustrations render (default: dark glassy).</CardDescription>
        </CardHeader>
        <CardContent>
          <DiagramStyleToggle />
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4">
        <Figure baseName="mock-fig-103-psi-vs-gpm" style="B-dark-glassy" />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Note: this demo currently renders the dark-glassy version server-side. Next step is to wrap figure rendering in a client
        component so it switches live.
      </p>
    </main>
  );
}
