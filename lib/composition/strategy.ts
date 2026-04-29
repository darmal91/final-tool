import type { BusinessInput, BusinessType, SectionType } from "@/lib/types";

export type StrategyTone = "trust" | "premium" | "urgent" | "friendly";
export type LayoutIntent = "high-trust" | "high-conversion" | "balanced";

export interface StrategyWeights {
  services: number;
  reviews: number;
  cta: number;
}

export interface CompositionStrategy {
  sectionOrder: SectionType[];
  weights: StrategyWeights;
  tone: StrategyTone;
  layoutIntent: LayoutIntent;
}

const TRUST_TYPES: ReadonlySet<BusinessType> = new Set([
  "plumber",
  "roofer",
  "hvac",
  "electrician",
]);

const PREMIUM_TYPES: ReadonlySet<BusinessType> = new Set([
  "dentist",
  "medspa",
]);

const FRIENDLY_TYPES: ReadonlySet<BusinessType> = new Set([
  "landscaper",
  "cleaner",
]);

const STRONG_DIFFERENTIATOR_LENGTH = 24;
const SIMPLE_SERVICES_THRESHOLD = 2;
const MANY_SERVICES_THRESHOLD = 5;

const REVIEWS_DROP_THRESHOLD = 0.25;
const REVIEWS_TAIL_THRESHOLD = 0.4;

function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function baseWeights(type: BusinessType): StrategyWeights {
  if (TRUST_TYPES.has(type)) {
    return { services: 0.55, reviews: 0.85, cta: 0.8 };
  }
  if (PREMIUM_TYPES.has(type)) {
    return { services: 0.7, reviews: 0.55, cta: 0.45 };
  }
  if (FRIENDLY_TYPES.has(type)) {
    return { services: 0.8, reviews: 0.6, cta: 0.6 };
  }
  return { services: 0.6, reviews: 0.6, cta: 0.6 };
}

function baseTone(type: BusinessType): StrategyTone {
  if (TRUST_TYPES.has(type)) return "trust";
  if (PREMIUM_TYPES.has(type)) return "premium";
  if (FRIENDLY_TYPES.has(type)) return "friendly";
  return "trust";
}

function resolveTone(input: BusinessInput): StrategyTone {
  if (input.tone === "aggressive") return "urgent";
  if (input.tone === "premium") return "premium";
  return baseTone(input.businessType);
}

function isSimple(input: BusinessInput): boolean {
  return input.services.length > 0 && input.services.length <= SIMPLE_SERVICES_THRESHOLD;
}

function hasStrongDifferentiator(input: BusinessInput): boolean {
  return (input.differentiator?.trim().length ?? 0) >= STRONG_DIFFERENTIATOR_LENGTH;
}

function buildWeights(input: BusinessInput, tone: StrategyTone): StrategyWeights {
  const w = baseWeights(input.businessType);
  let { services, reviews, cta } = w;

  if (input.services.length >= MANY_SERVICES_THRESHOLD) {
    services = Math.max(services, 0.85);
  } else if (isSimple(input)) {
    services = Math.min(services, 0.4);
    reviews = Math.min(reviews, 0.35);
  }

  if (hasStrongDifferentiator(input)) {
    cta = Math.max(cta, Math.min(1, cta + 0.1));
  }

  if (input.tone === "aggressive" || tone === "urgent") {
    cta = Math.max(cta, 0.95);
  } else if (input.tone === "premium" || tone === "premium") {
    cta = Math.min(cta, 0.5);
  }

  return {
    services: clamp01(services),
    reviews: clamp01(reviews),
    cta: clamp01(cta),
  };
}

function buildSectionOrder(
  input: BusinessInput,
  tone: StrategyTone,
  weights: StrategyWeights
): SectionType[] {
  let order: SectionType[];

  if (tone === "urgent") {
    order = ["hero", "services", "cta", "reviews", "cta"];
  } else if (isSimple(input)) {
    order = ["hero", "services", "cta"];
  } else if (TRUST_TYPES.has(input.businessType)) {
    order = ["hero", "reviews", "services", "cta"];
  } else if (PREMIUM_TYPES.has(input.businessType)) {
    order = ["hero", "services", "reviews", "cta"];
  } else {
    order = ["hero", "services", "reviews", "cta"];
  }

  if (weights.reviews < REVIEWS_DROP_THRESHOLD) {
    order = order.filter((t): t is SectionType => t !== "reviews");
  } else if (
    weights.reviews < REVIEWS_TAIL_THRESHOLD &&
    order.includes("reviews")
  ) {
    const withoutReviews: SectionType[] = order.filter(
      (t): t is SectionType => t !== "reviews"
    );
    const lastCtaIndex = withoutReviews.lastIndexOf("cta");
    if (lastCtaIndex >= 0) {
      withoutReviews.splice(lastCtaIndex, 0, "reviews");
      order = withoutReviews;
    }
  }

  if (!order.includes("hero")) order.unshift("hero");
  if (!order.includes("cta")) order.push("cta");

  return order;
}

function resolveLayoutIntent(input: BusinessInput): LayoutIntent {
  if (input.tone === "aggressive") return "high-conversion";
  if (
    input.businessType === "plumber" ||
    input.businessType === "roofer" ||
    input.businessType === "hvac"
  ) {
    return "high-trust";
  }
  return "balanced";
}

export function resolveStrategy(input: BusinessInput): CompositionStrategy {
  const tone = resolveTone(input);
  const weights = buildWeights(input, tone);
  const sectionOrder = buildSectionOrder(input, tone, weights);
  const layoutIntent = resolveLayoutIntent(input);
  return { sectionOrder, weights, tone, layoutIntent };
}

function weightLabel(n: number): string {
  if (n >= 0.75) return "heavy emphasis";
  if (n >= 0.45) return "balanced";
  return "light touch";
}

function ctaPosture(weight: number, tone: StrategyTone): string {
  if (tone === "urgent" || weight >= 0.85) return "direct, urgent call-to-action";
  if (weight <= 0.45) return "low-pressure invitation";
  return "clear single call-to-action";
}

export function describeStrategy(strategy: CompositionStrategy): string {
  const toneLabel: Record<StrategyTone, string> = {
    trust: "trust-driven, high credibility, strong call-to-action",
    premium: "premium, refined, understated authority",
    urgent: "urgent, decisive, immediate-action oriented",
    friendly: "friendly, approachable, neighborhood-warm",
  };
  return [
    `Voice: ${toneLabel[strategy.tone]}.`,
    `Services treatment: ${weightLabel(strategy.weights.services)}.`,
    `Social proof / reviews: ${weightLabel(strategy.weights.reviews)}.`,
    `CTA posture: ${ctaPosture(strategy.weights.cta, strategy.tone)}.`,
  ].join(" ");
}
