import type { CTAContent } from "@/lib/types";
import { Heading, Lead, Button } from "@/components/sections/shared/primitives";

export default function UrgencyCTA({ content }: { content: CTAContent }) {
  return (
    <section
      id="contact"
      style={{
        background: "var(--ft-surface-inverse)",
        color: "var(--ft-text-inverse)",
        padding: "var(--ft-section-spacing, var(--ft-section-y)) 1.25rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--ft-accent) 20%, transparent), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          maxWidth: "1080px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "var(--ft-item-gap)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.4rem 0.75rem",
            background: "rgba(255,255,255,0.15)",
            color: "white",
            borderRadius: "var(--ft-radius-pill)",
            fontSize: "var(--ft-fs-small)",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {content.eyebrow || "Limited time"}
        </span>
        <Heading level={2} size="h1" inverse>
          {content.heading}
        </Heading>
        <Lead inverse>{content.subheading}</Lead>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <Button href={content.buttonHref} size="lg">
            {content.buttonText}
          </Button>
          {content.microcopy && (
            <span style={{ fontSize: "var(--ft-fs-small)", opacity: 0.8 }}>{content.microcopy.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}</span>
          )}
        </div>
      </div>
    </section>
  );
}
