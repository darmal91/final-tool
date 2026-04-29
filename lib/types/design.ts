import type { Tone } from "./business";

export type Density = "tight" | "normal" | "airy";
export type RadiusStyle = "soft" | "sharp";

export interface ThemeTokens {
  tone: Tone;
  density: Density;
  radius: RadiusStyle;
}

export interface ResolvedTheme {
  tokens: ThemeTokens;
  cssVars: Record<string, string>;
  fontFamily: string;
}
