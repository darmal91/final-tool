import type { BusinessInput } from "@/lib/types";
import type { CompositionStrategy } from "@/lib/composition/strategy";

export interface HierarchyTokens {
  heroScale: number;
  sectionSpacing: "compact" | "balanced" | "airy";
  headingScale: number;
  bodyScale: number;
  ctaScale: number;
  density: "low" | "medium" | "high";
}

export function resolveHierarchyTokens(
  _input: BusinessInput,
  strategy: CompositionStrategy
): HierarchyTokens {
  const { layoutIntent } = strategy;

  if (layoutIntent === "high-trust") {
    return {
      heroScale: 1.15,
      sectionSpacing: "airy",
      headingScale: 1.1,
      bodyScale: 1.0,
      ctaScale: 1.05,
      density: "low",
    };
  }

  if (layoutIntent === "high-conversion") {
    return {
      heroScale: 1.25,
      sectionSpacing: "compact",
      headingScale: 1.2,
      bodyScale: 0.95,
      ctaScale: 1.2,
      density: "high",
    };
  }

  return {
    heroScale: 1.0,
    sectionSpacing: "balanced",
    headingScale: 1.0,
    bodyScale: 1.0,
    ctaScale: 1.0,
    density: "medium",
  };
}
