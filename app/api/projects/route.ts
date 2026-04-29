import { NextRequest, NextResponse } from "next/server";
import type { BusinessInput, BusinessProject } from "@/lib/types";
import { generateComposition } from "@/lib/composition/generate";
import { newBusinessId, saveProject } from "@/lib/projects/store";

export const runtime = "nodejs";

function isValidInput(x: unknown): x is BusinessInput {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.businessName === "string" &&
    typeof o.businessType === "string" &&
    typeof o.location === "string" &&
    Array.isArray(o.services) &&
    typeof o.tone === "string" &&
    typeof o.differentiator === "string"
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!isValidInput(body)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const id = newBusinessId();
  const { composition, source, error } = await generateComposition(id, body);
  const project: BusinessProject = {
    id,
    createdAt: new Date().toISOString(),
    input: body,
    assets: [],
  };
  await saveProject(project, composition);
  return NextResponse.json({ projectId: id, source, error });
}
