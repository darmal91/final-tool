import type { BusinessInput, BusinessType, SectionType } from "@/lib/types";

export type StrategyTone = "trust" | "premium" | "urgent" | "friendly";
export type EmphasisLevel = "low" | "medium" | "high";
export type CTAEmphasis = "soft" | "standard" | "aggressive";

export interface CompositionStrategy {
  sectionOrder: SectionType[];
  emphasis: {
    services: EmphasisLevel;
    reviews: EmphasisLevel;
    cta: CTAEmphasis;
  };
  tone: StrategyTone;
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

export function resolveStrategy(input: BusinessInput): CompositionStrategy {
  const sectionOrder: SectionType[] = ["hero", "services", "reviews", "cta"];

  let tone: StrategyTone = "trust";
  let services: EmphasisLevel = "medium";
  let reviews: EmphasisLevel = "medium";
  let cta: CTAEmphasis = "standard";

  if (TRUST_TYPES.has(input.businessType)) {
    tone = "trust";
    reviews = "high";
    cta = "aggressive";
  } else if (PREMIUM_TYPES.has(input.businessType)) {
    tone = "premium";
    reviews = "medium";
    cta = "soft";
  } else if (FRIENDLY_TYPES.has(input.businessType)) {
    tone = "friendly";
    services = "high";
  }

  if (input.tone === "aggressive") {
    tone = "urgent";
    cta = "aggressive";
  } else if (input.tone === "premium" && tone !== "premium") {
    tone = "premium";
  }

  if (input.services.length >= 5) {
    services = "high";
  } else if (input.services.length <= 2 && services !== "high") {
    services = "low";
  }

  return {
    sectionOrder,
    emphasis: { services, reviews, cta },
    tone,
  };
}

export function describeStrategy(strategy: CompositionStrategy): string {
  const toneLabel: Record<StrategyTone, string> = {
    trust: "trust-driven, high credibility, strong call-to-action",
    premium: "premium, refined, understated authority",
    urgent: "urgent, decisive, immediate-action oriented",
    friendly: "friendly, approachable, neighborhood-warm",
  };
  const ctaLabel: Record<CTAEmphasis, string> = {
    soft: "low-pressure invitation",
    standard: "clear single call-to-action",
    aggressive: "direct, urgent call-to-action",
  };
  const emph = (lvl: EmphasisLevel) =>
    lvl === "high" ? "heavy emphasis" : lvl === "low" ? "light touch" : "balanced";
  return [
    `Voice: ${toneLabel[strategy.tone]}.`,
    `Services treatment: ${emph(strategy.emphasis.services)}.`,
    `Social proof / reviews: ${emph(strategy.emphasis.reviews)}.`,
    `CTA posture: ${ctaLabel[strategy.emphasis.cta]}.`,
  ].join(" ");
}
