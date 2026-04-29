import * as React from "react";
import type { Section, SiteComposition, BusinessAsset } from "@/lib/types";
import { getSectionComponent } from "@/components/sections/registry";
import { ThemeProvider } from "@/components/design/ThemeProvider";

function pickHeroImage(assets: BusinessAsset[] | undefined): string | undefined {
  return assets?.find((a) => a.context === "hero")?.url;
}

function RenderSection({
  section,
  assets,
}: {
  section: Section;
  assets?: BusinessAsset[];
}) {
  const Comp = getSectionComponent(section);
  const heroImageUrl = section.type === "hero" ? pickHeroImage(assets) : undefined;
  return <Comp content={section.content as unknown} heroImageUrl={heroImageUrl} />;
}

export default function RenderComposition({
  composition,
  assets,
  asTag = "main",
}: {
  composition: SiteComposition;
  assets?: BusinessAsset[];
  asTag?: "div" | "main" | "section";
}) {
  return (
    <ThemeProvider tokens={composition.theme.tokens} asTag={asTag}>
      {composition.sections.map((s) => (
        <RenderSection key={s.id} section={s} assets={assets} />
      ))}
    </ThemeProvider>
  );
}
