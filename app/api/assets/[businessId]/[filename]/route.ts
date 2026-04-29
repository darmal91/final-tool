import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { assetsDir, loadProject, updateAssets } from "@/lib/projects/store";
import { deleteAssetFile } from "@/lib/assets/pipeline";

export const runtime = "nodejs";

function isSafeFilename(name: string): boolean {
  return /^[\w.\-]+$/.test(name);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ businessId: string; filename: string }> }
) {
  const { businessId, filename } = await params;
  if (!isSafeFilename(filename) || !isSafeFilename(businessId)) {
    return NextResponse.json({ error: "bad_path" }, { status: 400 });
  }
  const filePath = path.join(assetsDir(businessId), filename);
  try {
    const data = await fs.readFile(filePath);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ businessId: string; filename: string }> }
) {
  const { businessId, filename } = await params;
  if (!isSafeFilename(filename) || !isSafeFilename(businessId)) {
    return NextResponse.json({ error: "bad_path" }, { status: 400 });
  }
  const project = await loadProject(businessId);
  if (!project) return NextResponse.json({ error: "project_not_found" }, { status: 404 });

  await deleteAssetFile(businessId, filename);
  const updated = await updateAssets(businessId, (cur) => cur.filter((a) => a.filename !== filename));
  return NextResponse.json({ assets: updated?.assets ?? [] });
}
