"use client";

import { useState } from "react";
import type { BusinessInput } from "@/lib/types";

export default function ContactForm({ input: _input }: { input: BusinessInput }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="contact"
      style={{
        background: "var(--ft-surface-inverse)",
        padding: "5rem 1.25rem",
      }}
    >
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div
          style={{
            fontSize: "0.6875rem",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontWeight: 700,
            color: "var(--ft-brand)",
            marginBottom: "0.75rem",
          }}
        >
          GET IN TOUCH
        </div>

        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            color: "var(--ft-text-inverse)",
            margin: "0 0 0.75rem",
          }}
        >
          Request a free quote
        </h2>

        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.5)",
            margin: "0 0 2rem",
          }}
        >
          We&apos;ll get back to you within one business day.
        </p>

        {submitted ? (
          <div
            style={{
              padding: "1.5rem",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "var(--ft-radius-md)",
              color: "var(--ft-text-inverse)",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            Thanks! We&apos;ll be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <style>{`
              .ft-contact-input::placeholder { color: rgba(255,255,255,0.35); }
            `}</style>

            <input
              className="ft-contact-input"
              type="text"
              name="name"
              placeholder="Name"
              required
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "var(--ft-text-inverse)",
                borderRadius: "var(--ft-radius-md)",
                padding: "0.75rem 1rem",
                fontSize: "0.9375rem",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />

            <input
              className="ft-contact-input"
              type="tel"
              name="phone"
              placeholder="Phone"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "var(--ft-text-inverse)",
                borderRadius: "var(--ft-radius-md)",
                padding: "0.75rem 1rem",
                fontSize: "0.9375rem",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />

            <textarea
              className="ft-contact-input"
              name="message"
              rows={4}
              placeholder="Message"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "var(--ft-text-inverse)",
                borderRadius: "var(--ft-radius-md)",
                padding: "0.75rem 1rem",
                fontSize: "0.9375rem",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                background: "var(--ft-brand)",
                color: "var(--ft-on-brand)",
                padding: "1rem",
                fontWeight: 700,
                fontSize: "1rem",
                border: "none",
                borderRadius: "var(--ft-radius-md)",
                cursor: "pointer",
                letterSpacing: "-0.01em",
              }}
            >
              Send message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
