export type BusinessType =
  | "plumber"
  | "roofer"
  | "electrician"
  | "hvac"
  | "medspa"
  | "dentist"
  | "landscaper"
  | "cleaner"
  | "general";

export type Tone = "premium" | "friendly" | "aggressive";

export interface BusinessAsset {
  id: string;
  context: "logo" | "hero" | "gallery";
  filename: string;
  url: string;
  width?: number;
  height?: number;
}

export interface BusinessInput {
  businessName: string;
  businessType: BusinessType;
  location: string;
  services: string[];
  tone: Tone;
  differentiator: string;
  phone?: string;
  email?: string;
}

export interface BusinessProject {
  id: string;
  createdAt: string;
  input: BusinessInput;
  assets: BusinessAsset[];
}
