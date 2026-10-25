import { NextRequest, NextResponse } from "next/server";
import {
  callBluehostAcademyApi,
  SESSION_COOKIE_NAME,
  signAcademyToken,
  verifyAcademyToken,
} from "@/lib/auth";

const SESSION_TTL = 90 * 24 * 60 * 60; // 90 days

function attachSessionCookie(res: NextResponse, email: string) {
  const sessionToken = signAcademyToken(email, "session", SESSION_TTL);
  res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

// POST: Verify 6-digit OTP Passcode entered directly on /signin
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const code = String(body?.code || "").replace(/\D/g, "");

    if (!email || code.length !== 6) {
      return NextResponse.json(
        { ok: false, message: "Please enter your email and 6-digit passcode." },
        { status: 400 }
      );
    }

    const upstream = await callBluehostAcademyApi({
      sub_action: "verify_otp",
      email,
      code,
    });

    if (!upstream.success) {
      return NextResponse.json(
        {
          ok: false,
          message:
            upstream.data?.message ||
            "Invalid or expired 6-digit passcode. Please try again.",
        },
        { status: upstream.status >= 400 ? upstream.status : 401 }
      );
    }

    const res = NextResponse.json({
      ok: true,
      email: upstream.data?.email || email,
      isAdmin: Boolean(upstream.data?.isAdmin),
      profile: upstream.data?.profile || null,
      roster: upstream.data?.roster || null,
    });
    attachSessionCookie(res, email);
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to verify passcode." },
      { status: 400 }
    );
  }
}

// GET: Verify 1-Click Magic Link clicked from email
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const verified = verifyAcademyToken(token, "magic_link");

  const origin =
    process.env.AUTH_URL ||
    req.nextUrl.origin ||
    "https://academy.tbsoftwash.com";

  if (!verified) {
    return NextResponse.redirect(
      new URL("/signin?error=expired_magic_link", origin)
    );
  }

  await callBluehostAcademyApi({
    sub_action: "verify_magic_link",
    email: verified.email,
  });

  const res = NextResponse.redirect(new URL("/course?synced=1", origin));
  attachSessionCookie(res, verified.email);
  return res;
}
