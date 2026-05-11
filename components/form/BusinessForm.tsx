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

const TONE_DEFAULT_COLORS: Record<Tone, { primary: string; accent: string }> = {
  premium: { primary: "#0F172A", accent: "#C8A24B" },
  friendly: { primary: "#2563EB", accent: "#F59E0B" },
  aggressive: { primary: "#DC2626", accent: "#FACC15" },
};

interface Preset {
  label: string;
  businessName: string;
  businessType: BusinessType;
  location: string;
  tone: Tone;
  services: string;
  differentiator: string;
  phone: string;
}

const PRESETS: Preset[] = [
  {
    label: "Plumber",
    businessName: "Kerr Plumbing",
    businessType: "plumber",
    location: "Dallas, TX",
    tone: "friendly",
    services: "Emergency Repair\nDrain Cleaning\nWater Heaters\nFixture Install",
    differentiator: "Family-owned for 20 years. Same-day emergency service.",
    phone: "9492223344",
  },
  {
    label: "Roofer",
    businessName: "Summit Roofing",
    businessType: "roofer",
    location: "Austin, TX",
    tone: "aggressive",
    services: "Roof Replacement\nStorm Damage Repair\nGutter Installation\nRoof Inspection\nLeak Repair",
    differentiator: "Licensed, bonded, and insured. Free same-day inspections.",
    phone: "5124449988",
  },
  {
    label: "Medspa",
    businessName: "Lumière Aesthetics",
    businessType: "medspa",
    location: "Beverly Hills, CA",
    tone: "premium",
    services: "Botox & Fillers\nLaser Skin Resurfacing\nBody Contouring\nHydrafacial",
    differentiator: "Board-certified physicians only. Results-focused, not sales-focused.",
    phone: "3109876543",
  },
  {
    label: "Electrician",
    businessName: "Volt Pro Electric",
    businessType: "electrician",
    location: "Phoenix, AZ",
    tone: "aggressive",
    services: "Panel Upgrades\nEV Charger Install\nOutdoor Lighting\nEmergency Repairs",
    differentiator: "Master electricians on every job. No subcontractors.",
    phone: "6025551234",
  },
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

function ColorInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const display = value || placeholder;
  return (
    <div>
      <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.375rem" }}>{label}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          border: "1px solid #cbd5e1",
          borderRadius: "0.5rem",
          padding: "0.375rem 0.5rem",
          background: "white",
        }}
      >
        <label style={{ position: "relative", cursor: "pointer", flexShrink: 0 }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "0.375rem",
              background: display,
              border: "1px solid #e2e8f0",
            }}
          />
          <input
            type="color"
            value={value || placeholder}
            onChange={(e) => onChange(e.target.value)}
            style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
          />
        </label>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v);
          }}
          style={{
            border: "none",
            outline: "none",
            fontSize: "0.8125rem",
            fontFamily: "monospace",
            color: "#334155",
            background: "transparent",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}

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
  const [primaryColor, setPrimaryColor] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [colorsOpen, setColorsOpen] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const businessId =
      Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

    const input: BusinessInput = {
      businessName: businessName.trim(),
      businessType,
      location: location.trim(),
      services: services.split("\n").map((s) => s.trim()).filter(Boolean),
      tone,
      differentiator: differentiator.trim(),
      phone: phone.trim() || undefined,
    };

    // Fire the request before navigating — browser keeps it alive after unmount.
    fetch("/api/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...input,
        businessId,
        ...(primaryColor ? { primaryColor } : {}),
        ...(accentColor ? { accentColor } : {}),
      }),
    }).catch(() => {});

    router.push(`/generating/${businessId}?name=${encodeURIComponent(businessName.trim())}`);
  }

  function applyPreset(p: Preset) {
    setBusinessName(p.businessName);
    setBusinessType(p.businessType);
    setLocation(p.location);
    setTone(p.tone);
    setServices(p.services);
    setDifferentiator(p.differentiator);
    setPhone(p.phone);
    setPrimaryColor("");
    setAccentColor("");
    setColorsOpen(false);
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
      <div>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.625rem",
          }}
        >
          Quick presets
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              style={{
                padding: "0.375rem 0.875rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#334155",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                borderRadius: "9999px",
                cursor: "pointer",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #e2e8f0", marginTop: "1.25rem" }} />
      </div>

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

      <div>
        {!colorsOpen ? (
          <button
            type="button"
            onClick={() => setColorsOpen(true)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontSize: "0.8125rem",
              color: "#64748b",
              cursor: "pointer",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
              textUnderlineOffset: "2px",
            }}
          >
            Customize brand colors
          </button>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.625rem",
              }}
            >
              <label style={labelBase}>Brand Colors (optional)</label>
              <button
                type="button"
                onClick={() => { setPrimaryColor(""); setAccentColor(""); setColorsOpen(false); }}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  cursor: "pointer",
                }}
              >
                Reset to defaults
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <ColorInput
                label="Primary"
                value={primaryColor}
                placeholder={TONE_DEFAULT_COLORS[tone].primary}
                onChange={setPrimaryColor}
              />
              <ColorInput
                label="Accent"
                value={accentColor}
                placeholder={TONE_DEFAULT_COLORS[tone].accent}
                onChange={setAccentColor}
              />
            </div>
          </div>
        )}
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
