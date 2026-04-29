"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BusinessInput, BusinessType, Tone } from "@/lib/types";

const TYPES: { value: BusinessType; label: string }[] = [
  { value: "plumber", label: "Plumber" },
  { value: "roofer", label: "Roofer" },
  { value: "electrician", label: "Electrician" },
  { value: "hvac", label: "HVAC" },
  { value: "medspa", label: "Medspa" },
  { value: "dentist", label: "Dentist" },
  { value: "landscaper", label: "Landscaper" },
  { value: "cleaner", label: "Cleaning" },
  { value: "general", label: "Other / general" },
];

const TONES: { value: Tone; label: string; hint: string }[] = [
  { value: "premium", label: "Premium", hint: "Calm, refined, high-end" },
  { value: "friendly", label: "Friendly", hint: "Trustworthy local feel" },
  { value: "aggressive", label: "Aggressive", hint: "Direct, urgent, conversion-first" },
];

const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.875rem",
  border: "1px solid #cbd5e1",
  borderRadius: "0.5rem",
  fontSize: "0.9375rem",
  background: "white",
  color: "#0f172a",
  outline: "none",
};

const labelBase: React.CSSProperties = {
  display: "block",
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#334155",
  marginBottom: "0.375rem",
};

export default function BusinessForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("plumber");
  const [location, setLocation] = useState("");
  const [services, setServices] = useState("Emergency Repair\nDrain Cleaning\nWater Heaters\nFixture Install");
  const [tone, setTone] = useState<Tone>("friendly");
  const [differentiator, setDifferentiator] = useState("");
  const [phone, setPhone] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const input: BusinessInput = {
      businessName: businessName.trim(),
      businessType,
      location: location.trim(),
      services: services.split("\n").map((s) => s.trim()).filter(Boolean),
      tone,
      differentiator: differentiator.trim(),
      phone: phone.trim() || undefined,
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Generation failed");
      }
      const data = (await res.json()) as { projectId: string };
      router.push(`/editor/${data.projectId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "grid",
        gap: "1.25rem",
        background: "white",
        padding: "2rem",
        border: "1px solid #e2e8f0",
        borderRadius: "0.875rem",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelBase}>Business name</label>
          <input
            style={inputBase}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            placeholder="Acme Plumbing"
          />
        </div>
        <div>
          <label style={labelBase}>Type</label>
          <select
            style={inputBase}
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value as BusinessType)}
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelBase}>Location</label>
          <input
            style={inputBase}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="Austin, TX"
          />
        </div>
        <div>
          <label style={labelBase}>Phone (optional)</label>
          <input
            style={inputBase}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(512) 555-0199"
          />
        </div>
      </div>

      <div>
        <label style={labelBase}>Services (one per line)</label>
        <textarea
          style={{ ...inputBase, minHeight: "120px", resize: "vertical", fontFamily: "inherit" }}
          value={services}
          onChange={(e) => setServices(e.target.value)}
          required
        />
      </div>

      <div>
        <label style={labelBase}>What makes you different?</label>
        <input
          style={inputBase}
          value={differentiator}
          onChange={(e) => setDifferentiator(e.target.value)}
          placeholder="Family-owned for 20 years. Same-day emergency service."
        />
      </div>

      <div>
        <label style={labelBase}>Tone</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
          {TONES.map((t) => (
            <button
              type="button"
              key={t.value}
              onClick={() => setTone(t.value)}
              style={{
                textAlign: "left",
                padding: "0.875rem",
                border: tone === t.value ? "2px solid #0f172a" : "1px solid #cbd5e1",
                borderRadius: "0.5rem",
                background: tone === t.value ? "#f8fafc" : "white",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{t.label}</div>
              <div style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "0.125rem" }}>
                {t.hint}
              </div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "0.875rem 1.5rem",
            background: "#0f172a",
            color: "white",
            border: "none",
            borderRadius: "0.625rem",
            fontWeight: 600,
            cursor: submitting ? "wait" : "pointer",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Generating..." : "Generate website"}
        </button>
      </div>
    </form>
  );
}
