import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DiagramStyleToggle } from "@/components/DiagramStyleToggle";
import { FigureClient } from "@/components/FigureClient";

export default function FigureDemoPage() {
  return (
    <main className="mx-auto max-w-4xl">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.14),transparent_55%)]" />

      <h1 className="text-3xl font-semibold tracking-tight">Figure Demo: PSI vs GPM</h1>
      <p className="mt-2 text-muted-foreground">
        Choose a diagram style in Settings. This demo will switch instantly.
      </p>

      <Card className="mt-6 bg-card/70 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Diagram style</CardTitle>
          <CardDescription>Default: dark glassy. Stored per browser.</CardDescription>
        </CardHeader>
        <CardContent>
          <DiagramStyleToggle />
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4">
        <FigureClient baseName="mock-fig-103-psi-vs-gpm" />
      </div>
    </main>
  );
}
