import { NextRequest, NextResponse } from "next/server";
import { callBluehostAcademyApi, signAcademyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const origin =
      process.env.AUTH_URL ||
      req.headers.get("origin") ||
      "https://academy.tbsoftwash.com";

    // 15-minute signed Magic Link token
    const magicToken = signAcademyToken(email, "magic_link", 900);
    const magicLink = `${origin.replace(/\/$/, "")}/api/auth/verify?token=${encodeURIComponent(
      magicToken
    )}`;

    const upstream = await callBluehostAcademyApi({
      sub_action: "request_login",
      email,
      magic_link: magicLink,
    });

    if (!upstream.success) {
      return NextResponse.json(
        {
          ok: false,
          message:
            upstream.data?.message ||
            "Could not send sign-in email. Please try again in a moment.",
        },
        { status: upstream.status >= 400 ? upstream.status : 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      email,
      expiresIn: upstream.data?.expiresIn ?? 900,
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 }
    );
  }
}
