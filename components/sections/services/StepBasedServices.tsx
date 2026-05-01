import type { ServicesContent } from "@/lib/types";
import { SectionShell, Heading, Lead } from "@/components/sections/shared/primitives";

export default function StepBasedServices({ content }: { content: ServicesContent }) {
  return (
    <SectionShell id="services" background="surface">
      <div
        style={{
          textAlign: "center",
          marginBottom: "var(--ft-block-gap)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <Heading level={2} size="h2" align="center">
          {content.heading}
        </Heading>
        <Lead align="center">{content.subheading}</Lead>
      </div>
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(content.services.length, 4)}, minmax(0, 1fr))`,
          gap: "var(--ft-item-gap)",
        }}
        className="ft-steps"
      >
        {content.services.map((s, i) => (
          <li
            key={s.title}
            style={{
              position: "relative",
              padding: "var(--ft-card-pad)",
              borderRadius: "var(--ft-radius-lg)",
              border: "1px solid var(--ft-border)",
              background: "var(--ft-surface)",
            }}
          >
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "var(--ft-radius-pill)",
                background: "var(--ft-brand)",
                color: "var(--ft-on-brand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.875rem",
                marginBottom: "0.75rem",
              }}
            >
              {i + 1}
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: "calc(var(--ft-heading-scale, 1) * var(--ft-fs-h3))",
                fontWeight: 600,
                letterSpacing: "-0.015em",
              }}
            >
              {s.title}
            </h3>
            <p
              style={{
                margin: 0,
                marginTop: "0.5rem",
                color: "var(--ft-text-muted)",
                fontSize: "calc(var(--ft-body-scale, 1) * var(--ft-fs-body))",
                lineHeight: 1.55,
              }}
            >
              {s.description}
            </p>
          </li>
        ))}
      </ol>
      <style>{`
        @media (max-width: 880px) {
          .ft-steps { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </SectionShell>
  );
}
