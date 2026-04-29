import type { ReviewsContent } from "@/lib/types";
import { SectionShell, Stars } from "@/components/sections/shared/primitives";

export default function SingleHighlightReview({ content }: { content: ReviewsContent }) {
  const first = content.reviews[0];
  if (!first) return null;
  return (
    <SectionShell background="muted">
      <div
        style={{
          maxWidth: "780px",
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Stars count={first.rating} />
        <blockquote
          style={{
            margin: 0,
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            fontWeight: 500,
            color: "var(--ft-text)",
          }}
        >
          &ldquo;{first.body}&rdquo;
        </blockquote>
        <div>
          <div style={{ fontWeight: 600 }}>{first.name}</div>
          <div style={{ fontSize: "var(--ft-fs-small)", color: "var(--ft-text-muted)" }}>
            {first.role}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
