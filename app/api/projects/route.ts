import { NextRequest, NextResponse } from "next/server";
import type { BusinessInput, BusinessProject, HeroContent } from "@/lib/types";
import { generateComposition } from "@/lib/composition/generate";
import { newBusinessId, saveProject } from "@/lib/projects/store";
import { isValidHex } from "@/lib/design/colorUtils";
import { fetchHeroImage } from "@/lib/content/images";

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
  const raw = await req.json();
  const { businessId: clientId, ...body } = raw as Record<string, unknown>;
  if (!isValidInput(body)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  if (body.primaryColor !== undefined && !isValidHex(body.primaryColor)) {
    return NextResponse.json({ error: "invalid_primaryColor" }, { status: 400 });
  }
  if (body.accentColor !== undefined && !isValidHex(body.accentColor)) {
    return NextResponse.json({ error: "invalid_accentColor" }, { status: 400 });
  }
  const id = typeof clientId === "string" && clientId.length > 0 ? clientId : newBusinessId();
  const { composition, source, error } = await generateComposition(id, body);

  const heroSection = composition.sections.find((s) => s.type === "hero");
  if (heroSection && heroSection.variant === "premium-split") {
    const imageUrl = await fetchHeroImage(body.businessType, body.businessName, body.location);
    if (imageUrl) {
      (heroSection.content as HeroContent).imageUrl = imageUrl;
    }
  }

  const project: BusinessProject = {
    id,
    createdAt: new Date().toISOString(),
    input: body,
    assets: [],
  };
  await saveProject(project, composition);
  return NextResponse.json({ projectId: id, source, error });
}
