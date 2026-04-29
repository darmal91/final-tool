import type { BusinessInput, SiteComposition, Section, SectionType } from "@/lib/types";
import { resolveTheme } from "@/lib/design/tokens";
import { themeFromInput } from "./theme-from-input";
import { pickVariants } from "./variants";
import { resolveStrategy } from "./strategy";
import { generateCopy } from "@/lib/content/ai";

export async function generateComposition(
  businessId: string,
  input: BusinessInput
): Promise<{ composition: SiteComposition; source: "ai" | "template"; error?: string }> {
  const tokens = themeFromInput(input);
  const theme = resolveTheme(tokens);
  const strategy = resolveStrategy(input);
  const variants = pickVariants(input, strategy);
  const { copy, source, error } = await generateCopy(input, strategy);

  const sectionsByType: Record<SectionType, Section> = {
    hero: { id: "hero", type: "hero", variant: variants.hero, content: copy.hero },
    services: { id: "services", type: "services", variant: variants.services, content: copy.services },
    reviews: { id: "reviews", type: "reviews", variant: variants.reviews, content: copy.reviews },
    cta: { id: "cta", type: "cta", variant: variants.cta, content: copy.cta },
  };

  const sections: Section[] = strategy.sectionOrder.map((t) => sectionsByType[t]);

  return {
    composition: { businessId, theme, sections },
    source,
    error,
  };
}
