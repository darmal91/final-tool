"use client";

import { useRef, useState } from "react";
import type { HeroContent } from "@/lib/types";
import { EditableText } from "@/components/render/Editable";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PremiumSplitHero({
  content,
  heroImageUrl,
  onImageUpload,
}: {
  content: HeroContent;
  heroImageUrl?: string;
  onImageUpload?: (dataUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const imageUrl = heroImageUrl;
  const isEditor = !!onImageUpload;

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const dataUrl = await readFileAsDataUrl(file);
    onImageUpload?.(dataUrl);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <section
      style={{
        background: "var(--ft-surface-inverse)",
        color: "var(--ft-text-inverse)",
        minHeight: "580px",
        display: "flex",
        alignItems: "stretch",
        padding: "6rem 1.25rem 0",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--ft-block-gap)",
          alignItems: "center",
          padding: 0,
        }}
        className="ft-premium-split"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            alignItems: "flex-start",
          }}
        >
          {content.trustBadges.length > 0 && (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {content.trustBadges.slice(0, 5).map((b) => (
                <span
                  key={b}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.3rem 0.75rem",
                    background: "rgba(255,255,255,0.1)",
                    color: "var(--ft-text-inverse)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: "var(--ft-radius-pill)",
                    fontSize: "var(--ft-fs-small)",
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          <div
            style={{
              fontSize: "var(--ft-fs-eyebrow)",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontWeight: 600,
              opacity: 0.65,
              color: "var(--ft-text-inverse)",
            }}
          >
            {content.eyebrow}
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.08,
              margin: 0,
              color: "var(--ft-text-inverse)",
            }}
          >
            <EditableText fieldPath="headline">{content.headline}</EditableText>
          </h1>

          <p
            style={{
              fontSize: "1.125rem",
              lineHeight: 1.55,
              color: "var(--ft-text-inverse)",
              opacity: 0.7,
              margin: 0,
              maxWidth: "540px",
            }}
          >
            <EditableText fieldPath="subheadline" multiline>{content.subheadline}</EditableText>
          </p>

          <a
            href={content.ctaHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem 2rem",
              fontSize: "calc(var(--ft-cta-scale, 1) * 1.0625rem)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              background: "var(--ft-on-brand)",
              color: "var(--ft-brand)",
              border: "none",
              borderRadius: "var(--ft-radius-md)",
              textDecoration: "none",
              boxShadow: "0 10px 24px -8px rgba(0,0,0,0.4)",
              whiteSpace: "normal",
              textAlign: "center",
            }}
          >
            <EditableText fieldPath="ctaText">{content.ctaText}</EditableText>
          </a>
        </div>

        {/* Right panel — image or drop zone */}
        <div
          style={{
            borderRadius: "var(--ft-radius-lg)",
            minHeight: "380px",
            alignSelf: "stretch",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: imageUrl
              ? "transparent"
              : dragging
              ? "rgba(255,255,255,0.1)"
              : "rgba(255,255,255,0.05)",
            border: imageUrl
              ? "none"
              : `2px dashed ${dragging ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}`,
            cursor: isEditor ? "pointer" : "default",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={isEditor ? () => inputRef.current?.click() : undefined}
          onDragOver={isEditor ? (e) => { e.preventDefault(); setDragging(true); } : undefined}
          onDragLeave={isEditor ? () => setDragging(false) : undefined}
          onDrop={isEditor ? onDrop : undefined}
        >
          {imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {isEditor && hovered && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                  style={{
                    position: "absolute",
                    top: "0.625rem",
                    right: "0.625rem",
                    padding: "0.3rem 0.7rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    background: "rgba(0,0,0,0.55)",
                    color: "white",
                    border: "none",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  Change photo
                </button>
              )}
            </>
          ) : isEditor ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.625rem",
                color: dragging ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
                pointerEvents: "none",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span style={{ fontSize: "0.8125rem", fontWeight: 500, letterSpacing: "0.01em" }}>
                {dragging ? "Drop to upload" : "Drop your photo here"}
              </span>
            </div>
          ) : null}

          {isEditor && (
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files)}
            />
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ft-premium-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
