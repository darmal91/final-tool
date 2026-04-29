import Link from "next/link";
import BusinessForm from "@/components/form/BusinessForm";

export default function NewProjectPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/"
            style={{ fontSize: "0.875rem", color: "#64748b", textDecoration: "none" }}
          >
            ← Back
          </Link>
        </div>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}
        >
          Tell us about the business.
        </h1>
        <p style={{ color: "#475569", marginBottom: "2rem" }}>
          The system uses these fields to choose layout, theme, and copy.
        </p>
        <BusinessForm />
      </div>
    </main>
  );
}
