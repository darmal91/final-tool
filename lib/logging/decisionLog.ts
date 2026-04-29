import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { BusinessInput, SectionType } from "@/lib/types";
import type { VariantPlan } from "@/lib/composition/variants";
import type { CompositionStrategy } from "@/lib/composition/strategy";
import type { CompositionEvaluation } from "@/lib/composition/evaluation";
import type { PageArchetype } from "@/lib/composition/archetypes";
import { ARCHETYPE_CONFIGS } from "@/lib/composition/archetypes";
import type { RealismConfig } from "@/lib/design/realism";

export interface DecisionLogEntry {
  timestamp: number;
  businessId?: string;
  input: BusinessInput;
  archetype: PageArchetype;
  strategy: CompositionStrategy;
  realism: RealismConfig;
  variants: VariantPlan;
  pageFlow: SectionType[];
  evaluation?: CompositionEvaluation;
  selectionMeta: {
    selectionMethod: "rule-based" | "scored" | "fallback";
    candidateCount: number;
    bestScore?: number;
  };
  scoreBreakdown?: {
    visualClarity: number;
    conversionStrength: number;
    trustSignalStrength: number;
    structuralFlow: number;
    realismScore: number;
  };
}

const LOG_DIR = join(process.cwd(), "logs");
const LOG_PATH = join(LOG_DIR, "decision-log.jsonl");

export async function appendDecisionLog(entry: DecisionLogEntry): Promise<void> {
  try {
    const scoreBreakdown = entry.evaluation
      ? {
          visualClarity: entry.evaluation.visualClarity,
          conversionStrength: entry.evaluation.conversionStrength,
          trustSignalStrength: entry.evaluation.trustSignalStrength,
          structuralFlow: entry.evaluation.structuralFlow,
          realismScore: entry.evaluation.realismScore,
        }
      : entry.scoreBreakdown;

    const bestScore = entry.evaluation?.totalScore ?? entry.selectionMeta.bestScore;

    const debugMode = process.env.COMPOSITION_DEBUG_LOG === "true";

    const payload: Record<string, unknown> = {
      ...entry,
      selectionMeta: { ...entry.selectionMeta, bestScore },
      scoreBreakdown,
    };

    if (!debugMode) {
      payload["input"] = {
        ...(entry.input as unknown as Record<string, unknown>),
        services: entry.input.services.length,
      };
      payload["realism"] = {
        archetype: entry.archetype,
        density: ARCHETYPE_CONFIGS[entry.archetype].layoutBehavior.topFoldDensity,
      };
    }

    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_PATH, JSON.stringify(payload) + "\n", "utf8");
  } catch {
    // fail silently — logging must never affect runtime
  }
}
