import type { HeroContent } from "@/lib/types";

export default function CenteredTrustHero({ content }: { content: HeroContent }) {
  return (
    <section
      style={{
        background: "var(--ft-surface-muted)",
        color: "var(--ft-text)",
        minHeight: "600px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1.25rem",
      }}
    >
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "1.25rem",
        }}
      >
        {content.trustBadges.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {content.trustBadges.slice(0, 5).map((b) => (
              <span
                key={b}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.3rem 0.75rem",
                  background: "transparent",
                  color: "var(--ft-brand)",
                  border: "1px solid var(--ft-brand)",
                  borderRadius: "var(--ft-radius-pill)",
                  fontSize: "var(--ft-fs-small)",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                }}
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <div
          style={{
            fontSize: "var(--ft-fs-eyebrow)",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontWeight: 600,
            color: "var(--ft-brand)",
          }}
        >
          {content.eyebrow}
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            margin: 0,
            color: "var(--ft-text)",
          }}
        >
          {content.headline}
        </h1>

        <p
          style={{
            fontSize: "calc(var(--ft-body-scale, 1) * 1.125rem)",
            lineHeight: 1.55,
            color: "var(--ft-text-muted)",
            maxWidth: "560px",
            margin: 0,
          }}
        >
          {content.subheadline}
        </p>

        <a
          href={content.ctaHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem 2rem",
            fontSize: "calc(var(--ft-cta-scale, 1) * 1.0625rem)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            background: "var(--ft-brand)",
            color: "var(--ft-on-brand)",
            border: "none",
            borderRadius: "var(--ft-radius-md)",
            textDecoration: "none",
            boxShadow: "0 4px 16px -4px rgba(15,23,42,0.18)",
            whiteSpace: "nowrap",
            marginTop: "0.25rem",
          }}
        >
          {content.ctaText}
        </a>
      </div>
    </section>
  );
}
