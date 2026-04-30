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

type StyleFn = (title: string, trade: string, location: string) => string;

const SERVICE_STYLE_TEMPLATES: StyleFn[] = [
  // outcome-focused
  (title, _trade, location) =>
    `${title}, done right — clean work, clear pricing, and results built to last in ${location}.`,
  // problem-focused
  (title, _trade, location) =>
    `When ${title.toLowerCase()} issues come up, speed and accuracy matter. We reach ${location} fast, diagnose correctly, and fix it the first time.`,
  // assurance-focused
  (title, _trade, _location) =>
    `Every ${title.toLowerCase()} job is backed by our workmanship guarantee — licensed, insured, and fully accountable from start to finish.`,
  // speed/urgency-focused
  (title, _trade, location) =>
    `Same-day ${title.toLowerCase()} available in ${location}. Upfront pricing, no runaround, and a crew that shows up when we say we will.`,
];

function getServiceDescription(index: number, title: string, trade: string, location: string): string {
  return SERVICE_STYLE_TEMPLATES[index % SERVICE_STYLE_TEMPLATES.length](title, trade, location);
}

export function buildHeroContent(input: BusinessInput): HeroContent {
  const trade = TYPE_LABEL[input.businessType] || "service";
  const tone = input.tone;
  const headline =
    tone === "premium"
      ? `${capitalize(trade)} done with the care your home deserves.`
      : tone === "aggressive"
      ? `${input.location} ${capitalize(trade)} — fast, fair, done right.`
      : `Trusted ${trade} for ${input.location} homes and businesses.`;

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
      body: `Honest, professional, and on time. ${input.businessName} fixed our problem the first visit. Highly recommend.`,
      rating: 5,
    },
    {
      name: "James O.",
      role: "Repeat customer",
      body: `Fair pricing and a team that actually shows up when they say they will. We won't call anyone else.`,
      rating: 5,
    },
    {
      name: "Linda C.",
      role: "Property manager",
      body: `Clean work, clear communication, no surprises on the invoice. Exactly what you want.`,
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
        : `Ready when you are.`,
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
