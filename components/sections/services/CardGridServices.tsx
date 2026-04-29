import type { ServicesContent } from "@/lib/types";
import { SectionShell, Heading, Lead, Card } from "@/components/sections/shared/primitives";

export default function CardGridServices({ content }: { content: ServicesContent }) {
  return (
    <SectionShell background="muted">
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "var(--ft-item-gap)",
        }}
      >
        {content.services.map((s) => (
          <Card key={s.title}>
            <div
              style={{
                fontSize: "1.75rem",
                lineHeight: 1,
                marginBottom: "0.75rem",
              }}
            >
              {s.icon}
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: "var(--ft-fs-h3)",
                fontWeight: 600,
                letterSpacing: "-0.015em",
              }}
            >
              {s.title}
            </h3>
            <p
              style={{
                color: "var(--ft-text-muted)",
                fontSize: "var(--ft-fs-body)",
                lineHeight: 1.55,
                marginTop: "0.5rem",
              }}
            >
              {s.description}
            </p>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
