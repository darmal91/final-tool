import type { BusinessInput, BusinessAsset } from "@/lib/types";

export default function SiteFooter({
  input,
  assets: _assets,
  ctaVariant,
}: {
  input: BusinessInput;
  assets?: BusinessAsset[];
  ctaVariant?: string;
}) {
  const phone = input.phone;
  const formattedPhone = phone
    ? phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
    : null;

  const topSectionStyle: React.CSSProperties =
    ctaVariant === "strong-offer"
      ? { background: "#0f0f0f", borderTop: "4px solid var(--ft-brand)" }
      : ctaVariant === "urgency"
        ? { background: "#0f0f0f", borderTop: "1px solid rgba(255,255,255,0.08)" }
        : { background: "var(--ft-surface-inverse)" };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.6875rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 600,
    color: "rgba(255,255,255,0.4)",
    marginBottom: "0.75rem",
  };

  return (
    <footer>
      {/* Top section */}
      <div
        style={{
          ...topSectionStyle,
          color: "var(--ft-text-inverse)",
          padding: "3rem 1.25rem",
        }}
      >
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "2.5rem",
          }}
          className="ft-footer-grid"
        >
          {/* Column 1 — Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--ft-radius-md)",
                  background: "var(--ft-brand)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--ft-on-brand)",
                  fontWeight: 800,
                  fontSize: "0.9375rem",
                  flexShrink: 0,
                }}
              >
                {input.businessName.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: 700, fontSize: "1.125rem", letterSpacing: "-0.02em" }}>
                {input.businessName}
              </span>
            </div>
            <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
              {input.businessType} · {input.location}
            </div>
            {formattedPhone && (
              <a
                href={`tel:${phone}`}
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--ft-text-inverse)",
                  textDecoration: "none",
                  fontWeight: 600,
                  marginTop: "0.25rem",
                }}
              >
                {formattedPhone}
              </a>
            )}
            {input.email && (
              <a
                href={`mailto:${input.email}`}
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                }}
              >
                {input.email}
              </a>
            )}
          </div>

          {/* Column 2 — Services */}
          <div>
            <div style={labelStyle}>Services</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {input.services.map((s) => (
                <li
                  key={s}
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 2,
                  }}
                >
                  <span style={{ marginRight: "0.4rem", color: "rgba(255,255,255,0.35)" }}>›</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Service Area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <div style={labelStyle}>Service Area</div>
            <div style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
              {input.location}
            </div>
            <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)" }}>
              Licensed &amp; insured
            </div>
            {input.differentiator && (
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "rgba(255,255,255,0.4)",
                  fontStyle: "italic",
                  lineHeight: 1.55,
                  marginTop: "0.5rem",
                }}
              >
                {input.differentiator}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div
        style={{
          background: "rgba(0,0,0,0.3)",
          padding: "1rem 1.25rem",
        }}
      >
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.35)" }}>
            © 2025 {input.businessName}. All rights reserved.
          </span>
          <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.35)" }}>
            Built with Final Tool
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .ft-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
