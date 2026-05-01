import type { BusinessInput, SectionType } from "@/lib/types";
import type { CompositionStrategy } from "./strategy";

export type PageArchetype =
  | "high-trust-local"
  | "high-conversion-service"
  | "premium-authority"
  | "simple-neighborhood";

export interface ArchetypeConfig {
  sectionFlow: SectionType[];
  emphasisOverrides: {
    hero: number;
    services: number;
    reviews: number;
    cta: number;
  };
  layoutBehavior: {
    topFoldDensity: "low" | "medium" | "high";
    scrollPacing: "slow" | "normal" | "fast";
  };
}

export const ARCHETYPE_CONFIGS: Record<PageArchetype, ArchetypeConfig> = {
  "high-trust-local": {
    // Reviews appear early to anchor trust before asking for action
    sectionFlow: ["hero", "services", "reviews", "cta"],
    emphasisOverrides: { hero: 0.9, services: 0.7, reviews: 1.0, cta: 0.8 },
    layoutBehavior: { topFoldDensity: "low", scrollPacing: "slow" },
  },
  "high-conversion-service": {
    // CTA surfaces early and repeats after social proof
    sectionFlow: ["hero", "services", "reviews", "cta"],
    emphasisOverrides: { hero: 1.0, services: 0.8, reviews: 0.6, cta: 1.0 },
    layoutBehavior: { topFoldDensity: "high", scrollPacing: "fast" },
  },
  "premium-authority": {
    // Reviews positioned as authority signal, not social proof
    sectionFlow: ["hero", "services", "reviews", "cta"],
    emphasisOverrides: { hero: 1.0, services: 0.9, reviews: 0.9, cta: 0.7 },
    layoutBehavior: { topFoldDensity: "medium", scrollPacing: "slow" },
  },
  "simple-neighborhood": {
    sectionFlow: ["hero", "services", "reviews", "cta"],
    emphasisOverrides: { hero: 1.0, services: 0.9, reviews: 0.8, cta: 0.8 },
    layoutBehavior: { topFoldDensity: "medium", scrollPacing: "normal" },
  },
};

export function resolveArchetype(
  input: BusinessInput,
  strategy: CompositionStrategy
): PageArchetype {
  if (strategy.tone === "urgent" || input.tone === "aggressive") {
    return "high-conversion-service";
  }

  const { businessType } = input;

  if (
    businessType === "plumber" ||
    businessType === "roofer" ||
    businessType === "hvac" ||
    businessType === "electrician"
  ) {
    return "high-trust-local";
  }

  if (businessType === "dentist" || businessType === "medspa") {
    return "premium-authority";
  }

  return "simple-neighborhood";
}
