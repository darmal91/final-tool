import * as React from "react";
import type { Section, SiteComposition, BusinessAsset, CTASection, HeroContent } from "@/lib/types";
import { getSectionComponent } from "@/components/sections/registry";
import { ThemeProvider } from "@/components/design/ThemeProvider";
import SiteNav from "@/components/nav/SiteNav";
import SiteFooter from "@/components/sections/footer/SiteFooter";
import { EditableSectionProvider } from "@/components/render/Editable";

function pickHeroImage(assets: BusinessAsset[] | undefined): string | undefined {
  return assets?.find((a) => a.context === "hero")?.url;
}

function RenderSection({ section, assets }: { section: Section; assets?: BusinessAsset[] }) {
  const Comp = getSectionComponent(section);
  const heroImageUrl = section.type === "hero" ? pickHeroImage(assets) : undefined;
  return <Comp content={section.content as unknown} heroImageUrl={heroImageUrl} />;
}

export type CompositionEditHandler = (
  sectionId: string,
  fieldPath: string,
  value: string
) => void;

export default function RenderComposition({
  composition,
  assets,
  asTag = "main",
  input,
  onEdit,
}: {
  composition: SiteComposition;
  assets?: BusinessAsset[];
  asTag?: "div" | "main" | "section";
  input?: import("@/lib/types").BusinessInput;
  onEdit?: CompositionEditHandler;
}) {
  const lastCta = [...composition.sections]
    .reverse()
    .find((s): s is CTASection => s.type === "cta");
  const ctaVariant = lastCta?.variant;

  const heroSection = composition.sections.find((s) => s.type === "hero");
  const heroSubheadline = heroSection
    ? (heroSection.content as HeroContent).subheadline
    : "";

  const jsonLd = input
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: input.businessName,
        ...(input.phone ? { telephone: input.phone } : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: input.location,
        },
        description: heroSubheadline || `${input.businessName} — ${input.businessType} in ${input.location}.`,
      })
    : null;

  return (
    <ThemeProvider tokens={composition.theme.tokens} asTag={asTag}>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      {input && <SiteNav input={input} assets={assets} />}
      {composition.sections.map((s) => (
        <EditableSectionProvider key={s.id} sectionId={s.id} onEdit={onEdit}>
          <RenderSection section={s} assets={assets} />
        </EditableSectionProvider>
      ))}
{input && <SiteFooter input={input} assets={assets} ctaVariant={ctaVariant} />}
    </ThemeProvider>
  );
}