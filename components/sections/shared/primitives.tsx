import * as React from "react";

export function SectionShell({
  children,
  background = "surface",
  className = "",
}: {
  children: React.ReactNode;
  background?: "surface" | "muted" | "inverse" | "brand";
  className?: string;
}) {
  const bg =
    background === "surface"
      ? "var(--ft-surface)"
      : background === "muted"
      ? "var(--ft-surface-muted)"
      : background === "inverse"
      ? "var(--ft-surface-inverse)"
      : "var(--ft-brand)";
  const text =
    background === "inverse" || background === "brand"
      ? "var(--ft-text-inverse)"
      : "var(--ft-text)";
  return (
    <section
      className={className}
      style={{
        background: bg,
        color: text,
        paddingTop: "var(--ft-section-y)",
        paddingBottom: "var(--ft-section-y)",
        paddingLeft: "1.25rem",
        paddingRight: "1.25rem",
      }}
    >
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div
      style={{
        fontSize: "var(--ft-fs-eyebrow)",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        fontWeight: 600,
        color: "var(--ft-brand)",
        marginBottom: "0.75rem",
      }}
    >
      {children}
    </div>
  );
}

export function Heading({
  level = 2,
  size = "h2",
  children,
  align = "left",
  inverse = false,
}: {
  level?: 1 | 2 | 3;
  size?: "display" | "h1" | "h2" | "h3";
  children: React.ReactNode;
  align?: "left" | "center";
  inverse?: boolean;
}) {
  const Tag = (`h${level}` as unknown) as keyof React.JSX.IntrinsicElements;
  return (
    <Tag
      style={{
        fontSize: `var(--ft-fs-${size})`,
        fontWeight: "var(--ft-font-heading-weight)" as unknown as number,
        letterSpacing: "var(--ft-letter-spacing-heading)",
        lineHeight: 1.08,
        margin: 0,
        textAlign: align,
        color: inverse ? "var(--ft-text-inverse)" : "var(--ft-text)",
      }}
    >
      {children}
    </Tag>
  );
}

export function Lead({
  children,
  align = "left",
  inverse = false,
}: {
  children: React.ReactNode;
  align?: "left" | "center";
  inverse?: boolean;
}) {
  return (
    <p
      style={{
        fontSize: "1.125rem",
        lineHeight: 1.55,
        color: inverse ? "var(--ft-text-inverse)" : "var(--ft-text-muted)",
        textAlign: align,
        margin: 0,
        maxWidth: "44rem",
        marginLeft: align === "center" ? "auto" : undefined,
        marginRight: align === "center" ? "auto" : undefined,
      }}
    >
      {children}
    </p>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
}) {
  const padY = size === "lg" ? "1rem" : "0.75rem";
  const padX = size === "lg" ? "1.75rem" : "1.25rem";
  const fs = size === "lg" ? "1.0625rem" : "0.9375rem";

  let bg = "var(--ft-brand)";
  let color = "var(--ft-on-brand)";
  let border = "1px solid var(--ft-brand)";

  if (variant === "secondary") {
    bg = "transparent";
    color = "var(--ft-brand)";
    border = "1px solid var(--ft-border)";
  } else if (variant === "ghost") {
    bg = "transparent";
    color = "var(--ft-text)";
    border = "1px solid transparent";
  }

  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: `${padY} ${padX}`,
        fontSize: fs,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        background: bg,
        color,
        border,
        borderRadius: "var(--ft-radius-md)",
        textDecoration: "none",
        transition: "transform 120ms ease, background 120ms ease",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </a>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.4rem 0.75rem",
        background: "var(--ft-brand-soft)",
        color: "var(--ft-brand)",
        borderRadius: "var(--ft-radius-pill)",
        fontSize: "var(--ft-fs-small)",
        fontWeight: 600,
        letterSpacing: "-0.005em",
      }}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  padded = true,
  bordered = true,
  inverse = false,
}: {
  children: React.ReactNode;
  padded?: boolean;
  bordered?: boolean;
  inverse?: boolean;
}) {
  return (
    <div
      style={{
        background: inverse ? "var(--ft-surface-inverse)" : "var(--ft-surface)",
        color: inverse ? "var(--ft-text-inverse)" : "var(--ft-text)",
        border: bordered ? "1px solid var(--ft-border)" : "none",
        borderRadius: "var(--ft-radius-lg)",
        padding: padded ? "var(--ft-card-pad)" : 0,
        boxShadow: bordered ? "0 1px 2px rgba(15, 23, 42, 0.04)" : "none",
      }}
    >
      {children}
    </div>
  );
}

export function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill={i < count ? "var(--ft-accent)" : "var(--ft-border)"}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
