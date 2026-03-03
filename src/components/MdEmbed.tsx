"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

async function mdToHtml(md: string) {
  const processed = await remark().use(gfm).use(html).process(md);
  return processed.toString();
}

export function MdEmbed({ path }: { path: string }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState<string>(path);
  const [contentHtml, setContentHtml] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // prefetch title
    (async () => {
      try {
        const res = await fetch(`/api/md?path=${encodeURIComponent(path)}`);
        if (!res.ok) return;
        const data = await res.json();
        setTitle(data.title || path);
      } catch {
        // ignore
      }
    })();
  }, [path]);

  async function ensureLoaded() {
    if (contentHtml) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/md?path=${encodeURIComponent(path)}`);
      if (!res.ok) {
        setContentHtml(`<p>(Unable to load: ${path})</p>`);
        return;
      }
      const data = await res.json();
      const h = await mdToHtml(String(data.markdown || ""));
      setContentHtml(h);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-4 rounded-2xl glass-panel">
      <Collapsible
        open={open}
        onOpenChange={async (v) => {
          setOpen(v);
          if (v) await ensureLoaded();
        }}
      >
        <div className="flex items-center justify-between gap-3 px-3 py-2">
          <CollapsibleTrigger className="px-2 py-2">
            <span className="truncate">{title}</span>
            <span className="ml-3 text-xs text-muted-foreground">{open ? "Hide" : "Show"}</span>
          </CollapsibleTrigger>

          <Button asChild size="sm" variant="outline">
            <a href={`/api/md?path=${encodeURIComponent(path)}&download=1`}>Download</a>
          </Button>
        </div>

        <CollapsibleContent>
          <div className="px-4 pb-4">
            {loading && !contentHtml ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : (
              <div
                className="markdown rounded-xl glass-panel p-4"
                dangerouslySetInnerHTML={{ __html: contentHtml ?? "" }}
              />
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
