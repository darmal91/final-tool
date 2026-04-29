import type { ReviewsContent } from "@/lib/types";
import { SectionShell, Heading, Lead, Card, Stars } from "@/components/sections/shared/primitives";

export default function GridReviews({ content }: { content: ReviewsContent }) {
  return (
    <SectionShell background="surface">
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
          {content.heading}
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
                fontSize: "var(--ft-fs-body)",
                lineHeight: 1.55,
                color: "var(--ft-text)",
              }}
            >
              &ldquo;{r.body}&rdquo;
            </p>
            <div style={{ marginTop: "1rem" }}>
              <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{r.name}</div>
              <div style={{ fontSize: "var(--ft-fs-small)", color: "var(--ft-text-muted)" }}>
                {r.role}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
