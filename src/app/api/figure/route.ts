import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const style = searchParams.get("style");

  if (!name || !style) {
    return new Response("Missing params", { status: 400 });
  }

  const fileName = `${name}_${style}.svg`;
  const filePath = path.join(
    process.cwd(),
    "tbsoftwash-course",
    "08_illustrations",
    "src",
    fileName
  );

  if (!fs.existsSync(filePath)) {
    return new Response(`Missing figure: ${fileName}`, { status: 404 });
  }

  const svg = fs.readFileSync(filePath, "utf8");
  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store", 
    },
  });
}
