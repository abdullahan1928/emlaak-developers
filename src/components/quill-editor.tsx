"use client";
import React, { useState, useMemo, useCallback } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, Eye, EyeOff, Save } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";

export interface QuillEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: number;
  className?: string;
  onSave?: () => void;
}

export const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  disabled,
  minHeight = 400,
  className,
  onSave,
}) => {
  const [full, setFull] = useState(false);
  const [preview, setPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const { resolvedTheme } = useTheme(); // "light" or "dark"

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6] }],
        [{ font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ["blockquote", "code-block"],
        ["link", "clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
      history: {
        delay: 800,
        maxStack: 1000,
        userOnly: true,
      },
    }),
    []
  );

  const formats = useMemo(
    () => [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "script",
      "list",
      "bullet",
      "indent",
      "align",
      "color",
      "background",
      "blockquote",
      "code-block",
      "link",
      "clean",
    ],
    []
  );

  const handleChange = useCallback(
    (
      content: string,
      _delta: unknown,
      _source: unknown,
      editor: ReactQuill.UnprivilegedEditor
    ) => {
      onChange(content);
      try {
        const text = editor.getText();
        const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
        setCharCount(text.replace(/\n/g, "").length);
        setWordCount(words);
      } catch { }
    },
    [onChange]
  );

  return (
    <div
      className={cn(
        "relative rounded border bg-background flex flex-col",
        full && "fixed inset-4 z-50 shadow-xl border-ring/40",
        className
      )}
      style={{ minHeight }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-muted/60 backdrop-blur px-3 py-2 gap-2">
        <div className="text-xs font-medium opacity-70">Rich Text Editor</div>
        <div className="flex items-center gap-1">
          {onSave && (
            <Button
              size="sm"
              type="button"
              variant="outline"
              className="h-7 px-2"
              onClick={onSave}
              disabled={disabled}
            >
              <Save className="size-4" />
            </Button>
          )}
          <Button
            size="sm"
            type="button"
            variant="outline"
            className="h-7 px-2"
            onClick={() => setPreview((p) => !p)}
          >
            {preview ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
          <Button
            size="sm"
            type="button"
            variant="outline"
            className="h-7 px-2"
            onClick={() => setFull((f) => !f)}
          >
            {full ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Editor stays mounted to avoid losing unsupported HTML (e.g., tables) when toggling */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div className={cn("absolute inset-0 flex flex-col overflow-auto", preview && "invisible opacity-0 pointer-events-none")}>
          <ReactQuill
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            readOnly={disabled}
            theme="snow"
            modules={modules}
            formats={formats}
            className={cn(
              "flex-1",
              resolvedTheme === "dark" ? "quill-dark" : "quill-light"
            )}
          />
        </div>
        <div className={cn("absolute inset-0 overflow-auto p-6 text-sm prose prose-neutral dark:prose-invert max-w-none transition-opacity", !preview && "invisible opacity-0 pointer-events-none")}
          // Keep dangerous HTML render for preview (attempt to show any tables preserved in value)
          dangerouslySetInnerHTML={{
            __html:
              value && value.trim() !== "<p><br></p>"
                ? value
                : '<p class="opacity-50">Nothing to preview.</p>',
          }}
        />
      </div>

      {/* Inline basic table styling for preview clarity (in case global styles miss) */}
      <style jsx>{`
        :global(.prose table) { width:100%; border-collapse:collapse; }
        :global(.prose table th), :global(.prose table td) { border:1px solid hsl(var(--border)); padding:4px 8px; font-size:12px; }
        :global(.dark .prose table th), :global(.dark .prose table td){ border-color:hsl(var(--border)); }
      `}</style>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground bg-muted/50 px-3 py-1 border-t">
        <div className="flex gap-3">
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
        </div>
        <div className="hidden md:flex gap-2 opacity-70 text-[10px]">
          <span>Ctrl+B</span>
          <span>Ctrl+I</span>
          <span>Ctrl+U</span>
          <span>Ctrl+K</span>
        </div>
      </div>
    </div>
  );
};

export default QuillEditor;
