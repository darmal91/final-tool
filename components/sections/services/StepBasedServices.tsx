import type { ServicesContent } from "@/lib/types";
import { SectionShell, Heading, Lead } from "@/components/sections/shared/primitives";
import { EditableText } from "@/components/render/Editable";

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
          <EditableText fieldPath="heading">{content.heading}</EditableText>
        </Heading>
        <Lead align="center">
          <EditableText fieldPath="subheading" multiline>{content.subheading}</EditableText>
        </Lead>
      </div>
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: (() => {
            const count = Math.min(content.services.length, 6);
            const cols = count === 2 || count === 4 ? 2 : 3;
            return `repeat(${cols}, minmax(0, 1fr))`;
          })(),
          gap: "var(--ft-item-gap)",
        }}
        className="ft-steps"
      >
        {content.services.slice(0, 6).map((s, i) => (
          <li
            key={i}
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
                width: "24px",
                height: "24px",
                borderRadius: "9999px",
                background: "#f1f5f9",
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: "0.75rem",
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
              <EditableText fieldPath={`services.${i}.title`}>{s.title}</EditableText>
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
              <EditableText fieldPath={`services.${i}.description`} multiline>{s.description}</EditableText>
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
