export interface RealWorldPattern {
  businessType: string;
  heroPatterns: {
    headlineStyle: "outcome-first" | "credibility-first" | "problem-first";
    subtextStyle: "minimal-proof" | "detail-support" | "authority-statement";
  };
  serviceFraming: "benefit-driven" | "feature-driven";
  reviewFraming: "story-based" | "stat-based";
  ctaStyle: "risk-reversal" | "urgency" | "consultation-first";
}

export const REAL_WORLD_PATTERNS: Record<string, RealWorldPattern> = {
  plumber: {
    businessType: "plumber",
    heroPatterns: {
      headlineStyle: "outcome-first",
      subtextStyle: "detail-support",
    },
    serviceFraming: "benefit-driven",
    reviewFraming: "story-based",
    ctaStyle: "risk-reversal",
  },
  roofer: {
    businessType: "roofer",
    heroPatterns: {
      headlineStyle: "outcome-first",
      subtextStyle: "detail-support",
    },
    serviceFraming: "benefit-driven",
    reviewFraming: "story-based",
    ctaStyle: "risk-reversal",
  },
  hvac: {
    businessType: "hvac",
    heroPatterns: {
      headlineStyle: "outcome-first",
      subtextStyle: "detail-support",
    },
    serviceFraming: "benefit-driven",
    reviewFraming: "story-based",
    ctaStyle: "risk-reversal",
  },
  electrician: {
    businessType: "electrician",
    heroPatterns: {
      headlineStyle: "outcome-first",
      subtextStyle: "detail-support",
    },
    serviceFraming: "benefit-driven",
    reviewFraming: "story-based",
    ctaStyle: "risk-reversal",
  },
  dentist: {
    businessType: "dentist",
    heroPatterns: {
      headlineStyle: "credibility-first",
      subtextStyle: "authority-statement",
    },
    serviceFraming: "feature-driven",
    reviewFraming: "stat-based",
    ctaStyle: "consultation-first",
  },
  medspa: {
    businessType: "medspa",
    heroPatterns: {
      headlineStyle: "credibility-first",
      subtextStyle: "authority-statement",
    },
    serviceFraming: "feature-driven",
    reviewFraming: "stat-based",
    ctaStyle: "consultation-first",
  },
  landscaper: {
    businessType: "landscaper",
    heroPatterns: {
      headlineStyle: "problem-first",
      subtextStyle: "minimal-proof",
    },
    serviceFraming: "benefit-driven",
    reviewFraming: "story-based",
    ctaStyle: "risk-reversal",
  },
  cleaner: {
    businessType: "cleaner",
    heroPatterns: {
      headlineStyle: "problem-first",
      subtextStyle: "minimal-proof",
    },
    serviceFraming: "benefit-driven",
    reviewFraming: "story-based",
    ctaStyle: "risk-reversal",
  },
};
