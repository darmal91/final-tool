import type { HeroContent } from "@/lib/types";

export default function PremiumSplitHero({
  content,
  heroImageUrl,
}: {
  content: HeroContent;
  heroImageUrl?: string;
}) {
  return (
    <section
      style={{
        background: "var(--ft-surface-inverse)",
        color: "var(--ft-text-inverse)",
        minHeight: "600px",
        display: "flex",
        alignItems: "stretch",
        padding: "5rem 1.25rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--ft-block-gap)",
          alignItems: "center",
          padding: 0,
        }}
        className="ft-premium-split"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            alignItems: "flex-start",
          }}
        >
          {content.trustBadges.length > 0 && (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {content.trustBadges.slice(0, 5).map((b) => (
                <span
                  key={b}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.3rem 0.75rem",
                    background: "rgba(255,255,255,0.1)",
                    color: "var(--ft-text-inverse)",
                    border: "1px solid rgba(255,255,255,0.18)",
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
              fontWeight: 600,
              opacity: 0.65,
              color: "var(--ft-text-inverse)",
            }}
          >
            {content.eyebrow}
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: 0,
              color: "var(--ft-text-inverse)",
            }}
          >
            {content.headline}
          </h1>

          <p
            style={{
              fontSize: "calc(var(--ft-body-scale, 1) * 1.125rem)",
              lineHeight: 1.55,
              color: "var(--ft-text-inverse)",
              opacity: 0.7,
              margin: 0,
              maxWidth: "480px",
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
              boxShadow: "0 10px 24px -8px rgba(0,0,0,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            {content.ctaText}
          </a>
        </div>

        <div
          style={{
            borderRadius: "var(--ft-radius-lg)",
            minHeight: "380px",
            alignSelf: "stretch",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: heroImageUrl ? "transparent" : "rgba(255,255,255,0.05)",
            border: heroImageUrl ? "none" : "2px dashed rgba(255,255,255,0.15)",
          }}
        >
          {heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImageUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.625rem",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span style={{ fontSize: "0.8125rem", fontWeight: 500, letterSpacing: "0.01em" }}>
                Drop your photo here
              </span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ft-premium-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
