import type { BusinessInput } from "@/lib/types";
import type { VariantPlan } from "./variants";
import type { CompositionStrategy } from "./strategy";

export interface VariantScore {
  trustScore: number;
  conversionScore: number;
  aestheticScore: number;
  totalScore: number;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreTrust(
  plan: VariantPlan,
  input: BusinessInput,
  strategy: CompositionStrategy
): number {
  let score = 50;

  // Structured service layouts are clearer and more trustworthy
  const manyServices = input.services.length >= 4;
  if (plan.services === "step-based") score += manyServices ? 18 : 12;
  else if (plan.services === "icon-list") score += manyServices ? 10 : 7;
  // card-grid: neutral

  // Prominent reviews signal credibility
  if (plan.reviews === "grid") score += 12;
  else if (plan.reviews === "scrolling") score += 10;
  else if (plan.reviews === "single-highlight") score += 4;

  if (!strategy.sectionOrder.includes("reviews")) score -= 8;

  // Aggressive CTA damages trust perception
  if (plan.cta === "soft-contact") score += 12;
  else if (plan.cta === "strong-offer") score += 5;
  else if (plan.cta === "urgency") score -= 14;

  // Multiple urgency CTAs compound the aggressiveness penalty
  const ctaCount = strategy.sectionOrder.filter((s) => s === "cta").length;
  if (ctaCount > 1 && plan.cta === "urgency") score -= 10;

  // Hero clarity
  if (plan.hero === "centered-trust") score += 8;
  else if (plan.hero === "premium-split") score += 5;
  else if (plan.hero === "conversion") score -= 6;

  // Input tone cross-check: aggressive tone with soft CTA is incoherent
  if (input.tone === "aggressive" && plan.cta === "soft-contact") score -= 5;

  return clamp(score);
}

function scoreConversion(
  plan: VariantPlan,
  input: BusinessInput,
  strategy: CompositionStrategy
): number {
  let score = 50;

  // CTA directness
  if (plan.cta === "urgency") score += 20;
  else if (plan.cta === "strong-offer") score += 12;
  else if (plan.cta === "soft-contact") score -= 10;

  // Aggressive input tone expects strong CTA; soft-contact penalises more
  if (input.tone === "aggressive" && plan.cta === "soft-contact") score -= 8;

  // Hero conversion focus
  if (plan.hero === "conversion") score += 18;
  else if (plan.hero === "centered-trust") score += 5;
  else if (plan.hero === "premium-split") score -= 5;

  // Social proof boosts conversion — visible reviews reduce friction
  if (plan.reviews === "scrolling" || plan.reviews === "grid") score += 8;
  else if (plan.reviews === "single-highlight") score += 4;
  if (!strategy.sectionOrder.includes("reviews")) score -= 4;

  // Multiple CTAs increase action surface
  const ctaCount = strategy.sectionOrder.filter((s) => s === "cta").length;
  if (ctaCount > 1) score += 5;

  // Differentiator copy makes the CTA more compelling
  if ((input.differentiator?.trim().length ?? 0) >= 24) score += 4;

  return clamp(score);
}

function scoreAesthetic(
  plan: VariantPlan,
  input: BusinessInput,
  strategy: CompositionStrategy
): number {
  let score = 50;

  // Tone consistency: variants should match the resolved strategy tone
  if (strategy.tone === "urgent") {
    if (plan.hero === "conversion") score += 12;
    if (plan.cta === "urgency") score += 10;
    else if (plan.cta === "soft-contact") score -= 14;
    if (plan.hero === "premium-split") score -= 8;
  } else if (strategy.tone === "premium") {
    if (plan.hero === "premium-split") score += 12;
    if (plan.cta === "soft-contact") score += 10;
    else if (plan.cta === "urgency") score -= 15;
    if (plan.hero === "conversion") score -= 10;
  } else {
    // trust or friendly
    if (plan.hero === "centered-trust") score += 10;
    if (plan.cta === "strong-offer") score += 6;
    else if (plan.cta === "urgency") score -= 8;
    if (plan.hero === "conversion") score -= 5;
  }

  // Repeated CTAs degrade rhythm unless the tone demands it
  const ctaCount = strategy.sectionOrder.filter((s) => s === "cta").length;
  if (ctaCount > 2) score -= 15;
  else if (ctaCount > 1 && plan.cta === "urgency") score -= 8;
  else if (ctaCount > 1 && plan.cta === "strong-offer") score -= 3;

  // Double-aggressive signal (conversion hero + urgency CTA) feels like shouting
  if (plan.hero === "conversion" && plan.cta === "urgency") score -= 8;

  // Coherent services + reviews pairing
  if (plan.services === "step-based" && plan.reviews === "grid") score += 5;
  if (plan.services === "icon-list" && plan.reviews === "single-highlight") score += 4;

  // Input tone mismatch with resolved strategy
  if (input.tone === "premium" && plan.cta === "urgency") score -= 8;

  return clamp(score);
}

export function scoreVariantPlan(
  plan: VariantPlan,
  input: BusinessInput,
  strategy: CompositionStrategy
): VariantScore {
  const trustScore = scoreTrust(plan, input, strategy);
  const conversionScore = scoreConversion(plan, input, strategy);
  const aestheticScore = scoreAesthetic(plan, input, strategy);

  const totalScore = clamp(
    trustScore * 0.4 + conversionScore * 0.3 + aestheticScore * 0.3
  );

  return { trustScore, conversionScore, aestheticScore, totalScore };
}
