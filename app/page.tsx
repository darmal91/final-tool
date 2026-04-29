import Link from "next/link";
import { listProjects } from "@/lib/projects/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await listProjects();

  return (
    <main style={{ minHeight: "100vh", padding: "5rem 1.5rem" }}>
      <div style={{ maxWidth: "920px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              fontSize: "0.8125rem",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "#64748b",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            Final Tool
          </div>
          <h1
            style={{
              fontSize: "2.75rem",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              margin: 0,
            }}
          >
            Generate a website for a local business.
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: "#475569",
              marginTop: "0.75rem",
              maxWidth: "640px",
            }}
          >
            Enter your business details. The system picks layout, applies the design system, and writes the copy. Under two minutes, every time.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.75rem", flexWrap: "wrap" }}>
            <Link
              href="/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.875rem 1.5rem",
                background: "#0f172a",
                color: "white",
                borderRadius: "0.625rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Generate a site →
            </Link>
          </div>
        </div>

        <div style={{ marginTop: "3rem" }}>
          <h2
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#64748b",
              marginBottom: "0.875rem",
            }}
          >
            Recent projects
          </h2>
          {projects.length === 0 ? (
            <div
              style={{
                padding: "2rem",
                background: "white",
                border: "1px dashed #cbd5e1",
                borderRadius: "0.875rem",
                color: "#64748b",
                fontSize: "0.9375rem",
              }}
            >
              No projects yet. Generate your first one.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/editor/${p.id}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    gap: "1rem",
                    alignItems: "center",
                    padding: "1rem 1.25rem",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.625rem",
                    textDecoration: "none",
                    color: "#0f172a",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.input.businessName}</div>
                    <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                      {p.input.businessType} · {p.input.location}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: "#0f172a",
                      fontWeight: 600,
                    }}
                  >
                    Open →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
