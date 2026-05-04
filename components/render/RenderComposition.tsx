import * as React from "react";
import type { Section, SiteComposition, BusinessAsset, CTASection } from "@/lib/types";
import { getSectionComponent } from "@/components/sections/registry";
import { ThemeProvider } from "@/components/design/ThemeProvider";
import SiteNav from "@/components/nav/SiteNav";
import SiteFooter from "@/components/sections/footer/SiteFooter";
import ContactForm from "@/components/sections/contact/ContactForm";

function pickHeroImage(assets: BusinessAsset[] | undefined): string | undefined {
  return assets?.find((a) => a.context === "hero")?.url;
}

function RenderSection({ section, assets }: { section: Section; assets?: BusinessAsset[] }) {
  const Comp = getSectionComponent(section);
  const heroImageUrl = section.type === "hero" ? pickHeroImage(assets) : undefined;
  return <Comp content={section.content as unknown} heroImageUrl={heroImageUrl} />;
}

export default function RenderComposition({
  composition,
  assets,
  asTag = "main",
  input,
}: {
  composition: SiteComposition;
  assets?: BusinessAsset[];
  asTag?: "div" | "main" | "section";
  input?: import("@/lib/types").BusinessInput;
}) {
  const lastCta = [...composition.sections]
    .reverse()
    .find((s): s is CTASection => s.type === "cta");
  const ctaVariant = lastCta?.variant;

  return (
    <ThemeProvider tokens={composition.theme.tokens} asTag={asTag}>
      {input && <SiteNav input={input} assets={assets} />}
      {composition.sections.map((s) => (
        <RenderSection key={s.id} section={s} assets={assets} />
      ))}
      {input && <ContactForm input={input} />}
      {input && <SiteFooter input={input} assets={assets} ctaVariant={ctaVariant} />}
    </ThemeProvider>
  );
}