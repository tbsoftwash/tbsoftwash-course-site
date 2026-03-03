import fs from "fs";
import path from "path";

function safeResolvePhoto(name: string) {
  const cleaned = name.replace(/\\/g, "/").replace(/^\/+/, "").trim();
  if (!cleaned) throw new Error("missing name");
  if (cleaned.includes("..")) throw new Error("invalid name");
  if (!/^[a-zA-Z0-9._-]+$/.test(cleaned)) throw new Error("invalid characters");

  const base = path.join(process.cwd(), "tbsoftwash-course", "08_illustrations", "photos");
  const full = path.join(base, cleaned);
  if (!full.startsWith(base)) throw new Error("invalid path");
  return { base, full };
}

function contentTypeFor(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) return new Response("Missing name", { status: 400 });

  let resolved;
  try {
    resolved = safeResolvePhoto(name);
  } catch (e: any) {
    return new Response(String(e?.message ?? "Bad name"), { status: 400 });
  }

  if (!fs.existsSync(resolved.full)) {
    return new Response("Not found", { status: 404 });
  }

  const buf = fs.readFileSync(resolved.full);
  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": contentTypeFor(resolved.full),
      "Cache-Control": "public, max-age=300",
    },
  });
}
