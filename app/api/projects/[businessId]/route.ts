import { NextRequest, NextResponse } from "next/server";
import { loadProject, updateComposition } from "@/lib/projects/store";
import type { Section, SectionType } from "@/lib/types";
import { VARIANTS_BY_TYPE } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const { businessId } = await params;
  const file = await loadProject(businessId);
  if (!file) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(file);
}

interface PatchBody {
  action: "set-variant" | "reorder" | "remove";
  sectionId?: string;
  variant?: string;
  order?: string[];
}

function isValidVariantFor(type: SectionType, variant: string): boolean {
  const list = VARIANTS_BY_TYPE[type] as readonly string[];
  return list.includes(variant);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const { businessId } = await params;
  const body = (await req.json()) as PatchBody;

  const updated = await updateComposition(businessId, (comp) => {
    if (body.action === "set-variant" && body.sectionId && body.variant) {
      const sections = comp.sections.map((s) => {
        if (s.id !== body.sectionId) return s;
        if (!isValidVariantFor(s.type, body.variant!)) return s;
        return { ...s, variant: body.variant } as Section;
      });
      return { ...comp, sections };
    }
    if (body.action === "reorder" && body.order) {
      const byId = new Map(comp.sections.map((s) => [s.id, s]));
      const next = body.order.map((id) => byId.get(id)).filter((s): s is Section => !!s);
      // Anything missing — append in original order
      const present = new Set(next.map((s) => s.id));
      for (const s of comp.sections) {
        if (!present.has(s.id)) next.push(s);
      }
      return { ...comp, sections: next };
    }
    if (body.action === "remove" && body.sectionId) {
      return { ...comp, sections: comp.sections.filter((s) => s.id !== body.sectionId) };
    }
    return comp;
  });

  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ composition: updated });
}
