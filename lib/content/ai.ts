import Anthropic from "@anthropic-ai/sdk";
import type {
  BusinessInput,
  HeroContent,
  ServicesContent,
  ReviewsContent,
  CTAContent,
} from "@/lib/types";
import {
  buildHeroContent,
  buildServicesContent,
  buildReviewsContent,
  buildCTAContent,
} from "@/lib/composition/templates";
import {
  describeStrategy,
  type CompositionStrategy,
} from "@/lib/composition/strategy";
import type { RealWorldPattern } from "@/lib/composition/realWorldPatterns";

interface GeneratedCopy {
  hero: HeroContent;
  services: ServicesContent;
  reviews: ReviewsContent;
  cta: CTAContent;
}

const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You write conversion-focused copy for small local business websites.

You return ONLY a JSON object that matches the schema you are given. No prose. No markdown. No code fences.

Rules:
- Plain language. No jargon. No marketing fluff.
- Specific to the business: include the location and trade where it adds trust.
- Headlines should be 6–12 words, not generic ("Welcome to..." is forbidden).
SERVICE DESCRIPTIONS — CRITICAL RULES:
- Every description MUST be unique. No shared sentence structure across services.
- Never use the pattern "Reliable [X] for [location] customers, handled by experienced [trade] professionals." — this is forbidden.
- Never repeat the same opening verb or phrase across any two descriptions.
- Each description should reflect what makes THAT specific service distinct: its urgency, its process, its outcome, or its common failure mode.
- Vary sentence length and entry point: some short and punchy, some longer, different verb choices per item.
- Write like a real person who understands the trade, not a template generator.
- 14–22 words per description. One sentence.
- Reviews must sound like real people, varied tone, not all enthusiastic. Names should be realistic.
- Never invent claims that imply credentials, guarantees, or numbers the business did not provide.
- You are NOT in charge of layout, sections, or design. Only text.
- Output valid JSON. All required fields filled.`;

function userPrompt(
  input: BusinessInput,
  strategy?: CompositionStrategy,
  pattern?: RealWorldPattern
): string {
  const strategyLine = strategy
    ? `Strategic voice (content guidance only — do NOT alter structure): ${describeStrategy(strategy)}`
    : "";
  const patternLine = pattern
    ? `Copy must follow real-world framing:\nHero: ${pattern.heroPatterns.headlineStyle}\nServices: ${pattern.serviceFraming}\nReviews: ${pattern.reviewFraming}\nCTA: ${pattern.ctaStyle}`
    : "";
  return `Business: ${input.businessName}
Type: ${input.businessType}
Location: ${input.location}
Tone: ${input.tone}
Differentiator: ${input.differentiator || "(none provided)"}
Services: ${input.services.join(", ") || "(none provided)"}
${input.phone ? `Phone: ${input.phone}` : ""}
${input.email ? `Email: ${input.email}` : ""}
${strategyLine}
${patternLine}

Return JSON in exactly this shape:
{
  "hero": {
    "eyebrow": "string (short label, business type · location)",
    "headline": "string",
    "subheadline": "string",
    "ctaText": "string (2-4 words)",
    "ctaHref": "#contact",
    "trustBadges": ["string", ...] (2-4 items, short, e.g. 'Licensed & insured')
  },
  "services": {
    "heading": "string",
    "subheading": "string",
    "services": [
      { "title": "string", "description": "string", "icon": "string (single emoji)" }
    ]
  },
  "reviews": {
    "heading": "string",
    "subheading": "string",
    "reviews": [
      { "name": "string", "role": "string", "body": "string", "rating": 5 }
    ] (exactly 3 items)
  },
  "cta": {
    "eyebrow": "string",
    "heading": "string",
    "subheading": "string",
    "buttonText": "string",
    "buttonHref": "${input.phone ? `tel:${input.phone}` : "#contact"}",
    "microcopy": "string"
  }
}

The services array length must match the input services list (${input.services.length || 4} items).
Use the input services list for titles when provided.

BAD service descriptions (forbidden — all same structure):
- "Reliable emergency repair for Austin, TX customers, handled by experienced plumbing professionals."
- "Reliable drain cleaning for Austin, TX customers, handled by experienced plumbing professionals."

GOOD service descriptions (varied, specific, human):
- "Emergency Repair: Burst pipe, no water, sewage back-up — we pick up and move fast. Same-day across Austin."
- "Drain Cleaning: Slow drains usually mean one thing caught early or one thing ignored too long. We clear it and tell you which."
- "Water Heaters: Install, replace, or repair — we stock common units and can often finish the same visit."
- "Fixture Install: Faucets, toilets, showers. Done clean, no leaks, no follow-up calls needed."

Write descriptions in this spirit — each one specific to what that service actually is.`;
}

function fallback(input: BusinessInput): GeneratedCopy {
  return {
    hero: buildHeroContent(input),
    services: buildServicesContent(input),
    reviews: buildReviewsContent(input),
    cta: buildCTAContent(input),
  };
}

export async function generateCopy(
  input: BusinessInput,
  strategy?: CompositionStrategy,
  pattern?: RealWorldPattern
): Promise<{
  copy: GeneratedCopy;
  source: "ai" | "template";
  error?: string;
}> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { copy: fallback(input), source: "template" };
  }

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt(input, strategy, pattern) }],
    });

    const textBlock = message.content.find((c) => c.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text in AI response");
    }

    const parsed = parseJsonStrict(textBlock.text) as Partial<GeneratedCopy>;
    const merged = mergeWithFallback(parsed, fallback(input));
    return { copy: merged, source: "ai" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { copy: fallback(input), source: "template", error: msg };
  }
}

function parseJsonStrict(text: string): unknown {
  const trimmed = text.trim();
  // Tolerate leading/trailing fences if the model adds them despite instructions.
  const stripped = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(stripped);
}

function mergeWithFallback(
  partial: Partial<GeneratedCopy>,
  fb: GeneratedCopy
): GeneratedCopy {
  return {
    hero: { ...fb.hero, ...(partial.hero || {}) },
    services: {
      ...fb.services,
      ...(partial.services || {}),
      services:
        partial.services?.services && partial.services.services.length > 0
          ? partial.services.services
          : fb.services.services,
    },
    reviews: {
      ...fb.reviews,
      ...(partial.reviews || {}),
      reviews:
        partial.reviews?.reviews && partial.reviews.reviews.length > 0
          ? partial.reviews.reviews
          : fb.reviews.reviews,
    },
    cta: { ...fb.cta, ...(partial.cta || {}) },
  };
}
