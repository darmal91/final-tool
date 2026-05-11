import type { ReviewsContent } from "@/lib/types";
import { SectionShell, Stars } from "@/components/sections/shared/primitives";
import { EditableText } from "@/components/render/Editable";

export default function SingleHighlightReview({ content }: { content: ReviewsContent }) {
  const first = content.reviews[0];
  if (!first) return null;
  return (
    <SectionShell id="reviews" background="muted">
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
            fontSize: "calc(var(--ft-heading-scale, 1) * clamp(1.5rem, 3vw, 2rem))",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            fontWeight: 500,
            color: "var(--ft-text)",
          }}
        >
          &ldquo;<EditableText fieldPath="reviews.0.body" multiline>{first.body}</EditableText>&rdquo;
        </blockquote>
        <div>
          <div style={{ fontWeight: 600 }}>
            <EditableText fieldPath="reviews.0.name">{first.name}</EditableText>
          </div>
          <div style={{ fontSize: "var(--ft-fs-small)", color: "var(--ft-text-muted)" }}>
            <EditableText fieldPath="reviews.0.role">{first.role}</EditableText>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
