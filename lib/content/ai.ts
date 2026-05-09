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

interface HeroLines {
  headline: string;
  subheadline: string;
}

const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const SYSTEM_PROMPT = `You write conversion-focused copy for small local business websites.

You return ONLY a JSON object that matches the schema you are given. No prose. No markdown. No code fences.

Rules:
- Plain language. No jargon. No marketing fluff.
- Specific to the business: include the location and trade where it adds trust.
HERO HEADLINE RULES:
The headline must do ONE of these three things — pick based on business type and tone:

OUTCOME: State the result the customer gets. Not what you do — what they have after.
  Formula: "[Situation resolved] in [timeframe/location]" or "[Result], [qualifier]"
  Examples:
  - "Your plumbing fixed today. No callbacks."
  - "Storm damage handled before it gets worse."
  - "Hot water again by tonight."
  - "A yard you'll actually use this summer."

PROBLEM: Name the customer's pain or fear directly. Make them feel seen.
  Formula: "[Pain point]? [We solve it]." or "Tired of [problem]?"
  Examples:
  - "Leaking pipe at midnight? We pick up."
  - "Roof damage doesn't wait for Monday."
  - "Your AC quit. We're already on the way."

CREDIBILITY: Lead with a specific proof point that earns trust instantly.
  Formula: "[Specific number or fact] + [what that means for the customer]"
  Examples:
  - "20 years fixing Dallas plumbing. Still family-owned."
  - "500 roofs replaced in Austin. Yours is next."
  - "Board-certified injectors only. No exceptions."

RULES:
- 5-10 words maximum
- Never start with the business name
- Never use: "Welcome", "Discover", "Your trusted", "Quality", "Professional", "Solutions"
- Never describe what the business does — say what the customer gets
- Must feel like it was written by a human who knows this trade, not a marketer
- The differentiator input MUST influence the headline if provided
SERVICES SECTION HEADING RULES:
- Services section heading must never use: Done Right, Solutions, Professional, Quality, Trusted.
- Use plain headings like "What we do", "Our services", "How we help", or a trade-specific phrase.
- Never use the word "reliably" or "reliable" in subheadings.
- Subheadings should state a specific scope, speed, or location fact — not a quality claim.
- Good examples: "From emergency repairs to full replacements, Austin TX." or "Drain to water heater — same-day across Dallas."
- Bad examples: "Serving you reliably." or "Quality work you can trust."

SERVICE DESCRIPTIONS — CRITICAL RULES:
- Every description MUST be unique. No shared sentence structure across services.
- Never use the pattern "Reliable [X] for [location] customers, handled by experienced [trade] professionals." — this is forbidden.
- Never use the pattern "[Service name] — finished to a standard that holds" — this is forbidden.
- Never repeat the service title verbatim as the first 1–3 words of a description.
- Never repeat the same opening verb or phrase across any two descriptions.
- Each description should reflect what makes THAT specific service distinct: its urgency, its process, its outcome, or its common failure mode.
- Vary sentence length and entry point: some short and punchy, some longer, different verb choices per item.
- Write like a real person who understands the trade, not a template generator.
- 12–18 words per description. One sentence. Never write more than 18 words. If you reach 18 words, stop and end the sentence cleanly.
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

BAD (urgency angle — Emergency Repair):
- "Emergency Repair — finished to a standard that holds. Dallas, TX customers won't need to call back."
GOOD (urgency angle — Emergency Repair):
- "Burst pipe at 2am doesn't wait for business hours. We pick up, show up, and stop the damage — same night."

GOOD service descriptions (varied, specific, human):
- "Emergency Repair: Burst pipe, no water, sewage back-up — we pick up and move fast. Same-day across Austin."
- "Drain Cleaning: Slow drains usually mean one thing caught early or one thing ignored too long. We clear it and tell you which."
- "Water Heaters: Install, replace, or repair — we stock common units and can often finish the same visit."
- "Fixture Install: Faucets, toilets, showers. Done clean, no leaks, no follow-up calls needed."

Write descriptions in this spirit — each one specific to what that service actually is. 12–18 words maximum per description. End each description with a complete sentence — never trail off mid-thought.

HERO HEADLINE EXAMPLES BY BUSINESS TYPE (tone reference only, not templates):
  plumber: "Burst pipe at 2am? We're already on the way." / "Dallas plumbing fixed right, same day."
  roofer: "Storm damage doesn't wait. Neither do we." / "Your roof. Inspected today, repaired this week."
  hvac: "Your AC quit. We're already on the way." / "Same-day HVAC across [location]. No waiting on a slot."
  electrician: "Panel upgrade, EV charger, emergency repair — one call." / "Licensed master electricians. Every job, no subs."
  medspa: "Results-focused aesthetics in [location]." / "Board-certified care. No pushy sales, ever."
  dentist: "A dentist who actually explains what you need." / "Comfortable dental care in [location]."
  landscaper: "A yard you'll want to spend time in." / "Landscaping that holds up through summer."
  cleaner: "Come home to a clean house, every time." / "Reliable cleaning in [location] — same team, every visit."`;
}

