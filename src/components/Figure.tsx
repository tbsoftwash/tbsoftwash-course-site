import fs from "fs";
import path from "path";

type Props = {
  baseName: string;
  style: "A-clean" | "B-dark-glassy" | "C-hybrid";
};

export function Figure({ baseName, style }: Props) {
  // Current demo assets live in the course repo under 08_illustrations/src
  const fileName = `${baseName}_${style}.svg`;
  const filePath = path.join(
    process.cwd(),
    "tbsoftwash-course",
    "08_illustrations",
    "src",
    fileName
  );

  if (!fs.existsSync(filePath)) {
    return (
      <div className="rounded-xl border bg-card/50 p-4 text-sm text-muted-foreground">
        Missing figure: <code>{fileName}</code>
      </div>
    );
  }

  const svg = fs.readFileSync(filePath, "utf8");

  return (
    <div className="overflow-hidden rounded-2xl border bg-card/40">
      {/* inline svg for crispness */}
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
