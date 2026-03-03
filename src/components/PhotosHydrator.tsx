"use client";

import * as React from "react";

function renderPhoto(el: Element) {
  const file = el.getAttribute("data-photo");
  if (!file) return;
  const caption = el.getAttribute("data-caption") || "";
  const alt = el.getAttribute("data-alt") || file;
  const src = `/api/photo?name=${encodeURIComponent(file)}`;

  el.innerHTML = `
    <figure class="my-6">
      <div class="overflow-hidden rounded-2xl glass-panel">
        <img src="${src}" alt="${alt}" class="h-auto w-full" loading="lazy" />
      </div>
      ${caption ? `<figcaption class="mt-2 text-xs text-muted-foreground">${caption}</figcaption>` : ""}
    </figure>
  `;
}

export function PhotosHydrator() {
  React.useEffect(() => {
    document.querySelectorAll("[data-photo]").forEach((el) => renderPhoto(el));
  }, []);

  return null;
}
