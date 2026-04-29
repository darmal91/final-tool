import type {
  BusinessInput,
  Section,
  SiteComposition,
} from "@/lib/types";
import { resolveTheme } from "@/lib/design/tokens";
import { themeFromInput } from "./theme-from-input";
import { pickVariants } from "./variants";
import {
  buildHeroContent,
  buildServicesContent,
  buildReviewsContent,
  buildCTAContent,
} from "./templates";

export function composeSite(
  businessId: string,
  input: BusinessInput
): SiteComposition {
  const tokens = themeFromInput(input);
  const theme = resolveTheme(tokens);
  const variants = pickVariants(input);

  const sections: Section[] = [
    {
      id: "hero",
      type: "hero",
      variant: variants.hero,
      content: buildHeroContent(input),
    },
    {
      id: "services",
      type: "services",
      variant: variants.services,
      content: buildServicesContent(input),
    },
    {
      id: "reviews",
      type: "reviews",
      variant: variants.reviews,
      content: buildReviewsContent(input),
    },
    {
      id: "cta",
      type: "cta",
      variant: variants.cta,
      content: buildCTAContent(input),
    },
  ];

  return { businessId, theme, sections };
}
