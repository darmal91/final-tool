import Anthropic from "@anthropic-ai/sdk";
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

const MODEL = "claude-sonnet-4-6";

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

function parseJsonStrict(text: string): unknown {
  const trimmed = text.trim();
  const stripped = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(stripped);
}

export async function refineCopy(
  copy: GeneratedCopy,
  input: BusinessInput,
  strategy?: CompositionStrategy
): Promise<{ copy: GeneratedCopy; refined: boolean; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { copy, refined: false };
  }

  const current = extractRefineShape(input, copy);

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: [
        {
          type: "text",
          text: REFINE_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: refineUserPrompt(input, current, strategy) }],
    });

    const textBlock = message.content.find((c) => c.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text in refinement response");
    }

    const parsed = parseJsonStrict(textBlock.text);
    if (!isRefineShape(parsed, current.services.length)) {
      throw new Error("Refinement response did not match expected shape");
    }

    return { copy: applyRefineShape(copy, parsed), refined: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { copy, refined: false, error: msg };
  }
}
