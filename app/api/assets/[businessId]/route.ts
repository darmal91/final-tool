import { NextRequest, NextResponse } from "next/server";
import { ingestAsset } from "@/lib/assets/pipeline";
import { loadProject, updateAssets } from "@/lib/projects/store";
import type { BusinessAsset } from "@/lib/types";

export const runtime = "nodejs";

const VALID_CONTEXTS: BusinessAsset["context"][] = ["logo", "hero", "gallery"];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const { businessId } = await params;
  const project = await loadProject(businessId);
  if (!project) {
    return NextResponse.json({ error: "project_not_found" }, { status: 404 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const context = String(form.get("context") || "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }
  if (!VALID_CONTEXTS.includes(context as BusinessAsset["context"])) {
    return NextResponse.json({ error: "invalid_context" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const asset = await ingestAsset({
    businessId,
    context: context as BusinessAsset["context"],
    buffer: buf,
    originalName: file.name,
  });

  await updateAssets(businessId, (current) => {
    // Logo replaces existing logo. Hero replaces existing hero. Gallery is additive.
    if (asset.context === "logo" || asset.context === "hero") {
      return [...current.filter((a) => a.context !== asset.context), asset];
    }
    return [...current, asset];
  });

  return NextResponse.json({ asset });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const { businessId } = await params;
  const project = await loadProject(businessId);
  if (!project) {
    return NextResponse.json({ error: "project_not_found" }, { status: 404 });
  }
  return NextResponse.json({ assets: project.project.assets });
}
