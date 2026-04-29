import { NextRequest, NextResponse } from "next/server";
import { exportSiteZip } from "@/lib/export/bundle";

export const runtime = "nodejs";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const { businessId } = await params;
  const buf = await exportSiteZip(businessId);
  if (!buf) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${businessId}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
