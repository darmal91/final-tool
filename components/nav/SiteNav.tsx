"use client";

import { useState, useEffect } from "react";
import type { BusinessInput, BusinessAsset } from "@/lib/types";

interface SiteNavProps {
  input: BusinessInput;
  assets?: BusinessAsset[];
}

export default function SiteNav({ input, assets }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logoAsset = assets?.find((a) => a.context === "logo");
  const phone = input.phone;
  const formattedPhone = phone
    ? phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
    : null;

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--ft-surface)",
          borderBottom: scrolled ? "1px solid var(--ft-border)" : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 16px -4px rgba(0,0,0,0.10)" : "none",
          transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1.25rem",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          <a href="#" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", flexShrink: 0 }}>
            {logoAsset ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoAsset.url} alt={input.businessName} style={{ height: "36px", width: "auto", objectFit: "contain" }} />
            ) : (
              <>
                <div style={{ width: "32px", height: "32px", borderRadius: "var(--ft-radius-md)", background: "var(--ft-brand)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ft-on-brand)", fontWeight: 800, fontSize: "0.9375rem", flexShrink: 0 }}>
                  {input.businessName.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--ft-text)", letterSpacing: "-0.02em" }}>
                  {input.businessName}
                </span>
              </>
            )}
          </a>

          <div className="ft-nav-links" style={{ display: "flex", alignItems: "center", gap: "2rem", flex: 1, justifyContent: "center" }}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}
                style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--ft-text-muted)", textDecoration: "none", letterSpacing: "-0.01em", transition: "color 0.15s ease" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--ft-text)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--ft-text-muted)")}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
            {formattedPhone && (
              <a href={`tel:${phone}`} className="ft-nav-phone"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5625rem 1.125rem", background: "var(--ft-brand)", color: "var(--ft-on-brand)", borderRadius: "var(--ft-radius-md)", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none", whiteSpace: "nowrap", transition: "background 0.15s ease, transform 0.1s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--ft-brand-hover)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--ft-brand)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.49 5.49l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                </svg>
                {formattedPhone}
              </a>
            )}
            <button className="ft-nav-burger" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu"
              style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "0.25rem", color: "var(--ft-text)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                {menuOpen ? (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>) : (<><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>)}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div style={{ borderTop: "1px solid var(--ft-border)", background: "var(--ft-surface)", padding: "1rem 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                style={{ fontSize: "1.0625rem", fontWeight: 500, color: "var(--ft-text)", textDecoration: "none", padding: "0.625rem 0", borderBottom: "1px solid var(--ft-border)" }}
              >{link.label}</a>
            ))}
            {formattedPhone && (
              <a href={`tel:${phone}`} style={{ marginTop: "0.75rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.75rem", background: "var(--ft-brand)", color: "var(--ft-on-brand)", borderRadius: "var(--ft-radius-md)", fontWeight: 700, fontSize: "1rem", textDecoration: "none" }}>
                Call {formattedPhone}
              </a>
            )}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 720px) {
          .ft-nav-links { display: none !important; }
          .ft-nav-burger { display: flex !important; }
          .ft-nav-phone { display: none !important; }
        }
      `}</style>
    </>
  );
}