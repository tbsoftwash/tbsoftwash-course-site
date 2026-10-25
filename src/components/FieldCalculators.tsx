"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FieldCalculators({ compact = false }: { compact?: boolean }) {
  // 1. Batch & Manifold SH Mix Calculator
  const [sourceSh, setSourceSh] = React.useState(12.5);
  const [targetSh, setTargetSh] = React.useState(3.0);
  const [batchGal, setBatchGal] = React.useState(50);

  const shGallons = Math.min(batchGal, Math.max(0, (targetSh / sourceSh) * batchGal));
  const waterGallons = Math.max(0, batchGal - shGallons);
  const surfactantOz = Math.round((batchGal / 10) * 8); // ~8 oz per 10 gal batch

  // 2. Nozzle Orifice & Surface Cleaner Bar Tip Calculator
  const [gpm, setGpm] = React.useState(8.0);
  const [psi, setPsi] = React.useState(2500);
  const [barTips, setBarTips] = React.useState(2);

  const totalOrifice = gpm * Math.sqrt(4000 / Math.max(100, psi));
  const perTipOrifice = totalOrifice / Math.max(1, barTips);
  const tipCodeSuffix = Math.round(perTipOrifice * 10)
    .toString()
    .padStart(3, "0");
  const recommendedScInches = Math.round(gpm * 4);

  // 3. Trident Paver Sealer & ASTM C-144 Sand Coverage Calculator
  const [paverSqFt, setPaverSqFt] = React.useState(1200);
  const [sealerType, setSealerType] = React.useState<"cat4" | "cat5" | "cyclone" | "typhoon">("cat5");
  const [jointWidth, setJointWidth] = React.useState<"narrow" | "standard" | "wide">("standard");

  const sqFtPerGallon =
    sealerType === "cat4"
      ? 110
      : sealerType === "cat5"
      ? 100
      : sealerType === "cyclone"
      ? 125
      : 150;
  const totalSealerGallons = Math.ceil((paverSqFt / sqFtPerGallon) * 10) / 10;
  const fiveGalPails = Math.ceil(totalSealerGallons / 5);

  const sqFtPerSandBag =
    jointWidth === "narrow" ? 110 : jointWidth === "standard" ? 75 : 45;
  const sandBags50lb = Math.ceil(paverSqFt / sqFtPerSandBag);

  return (
    <div className="grid gap-6">
      {/* 1. SH Batch & Manifold Mix Calculator */}
      <Card className="border-primary/30 bg-card/80 backdrop-blur-xl">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base">🧪 1. Soft Wash SH Batch &amp; Manifold Mix Calculator</CardTitle>
            <Badge variant="secondary">Module 2 &amp; 3 SOP</Badge>
          </div>
          <CardDescription>
            Calculate exact Sodium Hypochlorite (SH), water, and surfactant volumes for roof, house, or pre/post-treatment batches.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Source SH Strength (%)
            </label>
            <select
              value={sourceSh}
              onChange={(e) => setSourceSh(Number(e.target.value))}
              className="w-full rounded-lg border bg-background/60 px-3 py-2 text-sm"
            >
              <option value={12.5}>12.5% (Commercial Bulk SH)</option>
              <option value={10.5}>10.5% (Retail Pool Shock)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Target Surface Mix (%): <span className="text-primary">{targetSh.toFixed(1)}%</span>
            </label>
            <input
              type="range"
              min={0.5}
              max={6.0}
              step={0.25}
              value={targetSh}
              onChange={(e) => setTargetSh(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
              <span>1% House</span>
              <span>3% Shingle</span>
              <span>5–6% Tile/Moss</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Total Batch Volume (Gallons)
            </label>
            <input
              type="number"
              min={1}
              max={500}
              value={batchGal}
              onChange={(e) => setBatchGal(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border bg-background/60 px-3 py-2 text-sm"
            />
          </div>

          <div className="sm:col-span-3 grid gap-3 rounded-xl border bg-background/50 p-4 sm:grid-cols-3">
            <div>
              <div className="text-xs text-muted-foreground">Sodium Hypochlorite ({sourceSh}%)</div>
              <div className="mt-0.5 text-xl font-bold text-primary">{shGallons.toFixed(1)} gal</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Fresh Water</div>
              <div className="mt-0.5 text-xl font-bold">{waterGallons.toFixed(1)} gal</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Surfactant (Cling/Scent)</div>
              <div className="mt-0.5 text-xl font-bold">{surfactantOz} fl oz</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Nozzle Orifice & Surface Cleaner Bar Tip Calculator */}
      <Card className="border-primary/30 bg-card/80 backdrop-blur-xl">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base">🚿 2. Nozzle Orifice &amp; Surface Cleaner Tip Calculator</CardTitle>
            <Badge variant="secondary">Module 7 Flatwork SOP</Badge>
          </div>
          <CardDescription>
            Formula: Orifice = GPM × √(4000 / PSI). Prevents etching concrete by matching nozzle orifice size to your pump GPM.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Machine Flow (GPM)
            </label>
            <input
              type="number"
              step={0.5}
              min={2.0}
              max={12.0}
              value={gpm}
              onChange={(e) => setGpm(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border bg-background/60 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Target Surface Pressure (PSI)
            </label>
            <input
              type="number"
              step={100}
              min={150}
              max={4000}
              value={psi}
              onChange={(e) => setPsi(Math.max(100, Number(e.target.value)))}
              className="w-full rounded-lg border bg-background/60 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Spray Bar Configuration
            </label>
            <select
              value={barTips}
              onChange={(e) => setBarTips(Number(e.target.value))}
              className="w-full rounded-lg border bg-background/60 px-3 py-2 text-sm"
            >
              <option value={1}>1 Tip (Single Wand Lance)</option>
              <option value={2}>2 Tips (Standard Surface Cleaner Bar)</option>
              <option value={4}>4 Tips (4-Nozzle Surface Cleaner Bar)</option>
            </select>
          </div>

          <div className="sm:col-span-3 grid gap-3 rounded-xl border bg-background/50 p-4 sm:grid-cols-3">
            <div>
              <div className="text-xs text-muted-foreground">Per-Tip Orifice Size</div>
              <div className="mt-0.5 text-xl font-bold text-primary">
                #{perTipOrifice.toFixed(1)} (25{tipCodeSuffix})
              </div>
              <div className="text-[11px] text-muted-foreground">
                25° fan × {barTips} tip(s)
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Combined Orifice</div>
              <div className="mt-0.5 text-xl font-bold">#{totalOrifice.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Max Surface Cleaner Size</div>
              <div className="mt-0.5 text-xl font-bold">{recommendedScInches}&quot; Deck</div>
              <div className="text-[11px] text-muted-foreground">4 inches per 1 GPM rule</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Trident Paver Sealer & ASTM C-144 Sand Coverage Calculator */}
      {!compact ? (
        <Card className="border-primary/30 bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">🧱 3. Trident Protects Sealer &amp; ASTM C-144 Sand Estimator</CardTitle>
              <Badge variant="secondary">Module 8 Specialty SOP</Badge>
            </div>
            <CardDescription>
              Calculate Trident Hurricane CAT 4/5 or Cyclone sealer pails and 50-lb bags of angular ASTM C-144 joint sand.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Paver Area (SqFt)
              </label>
              <input
                type="number"
                step={50}
                min={100}
                max={50000}
                value={paverSqFt}
                onChange={(e) => setPaverSqFt(Math.max(50, Number(e.target.value)))}
                className="w-full rounded-lg border bg-background/60 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Trident Sealer System
              </label>
              <select
                value={sealerType}
                onChange={(e) => setSealerType(e.target.value as any)}
                className="w-full rounded-lg border bg-background/60 px-3 py-2 text-sm"
              >
                <option value="cat5">Hurricane CAT 5 (High-Gloss Urethane)</option>
                <option value="cat4">Hurricane CAT 4 (Low-Sheen Urethane)</option>
                <option value="cyclone">Cyclone (Water-Based Acrylic/Urethane)</option>
                <option value="typhoon">Typhoon / Tsunami (Natural Look Penetrating)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Paver Joint Profile
              </label>
              <select
                value={jointWidth}
                onChange={(e) => setJointWidth(e.target.value as any)}
                className="w-full rounded-lg border bg-background/60 px-3 py-2 text-sm"
              >
                <option value="narrow">Tight / Travertine (&lt; 1/8&quot;)</option>
                <option value="standard">Standard Concrete Brick (1/8&quot;–1/4&quot;)</option>
                <option value="wide">Wide / Tumbled Old Chicago (&gt; 1/4&quot;)</option>
              </select>
            </div>

            <div className="sm:col-span-3 grid gap-3 rounded-xl border bg-background/50 p-4 sm:grid-cols-3">
              <div>
                <div className="text-xs text-muted-foreground">Est. Mixed Sealer Needed</div>
                <div className="mt-0.5 text-xl font-bold text-primary">{totalSealerGallons} gal</div>
                <div className="text-[11px] text-muted-foreground">~{sqFtPerGallon} SqFt / gal coverage</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">5-Gallon Pail Equivalent</div>
                <div className="mt-0.5 text-xl font-bold">{fiveGalPails} pail(s)</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">ASTM C-144 Silica Sand (50 lb)</div>
                <div className="mt-0.5 text-xl font-bold">{sandBags50lb} bags</div>
                <div className="text-[11px] text-muted-foreground">~{sqFtPerSandBag} SqFt / 50-lb bag</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
