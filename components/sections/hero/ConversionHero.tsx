import type { HeroContent } from "@/lib/types";
import { Heading, Lead, Button } from "@/components/sections/shared/primitives";

export default function ConversionHero({ content }: { content: HeroContent }) {
  return (
    <section
      style={{
        background: "var(--ft-brand)",
        color: "var(--ft-on-brand)",
        padding: "calc(var(--ft-hero-scale, 1) * var(--ft-section-spacing, var(--ft-section-y))) 1.25rem",
      }}
    >
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr auto",
          gap: "var(--ft-block-gap)",
          alignItems: "center",
        }}
        className="ft-conversion-hero"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--ft-item-gap)" }}>
          <div
            style={{
              fontSize: "var(--ft-fs-eyebrow)",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontWeight: 700,
              opacity: 0.85,
            }}
          >
            {content.eyebrow}
          </div>
          <Heading level={1} size="display" inverse>
            {content.headline}
          </Heading>
          <Lead inverse>{content.subheadline}</Lead>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "stretch",
          }}
        >
          <a
            href={content.ctaHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "calc(var(--ft-cta-scale, 1) * 1.25rem) calc(var(--ft-cta-scale, 1) * 2rem)",
              fontSize: "calc(var(--ft-cta-scale, 1) * 1.125rem)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              background: "var(--ft-on-brand)",
              color: "var(--ft-brand)",
              border: "none",
              borderRadius: "var(--ft-radius-md)",
              textDecoration: "none",
              boxShadow: "0 10px 24px -8px rgba(0,0,0,0.35)",
              whiteSpace: "nowrap",
            }}
          >
            {content.ctaText}
          </a>
          {content.trustBadges[0] && (
            <div
              style={{
                fontSize: "var(--ft-fs-small)",
                opacity: 0.85,
                textAlign: "center",
              }}
            >
              {content.trustBadges[0]}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 760px) {
          .ft-conversion-hero { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
