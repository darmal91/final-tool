import Link from "next/link";
import { defaultSections } from "@/lib/defaults";
import SectionRenderer from "@/components/editor/SectionRenderer";

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Slim preview bar */}
      <div className="bg-gray-900 text-white text-xs px-6 py-2 flex items-center justify-between">
        <span className="text-gray-400">Preview Mode</span>
        <Link
          href="/editor"
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          ← Back to Editor
        </Link>
      </div>

      {defaultSections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
