import type { HeroContent } from "@/lib/types";
import { Eyebrow, Heading, Lead, Button, Badge } from "@/components/sections/shared/primitives";

export default function PremiumSplitHero({
  content,
  heroImageUrl,
}: {
  content: HeroContent;
  heroImageUrl?: string;
}) {
  return (
    <section
      style={{
        background: "var(--ft-surface)",
        color: "var(--ft-text)",
        padding: "var(--ft-section-y) 1.25rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: "var(--ft-block-gap)",
          alignItems: "center",
        }}
        className="ft-premium-split"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--ft-item-gap)" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Heading level={1} size="display">
            {content.headline}
          </Heading>
          <Lead>{content.subheadline}</Lead>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
            <Button href={content.ctaHref} size="lg">
              {content.ctaText}
            </Button>
            <Button href="#services" variant="secondary" size="lg">
              View services →
            </Button>
          </div>
          {content.trustBadges.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginTop: "0.75rem",
              }}
            >
              {content.trustBadges.slice(0, 4).map((b) => (
                <Badge key={b}>{b}</Badge>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            position: "relative",
            aspectRatio: "4 / 5",
            borderRadius: "var(--ft-radius-lg)",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, var(--ft-brand) 0%, var(--ft-surface-inverse) 100%)",
            boxShadow: "0 24px 48px -16px rgba(15, 23, 42, 0.18)",
          }}
        >
          {heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImageUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-start",
                padding: "1.75rem",
                color: "var(--ft-text-inverse)",
                fontSize: "var(--ft-fs-small)",
                opacity: 0.85,
              }}
            >
              Drop a hero image to replace this block.
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 880px) {
          .ft-premium-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
