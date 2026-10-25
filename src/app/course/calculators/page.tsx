import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldCalculators } from "@/components/FieldCalculators";

export default function CalculatorsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.16),transparent_55%)]" />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <Badge variant="secondary">Truck-Cab Tools</Badge>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Operator Field Calculators
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Instant SH batch mixing, nozzle orifice sizing, and Trident Protects / ASTM C-144 paver estimation.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/course">← Back to Dashboard</Link>
        </Button>
      </div>

      <FieldCalculators />
    </main>
  );
}
