export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleQuiz {
  quizId: string;
  title: string;
  questions: QuizQuestion[];
}

export const MODULE_QUIZZES: Record<string, ModuleQuiz> = {
  "core:0": {
    quizId: "core:0",
    title: "Module 0 Safety Gate — Orientation & Proof-First Mindset",
    questions: [
      {
        id: "m0-q1",
        question: "What is the primary purpose of capturing a 'Proof Pack' on every job?",
        options: [
          "Only to post memes on social media",
          "To document pre-existing conditions, verify quality assurance, protect liability, and fuel local trust",
          "To replace the need for a final walkthrough",
          "Only required on commercial jobs over $5,000",
        ],
        correctIndex: 1,
        explanation: "Every TBSoftWash job uses a Proof Pack (before/after + risk documentation) to protect the customer, protect the company, and verify quality.",
      },
      {
        id: "m0-q2",
        question: "Before spraying any chemical on a property, what is the non-negotiable first step?",
        options: [
          "Turn the pressure washer up to maximum PSI",
          "Perform a 360° property walkaround, identify sensitive surfaces/plants/oxidized paint, and pre-wet surrounding vegetation",
          "Mix acid and bleach together in the same tank",
          "Skip testing and spray the front elevation immediately",
        ],
        correctIndex: 1,
        explanation: "Surface diagnosis, pre-existing damage documentation, and generous plant pre-wetting prevent 99% of avoidable claims.",
      },
    ],
  },
  "core:1": {
    quizId: "core:1",
    title: "Module 1 Safety Gate — Standards, Comms & Final Walk",
    questions: [
      {
        id: "m1-q1",
        question: "When you spot pre-existing oxidation, cracked stucco, or torn lanai screens during arrival intake, what must you do?",
        options: [
          "Clean over it and hope the homeowner doesn't notice",
          "Photograph it immediately and notify the customer BEFORE touching the surface",
          "Bring it up only if the customer complains a week later",
          "Cancel the job without speaking to the customer",
        ],
        correctIndex: 1,
        explanation: "If you touch a compromised surface before documenting and notifying the homeowner, you own the pre-existing defect.",
      },
      {
        id: "m1-q2",
        question: "What defines a proper job closeout?",
        options: [
          "Packing hoses and driving away silently",
          "Completing the QA checklist, capturing after photos from identical angles, rinsing all vegetation/hardware, and conducting the final walk",
          "Texting an invoice before rinsing the plants",
          "Leaving tape on exterior outlets for the homeowner to remove",
        ],
        correctIndex: 1,
        explanation: "Never leave tape on outlets/keyholes; always complete the final walk and post-rinse vegetation thoroughly.",
      },
    ],
  },
  "core:2": {
    quizId: "core:2",
    title: "Module 2 Safety Gate — Chemical Safety, SH Ratios & Delivery Systems",
    questions: [
      {
        id: "m2-q1",
        question: "CRITICAL SAFETY RULE: What happens if Sodium Hypochlorite (SH / bleach) is mixed with an acid (such as Oxalic or Muriatic acid)?",
        options: [
          "It creates a stronger roof cleaner",
          "It releases toxic, potentially lethal Chlorine Gas",
          "It neutralizes into pure water",
          "It turns into a degreaser",
        ],
        correctIndex: 1,
        explanation: "NEVER mix Sodium Hypochlorite with any acid—doing so liberates deadly chlorine gas. Always rinse thoroughly between chemistries.",
      },
      {
        id: "m2-q2",
        question: "If your tank holds 12.5% Sodium Hypochlorite and you batch-mix a 50/50 ratio with water, what is your approximate roof mix strength?",
        options: [
          "1.0% SH",
          "3.0% SH",
          "6.25% SH",
          "12.5% SH",
        ],
        correctIndex: 2,
        explanation: "A 1:1 (50/50) dilution of 12.5% SH with water yields 6.25% SH—reserved only for severe tile moss/lichen with extreme plant protection.",
      },
      {
        id: "m2-q3",
        question: "Why does a standard high-draw downstream injector typically deliver ~0.8%–1.5% SH at the tip?",
        options: [
          "Because the pressure washer pump dilutes the chemical draw at roughly a 7:1 to 10:1 water-to-chemical ratio",
          "Because downstream injectors heat the water to 200°F",
          "Because downstreaming uses compressed air",
          "Because SH evaporates inside the hose",
        ],
        correctIndex: 0,
        explanation: "Downstreaming pulls chemical after the high-pressure pump at ~10:1 dilution, making it ideal for 1%–1.25% house washing but too weak for roof cleaning.",
      },
    ],
  },
  "core:3": {
    quizId: "core:3",
    title: "Module 3 Safety Gate — ARMA Roof Soft Washing & Florida Insurance Rules",
    questions: [
      {
        id: "m3-q1",
        question: "What causes the black streaks on Florida asphalt shingle and barrel tile roofs, and why does ARMA forbid high-pressure washing?",
        options: [
          "Jet fuel soot; high pressure is fine if you stand 3 feet away",
          "Gloeocapsa magma (cyanobacteria) feeding on limestone filler; high pressure strips protective granules and voids manufacturer warranties",
          "Tree sap; only a rotary surface cleaner can remove it",
          "Rust from nails; requires muriatic acid",
        ],
        correctIndex: 1,
        explanation: "Gloeocapsa magma is a living photosynthetic bacteria. ARMA strictly mandates low-pressure sodium hypochlorite soft washing to kill the root system without stripping granules.",
      },
      {
        id: "m3-q2",
        question: "How do you protect landscaping during a 3%–5% SH roof treatment when gutters are NOT installed?",
        options: [
          "Cover plants with black plastic tarps in the 95°F Florida sun",
          "Continuously pre-wet, mist during application, flood-rinse drip lines, and apply a sodium thiosulfate neutralizer / soil conditioner",
          "Spray only at noon without water on site",
          "Hope for rain later that afternoon",
        ],
        correctIndex: 1,
        explanation: "Never bake Florida plants under dark tarps in direct heat; continuous water dilution + neutralizer at the drip line is mandatory.",
      },
    ],
  },
  "core:4": {
    quizId: "core:4",
    title: "Module 4 Safety Gate — House Washing & Oxidation Diagnosis",
    questions: [
      {
        id: "m4-q1",
        question: "How do you test vinyl siding or painted aluminum for chalky oxidation before washing?",
        options: [
          "Hit it with a 0-degree red tip at 4,000 PSI",
          "Swipe a gloved finger across the dry surface and inspect for chalky pigment transfer",
          "Spray degreaser on a small corner",
          "Oxidation only happens on wood fences",
        ],
        correctIndex: 1,
        explanation: "Always perform the finger-swipe oxidation test during intake. High pressure or strong degreasers on oxidized paint will leave permanent zebra striping.",
      },
      {
        id: "m4-q2",
        question: "What is the standard on-wall Sodium Hypochlorite concentration for a routine Florida stucco or vinyl house wash?",
        options: [
          "0.8% to 1.25% SH applied at low pressure (< 100 PSI)",
          "6.0% SH applied with a turbo nozzle",
          "Pure 12.5% SH undiluted",
          "3,500 PSI water only",
        ],
        correctIndex: 0,
        explanation: "0.8%–1.25% SH eradicates green algae and mildew on siding without burning vegetation or stripping paint.",
      },
    ],
  },
  "core:5": {
    quizId: "core:5",
    title: "Module 5 Safety Gate — Traditional Windows & Pure Water (WFP / RO-DI)",
    questions: [
      {
        id: "m5-q1",
        question: "What TDS (Total Dissolved Solids) reading is required after the DI resin vessel for spot-free Water-Fed Pole glass cleaning?",
        options: [
          "000–005 ppm (ideally 000 ppm)",
          "050–100 ppm",
          "250+ ppm",
          "TDS does not matter if you rinse quickly",
        ],
        correctIndex: 0,
        explanation: "Pure water window cleaning relies on 000 ppm deionized water so dissolved minerals cannot leave spots as the glass dries.",
      },
      {
        id: "m5-q2",
        question: "Why must hydrophobic frames and top seals be scrubbed and rinsed thoroughly before your final glass pass with a Water-Fed Pole?",
        options: [
          "To cool down the brush bristles",
          "Because dirty water dripping from the top frame after you walk away causes 'run-down' streaks across clean glass",
          "To polish the aluminum",
          "It is not necessary on second-story windows",
        ],
        correctIndex: 1,
        explanation: "Top-edge frame drips are the #1 cause of WFP callbacks. Scrub frames first, let drips settle, then do your final pure-water rinse.",
      },
    ],
  },
  "core:6": {
    quizId: "core:6",
    title: "Module 6 Safety Gate — Gutter Cleaning vs. Electrostatic Brightening",
    questions: [
      {
        id: "m6-q1",
        question: "Why don't black 'tiger stripes' on the outside of aluminum gutters come off during a standard SH house wash?",
        options: [
          "Because they are electrostatic asphalt/carbon oxidation bonded to the aluminum paint, not organic algae",
          "Because the bleach wasn't strong enough (needs 12.5%)",
          "Because gutters are made of stainless steel",
          "Because they are inside the gutter trough",
        ],
        correctIndex: 0,
        explanation: "Tiger stripes are electrostatic oxidation/pollutant bonding, not biological growth. They require a dedicated butyl/surfactant gutter brightening scrub and immediate cold-water rinse.",
      },
    ],
  },
  "core:7": {
    quizId: "core:7",
    title: "Module 7 Safety Gate — Stripe-Free Flatwork & Commercial Concrete",
    questions: [
      {
        id: "m7-q1",
        question: "How do you size rotary surface cleaner nozzles and walking speed for an 8 GPM machine?",
        options: [
          "Use a 20–24 inch surface cleaner (4 inches per GPM) with two 25040 tips (~2,500 PSI) and post-treat with 1.5%–2% SH to eliminate any circular overlap shadows",
          "Use a 12-inch residential attachment at 4,200 PSI and run across the driveway",
          "Remove the skirt and use 0-degree red tips",
          "Never rinse concrete before applying post-treatment",
        ],
        correctIndex: 0,
        explanation: "Rule of thumb: 4 inches of surface cleaner diameter per 1 GPM of flow, paired with proper orifice sizing and an SH post-treat to kill deep pore spores.",
      },
    ],
  },
  "core:8": {
    quizId: "core:8",
    title: "Module 8 Safety Gate — Trident Paver Sealing, Drains & Rust Chemistry",
    questions: [
      {
        id: "m8-q1",
        question: "Why does Tampa Bay Soft Wash specify ASTM C-144 angular silica sand stabilized by Trident joint-stabilizing sealers instead of big-box polymeric sand in Florida?",
        options: [
          "Polymeric sand polymers re-emulsify in Florida humidity/pool splashout, trapping moisture and causing white haze failure",
          "Polymeric sand is illegal in Pinellas County",
          "Play sand from the beach is better",
          "Joints should be left completely empty",
        ],
        correctIndex: 0,
        explanation: "Clean, angular ASTM C-144 silica sand locked with Trident Hurricane CAT 4/CAT 5 or Cyclone urethane/acrylic chemistry cures into a breathable, washout-proof joint matrix.",
      },
      {
        id: "m8-q2",
        question: "Why must you NEVER apply Sodium Hypochlorite (bleach) to an orange well-water iron/rust stain?",
        options: [
          "Bleach is an oxidizer that chemically sets and darkens iron oxide stains into the concrete pores",
          "It turns the concrete blue",
          "It dissolves the concrete aggregate",
          "Bleach actually removes rust better than oxalic acid",
        ],
        correctIndex: 0,
        explanation: "Iron rust is already oxidized; applying an oxidizer (SH) bakes it deeper. Rust requires a reducing acid (Oxalic Acid / F9 BARC) after thorough rinsing.",
      },
    ],
  },
  "core:9": {
    quizId: "core:9",
    title: "Module 9 Safety Gate — Speed-to-Lead, Quote Lanes & Trust Sandwich",
    questions: [
      {
        id: "m9-q1",
        question: "Why must Roof Square Footage always be distinguished from Livable (Heated) Square Footage when quoting a roof wash?",
        options: [
          "Because roof overhangs, garages, lanais, and roof pitch multiplier make true Roof SqFt 25%–45% larger than livable square footage",
          "Because roof square footage is smaller than livable square footage",
          "They are always identical",
          "Only two-story homes have a roof pitch",
        ],
        correctIndex: 0,
        explanation: "Educating the homeowner upfront on garages, lanais, and pitch multipliers builds transparency and prevents pricing friction.",
      },
    ],
  },
  "core:10": {
    quizId: "core:10",
    title: "Module 10 Safety Gate — GBP Reviews, Local SEO & Topical Authority",
    questions: [
      {
        id: "m10-q1",
        question: "When is the highest-converting moment to request a verified Google review?",
        options: [
          "Six months after the job via mass email blast",
          "Immediately at the Final Walk (or alongside the Before/After Proof Pack delivery) while the transformation emotion is at its peak",
          "Before starting the job",
          "Never ask for reviews",
        ],
        correctIndex: 1,
        explanation: "Delivering the visual Proof Pack and asking right at job completion captures authentic customer excitement.",
      },
    ],
  },
  "core:11": {
    quizId: "core:11",
    title: "Module 11 Safety Gate — Change Orders, Florida HOA Law & Crew Ops",
    questions: [
      {
        id: "m11-q1",
        question: "Under Florida Statute § 720.3055, when is a Florida Homeowners' Association (HOA) legally required to obtain competitive sealed bids?",
        options: [
          "For every $100 repair",
          "When an exterior maintenance or vendor contract exceeds 10% of the association's total annual budget",
          "Only on leap years",
          "HOAs are never required to get competitive bids",
        ],
        correctIndex: 1,
        explanation: "Knowing F.S. § 720.3055 and presenting COI ($1M Liability), W-9, OSHA-10, and Trident T3 credentials upfront wins commercial/HOA board votes.",
      },
    ],
  },
  "springboard:week-0-first-7-days": {
    quizId: "springboard:week-0-first-7-days",
    title: "Springboard Week 0 Check — Your First 7 Days",
    questions: [
      {
        id: "sb0-q1",
        question: "What is the goal of the Springboard track?",
        options: [
          "Wait until you own a $40,000 dual-axle skid before talking to a customer",
          "Start generating cash flow, Proof Packs, and 5-star reviews immediately with low-overhead, high-skill services (gutters & windows)",
          "Perform unpermitted roof repairs",
          "Skip insurance and licensing",
        ],
        correctIndex: 1,
        explanation: "Springboard gets you executing profitable, repeatable field reps in your first 7 days while building your Proof Pack library.",
      },
    ],
  },
  "springboard:week-1-gutters": {
    quizId: "springboard:week-1-gutters",
    title: "Springboard Week 1 Check — Gutter Cleaning & Downspout QA",
    questions: [
      {
        id: "sb1-q1",
        question: "How do you prove a downspout is 100% clear during a gutter cleaning job?",
        options: [
          "Tap on the outside of the aluminum elbow",
          "Flush water from the top and verify full, unrestricted flow exiting the bottom discharge or pop-up emitter",
          "Look at it from the street",
          "Use a leaf blower without checking the underground drain",
        ],
        correctIndex: 1,
        explanation: "Always flow-test every downspout; if an underground French/lanai drain is impacted with roots/sand, document it and offer a Hydro-Jetting change order.",
      },
    ],
  },
  "springboard:week-2-traditional-windows": {
    quizId: "springboard:week-2-traditional-windows",
    title: "Springboard Week 2 Check — Traditional Window Cleaning",
    questions: [
      {
        id: "sb2-q1",
        question: "What causes perimeter edge detailing marks on traditional squeegee window work?",
        options: [
          "Using too much dish soap",
          "Using a damp surgical/huck towel instead of a bone-dry edge wrap to detail the 1/8-inch perimeter frame edge",
          "Cleaning in the morning",
          "Removing the window screen first",
        ],
        correctIndex: 1,
        explanation: "Always keep a dry microfiber/huck towel edge for the perimeter frame wipe so you don't drag trapped frame water back onto dry glass.",
      },
    ],
  },
  "springboard:week-3-wfp-rodi": {
    quizId: "springboard:week-3-wfp-rodi",
    title: "Springboard Week 3 Check — Pure Water (WFP / RO-DI)",
    questions: [
      {
        id: "sb3-q1",
        question: "In a 4-stage RO/DI pure water cart, what protects the expensive RO membrane from municipal chlorine damage?",
        options: [
          "The DI mixed-bed resin tank",
          "The Carbon Block pre-filter (Stage 2), which strips chlorine before water reaches the RO membrane",
          "The garden hose reel",
          "The brush head jets",
        ],
        correctIndex: 1,
        explanation: "Municipal chlorine destroys RO membranes; replacing your sediment and carbon pre-filters on schedule extends RO membrane life for years.",
      },
    ],
  },
};

export function getQuizForTrack(opts: {
  track: "core" | "springboard";
  module?: number;
  week?: string;
}): ModuleQuiz | null {
  const key = opts.track === "core" ? `core:${opts.module}` : `springboard:${opts.week}`;
  return MODULE_QUIZZES[key] ?? null;
}
