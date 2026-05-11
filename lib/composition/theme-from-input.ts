import type { BusinessInput, ThemeTokens } from "@/lib/types";

export function themeFromInput(input: BusinessInput): ThemeTokens {
  const tone = input.tone;

  // Density and radius are deterministic functions of tone + business type.
  // Keeps style consistent across re-generations of the same input.
  let density: ThemeTokens["density"] = "normal";
  let radius: ThemeTokens["radius"] = "soft";

  if (tone === "premium") {
    density = "airy";
    radius = "soft";
  } else if (tone === "aggressive") {
    density = "tight";
    radius = "sharp";
  } else {
    density = "normal";
    radius = "soft";
  }

  // Field service trades feel a touch tighter even when friendly.
  if (
    tone === "friendly" &&
    (input.businessType === "plumber" ||
      input.businessType === "roofer" ||
      input.businessType === "electrician" ||
      input.businessType === "hvac")
  ) {
    density = "normal";
    radius = "soft";
  }

  return { tone, density, radius, primaryColor: input.primaryColor, accentColor: input.accentColor };
}
