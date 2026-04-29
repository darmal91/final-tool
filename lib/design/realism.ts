import type { BusinessInput } from "@/lib/types";
import type { CompositionStrategy } from "@/lib/composition/strategy";
import type { PageArchetype } from "@/lib/composition/archetypes";

export interface RealismConfig {
  spacingVariance: number;       // 0–0.2  (0 = uniform, 0.2 = noticeable)
  typographyRelaxation: number;  // 0–0.15
  ctaAsymmetry: number;          // 0–1    (visual dominance / off-center pull)
  sectionBreathing: number;      // 0–0.25
}

const ARCHETYPE_REALISM: Record<PageArchetype, RealismConfig> = {
  // Calm authority: organic spacing, unhurried feel
  "high-trust-local": {
    spacingVariance: 0.05,
    typographyRelaxation: 0.05,
    ctaAsymmetry: 0.2,
    sectionBreathing: 0.2,
  },
  // Tight flow: maximum CTA pull, compressed breathing
  "high-conversion-service": {
    spacingVariance: 0.15,
    typographyRelaxation: 0.1,
    ctaAsymmetry: 0.8,
    sectionBreathing: 0.1,
  },
  // Controlled refinement: minimal distortion, generous air
  "premium-authority": {
    spacingVariance: 0.08,
    typographyRelaxation: 0.03,
    ctaAsymmetry: 0.15,
    sectionBreathing: 0.25,
  },
  // Natural imperfection: human-made rather than system-generated
  "simple-neighborhood": {
    spacingVariance: 0.1,
    typographyRelaxation: 0.08,
    ctaAsymmetry: 0.4,
    sectionBreathing: 0.15,
  },
};

export function resolveRealismConfig(
  _input: BusinessInput,
  _strategy: CompositionStrategy,
  archetype: PageArchetype
): RealismConfig {
  return ARCHETYPE_REALISM[archetype];
}
