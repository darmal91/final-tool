import type { Density, RadiusStyle, ResolvedTheme, ThemeTokens } from "@/lib/types";
import type { Tone } from "@/lib/types";

interface TonePalette {
  brand: string;
  brandHover: string;
  brandSoft: string;
  onBrand: string;
  surface: string;
  surfaceMuted: string;
  surfaceInverse: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
  accent: string;
  fontFamily: string;
  fontWeightHeading: string;
  letterSpacingHeading: string;
}

const TONE_PALETTES: Record<Tone, TonePalette> = {
  premium: {
    brand: "#0F172A",
    brandHover: "#020617",
    brandSoft: "#E2E8F0",
    onBrand: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceMuted: "#F8FAFC",
    surfaceInverse: "#0F172A",
    text: "#0F172A",
    textMuted: "#475569",
    textInverse: "#F8FAFC",
    border: "#E2E8F0",
    accent: "#C8A24B",
    fontFamily: '"Playfair Display", "Inter", system-ui, sans-serif',
    fontWeightHeading: "600",
    letterSpacingHeading: "-0.02em",
  },
  friendly: {
    brand: "#2563EB",
    brandHover: "#1D4ED8",
    brandSoft: "#DBEAFE",
    onBrand: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceMuted: "#F1F5F9",
    surfaceInverse: "#1E3A8A",
    text: "#0F172A",
    textMuted: "#64748B",
    textInverse: "#F8FAFC",
    border: "#E2E8F0",
    accent: "#F59E0B",
    fontFamily: '"Inter", system-ui, sans-serif',
    fontWeightHeading: "700",
    letterSpacingHeading: "-0.025em",
  },
  aggressive: {
    brand: "#DC2626",
    brandHover: "#B91C1C",
    brandSoft: "#FEE2E2",
    onBrand: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceMuted: "#F8FAFC",
    surfaceInverse: "#111111",
    text: "#111111",
    textMuted: "#525252",
    textInverse: "#FAFAFA",
    border: "#E5E7EB",
    accent: "#FACC15",
    fontFamily: '"Inter", system-ui, sans-serif',
    fontWeightHeading: "800",
    letterSpacingHeading: "-0.03em",
  },
};

const DENSITY_SPACING: Record<
  Density,
  {
    sectionY: string;
    sectionYSm: string;
    blockGap: string;
    itemGap: string;
    cardPad: string;
  }
> = {
  tight: {
    sectionY: "4rem",
    sectionYSm: "2.5rem",
    blockGap: "1.25rem",
    itemGap: "0.75rem",
    cardPad: "1.25rem",
  },
  normal: {
    sectionY: "6rem",
    sectionYSm: "4rem",
    blockGap: "2rem",
    itemGap: "1rem",
    cardPad: "1.75rem",
  },
  airy: {
    sectionY: "8rem",
    sectionYSm: "5rem",
    blockGap: "2.75rem",
    itemGap: "1.5rem",
    cardPad: "2.25rem",
  },
};

const RADIUS_VALUES: Record<RadiusStyle, { sm: string; md: string; lg: string; pill: string }> = {
  soft: { sm: "0.5rem", md: "1rem", lg: "1.5rem", pill: "9999px" },
  sharp: { sm: "0.125rem", md: "0.25rem", lg: "0.375rem", pill: "0.5rem" },
};

const TYPOGRAPHY_SCALE = {
  display: "clamp(2.75rem, 5.5vw, 4.25rem)",
  h1: "clamp(2.25rem, 4vw, 3.25rem)",
  h2: "clamp(1.75rem, 3vw, 2.5rem)",
  h3: "1.5rem",
  body: "1.0625rem",
  small: "0.875rem",
  micro: "0.75rem",
  eyebrow: "0.8125rem",
};

export function resolveTheme(tokens: ThemeTokens): ResolvedTheme {
  const palette = TONE_PALETTES[tokens.tone];
  const spacing = DENSITY_SPACING[tokens.density];
  const radii = RADIUS_VALUES[tokens.radius];

  const cssVars: Record<string, string> = {
    "--ft-brand": palette.brand,
    "--ft-brand-hover": palette.brandHover,
    "--ft-brand-soft": palette.brandSoft,
    "--ft-on-brand": palette.onBrand,
    "--ft-surface": palette.surface,
    "--ft-surface-muted": palette.surfaceMuted,
    "--ft-surface-inverse": palette.surfaceInverse,
    "--ft-text": palette.text,
    "--ft-text-muted": palette.textMuted,
    "--ft-text-inverse": palette.textInverse,
    "--ft-border": palette.border,
    "--ft-accent": palette.accent,
    "--ft-font": palette.fontFamily,
    "--ft-font-heading-weight": palette.fontWeightHeading,
    "--ft-letter-spacing-heading": palette.letterSpacingHeading,
    "--ft-section-y": spacing.sectionY,
    "--ft-section-y-sm": spacing.sectionYSm,
    "--ft-block-gap": spacing.blockGap,
    "--ft-item-gap": spacing.itemGap,
    "--ft-card-pad": spacing.cardPad,
    "--ft-radius-sm": radii.sm,
    "--ft-radius-md": radii.md,
    "--ft-radius-lg": radii.lg,
    "--ft-radius-pill": radii.pill,
    "--ft-fs-display": TYPOGRAPHY_SCALE.display,
    "--ft-fs-h1": TYPOGRAPHY_SCALE.h1,
    "--ft-fs-h2": TYPOGRAPHY_SCALE.h2,
    "--ft-fs-h3": TYPOGRAPHY_SCALE.h3,
    "--ft-fs-body": TYPOGRAPHY_SCALE.body,
    "--ft-fs-small": TYPOGRAPHY_SCALE.small,
    "--ft-fs-micro": TYPOGRAPHY_SCALE.micro,
    "--ft-fs-eyebrow": TYPOGRAPHY_SCALE.eyebrow,
  };

  return { tokens, cssVars, fontFamily: palette.fontFamily };
}

export function cssVarsToInline(theme: ResolvedTheme): React.CSSProperties {
  return theme.cssVars as unknown as React.CSSProperties;
}

export const DEFAULT_THEME_TOKENS: ThemeTokens = {
  tone: "friendly",
  density: "normal",
  radius: "soft",
};
