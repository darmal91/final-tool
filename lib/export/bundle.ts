import { promises as fs } from "fs";
import path from "path";
import { assetsDir, loadProject } from "@/lib/projects/store";
import type { BusinessAsset, BusinessProject, SiteComposition } from "@/lib/types";

export async function exportSiteHtml(businessId: string): Promise<string | null> {
  const file = await loadProject(businessId);
  if (!file) return null;

  const inlinedAssets = await inlineAssetUrls(businessId, file.project.assets);
  return renderHtml(file.project, file.composition, inlinedAssets);
}

async function renderHtml(
  project: BusinessProject,
  composition: SiteComposition,
  assets: BusinessAsset[]
): Promise<string> {
  const [{ renderToStaticMarkup }, React, { default: RenderCompositionExport }] = await Promise.all([
    import("react-dom/server"),
    import("react"),
    import("@/components/render/RenderCompositionExport"),
  ]);

  const body = renderToStaticMarkup(
    React.createElement(RenderCompositionExport, {
      composition,
      assets,
      input: project.input,
    })
  );

  const fontFamily = composition.theme.fontFamily;
  const usesPlayfair = fontFamily.includes("Playfair");

  const fontLink = usesPlayfair
    ? '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">'
    : '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">';

  const title = escapeHtml(project.input.businessName);
  const description = escapeHtml(
    project.input.differentiator ||
      `${project.input.businessName} — ${project.input.businessType} in ${project.input.location}.`
  );
  const inlineGlobalCss = await getInlineGlobalCss();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
${fontLink}
<style>
${inlineGlobalCss}
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
  body { font-family: ${fontFamily}; background: var(--ft-surface); color: var(--ft-text); }
  a { text-decoration: none; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

async function getInlineGlobalCss(): Promise<string> {
  const cssPath = path.join(process.cwd(), "app", "globals.css");
  const css = await fs.readFile(cssPath, "utf-8");
  return css
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("@tailwind"))
    .join("\n")
    .trim();
}

async function inlineAssetUrls(
  businessId: string,
  assets: BusinessAsset[]
): Promise<BusinessAsset[]> {
  const dir = assetsDir(businessId);
  const results = await Promise.all(
    assets.map(async (asset) => {
      const filePath = path.join(dir, asset.filename);
      try {
        const buf = await fs.readFile(filePath);
        const mime = mimeTypeFromFilename(asset.filename);
        const dataUrl = `data:${mime};base64,${buf.toString("base64")}`;
        return { ...asset, url: dataUrl };
      } catch {
        console.warn(`[export] failed to inline asset ${asset.filename} — skipping`);
        return null;
      }
    })
  ) as (BusinessAsset | null)[];
  return results.filter((a): a is BusinessAsset => a !== null);
}

function mimeTypeFromFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
