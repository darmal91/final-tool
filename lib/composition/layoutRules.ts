import type { VariantPlan } from "./variants";
import type { CompositionStrategy } from "./strategy";

export function applyLayoutRules(
  plan: VariantPlan,
  strategy: CompositionStrategy
): VariantPlan {
  let { hero, services, reviews, cta } = plan;
  const { layoutIntent, tone } = strategy;

  // Rule 1: In high-trust, CTA must never be visually dominant over hero.
  // urgency is the most aggressive visual signal; downgrade to strong-offer.
  if (layoutIntent === "high-trust" && cta === "urgency") {
    cta = "strong-offer";
  }

  // Rule 2: In high-conversion, CTA must be the most visually dominant element.
  // soft-contact is the weakest signal; upgrade to strong-offer.
  if (layoutIntent === "high-conversion" && cta === "soft-contact") {
    cta = "strong-offer";
  }

  // Rule 3: Aggressive CTA (urgency) paired with low review emphasis
  // (single-highlight) is an incoherent signal combination — urgency implies
  // trust is already established, but single-highlight undercuts it.
  // Correction priority: CTA first, then reviews, then services.
  if (cta === "urgency" && reviews === "single-highlight") {
    cta = "strong-offer";
    // After CTA correction the combination is resolved; reviews are unchanged.
    // If a future variant introduced a case where strong-offer + single-highlight
    // were still invalid, reviews would be upgraded here (e.g. rev = "grid").
  }

  return { hero, services, reviews, cta };
}
