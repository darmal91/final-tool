import type {
  BusinessInput,
  HeroVariant,
  ServicesVariant,
  ReviewsVariant,
  CTAVariant,
} from "@/lib/types";
import type { CompositionStrategy } from "./strategy";

export interface VariantPlan {
  hero: HeroVariant;
  services: ServicesVariant;
  reviews: ReviewsVariant;
  cta: CTAVariant;
}

export function pickVariants(
  input: BusinessInput,
  strategy?: CompositionStrategy
): VariantPlan {
  const { tone, businessType, services } = input;

  let hero: HeroVariant;
  let svc: ServicesVariant;
  let rev: ReviewsVariant;
  let cta: CTAVariant;

  if (tone === "premium") {
    hero = "premium-split";
    svc = "icon-list";
    rev = "single-highlight";
    cta = "soft-contact";
  } else if (tone === "aggressive") {
    hero = "conversion";
    svc = "card-grid";
    rev = "scrolling";
    cta = "urgency";
  } else {
    hero = "centered-trust";
    svc = "card-grid";
    rev = "grid";
    cta = "strong-offer";
  }

  // Step-based services fits processes (roofing, hvac install, medspa journey).
  if (services.length >= 4 && (businessType === "roofer" || businessType === "hvac" || businessType === "medspa")) {
    svc = "step-based";
  }

  if (strategy) {
    if (strategy.tone === "premium") {
      hero = "premium-split";
      if (svc === "card-grid") svc = "icon-list";
    } else if (strategy.tone === "trust") {
      if (hero !== "premium-split") hero = "centered-trust";
    } else if (strategy.tone === "urgent") {
      hero = "conversion";
      cta = "urgency";
    }

    if (strategy.emphasis.reviews === "high") {
      rev = services.length >= 4 ? "scrolling" : "grid";
    } else if (strategy.emphasis.reviews === "low") {
      rev = "single-highlight";
    }

    if (strategy.emphasis.services === "high" && svc !== "step-based") {
      svc = "card-grid";
    } else if (strategy.emphasis.services === "low" && svc !== "step-based") {
      svc = "icon-list";
    }

    if (strategy.emphasis.cta === "aggressive") {
      cta = strategy.tone === "urgent" ? "urgency" : "strong-offer";
    } else if (strategy.emphasis.cta === "soft") {
      cta = "soft-contact";
    }
  }

  return { hero, services: svc, reviews: rev, cta };
}
