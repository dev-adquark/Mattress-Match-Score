export interface ContentLink {
  slug: string;
  title: string;
  excerpt: string;
}

export const guideLinks: ContentLink[] = [
  {
    slug: "pressure-relief-for-side-sleepers",
    title: "Pressure Relief for Side Sleepers",
    excerpt: "Why the shoulder and hip need a contouring surface, and which constructions deliver it.",
  },
  {
    slug: "back-support-for-heavy-back-sleepers",
    title: "Back Support for Heavier Back Sleepers",
    excerpt: "How body weight changes the firmness and support-core math for back sleepers.",
  },
  {
    slug: "hot-sleeper-cooling-comparison",
    title: "Cooling Comparison for Hot Sleepers",
    excerpt: "What airflow rating, materials, and coil design actually do for temperature at night.",
  },
];

export const faqLinks: ContentLink[] = [
  {
    slug: "firmness-tradeoffs",
    title: "Firmness Tradeoffs",
    excerpt: "Why there's no single \"best\" firmness, and how it interacts with position and weight.",
  },
  {
    slug: "trial-periods",
    title: "Trial Periods",
    excerpt: "How sleep trials work, how long they typically last, and what to test during one.",
  },
  {
    slug: "durability-timelines",
    title: "Durability Timelines",
    excerpt: "What sag risk and expected lifespan ratings mean in practice.",
  },
  {
    slug: "motion-isolation-expectations",
    title: "Motion Isolation Expectations",
    excerpt: "What \"good\" motion isolation actually feels like for a shared bed.",
  },
  {
    slug: "cooling",
    title: "Cooling & Temperature",
    excerpt: "The difference between airflow, heat retention, and active cooling features.",
  },
  {
    slug: "side-sleeping",
    title: "Side Sleeping",
    excerpt: "What side sleepers should prioritize and where mismatches usually show up.",
  },
  {
    slug: "back-support",
    title: "Back Support",
    excerpt: "How support and alignment scoring works for back sleepers specifically.",
  },
  {
    slug: "edge-support",
    title: "Edge Support",
    excerpt: "Why edge support matters more than people expect, especially for couples.",
  },
  {
    slug: "pressure-relief",
    title: "Pressure Relief",
    excerpt: "How the pressure-relief sub-score is derived and what improves it.",
  },
];
