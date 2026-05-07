import { notFound } from "next/navigation";
import { loadProject } from "@/lib/projects/store";
import RenderComposition from "@/components/render/RenderComposition";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ businessId: string }>;
}): Promise<Metadata> {
  const { businessId } = await params;
  const file = await loadProject(businessId);
  if (!file) return {};

  const { businessName, businessType, location, differentiator } = file.project.input;
  const title = `${businessName} | ${location}`;
  const description = differentiator
    ? `${businessName} — ${differentiator}. Serving ${location}.`
    : `${businessName} is a local ${businessType} serving ${location}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

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