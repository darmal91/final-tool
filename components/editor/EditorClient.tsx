"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { BusinessAsset, BusinessProject, SiteComposition, Section } from "@/lib/types";
import RenderComposition from "@/components/render/RenderComposition";
import VariantPicker from "./VariantPicker";
import AssetDropzone from "./AssetDropzone";

const SECTION_TITLES: Record<Section["type"], string> = {
  hero: "Hero",
  services: "Services",
  reviews: "Reviews",
  cta: "Call to action",
};

export default function EditorClient({
  initialProject,
  initialComposition,
}: {
  initialProject: BusinessProject;
  initialComposition: SiteComposition;
}) {
  const [project, setProject] = useState(initialProject);
  const [composition, setComposition] = useState(initialComposition);
  const [pending, startTransition] = useTransition();
  const [exporting, setExporting] = useState(false);

  async function setVariant(sectionId: string, variant: string) {
    const optimistic = {
      ...composition,
      sections: composition.sections.map((s) =>
        s.id === sectionId ? ({ ...s, variant } as Section) : s
      ),
    };
    setComposition(optimistic);
    startTransition(async () => {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "set-variant", sectionId, variant }),
      });
      if (res.ok) {
        const j = (await res.json()) as { composition: SiteComposition };
        setComposition(j.composition);
      }
    });
  }

  async function exportHtml() {
    setExporting(true);
    try {
      const res = await fetch(`/api/export/${project.id}`, { method: "POST" });
      if (!res.ok) throw new Error("export_failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.input.businessName.replace(/\s+/g, "-").toLowerCase() || project.id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  function setAssets(assets: BusinessAsset[]) {
    setProject({ ...project, assets });
  }

  const logoAsset = project.assets.find((a) => a.context === "logo");
  const heroAsset = project.assets.find((a) => a.context === "hero");

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
      <header
        style={{
          background: "white",
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0.75rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
            <Link href="/" style={{ fontSize: "0.875rem", color: "#64748b", textDecoration: "none" }}>
              ←
            </Link>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  letterSpacing: "-0.01em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {project.input.businessName}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                {project.input.businessType} · {project.input.location} · tone: {composition.theme.tokens.tone}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link
              href={`/preview/${project.id}`}
              target="_blank"
              style={{
                padding: "0.5rem 0.875rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                background: "white",
                color: "#0f172a",
                border: "1px solid #cbd5e1",
                borderRadius: "0.5rem",
                textDecoration: "none",
              }}
            >
              Open preview ↗
            </Link>
            <button
              type="button"
              onClick={exportHtml}
              disabled={exporting}
              style={{
                padding: "0.5rem 0.875rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                background: "#0f172a",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: exporting ? "wait" : "pointer",
              }}
            >
              {exporting ? "Exporting…" : "Export HTML"}
            </button>
          </div>
        </div>
      </header>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "1.5rem 1.25rem",
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: "1.5rem",
        }}
      >
        <aside style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Panel title="Sections">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {composition.sections.map((s) => (
                <div key={s.id}>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#64748b",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {SECTION_TITLES[s.type]}
                  </div>
                  <VariantPicker section={s} onChange={(v) => setVariant(s.id, v)} busy={pending} />
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Assets">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <AssetDropzone
                businessId={project.id}
                context="logo"
                label="Logo"
                hint="Square or transparent PNG works best."
                current={logoAsset}
                onChange={setAssets}
              />
              <AssetDropzone
                businessId={project.id}
                context="hero"
                label="Hero image"
                hint="Used by the premium-split hero variant."
                current={heroAsset}
                onChange={setAssets}
              />
            </div>
          </Panel>

          <Panel title="Theme">
            <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: "0.8125rem", color: "#475569" }}>
              <li><strong>Tone:</strong> {composition.theme.tokens.tone}</li>
              <li><strong>Density:</strong> {composition.theme.tokens.density}</li>
              <li><strong>Radius:</strong> {composition.theme.tokens.radius}</li>
            </ul>
            <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#94a3b8" }}>
              Theme is derived from your business input. Re-generate from the form to change it.
            </p>
          </Panel>
        </aside>

        <main
          style={{
            background: "white",
            borderRadius: "0.875rem",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            minHeight: "70vh",
          }}
        >
          <RenderComposition composition={composition} assets={project.assets} input={project.input} />
        </main>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "0.75rem",
        padding: "1rem",
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#475569",
          marginBottom: "0.875rem",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
