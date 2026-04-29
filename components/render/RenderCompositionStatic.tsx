import * as React from "react";
import type { BusinessAsset, Section, SiteComposition } from "@/lib/types";
import { getSectionComponent } from "@/components/sections/registry";
import { cssVarsToInline } from "@/lib/design/tokens";

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

export default function RenderCompositionStatic({
  composition,
  assets,
}: {
  composition: SiteComposition;
  assets?: BusinessAsset[];
}) {
  return (
    <main
      style={{
        ...cssVarsToInline(composition.theme),
        fontFamily: "var(--ft-font)",
        color: "var(--ft-text)",
        background: "var(--ft-surface)",
      }}
    >
      {composition.sections.map((s) => (
        <RenderSection key={s.id} section={s} assets={assets} />
      ))}
    </main>
  );
}
