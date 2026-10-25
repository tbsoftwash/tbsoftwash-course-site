import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "tbsa_session";
const DEFAULT_SECRET = "tbsa_v100_hybrid_auth_bridge_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c";

export function getAcademySecret(): string {
  return process.env.TBSA_AUTH_SECRET || DEFAULT_SECRET;
}

export interface SignedTokenPayload {
  email: string;
  purpose: "magic_link" | "session";
  exp: number;
  iat: number;
}

export function signAcademyToken(email: string, purpose: "magic_link" | "session", ttlSeconds: number): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SignedTokenPayload = {
    email: email.trim().toLowerCase(),
    purpose,
    iat: now,
    exp: now + ttlSeconds,
  };
  const bodyB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sigB64 = crypto
    .createHmac("sha256", getAcademySecret())
    .update(bodyB64)
    .digest("base64url");
  return `${bodyB64}.${sigB64}`;
}

export function verifyAcademyToken(token: string, expectedPurpose: "magic_link" | "session"): SignedTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [bodyB64, sigB64] = parts;
    const expectedSig = crypto
      .createHmac("sha256", getAcademySecret())
      .update(bodyB64)
      .digest("base64url");
    if (
      sigB64.length !== expectedSig.length ||
      !crypto.timingSafeEqual(Buffer.from(sigB64), Buffer.from(expectedSig))
    ) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(bodyB64, "base64url").toString("utf8")) as SignedTokenPayload;
    if (payload.purpose !== expectedPurpose) return null;
    if (Math.floor(Date.now() / 1000) > payload.exp) return null;
    if (!payload.email) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSessionEmail(): Promise<string | null> {
  try {
    const jar = await cookies();
    const raw = jar.get(SESSION_COOKIE_NAME)?.value;
    if (!raw) return null;
    const verified = verifyAcademyToken(raw, "session");
    return verified ? verified.email : null;
  } catch {
    return null;
  }
}

export async function callBluehostAcademyApi(payload: Record<string, any>): Promise<{
  success: boolean;
  data?: any;
  status: number;
}> {
  const rawPayload = JSON.stringify(payload);
  const signature = crypto
    .createHmac("sha256", getAcademySecret())
    .update(rawPayload)
    .digest("hex");

  const form = new URLSearchParams();
  form.set("action", "tbsoftwash_academy_api");
  form.set("payload", rawPayload);
  form.set("signature", signature);

  const endpoint =
    process.env.TBSA_BLUEHOST_API_URL ||
    "https://tbsoftwash.com/wp-admin/admin-ajax.php?action=tbsoftwash_academy_api";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "X-Academy-Signature": signature,
    },
    body: form.toString(),
    cache: "no-store",
  });

  try {
    const json = await res.json();
    return {
      success: Boolean(json?.success),
      data: json?.data,
      status: res.status,
    };
  } catch {
    return {
      success: false,
      data: { message: "Unable to reach Academy cloud database." },
      status: res.status || 502,
    };
  }
}
