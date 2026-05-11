import * as React from "react";
import type { BusinessAsset, BusinessInput, CTASection, HeroContent, Section, SiteComposition } from "@/lib/types";
import { getSectionComponent } from "@/components/sections/registry";
import { cssVarsToInline } from "@/lib/design/tokens";
import SiteNav from "@/components/nav/SiteNav";
import SiteFooter from "@/components/sections/footer/SiteFooter";

function pickHeroImage(assets: BusinessAsset[] | undefined): string | undefined {
  return assets?.find((a) => a.context === "hero")?.url;
}

function RenderSection({ section, assets }: { section: Section; assets?: BusinessAsset[] }) {
  const Comp = getSectionComponent(section);
  const contentImageUrl = section.type === "hero" ? (section.content as HeroContent).imageUrl : undefined;
  const heroImageUrl = contentImageUrl ?? (section.type === "hero" ? pickHeroImage(assets) : undefined);
  return <Comp content={section.content as unknown} heroImageUrl={heroImageUrl} />;
}

export default function RenderCompositionStatic({
  composition,
  assets,
  input,
}: {
  composition: SiteComposition;
  assets?: BusinessAsset[];
  input?: BusinessInput;
}) {
  const lastCta = [...composition.sections].reverse().find((s): s is CTASection => s.type === "cta");
  const ctaVariant = lastCta?.variant;

  return (
    <main
      style={{
        ...cssVarsToInline(composition.theme),
        fontFamily: "var(--ft-font)",
        color: "var(--ft-text)",
        background: "var(--ft-surface)",
      }}
    >
      {input && <SiteNav input={input} assets={assets} />}
      {composition.sections.map((s) => (
        <RenderSection key={s.id} section={s} assets={assets} />
      ))}
      {input && <SiteFooter input={input} assets={assets} ctaVariant={ctaVariant} />}
    </main>
  );
}
