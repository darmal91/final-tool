import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { BusinessInput } from "@/lib/types";
import type { VariantPlan } from "@/lib/composition/variants";
import type { CompositionStrategy } from "@/lib/composition/strategy";
import type { CompositionEvaluation } from "@/lib/composition/evaluation";

export interface DecisionLogEntry {
  timestamp: number;
  businessId?: string;
  input: BusinessInput;
  strategy: CompositionStrategy;
  candidates: Array<{
    name: string;
    variantPlan: VariantPlan;
    scores: {
      trustScore: number;
      conversionScore: number;
      aestheticScore: number;
      totalScore: number;
    };
  }>;
  selected: {
    name: string;
    variantPlan: VariantPlan;
  };
  evaluation?: CompositionEvaluation;
}

const LOG_DIR = join(process.cwd(), "logs");
const LOG_PATH = join(LOG_DIR, "decision-log.jsonl");

export async function appendDecisionLog(entry: DecisionLogEntry): Promise<void> {
  try {
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_PATH, JSON.stringify(entry) + "\n", "utf8");
  } catch {
    // fail silently — logging must never affect runtime
  }
}
