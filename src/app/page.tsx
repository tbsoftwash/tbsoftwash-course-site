import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.16),transparent_55%)]" />

      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand-icon.png" alt="Tampa Bay Soft Wash" className="h-10 w-10" />
        <div>
          <div className="text-sm font-semibold">@tbsoftwash</div>
          <div className="text-xs text-muted-foreground">tbsoftwash.com</div>
        </div>
      </div>

      <Badge className="mt-6" variant="secondary">
        Operator training
      </Badge>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Tampa Bay Soft Wash Academy
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        SOP-driven training for premium exterior cleaning. Built around Proof Packs, QA checklists, and
        systems that keep your work consistent and your business protected.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/course">Start learning</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/course/printables">Printables</Link>
        </Button>
        <Button asChild variant="secondary" title="Use your email to save your progress — no passwords required. (Coming soon)">
          <Link href="/signin">Sign in with Email (coming soon)</Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-4 rounded-2xl glass-panel p-6">
        <div className="text-sm font-semibold">Start here (read this first)</div>
        <p className="text-sm text-muted-foreground">
          This trade is hard work — but it’s not complicated forever. If you persist, you’ll close the
          knowledge gap and you’ll start seeing the job the way pros see it: surfaces, risks, and
          repeatable steps.
        </p>
        <ol className="list-decimal pl-5 text-sm text-muted-foreground">
          <li>Read the lesson once for the big picture.</li>
          <li>Run it on a real job (or a mock walkaround).</li>
          <li>Capture a Proof Pack (before/after + notes).</li>
          <li>Use the checklists, then do a final walk.</li>
        </ol>
        <p className="text-xs text-muted-foreground">
          Note: Progress is saved on this device. You can export/import a JSON backup in the User Card.
        </p>
      </div>

      <div className="mt-8 text-xs text-muted-foreground">
        Brand names used: Tampa Bay Soft Wash &amp; Pressure Cleaning • Tampa Bay Soft Wash • @tbsoftwash •
        tbsoftwash.com
      </div>
    </main>
  );
}
