import { promises as fs } from "fs";
import path from "path";
import type { BusinessAsset, BusinessInput, BusinessProject, SiteComposition } from "@/lib/types";

const ROOT = path.join(process.cwd(), "projects");

interface ProjectFile {
  project: BusinessProject;
  composition: SiteComposition;
}

export function projectDir(businessId: string): string {
  return path.join(ROOT, businessId);
}

export function assetsDir(businessId: string): string {
  return path.join(projectDir(businessId), "assets");
}

function projectFilePath(businessId: string): string {
  return path.join(projectDir(businessId), "project.json");
}

export async function ensureDirs(businessId: string): Promise<void> {
  await fs.mkdir(assetsDir(businessId), { recursive: true });
}

export async function saveProject(
  project: BusinessProject,
  composition: SiteComposition
): Promise<void> {
  await ensureDirs(project.id);
  const data: ProjectFile = { project, composition };
  await fs.writeFile(projectFilePath(project.id), JSON.stringify(data, null, 2));
}

export async function loadProject(businessId: string): Promise<ProjectFile | null> {
  try {
    const raw = await fs.readFile(projectFilePath(businessId), "utf-8");
    return JSON.parse(raw) as ProjectFile;
  } catch {
    return null;
  }
}

export async function listProjects(): Promise<BusinessProject[]> {
  try {
    const entries = await fs.readdir(ROOT, { withFileTypes: true });
    const out: BusinessProject[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const file = await loadProject(entry.name);
      if (file) out.push(file.project);
    }
    return out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return [];
  }
}

export async function updateAssets(
  businessId: string,
  mutator: (current: BusinessAsset[]) => BusinessAsset[]
): Promise<BusinessProject | null> {
  const file = await loadProject(businessId);
  if (!file) return null;
  const next = { ...file, project: { ...file.project, assets: mutator(file.project.assets) } };
  await saveProject(next.project, next.composition);
  return next.project;
}

export async function updateComposition(
  businessId: string,
  mutator: (current: SiteComposition) => SiteComposition
): Promise<SiteComposition | null> {
  const file = await loadProject(businessId);
  if (!file) return null;
  const nextComp = mutator(file.composition);
  await saveProject(file.project, nextComp);
  return nextComp;
}

export async function updateInput(
  businessId: string,
  input: BusinessInput,
  composition: SiteComposition
): Promise<void> {
  const file = await loadProject(businessId);
  if (!file) return;
  await saveProject(
    { ...file.project, input },
    composition
  );
}

export function newBusinessId(): string {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
}
