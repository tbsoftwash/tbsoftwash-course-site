import { NextRequest, NextResponse } from "next/server";
import { callBluehostAcademyApi, getSessionEmail } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const code = String(req.nextUrl.searchParams.get("code") || "")
    .trim()
    .toUpperCase();
  if (!code) {
    return NextResponse.json(
      { ok: false, valid: false, message: "Missing certificate code." },
      { status: 400 }
    );
  }

  const upstream = await callBluehostAcademyApi({
    sub_action: "verify_certificate",
    email: "verify@tbsoftwash.com",
    code,
  });

  if (!upstream.success || !upstream.data?.valid) {
    return NextResponse.json({
      ok: true,
      valid: false,
      code,
    });
  }

  return NextResponse.json({
    ok: true,
    valid: true,
    code,
    certificate: upstream.data.certificate,
  });
}

export async function POST(req: NextRequest) {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json(
      { ok: false, message: "Please sign in with your email to issue a verifiable certificate." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const milestoneId = String(body?.milestoneId || "").trim();
    const milestoneTitle = String(body?.milestoneTitle || "TBSoftWash Operator Certification").trim();
    const recipientName = String(body?.recipientName || email).trim();

    if (!milestoneId) {
      return NextResponse.json(
        { ok: false, message: "Missing milestoneId." },
        { status: 400 }
      );
    }

    const upstream = await callBluehostAcademyApi({
      sub_action: "issue_certificate",
      email,
      milestoneId,
      milestoneTitle,
      recipientName,
    });

    if (!upstream.success || !upstream.data?.certificate) {
      return NextResponse.json(
        {
          ok: false,
          message: upstream.data?.message || "Unable to issue certificate.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      certificate: upstream.data.certificate,
      profile: upstream.data.profile || null,
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Malformed certificate request." },
      { status: 400 }
    );
  }
}
