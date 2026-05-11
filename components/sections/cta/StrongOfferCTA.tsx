import type { CTAContent } from "@/lib/types";
import { Heading, Lead } from "@/components/sections/shared/primitives";
import { EditableText } from "@/components/render/Editable";

export default function StrongOfferCTA({ content }: { content: CTAContent }) {
  return (
    <section
      id="contact"
      style={{
        background: "var(--ft-brand)",
        color: "var(--ft-on-brand)",
        padding: "var(--ft-section-spacing, var(--ft-section-y)) 1.25rem",
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
        {content.eyebrow && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.3rem 0.75rem",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              borderRadius: "var(--ft-radius-pill)",
              fontSize: "var(--ft-fs-eyebrow)",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontWeight: 700,
            }}
          >
            {content.eyebrow}
          </div>
        )}
        <Heading level={2} size="h1" align="center" inverse>
          <EditableText fieldPath="heading">{content.heading}</EditableText>
        </Heading>
        <Lead align="center" inverse>
          <EditableText fieldPath="subheading" multiline>{content.subheading}</EditableText>
        </Lead>
        <a
          href={content.buttonHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "calc(var(--ft-cta-scale, 1) * 1.125rem) calc(var(--ft-cta-scale, 1) * 2.25rem)",
            fontSize: "calc(var(--ft-cta-scale, 1) * 1.125rem)",
            fontWeight: 700,
            background: "var(--ft-on-brand)",
            color: "var(--ft-brand)",
            borderRadius: "var(--ft-radius-md)",
            textDecoration: "none",
            boxShadow: "0 12px 28px -10px rgba(0,0,0,0.35)",
          }}
        >
          <EditableText fieldPath="buttonText">{content.buttonText}</EditableText>
        </a>
        {content.microcopy && (
          <div style={{ fontSize: "var(--ft-fs-small)", opacity: 0.85 }}>{content.microcopy.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}</div>
        )}
      </div>
    </section>
  );
}
