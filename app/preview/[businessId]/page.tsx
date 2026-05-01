import { notFound } from "next/navigation";
import { loadProject } from "@/lib/projects/store";
import RenderComposition from "@/components/render/RenderComposition";

export const dynamic = "force-dynamic";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const file = await loadProject(businessId);
  if (!file) notFound();

  return (
    <RenderComposition
      composition={file.composition}
      assets={file.project.assets}
      asTag="main"
      input={file.project.input}
    />
  );
}