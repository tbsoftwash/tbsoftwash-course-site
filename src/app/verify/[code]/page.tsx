"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { loadCertificates, type CertificateRecord } from "@/lib/progress";

export default function VerifyCertificatePage() {
  const params = useParams<{ code: string }>();
  const rawCode = String(params?.code || "").toUpperCase();

  const [loading, setLoading] = React.useState(true);
  const [valid, setValid] = React.useState(false);
  const [cert, setCert] = React.useState<CertificateRecord | null>(null);

  React.useEffect(() => {
    if (!rawCode) {
      setLoading(false);
      return;
    }

    // Check local cache first for instant preview
    const localCerts = Object.values(loadCertificates());
    const localMatch = localCerts.find((c) => c.code.toUpperCase() === rawCode);
    if (localMatch) {
      setCert(localMatch);
      setValid(true);
    }

    fetch(`/api/certificates?code=${encodeURIComponent(rawCode)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.valid && d?.certificate) {
          setCert(d.certificate);
          setValid(true);
        } else if (!localMatch) {
          setValid(false);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [rawCode]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.16),transparent_55%)]" />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div>
          <Badge variant="secondary">Credential Registry</Badge>
          <h1 className="mt-2 text-2xl font-semibold">TBSoftWash Academy Certificate Verification</h1>
        </div>
        <div className="flex gap-2">
          {valid ? (
            <Button onClick={() => window.print()}>🖨️ Print / Save as PDF</Button>
          ) : null}
          <Button asChild variant="outline">
            <Link href="/course">← Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="bg-card/80 p-8 text-center">
          <p className="text-sm text-muted-foreground">Verifying credential {rawCode} against Tampa Bay Soft Wash registry…</p>
        </Card>
      ) : valid && cert ? (
        <div className="rounded-2xl border-2 border-primary/50 bg-card/95 p-8 shadow-2xl print:border-black print:bg-white print:text-black">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand-icon.png" alt="Tampa Bay Soft Wash" className="h-12 w-12" />
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary">
                  Tampa Bay Soft Wash Academy
                </div>
                <div className="text-sm font-semibold">
                  Official Operator Credential • Clearwater, Florida
                </div>
              </div>
            </div>
            <Badge className="text-xs">✓ Verified Active Credential</Badge>
          </div>

          <div className="my-8 text-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              This certifies that
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight">
              {cert.recipientName}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{cert.email}</div>

            <div className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
              Has successfully completed all field SOP modules &amp; safety gate evaluations for
            </div>
            <div className="mt-2 text-2xl font-semibold text-primary">
              {cert.milestoneTitle}
            </div>
          </div>

          <div className="grid gap-4 rounded-xl border bg-background/50 p-4 text-xs sm:grid-cols-3">
            <div>
              <div className="text-muted-foreground">Certificate ID</div>
              <div className="mt-0.5 font-mono font-bold">{cert.code}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Date Issued</div>
              <div className="mt-0.5 font-semibold">
                {cert.issuedAt ? cert.issuedAt.slice(0, 10) : "2026"}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Issuing Authority</div>
              <div className="mt-0.5 font-semibold">
                Brian Vasquez &amp; Jessica Lakins
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span>Tampa Bay Soft Wash &amp; Pressure Cleaning, LLC • (727) 641-1296</span>
            <span>Verify online: https://academy.tbsoftwash.com/verify/{cert.code}</span>
          </div>
        </div>
      ) : (
        <Card className="border-destructive/40 bg-card/80">
          <CardHeader>
            <CardTitle>Certificate Not Found ({rawCode || "Invalid Code"})</CardTitle>
            <CardDescription>
              No active certificate matching this code was found in the Tampa Bay Soft Wash Academy registry.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/course">Return to Academy Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
