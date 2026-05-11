import * as React from "react";
import type { BusinessAsset, BusinessInput, CTASection, HeroContent, Section, SiteComposition } from "@/lib/types";
import { getSectionComponent } from "@/components/sections/registry";
import { cssVarsToInline } from "@/lib/design/tokens";
import SiteFooter from "@/components/sections/footer/SiteFooter";

function pickHeroImage(assets: BusinessAsset[] | undefined): string | undefined {
  return assets?.find((a) => a.context === "hero")?.url;
}

function pickLogoImage(assets: BusinessAsset[] | undefined): string | undefined {
  return assets?.find((a) => a.context === "logo")?.url;
}

function RenderSection({ section, assets }: { section: Section; assets?: BusinessAsset[] }) {
  const Comp = getSectionComponent(section);
  const contentImageUrl = section.type === "hero" ? (section.content as HeroContent).imageUrl : undefined;
  const heroImageUrl = contentImageUrl ?? (section.type === "hero" ? pickHeroImage(assets) : undefined);
  return <Comp content={section.content as unknown} heroImageUrl={heroImageUrl} />;
}

function ExportNav({ input, assets }: { input: BusinessInput; assets?: BusinessAsset[] }) {
  const logoUrl = pickLogoImage(assets);
  const phone = input.phone;
  const formattedPhone = phone ? phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") : null;
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--ft-surface)",
        borderBottom: "1px solid transparent",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.25rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        <a href="#" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", flexShrink: 0 }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={input.businessName} style={{ height: "36px", width: "auto", objectFit: "contain" }} />
          ) : (
            <>
              <div aria-hidden="true" style={{ width: "32px", height: "32px", borderRadius: "var(--ft-radius-md)", background: "var(--ft-brand)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ft-on-brand)", fontWeight: 800, fontSize: "0.9375rem", flexShrink: 0 }}>
                {input.businessName.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--ft-text)", letterSpacing: "-0.02em" }}>
                {input.businessName}
              </span>
            </>
          )}
        </a>
        <div className="ft-nav-links" style={{ display: "flex", alignItems: "center", gap: "2rem", flex: 1, justifyContent: "center" }}>
          <a href="#services" style={{ display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 0.25rem", fontSize: "0.9375rem", fontWeight: 500, color: "var(--ft-text-muted)", textDecoration: "none", letterSpacing: "-0.01em" }}>Services</a>
          <a href="#reviews" style={{ display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 0.25rem", fontSize: "0.9375rem", fontWeight: 500, color: "var(--ft-text-muted)", textDecoration: "none", letterSpacing: "-0.01em" }}>Reviews</a>
          <a href="#contact" style={{ display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 0.25rem", fontSize: "0.9375rem", fontWeight: 500, color: "var(--ft-text-muted)", textDecoration: "none", letterSpacing: "-0.01em" }}>Contact</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
          {formattedPhone && (
            <a
              href={`tel:${phone}`}
              className="ft-nav-phone"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5625rem 1.125rem", background: "var(--ft-brand)", color: "var(--ft-on-brand)", borderRadius: "var(--ft-radius-md)", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              {formattedPhone}
            </a>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 720px) {
          .ft-nav-links { display: none !important; }
          .ft-nav-phone { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

export default function RenderCompositionExport({
  composition,
  assets,
  input,
}: {
  composition: SiteComposition;
  assets?: BusinessAsset[];
  input: BusinessInput;
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
      <ExportNav input={input} assets={assets} />
      {composition.sections.map((s) => (
        <RenderSection key={s.id} section={s} assets={assets} />
      ))}
      <SiteFooter input={input} assets={assets} ctaVariant={ctaVariant} />
    </main>
  );
}
