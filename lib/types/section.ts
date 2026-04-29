import type {
  HeroContent,
  ServicesContent,
  ReviewsContent,
  CTAContent,
} from "./content";
import type { ResolvedTheme } from "./design";

export type HeroVariant = "premium-split" | "centered-trust" | "conversion";
export type ServicesVariant = "card-grid" | "icon-list" | "step-based";
export type ReviewsVariant = "scrolling" | "grid" | "single-highlight";
export type CTAVariant = "strong-offer" | "soft-contact" | "urgency";

export type SectionType = "hero" | "services" | "reviews" | "cta";

export interface HeroSection {
  id: string;
  type: "hero";
  variant: HeroVariant;
  content: HeroContent;
}
export interface ServicesSection {
  id: string;
  type: "services";
  variant: ServicesVariant;
  content: ServicesContent;
}
export interface ReviewsSection {
  id: string;
  type: "reviews";
  variant: ReviewsVariant;
  content: ReviewsContent;
}
export interface CTASection {
  id: string;
  type: "cta";
  variant: CTAVariant;
  content: CTAContent;
}

export type Section = HeroSection | ServicesSection | ReviewsSection | CTASection;

export const VARIANTS_BY_TYPE: {
  hero: HeroVariant[];
  services: ServicesVariant[];
  reviews: ReviewsVariant[];
  cta: CTAVariant[];
} = {
  hero: ["premium-split", "centered-trust", "conversion"],
  services: ["card-grid", "icon-list", "step-based"],
  reviews: ["scrolling", "grid", "single-highlight"],
  cta: ["strong-offer", "soft-contact", "urgency"],
};

export const VARIANT_LABELS: Record<string, string> = {
  "premium-split": "Premium split",
  "centered-trust": "Centered trust",
  conversion: "Conversion",
  "card-grid": "Card grid",
  "icon-list": "Icon list",
  "step-based": "Step-based",
  scrolling: "Scrolling",
  grid: "Grid",
  "single-highlight": "Single highlight",
  "strong-offer": "Strong offer",
  "soft-contact": "Soft contact",
  urgency: "Urgency",
};

export interface SiteComposition {
  businessId: string;
  theme: ResolvedTheme;
  sections: Section[];
}
