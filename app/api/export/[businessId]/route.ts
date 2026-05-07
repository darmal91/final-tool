import { NextRequest, NextResponse } from "next/server";
import { exportSiteHtml } from "@/lib/export/bundle";

export const runtime = "nodejs";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const { businessId } = await params;
  const html = await exportSiteHtml(businessId);
  if (!html) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${businessId}.html"`,
      "Cache-Control": "no-store",
    },
  });
}
