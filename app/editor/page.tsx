"use client";

import { useState } from "react";
import Link from "next/link";
import { Section, SectionType } from "@/lib/types";
import { defaultSections, defaultHero, defaultServices, defaultReviews, defaultCTA } from "@/lib/defaults";
import SectionControls from "@/components/editor/SectionControls";
import SectionRenderer from "@/components/editor/SectionRenderer";

const ADD_OPTIONS: { type: SectionType; label: string }[] = [
  { type: "hero", label: "Hero" },
  { type: "services", label: "Services" },
  { type: "reviews", label: "Reviews" },
  { type: "cta", label: "Call to Action" },
];

function makeSection(type: SectionType): Section {
  const id = `section-${Date.now()}`;
  switch (type) {
    case "hero": return { id, type, content: defaultHero };
    case "services": return { id, type, content: defaultServices };
    case "reviews": return { id, type, content: defaultReviews };
    case "cta": return { id, type, content: defaultCTA };
  }
}

export default function EditorPage() {
  const [sections, setSections] = useState<Section[]>(defaultSections);

  function moveUp(index: number) {
    if (index === 0) return;
    setSections((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  function moveDown(index: number) {
    if (index === sections.length - 1) return;
    setSections((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  function remove(index: number) {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }

  function addSection(type: SectionType) {
    setSections((prev) => [...prev, makeSection(type)]);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Topbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-800">Editor</span>
          </div>
          <Link
            href="/preview"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Preview →
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        {/* Left panel */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
              Page Sections
            </h2>
            {sections.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No sections yet. Add one below.</p>
            ) : (
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <SectionControls
                    key={section.id}
                    section={section}
                    index={index}
                    total={sections.length}
                    onMoveUp={() => moveUp(index)}
                    onMoveDown={() => moveDown(index)}
                    onRemove={() => remove(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
              Add Section
            </h2>
            <div className="space-y-2">
              {ADD_OPTIONS.map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => addSection(type)}
                  className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                >
                  + {label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-400 px-1">
            {sections.length} section{sections.length !== 1 ? "s" : ""} on this page.
          </div>
        </aside>

        {/* Preview area */}
        <main className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-400 space-y-2">
              <span className="text-4xl">🧱</span>
              <p className="text-sm">Add sections from the left panel to build your page.</p>
            </div>
          ) : (
            sections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))
          )}
        </main>
      </div>
    </div>
  );
}
