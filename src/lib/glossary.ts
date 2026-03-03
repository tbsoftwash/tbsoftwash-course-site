export type GlossaryEntry = {
  term: string;
  def: string;
  aliases?: string[];
};

// v0: start with obvious operator terms. Keep short, plain-English, and jobsite-practical.
// Later we can move this into a course-owned markdown/JSON file.
export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "SH",
    aliases: ["sodium hypochlorite"],
    def: "Bleach (sodium hypochlorite). In soft washing, it’s the main active ingredient that kills organic growth. Handle like a strong chemical: PPE + protect plants/metals.",
  },
  {
    term: "dwell",
    def: "How long the solution sits on the surface before you rinse. Too short = weak results; too long on sensitive surfaces can cause damage.",
  },
  {
    term: "downstream injector",
    aliases: ["DS injector", "downstream", "DS"],
    def: "A device that pulls chemical into the pressure line AFTER the pump. Safer/easier for many house washes because strong bleach doesn’t go through the pump.",
  },
  {
    term: "batch mix",
    aliases: ["batching"],
    def: "Mixing chemical in a tank or sprayer first, then applying. More control/strength, but more handling risk.",
  },
  {
    term: "surfactant",
    def: "A soap additive that helps solution cling/spread and improves cleaning. Also helps you see coverage.",
  },
  {
    term: "post-treat",
    def: "A final light treatment after surface cleaning (often flatwork) to brighten and kill remaining organics.",
  },
  {
    term: "pre-treat",
    def: "Treatment applied before cleaning to loosen organics/soil. Common in flatwork.",
  },
  {
    term: "oxidation",
    def: "A chalky breakdown of paint/coatings (often on older siding). Not the same as algae. Wrong chemistry/pressure can make it worse.",
  },
  {
    term: "tiger stripes",
    aliases: ["tiger striping"],
    def: "Dark streaks on gutters—often oxidation/metal runoff staining. Brightening is restoration work (different risk + price).",
  },
  {
    term: "WFP",
    aliases: ["water fed pole", "water-fed pole"],
    def: "Window-cleaning system using a pole + brush with purified water so glass dries spot-free (when technique and water quality are right).",
  },
  {
    term: "RO/DI",
    aliases: ["RODI", "RODI system"],
    def: "Reverse Osmosis / Deionization filtration used to purify water for WFP window cleaning.",
  },
  {
    term: "TDS",
    def: "Total Dissolved Solids. A water quality number—lower TDS means fewer minerals that can spot glass.",
  },
  {
    term: "Proof Pack",
    def: "Your before/after photos + notes that prove what was done and protect you from disputes. Also fuels reviews and marketing.",
  },
  {
    term: "soft wash",
    aliases: ["softwashing"],
    def: "Low-pressure application of cleaning solutions to kill organics and lift grime—used on roofs, siding, enclosures, etc. Not high-pressure blasting.",
  },
  {
    term: "surface cleaner",
    def: "A round flatwork tool that spins spray nozzles under a skirt for even concrete cleaning. Paired with adequate GPM.",
  },
];
