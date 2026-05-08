import type { ServicesContent } from "@/lib/types";
import { SectionShell, Heading, Lead } from "@/components/sections/shared/primitives";

export default function IconListServices({ content }: { content: ServicesContent }) {
  return (
    <SectionShell id="services" background="surface">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.85fr 1.15fr",
          gap: "var(--ft-block-gap)",
        }}
        className="ft-icon-list"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Heading level={2} size="h2">
            {content.heading}
          </Heading>
          <Lead>{content.subheading}</Lead>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {content.services.map((s, i) => (
            <div
              key={s.title}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "1rem",
                alignItems: "flex-start",
                padding: "1.25rem 0",
                borderTop: i === 0 ? "none" : "1px solid var(--ft-border)",
                minHeight: "200px",
              }}
            >
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "var(--ft-radius-md)",
                  background: "var(--ft-brand-soft)",
                  color: "var(--ft-brand)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "calc(var(--ft-heading-scale, 1) * 1.125rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "var(--ft-text-muted)",
                    fontSize: "calc(var(--ft-body-scale, 1) * var(--ft-fs-body))",
                    lineHeight: 1.55,
                    marginTop: "0.25rem",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 880px) {
          .ft-icon-list { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </SectionShell>
  );
}
