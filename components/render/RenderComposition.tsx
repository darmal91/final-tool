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

export type CompositionEditHandler = (sectionId: string, fieldPath: string, value: string) => void;
export type CompositionImageUploadHandler = (sectionId: string, dataUrl: string) => void;

function RenderSection({
  section,
  assets,
  onImageUpload,
}: {
  section: Section;
  assets?: BusinessAsset[];
  onImageUpload?: CompositionImageUploadHandler;
}) {
  const Comp = getSectionComponent(section);
  const contentImageUrl = section.type === "hero" ? (section.content as HeroContent).imageUrl : undefined;
  const heroImageUrl = contentImageUrl ?? (section.type === "hero" ? pickHeroImage(assets) : undefined);
  const boundUpload = onImageUpload && section.type === "hero"
    ? (dataUrl: string) => onImageUpload(section.id, dataUrl)
    : undefined;
  return <Comp content={section.content as unknown} heroImageUrl={heroImageUrl} onImageUpload={boundUpload} />;
}

export default function RenderComposition({
  composition,
  assets,
  asTag = "main",
  input,
  onEdit,
  onImageUpload,
}: {
  composition: SiteComposition;
  assets?: BusinessAsset[];
  asTag?: "div" | "main" | "section";
  input?: import("@/lib/types").BusinessInput;
  onEdit?: CompositionEditHandler;
  onImageUpload?: CompositionImageUploadHandler;
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
          <RenderSection section={s} assets={assets} onImageUpload={onImageUpload} />
        </EditableSectionProvider>
      ))}
{input && <SiteFooter input={input} assets={assets} ctaVariant={ctaVariant} />}
    </ThemeProvider>
  );
}