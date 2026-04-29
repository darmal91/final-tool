"use client";

import { VARIANT_LABELS, VARIANTS_BY_TYPE } from "@/lib/types";
import type { Section, SectionType } from "@/lib/types";

export default function VariantPicker({
  section,
  onChange,
  busy,
}: {
  section: Section;
  onChange: (variant: string) => void;
  busy?: boolean;
}) {
  const variants = VARIANTS_BY_TYPE[section.type as SectionType] as readonly string[];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
      {variants.map((v) => {
        const active = section.variant === v;
        return (
          <button
            key={v}
            disabled={busy}
            onClick={() => onChange(v)}
            type="button"
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              border: active ? "1px solid #0f172a" : "1px solid #cbd5e1",
              background: active ? "#0f172a" : "white",
              color: active ? "white" : "#0f172a",
              borderRadius: "9999px",
              cursor: busy ? "wait" : "pointer",
              opacity: busy ? 0.7 : 1,
            }}
          >
            {VARIANT_LABELS[v] ?? v}
          </button>
        );
      })}
    </div>
  );
}
