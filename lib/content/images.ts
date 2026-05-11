import type { BusinessType } from "@/lib/types";

const QUERY_MAP: Record<BusinessType, string> = {
  plumber: "plumber pipe",
  roofer: "roofing house",
  electrician: "electrician work",
  hvac: "hvac technician",
  medspa: "spa wellness",
  dentist: "dental office professional",
  landscaper: "landscaping garden",
  cleaner: "professional cleaning service",
  general: "professional tradesperson",
};

export async function fetchHeroImage(
  businessType: string,
  _businessName: string,
  _location: string
): Promise<string | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;

  try {
    const query = QUERY_MAP[businessType as BusinessType] ?? "professional service";
    console.log('[Unsplash] fetching:', query);
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=portrait&per_page=1&client_id=${key}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    console.log('[Unsplash] status:', res.status);
    if (!res.ok) return null;
    const json = (await res.json()) as { results?: { urls?: { regular?: string } }[] };
    return json.results?.[0]?.urls?.regular ?? null;
  } catch (e) {
    console.error('[Unsplash] error:', e);
    return null;
  }
}
