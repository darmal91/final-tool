export const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

export function isValidHex(v: unknown): v is string {
  return typeof v === "string" && HEX_RE.test(v);
}

export function hexDarken(hex: string, amount: number): string {
  const r = Math.max(0, Math.round(parseInt(hex.slice(1, 3), 16) * (1 - amount)));
  const g = Math.max(0, Math.round(parseInt(hex.slice(3, 5), 16) * (1 - amount)));
  const b = Math.max(0, Math.round(parseInt(hex.slice(5, 7), 16) * (1 - amount)));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function hexSoft(hex: string, alpha = 0.12): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * alpha + 255 * (1 - alpha));
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * alpha + 255 * (1 - alpha));
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * alpha + 255 * (1 - alpha));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
