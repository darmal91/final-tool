import type { CTAContent } from "@/lib/types";
import { SectionShell, Heading, Lead, Button } from "@/components/sections/shared/primitives";

export default function SoftContactCTA({ content }: { content: CTAContent }) {
  return (
    <SectionShell id="contact" background="muted">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "var(--ft-block-gap)",
          alignItems: "center",
          padding: "var(--ft-card-pad)",
          background: "var(--ft-surface)",
          border: "1px solid var(--ft-border)",
          borderRadius: "var(--ft-radius-lg)",
        }}
        className="ft-soft-cta"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Heading level={2} size="h2">
            {content.heading}
          </Heading>
          <Lead>{content.subheading}</Lead>
          {content.microcopy && (
            <div style={{ fontSize: "var(--ft-fs-small)", color: "var(--ft-text-muted)" }}>
              {content.microcopy.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
          <Button href={content.buttonHref} size="lg">
            {content.buttonText}
          </Button>
        </div>
      </div>
      <style>{`
        @media (max-width: 720px) {
          .ft-soft-cta { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </SectionShell>
  );
}
