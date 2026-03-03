import fs from "fs";
import path from "path";

function safeResolve(relPath: string) {
  // normalize and prevent traversal
  const cleaned = relPath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (cleaned.includes("..")) throw new Error("invalid path");

  // allowlist folders within vendored course repo
  const allowedPrefixes = [
    "04_sops/",
    "02_chemicals/",
    "03_curriculum/printables/",
    "06_ops/",
    "05_sales_marketing/",
    // internal citations / sources
    "01_business_profile/",
  ];
  if (!allowedPrefixes.some((p) => cleaned.startsWith(p))) {
    throw new Error("path not allowed");
  }

  const base = path.join(process.cwd(), "tbsoftwash-course");
  const full = path.join(base, cleaned);
  if (!full.startsWith(base)) throw new Error("invalid path");
  return { cleaned, full };
}

function firstH1(md: string) {
  for (const ln of md.split("\n")) {
    if (ln.startsWith("# ")) return ln.slice(2).trim();
  }
  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rel = searchParams.get("path");
  const download = searchParams.get("download") === "1";

  if (!rel) return new Response("Missing path", { status: 400 });

  let resolved;
  try {
    resolved = safeResolve(rel);
  } catch (e: any) {
    return new Response(String(e?.message ?? "Bad path"), { status: 400 });
  }

  if (!fs.existsSync(resolved.full)) return new Response("Not found", { status: 404 });

  const md = fs.readFileSync(resolved.full, "utf8");
  const title = firstH1(md) ?? path.basename(resolved.cleaned);

  if (download) {
    return new Response(md, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${path.basename(resolved.cleaned)}"`,
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  return Response.json(
    {
      title,
      path: resolved.cleaned,
      markdown: md,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60",
      },
    }
  );
}
