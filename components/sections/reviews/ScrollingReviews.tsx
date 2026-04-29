import type { ReviewsContent } from "@/lib/types";
import { Heading, Lead, Card, Stars } from "@/components/sections/shared/primitives";

export default function ScrollingReviews({ content }: { content: ReviewsContent }) {
  return (
    <section
      style={{
        background: "var(--ft-surface-muted)",
        padding: "var(--ft-section-y) 0",
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
            {content.heading}
          </Heading>
          <Lead align="center">{content.subheading}</Lead>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "var(--ft-item-gap)",
          padding: "0 1.25rem",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: "0.5rem",
        }}
        className="ft-scroll-row"
      >
        {content.reviews.map((r, i) => (
          <div
            key={i}
            style={{
              flex: "0 0 320px",
              scrollSnapAlign: "start",
            }}
          >
            <Card>
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
          </div>
        ))}
      </div>
    </section>
  );
}
