import type {
  BusinessInput,
  HeroContent,
  ServicesContent,
  ReviewsContent,
  CTAContent,
  ServiceItem,
} from "@/lib/types";
import {
  describeStrategy,
  type CompositionStrategy,
} from "@/lib/composition/strategy";

interface GeneratedCopy {
  hero: HeroContent;
  services: ServicesContent;
  reviews: ReviewsContent;
  cta: CTAContent;
}

interface RefineService {
  title: string;
  description: string;
}

interface RefineShape {
  businessType: string;
  location: string;
  services: RefineService[];
  hero: {
    headline: string;
    subheadline: string;
  };
  cta: {
    headline: string;
    subtext: string;
    buttonText: string;
  };
}

const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const REFINE_SYSTEM_PROMPT = `You are a senior conversion copywriter for local service businesses.

You receive an existing JSON object of copy fields and rewrite ONLY the values to feel like a real, high-performing local service website. You return ONLY the same JSON shape. No prose. No markdown. No code fences.

Hard rules:
- Do NOT add, rename, or remove any fields.
- Do NOT add or remove services. The services array length must stay identical.
- Preserve each service's intent (outcome / problem / assurance / speed). Keep titles aligned with the same offering.
- Do NOT touch any field outside the JSON you are given.
- Output must be valid JSON with the EXACT same keys.

SERVICES
- Each service description must feel individually written. No shared rhythm or repeated sentence openings across services.
- Vary sentence structure between items. Some short, some longer. Different verbs and entry points.
- Make descriptions slightly more specific and human; mention concrete details where natural.
- Do NOT overhype or exaggerate. No "best in class", "world-class", "premier".

HERO
- headline: outcome-driven and specific. Grounded in the business type and location. Avoid generic phrases like "best in class" or "high quality service". 6–12 words.
- subheadline: support the claim, reduce risk, add credibility or specificity. One sentence.

CTA
- headline: action-oriented, reinforces value or urgency. Avoid aggressive sales tone unless the business is a high-conversion trade (plumber, hvac, roofer, electrician).
- subtext: reduce hesitation, make the next step feel simple and safe, clarify what happens next. One sentence.
- buttonText: specific and action-driven. Avoid generic "Submit" or "Contact Us". 2–4 words.

Style target:
- Natural human tone.
- Subtle variation in sentence structure.
- Slight imperfection allowed for realism.
- No AI-like symmetry across lines.
- Sounds like a real business, not AI.

Echo businessType and location back unchanged.`;

function refineUserPrompt(
  input: BusinessInput,
  current: RefineShape,
  strategy?: CompositionStrategy
): string {
  const strategyLine = strategy
    ? `Strategic voice (do NOT alter structure): ${describeStrategy(strategy)}`
    : "";
  return `Business: ${input.businessName}
Differentiator: ${input.differentiator || "(none provided)"}
${strategyLine}

Rewrite the values in the following JSON. Return the same shape with refined text.

${JSON.stringify(current, null, 2)}`;
}

function extractRefineShape(input: BusinessInput, copy: GeneratedCopy): RefineShape {
  return {
    businessType: input.businessType,
    location: input.location,
    services: copy.services.services.map((s) => ({
      title: s.title,
      description: s.description,
    })),
    hero: {
      headline: copy.hero.headline,
      subheadline: copy.hero.subheadline,
    },
    cta: {
      headline: copy.cta.heading,
      subtext: copy.cta.subheading,
      buttonText: copy.cta.buttonText,
    },
  };
}

function applyRefineShape(copy: GeneratedCopy, refined: RefineShape): GeneratedCopy {
  const refinedServices: ServiceItem[] = copy.services.services.map((original, idx) => {
    const r = refined.services[idx];
    if (!r) return original;
    return {
      ...original,
      title: r.title.trim() || original.title,
      description: r.description.trim() || original.description,
    };
  });

  return {
    ...copy,
    hero: {
      ...copy.hero,
      headline: refined.hero.headline || copy.hero.headline,
      subheadline: refined.hero.subheadline || copy.hero.subheadline,
    },
    services: {
      ...copy.services,
      services: refinedServices,
    },
    cta: {
      ...copy.cta,
      heading: refined.cta.headline || copy.cta.heading,
      subheading: refined.cta.subtext || copy.cta.subheading,
      buttonText: refined.cta.buttonText || copy.cta.buttonText,
    },
  };
}

function isRefineService(value: unknown): value is RefineService {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.title === "string" && typeof v.description === "string";
}

function isRefineShape(value: unknown, expectedServiceCount: number): value is RefineShape {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  const hero = v.hero as Record<string, unknown> | undefined;
  const cta = v.cta as Record<string, unknown> | undefined;
  const services = v.services;
  if (!Array.isArray(services) || services.length !== expectedServiceCount) return false;
  if (!services.every(isRefineService)) return false;
  if (!hero || typeof hero !== "object") return false;
  if (!cta || typeof cta !== "object") return false;
  return (
    typeof v.businessType === "string" &&
    typeof v.location === "string" &&
    typeof hero.headline === "string" &&
    typeof hero.subheadline === "string" &&
    typeof cta.headline === "string" &&
    typeof cta.subtext === "string" &&
    typeof cta.buttonText === "string"
  );
}

