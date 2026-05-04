"use client";

import { useState } from "react";
import type { ServicesContent } from "@/lib/types";
import { SectionShell, Heading, Lead } from "@/components/sections/shared/primitives";

function gridCols(count: number): string {
  if (count === 2) return "repeat(2, 1fr)";
  if (count === 3) return "repeat(3, 1fr)";
  if (count === 4) return "repeat(2, 1fr)";
  return "repeat(3, 1fr)";
}

export default function CardGridServices({ content }: { content: ServicesContent }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const services = content.services.slice(0, 6);
  const cols = gridCols(services.length);

  return (
    <SectionShell background="muted">
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: "var(--ft-block-gap)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <Heading level={2} size="h2" align="center">
            {content.heading}
          </Heading>
          <Lead align="center">{content.subheading}</Lead>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            gap: "var(--ft-item-gap)",
          }}
        >
          {services.map((s, idx) => {
            const hovered = hoveredIdx === idx;
            return (
              <div
                key={s.title}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  background: "var(--ft-surface)",
                  border: "1px solid var(--ft-border)",
                  borderRadius: "var(--ft-radius-lg)",
                  padding: "var(--ft-card-pad)",
                  minWidth: 0,
                  boxShadow: hovered
                    ? "0 6px 20px rgba(15, 23, 42, 0.12)"
                    : "0 1px 2px rgba(15, 23, 42, 0.04)",
                  transform: hovered ? "translateY(-2px)" : "translateY(0)",
                  transition: "transform 160ms ease, box-shadow 160ms ease",
                }}
              >
                <div
                  style={{
                    fontSize: "calc(var(--ft-body-scale, 1) * 1.75rem)",
                    lineHeight: 1,
                    marginBottom: "0.75rem",
                  }}
                >
                  {s.icon}
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "calc(var(--ft-heading-scale, 1) * var(--ft-fs-h3))",
                    fontWeight: 600,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "var(--ft-text-muted)",
                    fontSize: "calc(var(--ft-body-scale, 1) * var(--ft-fs-body))",
                    lineHeight: 1.55,
                    marginTop: "0.5rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
