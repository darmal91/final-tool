"use client";

import { useRef, useState } from "react";
import type { BusinessAsset } from "@/lib/types";

export default function AssetDropzone({
  businessId,
  context,
  label,
  hint,
  current,
  onChange,
}: {
  businessId: string;
  context: BusinessAsset["context"];
  label: string;
  hint: string;
  current?: BusinessAsset;
  onChange: (assets: BusinessAsset[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("context", context);
      const res = await fetch(`/api/assets/${businessId}`, { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "upload_failed");
      }
      const list = await fetch(`/api/assets/${businessId}`).then((r) => r.json());
      onChange(list.assets);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!current) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/assets/${businessId}/${current.filename}`, {
        method: "DELETE",
      });
      const j = await res.json();
      onChange(j.assets || []);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        const f = e.dataTransfer.files?.[0];
        if (f) upload(f);
      }}
      style={{
        padding: "1rem",
        background: hover ? "#eff6ff" : "white",
        border: hover
          ? "2px dashed #3b82f6"
          : current
          ? "1px solid #e2e8f0"
          : "2px dashed #cbd5e1",
        borderRadius: "0.625rem",
        transition: "background 120ms ease, border-color 120ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{label}</div>
          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{hint}</div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            padding: "0.4rem 0.75rem",
            background: "white",
            border: "1px solid #cbd5e1",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          {busy ? "Working…" : "Browse"}
        </button>
      </div>

      {current ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt=""
            style={{
              width: "56px",
              height: "56px",
              objectFit: "cover",
              borderRadius: "0.375rem",
              border: "1px solid #e2e8f0",
            }}
          />
          <div style={{ fontSize: "0.8125rem", color: "#475569", flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {current.filename}
            </div>
            <div>{current.width}×{current.height} · WebP</div>
          </div>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            style={{
              fontSize: "0.75rem",
              color: "#dc2626",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        <div style={{ fontSize: "0.8125rem", color: "#94a3b8", padding: "0.5rem 0" }}>
          Drop an image here or browse. Auto-converts to WebP.
        </div>
      )}

      {error && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#dc2626" }}>{error}</div>
      )}
    </div>
  );
}
