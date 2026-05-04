import type {
  BusinessInput,
  HeroContent,
  ServicesContent,
  ReviewsContent,
  CTAContent,
  ServiceItem,
  ReviewItem,
} from "@/lib/types";

const TYPE_LABEL: Record<string, string> = {
  plumber: "plumbing",
  roofer: "roofing",
  electrician: "electrical",
  hvac: "HVAC",
  medspa: "medspa",
  dentist: "dental",
  landscaper: "landscaping",
  cleaner: "cleaning",
  general: "service",
};

const ICON_BY_TYPE: Record<string, string> = {
  plumber: "🔧",
  roofer: "🏠",
  electrician: "⚡",
  hvac: "❄️",
  medspa: "✨",
  dentist: "🦷",
  landscaper: "🌿",
  cleaner: "🧽",
  general: "🛠️",
};

function pickIcon(serviceTitle: string, businessType: string): string {
  const t = serviceTitle.toLowerCase();
  if (/(emergency|24)/.test(t)) return "🚨";
  if (/(install|new|replace)/.test(t)) return "🔨";
  if (/(repair|fix|service)/.test(t)) return "🛠️";
  if (/(inspect|check|estimate|quote)/.test(t)) return "🔍";
  if (/(clean)/.test(t)) return "🧽";
  if (/(consult)/.test(t)) return "💬";
  return ICON_BY_TYPE[businessType] || "✓";
}

type DescFn = (title: string, trade: string, location: string) => string;

// 12 templates cycling: outcome, problem, urgency, process × 3 rounds.
// Adjacent slots never share an intent. First 6 slots cover max service list with unique openers.
const SERVICE_DESCRIPTION_TEMPLATES: DescFn[] = [
  // [0] outcome
  (title, _trade, _location) => {
    if (/emergency/i.test(title)) return "Available now. We pick up, show up, and stop the damage — day or night.";
    if (/drain/i.test(title)) return "We find where it starts, not just where the water stops. One visit, clear drain.";
    if (/water heat/i.test(title)) return "Most replacements done same day. We carry common units and don't schedule a second trip.";
    if (/fixture/i.test(title)) return "Faucets, toilets, showers — installed clean, sealed right, no callbacks.";
    if (/roof/i.test(title)) return "Storm damage or full replacement — we inspect same day and give you a straight answer.";
    if (/gutter/i.test(title)) return "Installed level, sealed at every joint. No pooling, no pulling away from the fascia.";
    if (/hvac|heat|cool/i.test(title)) return "Same-day diagnosis. We tell you what it needs, not what earns us the most.";
    return "Handled start to finish by our team. No subcontractors, no surprises.";
  },
  // [1] problem
  (title, _trade, _location) =>
    `Putting off ${title.toLowerCase()} usually makes it worse. We find the root cause, not just the symptom, and walk you through the fix before we start.`,
  // [2] urgency
  (title, _trade, location) =>
    `Same-day ${title.toLowerCase()} across ${location} — no scheduling window, no waiting on a slot. Call and we move.`,
  // [3] process
  (title, _trade, _location) =>
    `Every ${title.toLowerCase()} job follows a fixed standard: assess correctly, fix completely, leave the site clean. No steps skipped.`,
  // [4] outcome
  (title, _trade, _location) =>
    `You'll notice the difference with ${title.toLowerCase()} done right — no patchwork, no revisits, one solution that sticks.`,
  // [5] problem
  (title, _trade, location) =>
    `Most ${title.toLowerCase()} calls in ${location} come in later than they should. We give straight answers and fix it the same visit when we can.`,
  // [6] urgency
  (title, _trade, _location) =>
    `When ${title.toLowerCase()} can't wait, we don't make you. Fast dispatch, a clear arrival window, fixed on the first visit.`,
  // [7] process
  (title, _trade, _location) =>
    `We don't rush ${title.toLowerCase()}. The right technique takes the same time as the wrong one — the difference shows up years later.`,
  // [8] outcome
  (title, _trade, _location) =>
    `The goal with ${title.toLowerCase()} is simple: leave it better than we found it, with nothing left to come back and fix.`,
  // [9] problem
  (title, _trade, _location) =>
    `Ignoring ${title.toLowerCase()} issues costs more later. We diagnose fast, give you a clear answer, and fix the actual problem — not a workaround.`,
  // [10] urgency
  (title, _trade, location) =>
    `${title} available now in ${location}. Upfront pricing before we touch anything — no surprises on the invoice, no bait-and-switch.`,
  // [11] process
  (title, _trade, _location) =>
    `${title} handled methodically — we document the issue, confirm the fix before closing up, and walk you through what we found.`,
];

