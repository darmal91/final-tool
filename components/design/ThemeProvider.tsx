"use client";

import { createContext, useContext, useMemo } from "react";
import type { ResolvedTheme, ThemeTokens } from "@/lib/types";
import { resolveTheme, cssVarsToInline } from "@/lib/design/tokens";

const ThemeContext = createContext<ResolvedTheme | null>(null);

export function useTheme(): ResolvedTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}

export function ThemeProvider({
  tokens,
  children,
  asTag = "div",
  className,
}: {
  tokens: ThemeTokens;
  children: React.ReactNode;
  asTag?: "div" | "section" | "main";
  className?: string;
}) {
  const theme = useMemo(() => resolveTheme(tokens), [tokens]);
  const Tag = asTag;
  return (
    <ThemeContext.Provider value={theme}>
      <Tag
        className={className}
        style={{
          ...cssVarsToInline(theme),
          fontFamily: "var(--ft-font)",
          color: "var(--ft-text)",
          background: "var(--ft-surface)",
        }}
      >
        {children}
      </Tag>
    </ThemeContext.Provider>
  );
}
