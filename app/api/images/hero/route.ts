import { NextRequest, NextResponse } from "next/server";
import { fetchHeroImage } from "@/lib/content/images";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") ?? "";
  const imageUrl = await fetchHeroImage(type, "", "");
  if (!imageUrl) return NextResponse.json({ imageUrl: null }, { status: 404 });
  return NextResponse.json({ imageUrl });
}
