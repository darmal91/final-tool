"use client";

import * as React from "react";

interface EditableSectionContextValue {
  sectionId: string;
  onEdit: (fieldPath: string, value: string) => void;
}

const EditableSectionContext = React.createContext<EditableSectionContextValue | null>(null);

export function EditableSectionProvider({
  sectionId,
  onEdit,
  children,
}: {
  sectionId: string;
  onEdit: ((sectionId: string, fieldPath: string, value: string) => void) | undefined;
  children: React.ReactNode;
}) {
  const value = React.useMemo<EditableSectionContextValue | null>(() => {
    if (!onEdit) return null;
    return { sectionId, onEdit: (fieldPath, v) => onEdit(sectionId, fieldPath, v) };
  }, [sectionId, onEdit]);
  return (
    <EditableSectionContext.Provider value={value}>{children}</EditableSectionContext.Provider>
  );
}

interface EditableTextProps {
  fieldPath: string;
  multiline?: boolean;
  children: string;
}

export function EditableText({ fieldPath, multiline = false, children }: EditableTextProps) {
  const ctx = React.useContext(EditableSectionContext);
  const [editing, setEditing] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const originalRef = React.useRef<string>(children);
  const cancelledRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (!editing || !ref.current) return;
    const el = ref.current;
    el.textContent = originalRef.current;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  if (!ctx) return <>{children}</>;

  if (editing) {
    const commit = () => {
      if (cancelledRef.current) {
        cancelledRef.current = false;
        setEditing(false);
        return;
      }
      const next = (ref.current?.textContent ?? "").replace(/\u00A0/g, " ");
      const trimmed = multiline ? next.replace(/\s+$/g, "") : next.trim();
      setEditing(false);
      if (trimmed !== originalRef.current) ctx.onEdit(fieldPath, trimmed);
    };
    const onKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === "Enter" && (!multiline || !e.shiftKey)) {
        e.preventDefault();
        e.stopPropagation();
        ref.current?.blur();
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        cancelledRef.current = true;
        if (ref.current) ref.current.textContent = originalRef.current;
        ref.current?.blur();
      }
    };
    return (
      <span
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        spellCheck
        onBlur={commit}
        onKeyDown={onKeyDown}
        style={{
          outline: "2px solid rgba(99, 102, 241, 0.7)",
          outlineOffset: "2px",
          borderRadius: "2px",
          cursor: "text",
          whiteSpace: multiline ? "pre-wrap" : "normal",
        }}
      />
    );
  }

  return (
    <span
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        originalRef.current = children;
        setEditing(true);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: "text",
        borderBottom: hover ? "1px dashed rgba(99,102,241,0.55)" : "1px dashed transparent",
        transition: "border-color 120ms ease",
      }}
      title="Click to edit"
    >
      {children}
    </span>
  );
}
