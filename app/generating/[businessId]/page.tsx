"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

const MESSAGES = [
  "Analyzing your business...",
  "Writing your headline...",
  "Building your services section...",
  "Crafting your reviews...",
  "Putting it all together...",
];

export default function GeneratingPage() {
  const router = useRouter();
  const { businessId } = useParams<{ businessId: string }>();
  const searchParams = useSearchParams();
  const businessName = searchParams.get("name") ?? "Your site";

  const [messageIdx, setMessageIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const redirectedRef = useRef(false);

  // Animate progress bar 0→90% over 14s via CSS transition.
  // Set to 0 on mount, then immediately to 90 so the transition fires.
  useEffect(() => {
    const id = requestAnimationFrame(() => setProgress(90));
    return () => cancelAnimationFrame(id);
  }, []);

  // Cycle status messages every 2.5s
  useEffect(() => {
    const id = setInterval(() => {
      setMessageIdx((i) => (i + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  // Poll for readiness every 1.5s
  useEffect(() => {
    const id = setInterval(async () => {
      if (redirectedRef.current) return;
      try {
        const res = await fetch(`/api/projects/${businessId}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.project) {
            redirectedRef.current = true;
            clearInterval(id);
            setDone(true);
            setProgress(100);
            setTimeout(() => router.push(`/editor/${businessId}`), 400);
          }
        }
      } catch {
        // network blip — keep polling
      }
    }, 1500);
    return () => clearInterval(id);
  }, [businessId, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111111",
        color: "#FAFAFA",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.25rem",
        fontFamily: '"Inter", system-ui, sans-serif',
      }}
    >
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Business name */}
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              marginBottom: "0.5rem",
            }}
          >
            Building site for
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              color: "#FAFAFA",
            }}
          >
            {businessName}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div
            style={{
              height: "4px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "#DC2626",
                borderRadius: "2px",
                transition: done
                  ? "width 300ms ease"
                  : "width 14000ms cubic-bezier(0.1, 0.4, 0.3, 1)",
              }}
            />
          </div>
        </div>

        {/* Status message */}
        <div
          style={{
            fontSize: "0.9375rem",
            color: "rgba(255,255,255,0.55)",
            fontWeight: 500,
            minHeight: "1.5rem",
          }}
        >
          {MESSAGES[messageIdx]}
        </div>
      </div>
    </div>
  );
}
