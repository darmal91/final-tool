import type { ComponentType } from "react";
import type {
  Section,
  HeroVariant,
  ServicesVariant,
  ReviewsVariant,
  CTAVariant,
} from "@/lib/types";

import PremiumSplitHero from "./hero/PremiumSplitHero";
import CenteredTrustHero from "./hero/CenteredTrustHero";
import ConversionHero from "./hero/ConversionHero";

import CardGridServices from "./services/CardGridServices";
import IconListServices from "./services/IconListServices";
import StepBasedServices from "./services/StepBasedServices";

import ScrollingReviews from "./reviews/ScrollingReviews";
import GridReviews from "./reviews/GridReviews";
import SingleHighlightReview from "./reviews/SingleHighlightReview";

import StrongOfferCTA from "./cta/StrongOfferCTA";
import SoftContactCTA from "./cta/SoftContactCTA";
import UrgencyCTA from "./cta/UrgencyCTA";

type AnyComp = ComponentType<{ content: unknown; heroImageUrl?: string; onImageUpload?: (dataUrl: string) => void }>;

export const SECTION_REGISTRY: {
  hero: Record<HeroVariant, AnyComp>;
  services: Record<ServicesVariant, AnyComp>;
  reviews: Record<ReviewsVariant, AnyComp>;
  cta: Record<CTAVariant, AnyComp>;
} = {
  hero: {
    "premium-split": PremiumSplitHero as AnyComp,
    "centered-trust": CenteredTrustHero as AnyComp,
    conversion: ConversionHero as AnyComp,
  },
  services: {
    "card-grid": CardGridServices as AnyComp,
    "icon-list": IconListServices as AnyComp,
    "step-based": StepBasedServices as AnyComp,
  },
  reviews: {
    scrolling: ScrollingReviews as AnyComp,
    grid: GridReviews as AnyComp,
    "single-highlight": SingleHighlightReview as AnyComp,
  },
  cta: {
    "strong-offer": StrongOfferCTA as AnyComp,
    "soft-contact": SoftContactCTA as AnyComp,
    urgency: UrgencyCTA as AnyComp,
  },
};

export function getSectionComponent(section: Section): AnyComp {
  switch (section.type) {
    case "hero":
      return SECTION_REGISTRY.hero[section.variant];
    case "services":
      return SECTION_REGISTRY.services[section.variant];
    case "reviews":
      return SECTION_REGISTRY.reviews[section.variant];
    case "cta":
      return SECTION_REGISTRY.cta[section.variant];
  }
}