const FORBIDDEN_DESCRIPTION_PATTERNS: RegExp[] = [
  /finished to a standard that holds/i,
  /won't need to call back/i,
  /customers won't need to call/i,
  /customers won't need to/i,
  /handled by experienced/i,
  /reliable \w+ for/i,
  /done right the first time/i,
  /experienced professionals/i,
];

const FALLBACK_DESCRIPTIONS: Record<string, string> = {
  "Emergency Repair": "Available now. We pick up, show up, and fix it — day or night.",
  "Drain Cleaning": "We find where it starts, not just where the water stops. One visit, clear drain, clear explanation.",
  "Water Heaters": "Most replacements done same day. We carry common units and don't schedule a second trip.",
  "Fixture Install": "Faucets, toilets, showers — installed clean, sealed right, no callbacks.",
};

function stripForbiddenDescriptions(copy: GeneratedCopy): GeneratedCopy {
  const cleaned = copy.services.services.map((s) => {
    const hit = FORBIDDEN_DESCRIPTION_PATTERNS.find((re) => re.test(s.description));
    if (hit) {
      const fallback = FALLBACK_DESCRIPTIONS[s.title] ?? "";
      console.warn(
        `[refine] forbidden pattern detected in "${s.title}" — ${fallback ? "using fallback" : "clearing"} description. Pattern: ${hit}`
      );
      return { ...s, description: fallback };
    }
    return s;
  });

  return {
    ...copy,
    services: { ...copy.services, services: cleaned },
  };
}

function extractAndParseJson(text: string): unknown {
  let s = text.replace(/^﻿/, "").trim();
  s = s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

  const fenceMatch = s.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    s = fenceMatch[1].trim();
  }

  try {
    return JSON.parse(s);
  } catch (firstErr) {
    const firstBrace = s.indexOf("{");
    const lastBrace = s.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const sliced = s.slice(firstBrace, lastBrace + 1);
      console.log("[refine] retrying parse with brace-extracted slice");
      try {
        return JSON.parse(sliced);
      } catch (secondErr) {
        const m = secondErr instanceof Error ? secondErr.message : String(secondErr);
        throw new Error(`JSON parse failed after brace-slice: ${m}`);
      }
    }
    const m = firstErr instanceof Error ? firstErr.message : String(firstErr);
    throw new Error(`JSON parse failed: ${m}`);
  }
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
}

export async function refineCopy(
  copy: GeneratedCopy,
  input: BusinessInput,
  strategy?: CompositionStrategy
): Promise<{ copy: GeneratedCopy; refined: boolean; error?: string }> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.log("[refine] no GOOGLE_API_KEY — skipping refinement");
    return { copy, refined: false };
  }

  const current = extractRefineShape(input, copy);
  let rawText: string | undefined;

  try {
    const response = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: REFINE_SYSTEM_PROMPT }] },
        contents: [
          { role: "user", parts: [{ text: refineUserPrompt(input, current, strategy) }] },
        ],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.9,
          responseMimeType: "application/json",
        },
      }),
    });

    console.log("[refine] gemini status:", response.status);

    const data = (await response.json()) as GeminiResponse;

    if (!response.ok) {
      const apiMsg = data.error?.message || `HTTP ${response.status}`;
      throw new Error(`Gemini API error: ${apiMsg}`);
    }

    if (data.promptFeedback?.blockReason) {
      throw new Error(`Gemini blocked: ${data.promptFeedback.blockReason}`);
    }

    const candidate = data.candidates?.[0];
    rawText = candidate?.content?.parts?.[0]?.text;
    const finishReason = candidate?.finishReason;
    console.log("[refine] finishReason:", finishReason);

    if (!rawText || typeof rawText !== "string") {
      throw new Error("No text in Gemini response");
    }

    console.log("[refine] raw text head:", rawText.slice(0, 200));
    console.log("[refine] raw text tail:", rawText.slice(-120));

    const parsed = extractAndParseJson(rawText);
    if (!isRefineShape(parsed, current.services.length)) {
      throw new Error(
        `Refinement response did not match expected shape (expected ${current.services.length} services)`
      );
    }

    const merged = applyRefineShape(copy, parsed);
    console.log("[refine] applied refined copy: services", parsed.services.length);
    return { copy: stripForbiddenDescriptions(merged), refined: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[refine] failure:", msg);
    if (rawText) {
      console.error("[refine] rawText snapshot:", rawText.slice(0, 400));
    }
    return { copy, refined: false, error: msg };
  }
}
