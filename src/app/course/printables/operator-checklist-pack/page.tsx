import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

export default async function OperatorChecklistPackPage() {
  const filePath = path.join(
    process.cwd(),
    "tbsoftwash-course",
    "03_curriculum",
    "printables",
    "operator-checklist-pack-v1.md"
  );

  const md = fs.readFileSync(filePath, "utf8");
  const processed = await remark().use(html).process(md);
  const contentHtml = processed.toString();

  return (
    <main style={{ maxWidth: 900 }}>
      <h1>Operator Checklist Pack (Printable)</h1>
      <p>
        This is the truck-ready pack. (DOCX/PDF downloads can be wired here next.)
      </p>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}
