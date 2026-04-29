"use client";

import { Section } from "@/lib/types";

interface SectionControlsProps {
  section: Section;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

const LABELS: Record<Section["type"], string> = {
  hero: "Hero",
  services: "Services",
  reviews: "Reviews",
  cta: "Call to Action",
};

export default function SectionControls({
  section,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
}: SectionControlsProps) {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-5 text-center">
          {index + 1}
        </span>
        <span className="text-sm font-semibold text-gray-700">{LABELS[section.type]}</span>
        <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">{section.type}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Move up"
        >
          ▲
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Move down"
        >
          ▼
        </button>
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
          title="Remove section"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
