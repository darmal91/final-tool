import { NextRequest, NextResponse } from "next/server";
import { loadProject } from "@/lib/projects/store";
import { exportSiteHtml } from "@/lib/export/bundle";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { businessId } = await params;

  const [file, exportHtml] = await Promise.all([
    loadProject(businessId),
    exportSiteHtml(businessId),
  ]);

  if (!file) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    project: file,
    exportHtml,
    previewUrl: `http://localhost:3000/preview/${businessId}`,
  });
}
