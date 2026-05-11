import type { ReviewsContent } from "@/lib/types";
import { SectionShell, Heading, Lead, Card, Stars } from "@/components/sections/shared/primitives";
import { EditableText } from "@/components/render/Editable";

export default function GridReviews({ content }: { content: ReviewsContent }) {
  return (
    <SectionShell id="reviews" background="surface">
      <div
        style={{
          textAlign: "center",
          marginBottom: "var(--ft-block-gap)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <Heading level={2} size="h2" align="center">
          <EditableText fieldPath="heading">{content.heading}</EditableText>
        </Heading>
        <Lead align="center">{content.subheading}</Lead>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--ft-item-gap)",
        }}
      >
        {content.reviews.map((r, i) => (
          <Card key={i}>
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
        ))}
      </div>
    </SectionShell>
  );
}
