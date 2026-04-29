import type { BusinessInput, SiteComposition, Section, SectionType } from "@/lib/types";
import { resolveTheme } from "@/lib/design/tokens";
import { themeFromInput } from "./theme-from-input";
import { pickVariants, type VariantPlan } from "./variants";
import { resolveStrategy } from "./strategy";
import { generateCopy } from "@/lib/content/ai";

interface GeneratedCopy {
  hero: import("@/lib/types").HeroContent;
  services: import("@/lib/types").ServicesContent;
  reviews: import("@/lib/types").ReviewsContent;
  cta: import("@/lib/types").CTAContent;
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

export async function generateComposition(
  businessId: string,
  input: BusinessInput
): Promise<{ composition: SiteComposition; source: "ai" | "template"; error?: string }> {
  const tokens = themeFromInput(input);
  const theme = resolveTheme(tokens);
  const strategy = resolveStrategy(input);
  const variants = pickVariants(input, strategy);
  const { copy, source, error } = await generateCopy(input, strategy);

  const counts: Record<SectionType, number> = { hero: 0, services: 0, reviews: 0, cta: 0 };
  const sections: Section[] = strategy.sectionOrder.map((type) => {
    counts[type] += 1;
    const id = counts[type] === 1 ? type : `${type}-${counts[type]}`;
    return buildSection(type, id, variants, copy);
  });

  return {
    composition: { businessId, theme, sections },
    source,
    error,
  };
}
