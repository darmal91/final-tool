import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface ImageCandidate {
  url: string;
  description: string;
  source: "unsplash" | "pexels";
}

async function generateUnsplashQuery(
  businessType: string,
  businessName: string,
  location: string
): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 15,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You generate photo search queries. Return ONLY 2-4 words. No quotes. No punctuation. No explanation. " +
            "The query must find photos of a real person actively doing a trade job — on a job site, in uniform, hands doing work. " +
            "Never suggest: circuit board, equipment close-up, wires only, abstract, product shot.",
        },
        {
          role: "user",
          content: `Business type: ${businessType}. Name: ${businessName}. Location: ${location}. Return 2-4 words.`,
        },
      ],
    });
    const q = completion.choices[0]?.message?.content?.trim() ?? businessType;
    console.log("[images] AI query:", q);
    return q;
  } catch {
    return businessType;
  }
}

async function fetchUnsplashCandidates(
  query: string,
  key: string
): Promise<ImageCandidate[]> {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=portrait&per_page=8&client_id=${key}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      results?: { urls?: { regular?: string }; alt_description?: string; description?: string }[];
    };
    return (json.results ?? [])
      .filter((r) => r.urls?.regular)
      .map((r) => ({
        url: r.urls!.regular!,
        description: r.alt_description ?? r.description ?? "",
        source: "unsplash" as const,
      }));
  } catch {
    return [];
  }
}

async function fetchPexelsCandidates(
  query: string,
  key: string
): Promise<ImageCandidate[]> {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=portrait&per_page=8`;
    const res = await fetch(url, {
      headers: { Authorization: key },
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      photos?: { src?: { large?: string }; alt?: string }[];
    };
    return (json.photos ?? [])
      .filter((p) => p.src?.large)
      .map((p) => ({
        url: p.src!.large!,
        description: p.alt ?? "",
        source: "pexels" as const,
      }));
  } catch {
    return [];
  }
}

async function pickBestCandidate(
  candidates: ImageCandidate[],
  businessType: string,
  businessName: string
): Promise<string | null> {
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0].url;

  const numbered = candidates
    .map((c, i) => `${i + 1}. [${c.source}] "${c.description}"`)
    .join("\n");

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 5,
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "You pick the best hero photo for a local business website. " +
            "Return ONLY the number of the best photo. Nothing else. " +
            "Best means: shows a real person actively doing the trade work, on a job site or in a professional setting. " +
            "Reject: equipment only, close-ups of parts/wires/boards, abstract, stock-looking office scenes.",
        },
        {
          role: "user",
          content:
            `Business: ${businessName} (${businessType})\n\nPhotos:\n${numbered}\n\nReturn only the number of the best photo.`,
        },
      ],
    });
    const raw = completion.choices[0]?.message?.content?.trim() ?? "1";
    const picked = parseInt(raw.match(/\d+/)?.[0] ?? "1", 10);
    const index = Math.min(Math.max(picked - 1, 0), candidates.length - 1);
    console.log("[images] Groq picked #" + (index + 1) + " from " + candidates.length + " candidates:", candidates[index].description);
    return candidates[index].url;
  } catch {
    console.log("[images] Groq pick failed, using first candidate");
    return candidates[0].url;
  }
}

export async function fetchHeroImage(
  businessType: string,
  businessName: string,
  location: string
): Promise<string | null> {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (!unsplashKey && !pexelsKey) return null;

  const query = await generateUnsplashQuery(businessType, businessName, location);

  const [unsplashResults, pexelsResults] = await Promise.all([
    unsplashKey ? fetchUnsplashCandidates(query, unsplashKey) : Promise.resolve([]),
    pexelsKey ? fetchPexelsCandidates(query, pexelsKey) : Promise.resolve([]),
  ]);

  const candidates = [...unsplashResults, ...pexelsResults];
  console.log("[images] candidates:", candidates.length, "(unsplash:", unsplashResults.length, "pexels:", pexelsResults.length + ")");

  return pickBestCandidate(candidates, businessType, businessName);
}
