import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import type { BusinessAsset } from "@/lib/types";
import { assetsDir, ensureDirs } from "@/lib/projects/store";

const MAX_WIDTH_BY_CONTEXT: Record<BusinessAsset["context"], number> = {
  logo: 512,
  hero: 2200,
  gallery: 1800,
};

const QUALITY_BY_CONTEXT: Record<BusinessAsset["context"], number> = {
  logo: 92,
  hero: 82,
  gallery: 80,
};

export interface IngestInput {
  businessId: string;
  context: BusinessAsset["context"];
  buffer: Buffer;
  originalName: string;
}

export async function ingestAsset({
  businessId,
  context,
  buffer,
  originalName,
}: IngestInput): Promise<BusinessAsset> {
  await ensureDirs(businessId);

  const id = `${context}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const filename = `${id}.webp`;
  const target = path.join(assetsDir(businessId), filename);

  const pipeline = sharp(buffer).rotate();
  const meta = await pipeline.metadata();
  const maxWidth = MAX_WIDTH_BY_CONTEXT[context];

  const resized =
    meta.width && meta.width > maxWidth
      ? pipeline.resize({ width: maxWidth, withoutEnlargement: true })
      : pipeline;

  const out = await resized
    .webp({ quality: QUALITY_BY_CONTEXT[context], effort: 4 })
    .toBuffer({ resolveWithObject: true });

  await fs.writeFile(target, out.data);

  return {
    id,
    context,
    filename,
    url: `/api/assets/${businessId}/${filename}`,
    width: out.info.width,
    height: out.info.height,
  };
}

export async function deleteAssetFile(businessId: string, filename: string): Promise<void> {
  const target = path.join(assetsDir(businessId), filename);
  try {
    await fs.unlink(target);
  } catch {
    // ignore
  }
}

export function originalNameForLog(name: string): string {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 80);
}