function fallback(input: BusinessInput): GeneratedCopy {
  return {
    hero: buildHeroContent(input),
    services: buildServicesContent(input),
    reviews: buildReviewsContent(input),
    cta: buildCTAContent(input),
  };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
}

type HeadlineType = "OUTCOME" | "PROBLEM" | "CREDIBILITY";

function pickHeadlineType(tone: string): HeadlineType {
  if (tone === "aggressive") return "PROBLEM";
  if (tone === "premium") return "CREDIBILITY";
  return "OUTCOME";
}

async function generateHeroHeadline(
  input: BusinessInput,
  apiKey: string
): Promise<HeroLines> {
  const headlineType = pickHeadlineType(input.tone);
  const approachDesc =
    headlineType === "OUTCOME"
      ? "State the result the customer gets after hiring them"
      : headlineType === "PROBLEM"
      ? "Name the pain or fear the customer has right now"
      : "Lead with a specific credibility fact about this business";

  const systemPrompt =
    'You write hero copy for local business websites. Return ONLY a JSON object with two fields: "headline" and "subheadline". ' +
    "No prose, no markdown, no code fences. " +
    'Example: {"headline": "Burst pipe at midnight? We pick up.", "subheadline": "Same-day repairs across Dallas — no voicemail, no waiting."} ' +
    "Headline: 5-9 words maximum. Never include the business name. Never use: Done Right, Solutions, Professional, Quality, Trusted, Welcome, Discover. " +
    "Subheadline: max 25 words, sounds human. Must advance the headline — not restate it.";

  const subheadlineRule =
    headlineType === "PROBLEM"
      ? "The headline names a problem — the subheadline names the fix or the proof that you solve it fast."
      : headlineType === "OUTCOME"
      ? "The headline states an outcome — the subheadline names why to believe it (years of experience, coverage area, speed, guarantee)."
      : "The headline leads with credibility — the subheadline connects that fact to what it means for the customer right now.";

  const prompt =
    `Business: ${input.businessName}, Type: ${input.businessType}, Location: ${input.location}, ` +
    `Differentiator: ${input.differentiator || "none"}. Tone: ${input.tone}. ` +
    `Write one headline using the ${headlineType} approach: ${approachDesc}. ` +
    `Examples for plumber: OUTCOME='Your plumbing fixed today. No callbacks.' ` +
    `PROBLEM='Burst pipe at midnight? We pick up.' ` +
    `CREDIBILITY='20 years fixing Dallas plumbing. Still family-owned.' ` +
    `Never use: Welcome, Discover, Professional, Solutions, Quality, Trusted. ` +
    `Never describe what the business does. Do not include the business name anywhere in the headline. ` +
    `${subheadlineRule}`;

  try {
    console.log("[headline] calling Groq...");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    });
    console.log("[headline] Groq status:", response.status);
    const errorBody = await response.clone().text();
    console.log("[headline] Groq error body:", errorBody);
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
    console.log("[headline] Groq result:", raw);
    try {
      const parsed = JSON.parse(raw) as { headline?: string; subheadline?: string };
      return {
        headline: parsed.headline?.trim() ?? "",
        subheadline: parsed.subheadline?.trim() ?? "",
      };
    } catch {
      return { headline: raw, subheadline: "" };
    }
  } catch (err) {
    console.log("[headline] Groq error:", err);
    return { headline: "", subheadline: "" };
  }
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
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.log("[ai] no GOOGLE_API_KEY — using template fallback");
    return { copy: fallback(input), source: "template" };
  }

  const [heroHeadline] = await Promise.allSettled([
    generateHeroHeadline(input, apiKey),
  ]);
  const focusedLines: HeroLines =
    heroHeadline.status === "fulfilled"
      ? heroHeadline.value
      : { headline: "", subheadline: "" };

  let rawText: string | undefined;

  try {
    const response = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          { role: "user", parts: [{ text: userPrompt(input, strategy, pattern) }] },
        ],
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.9,
          responseMimeType: "application/json",
        },
      }),
    });

    console.log("[ai] gemini status:", response.status);

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
    console.log("[ai] finishReason:", finishReason);

    if (!rawText || typeof rawText !== "string") {
      throw new Error("No text in Gemini response");
    }

    console.log("[ai] raw text head:", rawText.slice(0, 200));
    console.log("[ai] raw text tail:", rawText.slice(-120));

    const parsed = extractAndParseJson(rawText) as Partial<GeneratedCopy>;
    console.log(
      "[ai] parsed keys:",
      Object.keys(parsed),
      "services count:",
      parsed.services?.services?.length ?? 0,
      "reviews count:",
      parsed.reviews?.reviews?.length ?? 0
    );

    const merged = mergeWithFallback(parsed, fallback(input));
    if (focusedLines.headline && focusedLines.headline.length < 80) {
      console.log("[headline] override result:", focusedLines.headline, "merged headline was:", merged.hero.headline);
      merged.hero.headline = focusedLines.headline;
    }
    if (focusedLines.subheadline && focusedLines.subheadline.length < 200) {
      merged.hero.subheadline = focusedLines.subheadline;
    }
    for (const service of merged.services.services) {
      const words = service.description.split(" ");
      if (words.length > 18) {
        service.description = words.slice(0, 18).join(" ").replace(/[,\-—]$/, "") + ".";
      }
    }
    console.log("[ai] merged services count:", merged.services.services.length);
    console.log("[ai] source: ai");
    return { copy: merged, source: "ai" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[ai] failure:", msg);
    if (rawText) {
      console.error("[ai] rawText snapshot:", rawText.slice(0, 400));
    }
    return { copy: fallback(input), source: "template", error: msg };
  }
}

