import type { HeroContent } from "@/lib/types";
import { Eyebrow, Heading, Lead, Button, Badge } from "@/components/sections/shared/primitives";

export default function CenteredTrustHero({ content }: { content: HeroContent }) {
  return (
    <section
      style={{
        background: "var(--ft-surface-muted)",
        color: "var(--ft-text)",
        padding: "var(--ft-section-y) 1.25rem",
      }}
    >
      <div
        style={{
          maxWidth: "880px",
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--ft-item-gap)",
        }}
      >
        {content.trustBadges.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {content.trustBadges.slice(0, 5).map((b) => (
              <Badge key={b}>{b}</Badge>
            ))}
          </div>
        )}
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading level={1} size="display" align="center">
          {content.headline}
        </Heading>
        <Lead align="center">{content.subheadline}</Lead>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Button href={content.ctaHref} size="lg">
            {content.ctaText}
          </Button>
        </div>
      </div>
    </section>
  );
}
