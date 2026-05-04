import type { HeroContent } from "@/lib/types";

export default function ConversionHero({ content }: { content: HeroContent }) {
  return (
    <section
      style={{
        background:
          "radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.07) 0%, transparent 70%), var(--ft-brand)",
        color: "var(--ft-on-brand)",
        minHeight: "580px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 1.25rem",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
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
                  background: "rgba(255,255,255,0.15)",
                  color: "var(--ft-on-brand)",
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
            letterSpacing: "0.16em",
            fontWeight: 700,
            opacity: 0.8,
            color: "var(--ft-on-brand)",
          }}
        >
          {content.eyebrow}
        </div>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.08,
            margin: 0,
            color: "var(--ft-text-inverse)",
          }}
        >
          {content.headline}
        </h1>

        <p
          style={{
            fontSize: "1.125rem",
            lineHeight: 1.55,
            color: "var(--ft-text-inverse)",
            opacity: 0.8,
            maxWidth: "540px",
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
            background: "var(--ft-on-brand)",
            color: "var(--ft-brand)",
            border: "none",
            borderRadius: "var(--ft-radius-md)",
            textDecoration: "none",
            boxShadow: "0 10px 24px -8px rgba(0,0,0,0.35)",
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