function extractAndParseJson(text: string): unknown {
  // 1. Strip BOM and trim.
  let s = text.replace(/^﻿/, "").trim();

  // 2. Normalize smart quotes that some models sneak in.
  s = s
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");

  // 3. If wrapped in a fenced code block (anywhere in the text), pull the inside.
  //    Handles ```json ... ```, ``` ... ```, with or without surrounding prose.
  const fenceMatch = s.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    s = fenceMatch[1].trim();
  }

  // 4. Try a direct parse.
  try {
    return JSON.parse(s);
  } catch (firstErr) {
    // 5. Last resort: extract the largest balanced object span by braces.
    const firstBrace = s.indexOf("{");
    const lastBrace = s.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const sliced = s.slice(firstBrace, lastBrace + 1);
      console.log("[ai] retrying parse with brace-extracted slice");
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

function mergeWithFallback(
  partial: Partial<GeneratedCopy>,
  fb: GeneratedCopy
): GeneratedCopy {
  const merged: GeneratedCopy = {
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

  if (!partial.hero) console.log("[ai] merge: hero missing, used fallback");
  if (!partial.services?.services?.length) console.log("[ai] merge: services missing/empty, used fallback");
  if (!partial.reviews?.reviews?.length) console.log("[ai] merge: reviews missing/empty, used fallback");
  if (!partial.cta) console.log("[ai] merge: cta missing, used fallback");

  return merged;
}
