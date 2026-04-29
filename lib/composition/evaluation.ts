import type { SectionType } from "@/lib/types";
import type { CompositionStrategy } from "./strategy";
import type { VariantPlan } from "./variants";
import type { PageArchetype } from "./archetypes";
import type { RealismConfig } from "@/lib/design/realism";
import { ARCHETYPE_CONFIGS } from "./archetypes";

export interface CompositionEvaluation {
  visualClarity: number;
  conversionStrength: number;
  trustSignalStrength: number;
  structuralFlow: number;
  realismScore: number;
  totalScore: number;
}

export interface EvaluationInput {
  archetype: PageArchetype;
  strategy: CompositionStrategy;
  realism: RealismConfig;
  variantPlan: VariantPlan;
  sectionOrder: SectionType[];
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreVisualClarity(input: EvaluationInput): number {
  let score = 60;
  const { archetype, sectionOrder } = input;
  const archetypeFlow = ARCHETYPE_CONFIGS[archetype].sectionFlow;

  if (JSON.stringify(sectionOrder) === JSON.stringify(archetypeFlow)) score += 15;

  if (sectionOrder[0] === "hero") score += 10;

  if (archetype !== "high-conversion-service") {
    const firstCta = sectionOrder.indexOf("cta");
    const firstServices = sectionOrder.indexOf("services");
    if (firstCta >= 0 && firstServices >= 0 && firstCta < firstServices) score -= 10;
  }

  if (archetype === "high-trust-local" || archetype === "premium-authority") {
    const firstReviews = sectionOrder.indexOf("reviews");
    const ctasBeforeReviews =
      firstReviews >= 0
        ? sectionOrder.slice(0, firstReviews).filter((s) => s === "cta").length
        : sectionOrder.filter((s) => s === "cta").length;
    if (ctasBeforeReviews > 1) score -= 15;
  }

  return clamp(score);
}

function scoreConversionStrength(input: EvaluationInput): number {
  let score = 50;
  const { archetype, strategy, sectionOrder } = input;

  if (archetype === "high-conversion-service") {
    const firstCta = sectionOrder.indexOf("cta");
    const total = sectionOrder.length;

    if (firstCta >= 0 && firstCta / total <= 0.6) score += 20;

    const ctaCount = sectionOrder.filter((s) => s === "cta").length;
    const lastCta = sectionOrder.lastIndexOf("cta");
    if (ctaCount === 1 && lastCta === total - 1) score -= 20;

    if (sectionOrder[0] === "hero" && sectionOrder[1] === "services") score += 15;
  }

  if (strategy.tone === "urgent" || strategy.weights.cta >= 0.85) score += 10;

  return clamp(score);
}

function scoreTrustSignalStrength(input: EvaluationInput): number {
  let score = 50;
  const { archetype, strategy, realism, variantPlan, sectionOrder } = input;

  if (archetype === "high-trust-local") {
    const firstReviews = sectionOrder.indexOf("reviews");
    const firstCta = sectionOrder.indexOf("cta");
    if (firstReviews >= 0 && firstCta >= 0 && firstReviews < firstCta) score += 20;
  }

  if (realism.sectionBreathing > 0.2) score += 15;

  if (
    (strategy.tone === "premium" ||
      strategy.tone === "trust" ||
      archetype === "high-trust-local") &&
    variantPlan.cta === "soft-contact"
  ) {
    score += 10;
  }

  if (archetype === "premium-authority" && variantPlan.cta === "urgency") score -= 15;

  return clamp(score);
}

function scoreStructuralFlow(input: EvaluationInput): number {
  let score = 55;
  const { archetype, sectionOrder } = input;
  const archetypeFlow = ARCHETYPE_CONFIGS[archetype].sectionFlow;

  if (JSON.stringify(sectionOrder) === JSON.stringify(archetypeFlow)) score += 20;

  const unique = new Set(sectionOrder);
  if (unique.size === sectionOrder.length) score += 10;

  const ctaCount = sectionOrder.filter((s) => s === "cta").length;
  const archetypeCtaCount = archetypeFlow.filter((s) => s === "cta").length;
  if (ctaCount > archetypeCtaCount && archetype !== "high-conversion-service") score -= 20;

  if (archetype === "high-trust-local") {
    const firstServices = sectionOrder.indexOf("services");
    const firstCta = sectionOrder.indexOf("cta");
    if (firstServices >= 0 && firstCta >= 0 && firstServices > firstCta) score -= 10;
  }

  return clamp(score);
}

function scoreRealism(input: EvaluationInput): number {
  let score = 50;
  const { realism } = input;

  if (realism.spacingVariance >= 0.05 && realism.spacingVariance <= 0.15) score += 20;

  if (realism.ctaAsymmetry > 0 && realism.ctaAsymmetry < 0.6) score += 10;

  if (realism.typographyRelaxation > 0.03) score += 10;

  if (realism.ctaAsymmetry > 0.85) score -= 15;

  const vals = [
    realism.spacingVariance,
    realism.typographyRelaxation,
    realism.ctaAsymmetry,
    realism.sectionBreathing,
  ];
  if (vals.every((v) => v === vals[0])) score -= 10;

  return clamp(score);
}

export function evaluateComposition(input: EvaluationInput): CompositionEvaluation {
  const visualClarity = scoreVisualClarity(input);
  const conversionStrength = scoreConversionStrength(input);
  const trustSignalStrength = scoreTrustSignalStrength(input);
  const structuralFlow = scoreStructuralFlow(input);
  const realismScore = scoreRealism(input);

  const totalScore = clamp(
    visualClarity * 0.25 +
      conversionStrength * 0.25 +
      trustSignalStrength * 0.2 +
      structuralFlow * 0.2 +
      realismScore * 0.1
  );

  return {
    visualClarity,
    conversionStrength,
    trustSignalStrength,
    structuralFlow,
    realismScore,
    totalScore,
  };
}
