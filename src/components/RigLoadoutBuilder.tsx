"use client";

import * as React from "react";
import affiliatesData from "@/lib/affiliates.json";
import { loadRigLoadout, saveRigLoadout } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SkuItem {
  key: string;
  name: string;
  asin: string;
  url: string;
  category: string;
}

function categorizeKey(key: string, name: string): string {
  const s = `${key} ${name}`.toLowerCase();
  if (s.includes("boot") || s.includes("glove") || s.includes("respirator") || s.includes("goggle") || s.includes("ppe") || s.includes("shirt") || s.includes("hat") || s.includes("sock") || s.includes("pant")) {
    return "PPE & Apparel";
  }
  if (s.includes("window") || s.includes("squeegee") || s.includes("ettore") || s.includes("unger") || s.includes("moerman") || s.includes("rodi") || s.includes("tds") || s.includes("wfp") || s.includes("resin")) {
    return "Windows & Pure Water (RO/DI)";
  }
  if (s.includes("gutter") || s.includes("ladder") || s.includes("stabilizer") || s.includes("pitch_hopper")) {
    return "Gutters & Ladder Safety";
  }
  if (s.includes("acid") || s.includes("degreaser") || s.includes("surfactant") || s.includes("bleach") || s.includes("chem") || s.includes("sprayer") || s.includes("neutralizer") || s.includes("stain") || s.includes("sealer")) {
    return "Chemicals & Sprayers";
  }
  if (s.includes("pump") || s.includes("manifold") || s.includes("banjo") || s.includes("valve") || s.includes("barb") || s.includes("kuriyama") || s.includes("12v") || s.includes("diaphragm") || s.includes("proportioner")) {
    return "Soft Wash Pumps & Plumbing";
  }
  return "Pressure Washing, Hoses & Hardware";
}

export function RigLoadoutBuilder() {
  const tag = (affiliatesData as any).tag || (affiliatesData as any).amazon_tag || "tbsoftwash06-20";
  const allItems = React.useMemo<SkuItem[]>(() => {
    const products = (affiliatesData.products || {}) as Record<
      string,
      { name: string; asin: string; status?: string }
    >;
    return Object.entries(products)
      .filter(([, p]) => p && p.asin && p.status !== "unmapped")
      .map(([key, p]) => ({
        key,
        name: p.name,
        asin: p.asin,
        url: `https://www.amazon.com/dp/${p.asin}?tag=${tag}`,
        category: categorizeKey(key, p.name),
      }));
  }, [tag]);

  const categories = React.useMemo(() => {
    const set = new Set<string>(["All"]);
    for (const item of allItems) set.add(item.category);
    return Array.from(set);
  }, [allItems]);

  const [owned, setOwned] = React.useState<Set<string>>(new Set());
  const [filterCat, setFilterCat] = React.useState("All");
  const [onlyNeeded, setOnlyNeeded] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const refresh = () => setOwned(loadRigLoadout());
    refresh();
    window.addEventListener("tbsa:progress", refresh as any);
    return () => window.removeEventListener("tbsa:progress", refresh as any);
  }, []);

  function toggleItem(key: string) {
    const next = new Set(owned);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setOwned(next);
    saveRigLoadout(next, true);
  }

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return allItems.filter((item) => {
      if (filterCat !== "All" && item.category !== filterCat) return false;
      if (onlyNeeded && owned.has(item.key)) return false;
      if (q && !`${item.name} ${item.key} ${item.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allItems, filterCat, onlyNeeded, owned, query]);

  return (
    <div className="grid gap-6">
      <Card className="border-primary/30 bg-card/80 backdrop-blur-xl">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg">
                🚛 My Rig &amp; Gear Loadout ({owned.size}/{allItems.length} Owned)
              </CardTitle>
              <CardDescription>
                Check off the valves, hoses, pumps, and PPE you already own. Your rig inventory syncs to your cloud account.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant={onlyNeeded ? "default" : "outline"}
              onClick={() => setOnlyNeeded((v) => !v)}
            >
              {onlyNeeded ? "Showing Needed Only" : "Filter: Show Needed Gear Only"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCat(cat)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  filterCat === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background/40 text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 186 verified rig parts, Banjo fittings, hoses, PPE, pumps…"
            className="w-full rounded-xl border bg-background/60 px-4 py-2 text-sm"
          />
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((item) => {
          const isOwned = owned.has(item.key);
          return (
            <div
              key={item.key}
              className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 transition ${
                isOwned
                  ? "border-primary/50 bg-primary/10"
                  : "bg-card/60 hover:bg-card/90"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant={isOwned ? "default" : "secondary"} className="text-[10px]">
                    {isOwned ? "✓ In My Rig" : item.category}
                  </Badge>
                </div>
                <div className="mt-1 truncate text-sm font-semibold">{item.name}</div>
                <div className="text-[11px] text-muted-foreground">ASIN: {item.asin}</div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  size="sm"
                  variant={isOwned ? "secondary" : "outline"}
                  onClick={() => toggleItem(item.key)}
                >
                  {isOwned ? "Owned ✓" : "Mark Owned"}
                </Button>
                <Button asChild size="sm" variant="default">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    Amazon ↗
                  </a>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
