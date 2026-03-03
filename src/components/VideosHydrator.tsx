"use client";

import * as React from "react";

function toEmbedUrl(raw: string) {
  const s = String(raw || "").trim();
  if (!s) return null;

  // Accept:
  // - https://www.youtube.com/watch?v=ID
  // - https://youtu.be/ID
  // - ID (11 chars)
  let id = "";
  try {
    if (s.includes("youtube.com") || s.includes("youtu.be")) {
      const u = new URL(s);
      if (u.hostname.includes("youtu.be")) {
        id = u.pathname.replace("/", "");
      } else {
        id = u.searchParams.get("v") || "";
      }
    } else {
      id = s;
    }
  } catch {
    id = s;
  }

  id = id.trim();
  if (!/^[a-zA-Z0-9_-]{6,}$/.test(id)) return null;
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderVideo(el: Element) {
  const raw = el.getAttribute("data-video") || "";
  const caption = el.getAttribute("data-caption") || "";
  const embed = toEmbedUrl(raw);

  if (!embed) {
    el.innerHTML = `<div class="my-4 rounded-2xl glass-panel p-4 text-sm text-muted-foreground">(Unable to load video: ${escapeHtml(raw)})</div>`;
    return;
  }

  el.innerHTML = `
    <figure class="my-6">
      <div class="overflow-hidden rounded-2xl glass-panel">
        <div style="position:relative;padding-top:56.25%;">
          <iframe
            src="${embed}"
            title="TBSoftWash video"
            style="position:absolute;inset:0;width:100%;height:100%;"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
      ${caption ? `<figcaption class="mt-2 text-xs text-muted-foreground">${escapeHtml(caption)}</figcaption>` : ""}
    </figure>
  `;
}

export function VideosHydrator() {
  React.useEffect(() => {
    document.querySelectorAll("[data-video]").forEach((el) => renderVideo(el));
  }, []);

  return null;
}
