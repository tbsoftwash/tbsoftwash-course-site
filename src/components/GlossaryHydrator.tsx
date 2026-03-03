"use client";

import * as React from "react";
import { GLOSSARY } from "@/lib/glossary";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Build matchers longest-first to avoid partial matches (e.g., "downstream" inside "downstream injector").
const entries = [...GLOSSARY]
  .flatMap((e) => {
    const terms = [e.term, ...(e.aliases ?? [])].filter(Boolean);
    const isAcronym = /^[A-Z0-9]{2,5}$/.test(e.term);
    return terms.map((t) => ({
      display: t,
      def: e.def,
      isAcronym,
    }));
  })
  .sort((a, b) => b.display.length - a.display.length);

const skipTags = new Set(["CODE", "PRE", "A", "BUTTON", "INPUT", "TEXTAREA"]);

function shouldSkipNode(node: Node) {
  let p = node.parentElement;
  while (p) {
    if (skipTags.has(p.tagName)) return true;
    p = p.parentElement;
  }
  return false;
}

function wrapTermsInTextNode(textNode: Text) {
  if (shouldSkipNode(textNode)) return;
  const raw = textNode.nodeValue || "";
  if (!raw.trim()) return;

  // Quick filter: if no term substring appears, bail.
  const lower = raw.toLowerCase();
  let maybe = false;
  for (const e of entries) {
    if (lower.includes(e.display.toLowerCase())) {
      maybe = true;
      break;
    }
  }
  if (!maybe) return;

  // Build a combined regex of all terms (word-boundary-ish).
  // We allow terms with punctuation/spaces.
  const parts = entries.map((e) => escapeRegExp(e.display));
  const re = new RegExp(`(${parts.join("|")})`, "gi");

  const frag = document.createDocumentFragment();
  let last = 0;
  const s = raw;
  let m: RegExpExecArray | null;

  while ((m = re.exec(s))) {
    const hit = m[0];
    const start = m.index;
    const end = start + hit.length;

    const before = start > 0 ? s[start - 1] : "";
    const after = end < s.length ? s[end] : "";
    const isAlphaNum = /[a-z0-9]/i;

    // Avoid mid-word matches (most important fix for SH inside "wash").
    if (isAlphaNum.test(before) && isAlphaNum.test(after)) {
      continue;
    }

    // Acronyms should not trigger on lowercase word fragments.
    // Example: "waSH" could be valid, but "wash" should not underline "sh".
    const matchedEntry = entries.find((e) => e.display.toLowerCase() === hit.toLowerCase());
    if (matchedEntry?.isAcronym && hit === hit.toLowerCase()) {
      continue;
    }

    if (start > last) frag.appendChild(document.createTextNode(s.slice(last, start)));

    // Find definition for this hit (case-insensitive match against display terms).
    const def = matchedEntry?.def || "";

    const span = document.createElement("span");
    span.textContent = hit;
    span.setAttribute("data-gloss", "1");
    span.setAttribute("title", def);
    span.className = "glossary-term";
    frag.appendChild(span);

    last = end;
  }

  if (last === 0) return; // no replacements

  if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));

  const parent = textNode.parentNode;
  if (!parent) return;
  parent.replaceChild(frag, textNode);
}

export function GlossaryHydrator() {
  React.useEffect(() => {
    const roots = Array.from(document.querySelectorAll(".markdown"));
    for (const root of roots) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      let n: Node | null;
      while ((n = walker.nextNode())) {
        if ((n as any).nodeValue && !(n as any).parentElement?.closest?.("[data-glossary-done]")) {
          textNodes.push(n as Text);
        }
      }
      for (const tn of textNodes) wrapTermsInTextNode(tn);
      (root as HTMLElement).setAttribute("data-glossary-done", "1");
    }
  }, []);

  return null;
}
