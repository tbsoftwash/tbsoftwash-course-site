import { NextRequest, NextResponse } from "next/server";
import { callBluehostAcademyApi, getSessionEmail } from "@/lib/auth";

export async function GET() {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ authenticated: false });
  }

  const upstream = await callBluehostAcademyApi({
    sub_action: "get_profile",
    email,
  });

  if (!upstream.success) {
    return NextResponse.json({
      authenticated: true,
      email,
      isAdmin: false,
      profile: null,
    });
  }

  return NextResponse.json({
    authenticated: true,
    email: upstream.data?.email || email,
    isAdmin: Boolean(upstream.data?.isAdmin),
    profile: upstream.data?.profile || null,
    roster: upstream.data?.roster || null,
  });
}

export async function POST(req: NextRequest) {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json(
      { authenticated: false, message: "Not signed in." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const upstream = await callBluehostAcademyApi({
      sub_action: "sync_progress",
      email,
      mode: body?.mode || "merge",
      completedLessons: body?.completedLessons,
      lastLesson: body?.lastLesson,
      activityDays: body?.activityDays,
      bookmarks: body?.bookmarks,
      notes: body?.notes,
      preferences: body?.preferences,
    });

    if (!upstream.success) {
      return NextResponse.json(
        {
          authenticated: true,
          ok: false,
          message: upstream.data?.message || "Failed to sync progress.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      ok: true,
      email: upstream.data?.email || email,
      isAdmin: Boolean(upstream.data?.isAdmin),
      profile: upstream.data?.profile || null,
      roster: upstream.data?.roster || null,
    });
  } catch {
    return NextResponse.json(
      { authenticated: true, ok: false, message: "Malformed sync payload." },
      { status: 400 }
    );
  }
}
