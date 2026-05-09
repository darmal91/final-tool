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

  const { businessName, businessType, location, services } = file.project.input;
  const heroSection = file.composition.sections.find((s) => s.type === "hero");
  const heroSubheadline = (heroSection?.content as { subheadline?: string })?.subheadline ?? "";

  const title = `${businessName} | ${businessType} in ${location}`;
  const description = heroSubheadline || `${businessName} — ${businessType} in ${location}.`;

  return {
    title,
    description,
    keywords: [businessType, location, ...services],
    openGraph: {
      title,
      description,
      type: "website",
    },
    robots: "index, follow",
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