import { notFound } from "next/navigation";
import { loadProject } from "@/lib/projects/store";
import EditorClient from "@/components/editor/EditorClient";

export const dynamic = "force-dynamic";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const file = await loadProject(businessId);
  if (!file) notFound();

  return (
    <EditorClient
      initialProject={file.project}
      initialComposition={file.composition}
    />
  );
}
