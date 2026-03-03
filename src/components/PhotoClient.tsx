"use client";

import * as React from "react";

export function PhotoClient({
  file,
  alt,
  caption,
}: {
  file: string;
  alt?: string;
  caption?: string;
}) {
  const src = `/api/photo?name=${encodeURIComponent(file)}`;

  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-2xl glass-panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt || file} className="h-auto w-full" loading="lazy" />
      </div>
      {caption ? <figcaption className="mt-2 text-xs text-muted-foreground">{caption}</figcaption> : null}
    </figure>
  );
}
