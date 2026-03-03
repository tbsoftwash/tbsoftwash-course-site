import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";
import { CompleteAndNextButton } from "@/components/CompleteAndNextButton";

export function LessonHeader({
  kicker,
  title,
  prev,
  next,
  progress,
}: {
  kicker: string;
  title: string;
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
  progress: { track: "core" | "springboard"; module?: number; week?: string; slug: string };
}) {
  return (
    <div className="sticky top-0 z-40 -mx-6 mb-6 border-b bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {kicker}
          </div>
          <div className="truncate text-lg font-semibold">{title}</div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <MarkCompleteButton {...progress} />
          {prev ? (
            <Button asChild variant="outline" size="sm">
              <Link href={prev.href}>← Prev</Link>
            </Button>
          ) : null}
          {next ? (
            <CompleteAndNextButton
              nextHref={next.href}
              nextLabel={next.label}
              progress={progress}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
