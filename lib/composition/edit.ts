import type { Section, SiteComposition } from "@/lib/types";

function setByPath<T>(node: T, parts: string[], idx: number, value: string): T {
  if (idx === parts.length) return value as unknown as T;
  const key = parts[idx];
  if (/^\d+$/.test(key)) {
    const i = Number(key);
    const arr = Array.isArray(node) ? [...node] : [];
    arr[i] = setByPath((node as unknown as unknown[])[i], parts, idx + 1, value);
    return arr as unknown as T;
  }
  const obj = (node ?? {}) as Record<string, unknown>;
  return {
    ...obj,
    [key]: setByPath(obj[key], parts, idx + 1, value),
  } as unknown as T;
}

export function applyContentEdit(
  composition: SiteComposition,
  sectionId: string,
  fieldPath: string,
  value: string
): SiteComposition {
  const parts = fieldPath.split(".").filter(Boolean);
  if (parts.length === 0) return composition;
  return {
    ...composition,
    sections: composition.sections.map((s) => {
      if (s.id !== sectionId) return s;
      const nextContent = setByPath(s.content, parts, 0, value);
      return { ...s, content: nextContent } as Section;
    }),
  };
}
