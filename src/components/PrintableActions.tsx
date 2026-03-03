"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function PrintableActions({ downloadUrl }: { downloadUrl: string }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Button asChild variant="outline" size="sm">
        <a href={downloadUrl}>Download (.md)</a>
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={() => {
          // Print the current page
          window.print();
        }}
      >
        Print
      </Button>
    </div>
  );
}
