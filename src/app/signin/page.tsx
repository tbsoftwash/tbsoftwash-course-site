"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  applyCloudProfileToLocal,
  STORAGE_EMAIL,
  syncProgressToCloud,
} from "@/lib/progress";

export default function SignInPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<"email" | "code">("email");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);
  const [currentMember, setCurrentMember] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error") === "expired_magic_link") {
        setError("That magic link has expired. Enter your email below for a fresh code and link.");
      }
      const savedEmail = window.localStorage.getItem(STORAGE_EMAIL);
      if (savedEmail) {
        setCurrentMember(savedEmail);
        setEmail(savedEmail);
      }
    }
    fetch("/api/progress")
      .then((r) => r.json())
      .then((d) => {
        if (d?.authenticated && d?.email) {
          setCurrentMember(d.email);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_EMAIL, d.email);
          }
        }
      })
      .catch(() => {});
  }, []);

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setError(data?.message || "Could not send sign-in email. Please try again.");
      } else {
        setEmail(cleanEmail);
        setStep("code");
        setInfo(
          `Sent! Check ${cleanEmail} for your 6-digit passcode OR click the 1-Click Magic Link button inside the email.`
        );
      }
    } catch {
      setError("Network error while requesting sign-in code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cleanCode = code.replace(/\D/g, "");
    if (cleanCode.length !== 6) {
      setError("Please enter the 6-digit passcode from your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: cleanCode }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setError(data?.message || "Invalid or expired passcode. Please try again.");
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_EMAIL, data.email || email);
      }
      if (data.profile) {
        applyCloudProfileToLocal(data.profile, "merge");
      }
      // Push merged union (guest progress + cloud progress) back to Bluehost MySQL
      await syncProgressToCloud("merge");
      router.push("/course");
    } catch {
      setError("Network error while verifying passcode. Please try again.");
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_EMAIL);
    }
    setCurrentMember(null);
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.16),transparent_55%)]" />

      <Badge variant="secondary">Passwordless Operator Auth</Badge>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Academy Cloud Sign-In
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        No passwords to remember. We send one email with <strong>both</strong> a{" "}
        <span className="text-foreground font-medium">6-digit passcode</span> (for signing in across phone, tablet, or laptop) and a{" "}
        <span className="text-foreground font-medium">1-Click Magic Link</span>.
      </p>

      {currentMember ? (
        <Card className="mt-6 border-primary/40 bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base">Signed in as {currentMember}</CardTitle>
            <CardDescription>
              Your completed lessons, streak days, saved SOP bookmarks, and field notes are actively syncing to the cloud.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/course">Open Operator Dashboard →</Link>
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign out / Switch email
            </Button>
          </CardFooter>
        </Card>
      ) : null}

      <Card className="mt-6 bg-card/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg">
            {step === "email" ? "Step 1: Enter your email" : "Step 2: Enter 6-Digit Passcode (or click Magic Link)"}
          </CardTitle>
          <CardDescription>
            {step === "email"
              ? "Any lessons you already completed as a Guest on this device will automatically merge into your account."
              : `Email sent to ${email}. Valid for 15 minutes.`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error ? (
            <div className="mb-4 rounded-xl border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          {info ? (
            <div className="mb-4 rounded-xl border border-primary/40 bg-primary/10 p-3 text-sm text-foreground">
              {info}
            </div>
          ) : null}

          {step === "email" ? (
            <form onSubmit={handleRequestCode} className="grid gap-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Operator Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border bg-background/60 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Sending Passcode & Magic Link…" : "Send 6-Digit Code & Magic Link →"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="grid gap-4">
              <div>
                <label htmlFor="otp-code" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  6-Digit Passcode from Email
                </label>
                <input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full rounded-xl border bg-background/60 px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.4em] text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Verifying & Syncing Progress…" : "Verify Code & Open Dashboard →"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setError(null);
                  }}
                >
                  Change Email / Resend
                </Button>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap justify-between gap-2 border-t pt-4 text-xs text-muted-foreground">
          <span>Prefer local-only guest mode?</span>
          <div className="flex gap-3">
            <Link href="/course" className="font-medium text-foreground underline-offset-4 hover:underline">
              Continue as Guest →
            </Link>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