function getServiceDescription(index: number, title: string, trade: string, location: string): string {
  return SERVICE_DESCRIPTION_TEMPLATES[index % SERVICE_DESCRIPTION_TEMPLATES.length](title, trade, location);
}

export function buildHeroContent(input: BusinessInput): HeroContent {
  const trade = TYPE_LABEL[input.businessType] || "service";
  const tone = input.tone;
  const headline =
    tone === "premium"
      ? `${capitalize(trade)} done with the care your home deserves.`
      : tone === "aggressive"
      ? `${input.location} ${capitalize(trade)} — fast, fair, done right.`
      : `${capitalize(trade)} for ${input.location} homes and businesses.`;

  const subheadline =
    input.differentiator?.trim() ||
    `Local ${trade} you can count on. Honest pricing. Real people. Workmanship that lasts.`;

  return {
    eyebrow: `${input.location} · ${capitalize(trade)}`,
    headline,
    subheadline,
    ctaText: tone === "aggressive" ? "Get a free quote" : "Request a quote",
    ctaHref: "#contact",
    trustBadges:
      tone === "premium"
        ? ["Licensed & insured", "Locally owned", "5-star rated"]
        : tone === "aggressive"
        ? ["Same-day service available", "Free quotes"]
        : ["Licensed & insured", "Family owned", "Top rated locally"],
  };
}

export function buildServicesContent(input: BusinessInput): ServicesContent {
  const trade = TYPE_LABEL[input.businessType] || "service";
  const services: ServiceItem[] = (input.services.length
    ? input.services
    : ["Service A", "Service B", "Service C", "Service D"]
  )
    .slice(0, 6)
    .map((title, index) => ({
      title,
      description: getServiceDescription(index, title, trade, input.location),
      icon: pickIcon(title, input.businessType),
    }));

  return {
    heading: "What we do",
    subheading: `Full-service ${trade} across ${input.location} and surrounding areas.`,
    services,
  };
}

export function buildReviewsContent(input: BusinessInput): ReviewsContent {
  const reviews: ReviewItem[] = [
    {
      name: "Sarah M.",
      role: `${input.location} homeowner`,
      body: `${input.businessName} fixed our problem the first visit. Showed up on time, explained the issue, and didn't upsell anything we didn't need.`,
      rating: 5,
    },
    {
      name: "James O.",
      role: "Repeat customer",
      body: `Fair pricing and a crew that actually shows up when they say they will. We've used them twice now and won't call anyone else.`,
      rating: 5,
    },
    {
      name: "Linda C.",
      role: "Property manager",
      body: `Clean work, clear communication, no surprises on the invoice. That's all I ask for — and they delivered every time.`,
      rating: 5,
    },
  ];
  return {
    heading: "What our customers say",
    subheading: `Real reviews from real ${input.location} customers.`,
    reviews,
  };
}

export function buildCTAContent(input: BusinessInput): CTAContent {
  const tone = input.tone;
  return {
    eyebrow: tone === "aggressive" ? "Limited slots this week" : "Get started",
    heading:
      tone === "premium"
        ? "Bring your project to a team that takes it seriously."
        : tone === "aggressive"
        ? "Need it handled today? Call now."
        : "Ready when you are.",
    subheading:
      tone === "premium"
        ? "Reach out for a private consultation. We'll respond within one business day."
        : tone === "aggressive"
        ? "Tell us what's wrong. We'll be there fast."
        : "Get a free, no-obligation quote in minutes.",
    buttonText: tone === "aggressive" ? "Call now" : "Request a quote",
    buttonHref: input.phone ? `tel:${input.phone}` : "#contact",
    microcopy: input.phone
      ? `Or call ${input.phone}`
      : "No spam. No pressure. Just an honest quote.",
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
