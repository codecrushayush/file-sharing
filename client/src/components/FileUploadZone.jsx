import { useCallback, useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";

export function FileUploadZone({ onFileSelected, disabled, uploading }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (fileList) => {
      if (!fileList?.length || disabled || uploading) return;
      const file = fileList[0];
      onFileSelected(file);
    },
    [disabled, uploading, onFileSelected]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  });

  const onDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  });

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) setDragActive(false);
  });

  function openPicker() {
    if (!disabled && !uploading) inputRef.current?.click();
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        aria-label="Choose file to upload"
        disabled={disabled || uploading}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div
        role="button"
        tabIndex={disabled || uploading ? -1 : 0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        className={[
          "group relative w-full rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50",
          dragActive
            ? "border-indigo-400 bg-indigo-500/10 shadow-[0_0_0_1px_rgba(99,102,241,0.3)]"
            : "border-slate-600/80 bg-slate-900/40 hover:border-indigo-500/50 hover:bg-slate-800/40",
          disabled || uploading ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        ].join(" ")}
      >
        <div className="pointer-events-none mx-auto flex max-w-md flex-col items-center gap-3">
          <span
            className={[
              "flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-200",
              dragActive
                ? "scale-105 bg-indigo-500/20 text-indigo-300"
                : "bg-slate-800/80 text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-500/15",
            ]}
          >
            {uploading ? (
              <Loader2 className="h-7 w-7 animate-spin" aria-hidden />
            ) : (
              <Upload className="h-7 w-7" aria-hidden />
            )}
          </span>
          <div>
            <p className="text-base font-semibold text-white">
              {uploading ? "Uploading…" : "Drop files here or click to browse"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              PDF, TXT, DOC, DOCX, RTF · max size per file set by server
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
