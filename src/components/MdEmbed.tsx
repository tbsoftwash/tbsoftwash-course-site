"use client";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

async function mdToHtml(md: string) {
  const processed = await remark().use(gfm).use(html).process(md);
  return processed.toString();
}

const INLINE_CODE_ALLOWED =
  "(?:04_sops|02_chemicals|03_curriculum|06_ops|05_sales_marketing|01_business_profile)";

function patchHtmlForMdEmbeds(input: string) {
  let out = input;

  // Embed raw YouTube links even if author didn't use VIDEO:.
  out = out.replace(
    /<p><a href=\"(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=[^\"&]+|youtu\.be\/[^\"?&]+|youtube\.com\/shorts\/[^\"?&]+)[^\"]*)\"[^>]*>[^<]*<\/a><\/p>/g,
    (_m, href) => `<div data-video=\"${String(href).trim()}\" data-caption=\"\"></div>`
  );

  // Also support VIDEO: callouts inside embedded markdown.
  out = out.replace(
    /<(p|li)>VIDEO:\s*(?:(?:<a href=\"([^\"]+)\"[^>]*>[^<]*<\/a>)|([^<|]+?))(?:\s*\|\s*([^<]+))?<\/\1>/g,
    (_m, _tag, href, raw, cap) => {
      const u = String(href || raw || "").trim();
      const c = String(cap ?? "").trim();
      return `<div data-video=\"${u.replace(/\"/g, "&quot;")}\" data-caption=\"${c.replace(/\"/g, "&quot;")}\"></div>`;
    }
  );

  // Standalone code blocks that are exactly a path.
  out = out.replace(
    /<p><code>([^<]+\.md)<\/code><\/p>/g,
    (_m, mdPath) => `<div data-md="${String(mdPath).trim()}"></div>`
  );
  out = out.replace(
    /<li><code>([^<]+\.md)<\/code><\/li>/g,
    (_m, mdPath) => `<li><div data-md="${String(mdPath).trim()}"></div></li>`
  );

  // Inline code paths.
  const inlineCodeRe = new RegExp(
    `<code>(${INLINE_CODE_ALLOWED}\\/[^<\\s]+\\.md)<\\/code>`,
    "g"
  );
  out = out.replace(inlineCodeRe, (_m, mdPath) => `<span data-md="${String(mdPath).trim()}"></span>`);

  // Links to .md
  out = out.replace(
    /<a href="([^"]+\.md)">([^<]+)<\/a>/g,
    (_m, href, _label) => `<div data-md="${String(href).replace(/^\.\//, "").trim()}"></div>`
  );

  // Plain text occurrences only inside text nodes (avoid attribute corruption).
  const mdPathRegex =
    /(04_sops\/[^\s<]+\.md|02_chemicals\/[^\s<]+\.md|03_curriculum\/[^\s<]+\.md|06_ops\/[^\s<]+\.md|05_sales_marketing\/[^\s<]+\.md|01_business_profile\/[^\s<]+\.md)/g;

  out = out.replace(/>([^<]+)</g, (full, text) => {
    const replaced = String(text).replace(mdPathRegex, (m) => `<span data-md="${m}"></span>`);
    return `>${replaced}<`;
  });

  return out;
}

function hydrateNestedMdEmbeds(container: HTMLElement) {
  const nodes = Array.from(container.querySelectorAll("[data-md]") as any as HTMLElement[]);
  for (const el of nodes) {
    const p = el.getAttribute("data-md");
    if (!p) continue;
    if ((el as any).__mdMounted) continue;
    (el as any).__mdMounted = true;
    const root = createRoot(el);
    root.render(<MdEmbed path={p} />);
  }

  // Hydrate nested videos too (so embedded docs can contain videos).
  const vids = Array.from(container.querySelectorAll("[data-video]") as any as HTMLElement[]);
  for (const el of vids) {
    if ((el as any).__videoMounted) continue;
    (el as any).__videoMounted = true;
    const raw = el.getAttribute("data-video") || "";
    const caption = el.getAttribute("data-caption") || "";

    // Build a nocookie embed URL.
    let id = "";
    try {
      if (raw.includes("youtube.com") || raw.includes("youtu.be")) {
        const u = new URL(raw);
        if (u.hostname.includes("youtu.be")) id = u.pathname.replace("/", "");
        else if (u.pathname.startsWith("/shorts/")) id = u.pathname.split("/shorts/")[1] || "";
        else id = u.searchParams.get("v") || "";
      } else {
        id = raw;
      }
    } catch {
      id = raw;
    }
    id = String(id).trim();
    if (!id) continue;
    const embed = `https://www.youtube-nocookie.com/embed/${id}`;

    el.innerHTML = `
      <figure class="my-6">
        <div class="overflow-hidden rounded-2xl glass-panel">
          <div style="position:relative;padding-top:56.25%;">
            <iframe
              src="${embed}"
              title="@tbsoftwash video"
              style="position:absolute;inset:0;width:100%;height:100%;"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        ${caption ? `<figcaption class="mt-2 text-xs text-muted-foreground">${caption}</figcaption>` : ""}
      </figure>
    `;
  }
}

export function MdEmbed({ path }: { path: string }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState<string>(path);
  const [contentHtml, setContentHtml] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

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
      const h0 = await mdToHtml(String(data.markdown || ""));
      const h = patchHtmlForMdEmbeds(h0);
      setContentHtml(h);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (!contentHtml) return;
    if (!contentRef.current) return;
    hydrateNestedMdEmbeds(contentRef.current);
  }, [contentHtml]);

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
                ref={contentRef}
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
