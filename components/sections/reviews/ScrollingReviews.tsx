import type { ReviewsContent } from "@/lib/types";
import { Heading, Lead, Card, Stars } from "@/components/sections/shared/primitives";
import { EditableText } from "@/components/render/Editable";

export default function ScrollingReviews({ content }: { content: ReviewsContent }) {
  return (
    <section
      id="reviews"
      style={{
        background: "var(--ft-surface-muted)",
        padding: "var(--ft-section-spacing, var(--ft-section-y)) 0",
      }}
    >
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 1.25rem" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "var(--ft-block-gap)",
            textAlign: "center",
          }}
        >
          <Heading level={2} size="h2" align="center">
            <EditableText fieldPath="heading">{content.heading}</EditableText>
          </Heading>
          <Lead align="center">{content.subheading}</Lead>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "var(--ft-item-gap)",
          padding: "0 1.25rem 0.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {content.reviews.map((r, i) => (
          <div
            key={i}
            style={{
              flex: "0 0 min(320px, 90vw)",
            }}
          >
            <Card>
              <Stars count={r.rating} />
              <p
                style={{
                  marginTop: "0.75rem",
                  fontSize: "calc(var(--ft-body-scale, 1) * var(--ft-fs-body))",
                  lineHeight: 1.55,
                  color: "var(--ft-text)",
                }}
              >
                &ldquo;<EditableText fieldPath={`reviews.${i}.body`} multiline>{r.body}</EditableText>&rdquo;
              </p>
              <div style={{ marginTop: "1rem" }}>
                <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
                  <EditableText fieldPath={`reviews.${i}.name`}>{r.name}</EditableText>
                </div>
                <div style={{ fontSize: "var(--ft-fs-small)", color: "var(--ft-text-muted)" }}>
                  <EditableText fieldPath={`reviews.${i}.role`}>{r.role}</EditableText>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}