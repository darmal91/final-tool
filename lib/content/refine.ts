import Anthropic from "@anthropic-ai/sdk";
import type {
  BusinessInput,
  HeroContent,
  ServicesContent,
  ReviewsContent,
  CTAContent,
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

interface RefineShape {
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

const REFINE_SYSTEM_PROMPT = `You are a senior conversion copywriter at a top-tier agency.

You receive an existing JSON object of copy fields and rewrite ONLY the values to feel agency-grade. You return ONLY the same JSON shape. No prose. No markdown. No code fences.

Hard rules:
- Do NOT add, rename, or remove any fields.
- Do NOT touch any field outside the JSON you are given.
- Output must be valid JSON with the EXACT same keys.

Style rules:

HERO
- headline: clear outcome, emotionally compelling, no fluff. Avoid generic phrases like "high quality service". Specific and confident. 6–12 words.
- subheadline: support the claim, reduce risk, add credibility or specificity. One sentence.

CTA
- headline: action-oriented, reinforces urgency or value.
- subtext: remove friction, reduce hesitation, clarify what happens next. One sentence.
- buttonText: specific and action-driven. Avoid generic "Submit" or "Contact Us". 2–4 words.

Tone targets:
- Confident but not hypey.
- Clear over clever.
- Specific over vague.
- Sounds like a real business, not AI.`;

function refineUserPrompt(
  input: BusinessInput,
  current: RefineShape,
  strategy?: CompositionStrategy
): string {
  const strategyLine = strategy
    ? `Strategic voice (do NOT alter structure): ${describeStrategy(strategy)}`
    : "";
  return `Business: ${input.businessName}
Type: ${input.businessType}
Location: ${input.location}
Differentiator: ${input.differentiator || "(none provided)"}
${strategyLine}

Rewrite the values in the following JSON. Return the same shape with refined text.

${JSON.stringify(current, null, 2)}`;
}

function extractRefineShape(copy: GeneratedCopy): RefineShape {
  return {
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
  return {
    ...copy,
    hero: {
      ...copy.hero,
      headline: refined.hero.headline || copy.hero.headline,
      subheadline: refined.hero.subheadline || copy.hero.subheadline,
    },
    cta: {
      ...copy.cta,
      heading: refined.cta.headline || copy.cta.heading,
      subheading: refined.cta.subtext || copy.cta.subheading,
      buttonText: refined.cta.buttonText || copy.cta.buttonText,
    },
  };
}

function isRefineShape(value: unknown): value is RefineShape {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  const hero = v.hero as Record<string, unknown> | undefined;
  const cta = v.cta as Record<string, unknown> | undefined;
  if (!hero || typeof hero !== "object") return false;
  if (!cta || typeof cta !== "object") return false;
  return (
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

  const current = extractRefineShape(copy);

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
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
    if (!isRefineShape(parsed)) {
      throw new Error("Refinement response did not match expected shape");
    }

    return { copy: applyRefineShape(copy, parsed), refined: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { copy, refined: false, error: msg };
  }
}
