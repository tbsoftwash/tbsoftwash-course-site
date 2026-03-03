import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SignInComingSoon() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.16),transparent_55%)]" />

      <Badge variant="secondary">Coming soon</Badge>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Email sign-in</h1>
      <p className="mt-3 text-muted-foreground">
        We’re adding passwordless email sign-in so you can label your progress and (later) sync across
        devices.
      </p>

      <div className="mt-6 grid gap-3 rounded-2xl glass-panel p-5">
        <div className="text-sm font-semibold">What you can do right now</div>
        <ul className="list-disc pl-5 text-sm text-muted-foreground">
          <li>Continue as Guest (progress saves on this device).</li>
          <li>Export / Import your progress JSON (manual backup to Drive).</li>
        </ul>

        <div className="mt-2 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/course">Go to course</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back</Link>
          </Button>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Dev note: SMTP/Auth.js wiring is stubbed. See <code>docs/AUTH-STUB.md</code>.
        </p>
      </div>
    </main>
  );
}
