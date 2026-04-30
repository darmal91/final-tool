import type { BusinessInput, SiteComposition, Section, SectionType } from "@/lib/types";
import { resolveTheme } from "@/lib/design/tokens";
import { resolveHierarchyTokens } from "@/lib/design/hierarchyTokens";
import { resolveRealismConfig } from "@/lib/design/realism";
import { themeFromInput } from "./theme-from-input";
import { pickVariants, type VariantPlan } from "./variants";
import { resolveStrategy, type CompositionStrategy } from "./strategy";
import { generateCopy } from "@/lib/content/ai";
import { refineCopy } from "@/lib/content/refine";
import { scoreVariantPlan } from "./scoring";
import { applyLayoutRules } from "./layoutRules";
import { REAL_WORLD_PATTERNS } from "./realWorldPatterns";
import { resolveArchetype, ARCHETYPE_CONFIGS } from "./archetypes";
import { evaluateComposition } from "./evaluation";
import { appendDecisionLog, type DecisionLogEntry } from "@/lib/logging/decisionLog";

interface GeneratedCopy {
  hero: import("@/lib/types").HeroContent;
  services: import("@/lib/types").ServicesContent;
  reviews: import("@/lib/types").ReviewsContent;
  cta: import("@/lib/types").CTAContent;
}

interface CandidateRecord {
  name: string;
  variantPlan: VariantPlan;
  scores: {
    trustScore: number;
    conversionScore: number;
    aestheticScore: number;
    totalScore: number;
  };
}

interface SelectionResult {
  best: VariantPlan;
  bestName: string;
  candidates: CandidateRecord[];
}

function inferSelectionMethod(
  candidates: CandidateRecord[]
): "rule-based" | "scored" | "fallback" {
  if (candidates.length === 1 && candidates[0].scores.totalScore === 0) return "fallback";
  if (candidates.length > 1) return "scored";
  return "rule-based";
}

function resolvePageFlow(
  baseFlow: SectionType[],
  strategy: CompositionStrategy
): SectionType[] {
  // layoutIntent override: high-conversion requires CTA before reviews.
  // If the archetype places CTA only after reviews, move it to just before reviews.
  if (strategy.layoutIntent === "high-conversion") {
    const reviewsIdx = baseFlow.indexOf("reviews");
    const firstCtaIdx = baseFlow.indexOf("cta");
    if (reviewsIdx >= 0 && firstCtaIdx > reviewsIdx) {
      const adjusted: SectionType[] = baseFlow.filter((s) => s !== "cta");
      const newReviewsIdx = adjusted.indexOf("reviews");
      adjusted.splice(newReviewsIdx, 0, "cta");
      return adjusted;
    }
  }
  return baseFlow;
}

function buildSection(
  type: SectionType,
  id: string,
  variants: VariantPlan,
  copy: GeneratedCopy
): Section {
  switch (type) {
    case "hero":
      return { id, type: "hero", variant: variants.hero, content: copy.hero };
    case "services":
      return { id, type: "services", variant: variants.services, content: copy.services };
    case "reviews":
      return { id, type: "reviews", variant: variants.reviews, content: copy.reviews };
    case "cta":
      return { id, type: "cta", variant: variants.cta, content: copy.cta };
  }
}

function selectBestVariant(
  input: BusinessInput,
  strategy: CompositionStrategy
): SelectionResult {
  const base = pickVariants(input, strategy);

  try {
    const trustEmphasis: CompositionStrategy = {
      ...strategy,
      weights: {
        ...strategy.weights,
        reviews: Math.min(1, strategy.weights.reviews + 0.2),
        cta: Math.max(0, strategy.weights.cta - 0.15),
      },
    };

    const conversionEmphasis: CompositionStrategy = {
      ...strategy,
      weights: {
        ...strategy.weights,
        cta: Math.min(1, strategy.weights.cta + 0.2),
        reviews: Math.max(0, strategy.weights.reviews - 0.15),
      },
    };

    const named: Array<{ name: string; plan: VariantPlan }> = [
      { name: "base", plan: base },
      { name: "trust-emphasis", plan: pickVariants(input, trustEmphasis) },
      { name: "conversion-emphasis", plan: pickVariants(input, conversionEmphasis) },
    ];

    const candidates: CandidateRecord[] = named.map(({ name, plan }) => ({
      name,
      variantPlan: plan,
      scores: scoreVariantPlan(plan, input, strategy),
    }));

    let bestIdx = 0;
    for (let i = 1; i < candidates.length; i++) {
      if (candidates[i].scores.totalScore > candidates[bestIdx].scores.totalScore) {
        bestIdx = i;
      }
    }

    return {
      best: candidates[bestIdx].variantPlan,
      bestName: candidates[bestIdx].name,
      candidates,
    };
  } catch {
    return {
      best: base,
      bestName: "base",
      candidates: [
        {
          name: "base",
          variantPlan: base,
          scores: { trustScore: 0, conversionScore: 0, aestheticScore: 0, totalScore: 0 },
        },
      ],
    };
  }
}

export async function generateComposition(
  businessId: string,
  input: BusinessInput
): Promise<{ composition: SiteComposition; source: "ai" | "template"; error?: string }> {
  const tokens = themeFromInput(input);
  const strategy = resolveStrategy(input);
  const archetype = resolveArchetype(input, strategy);
  const hierarchy = resolveHierarchyTokens(input, strategy);
  const realism = resolveRealismConfig(input, strategy, archetype);
  const theme = resolveTheme(tokens, hierarchy, realism);
  const { best, bestName, candidates } = selectBestVariant(input, strategy);
  const variants = applyLayoutRules(best, strategy);
  const pattern = REAL_WORLD_PATTERNS[input.businessType];
  const { copy: rawCopy, source, error } = await generateCopy(input, strategy, pattern);
  const { copy } = source === "ai" ? await refineCopy(rawCopy, input, strategy) : { copy: rawCopy };
  const pageFlow = resolvePageFlow(ARCHETYPE_CONFIGS[archetype].sectionFlow, strategy);

  const counts: Record<SectionType, number> = { hero: 0, services: 0, reviews: 0, cta: 0 };
  const sections: Section[] = pageFlow.map((type) => {
    counts[type] += 1;
    const id = counts[type] === 1 ? type : `${type}-${counts[type]}`;
    return buildSection(type, id, variants, copy);
  });

  try {
    const evaluation = evaluateComposition({
      archetype,
      strategy,
      realism,
      variantPlan: variants,
      sectionOrder: pageFlow,
    });
    void appendDecisionLog({
      timestamp: Date.now(),
      businessId,
      input,
      archetype,
      strategy,
      realism,
      variants,
      pageFlow,
      evaluation,
      selectionMeta: {
        selectionMethod: inferSelectionMethod(candidates),
        candidateCount: candidates.length,
      },
    });
  } catch {
    // logging errors must never surface
  }

  return {
    composition: { businessId, theme, sections },
    source,
    error,
  };
}
