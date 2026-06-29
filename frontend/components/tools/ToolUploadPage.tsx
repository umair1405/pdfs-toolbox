"use client";

import { useRef, useState } from "react";
import { CloudUpload, Download, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import type { Tool } from "@/config/tools";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useUploadStore } from "@/store/useUploadStore";
import { conversionService } from "@/services/conversion.service";
import { formatBytes } from "@/utils/formatBytes";
import { cn } from "@/utils/cn";

export function ToolUploadPage({ tool }: { tool: Tool }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { upload } = useFileUpload(tool);
  const { job, file, uploadProgress, isUploading, reset } = useUploadStore();

  /* ── helpers ── */
  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    upload(files[0]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  const statusLabel =
    isUploading
      ? uploadProgress < 100
        ? `Uploading… ${uploadProgress}%`
        : "Processing…"
      : job?.status === "queued"
      ? "Queued…"
      : job?.status === "processing"
      ? "Converting…"
      : job?.status === "done"
      ? "Done!"
      : job?.status === "failed"
      ? `Failed: ${job.error_message ?? "unknown error"}`
      : null;

  const progressPct =
    job?.status === "done"
      ? 100
      : job?.status === "processing"
      ? 65
      : job?.status === "queued"
      ? 30
      : uploadProgress;

  /* ── coming-soon state ── */
  if (!tool.active) {
    return (
      <div className="flex flex-col items-center justify-center py-28 px-4 text-center">
        <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center mb-6", tool.iconBg)}>
          <CloudUpload size={38} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{tool.pageTitle}</h1>
        <p className="text-gray-500 max-w-md mb-6">{tool.pageSubtitle}</p>
        <span className="inline-block bg-gray-100 text-gray-500 text-sm font-semibold px-5 py-2 rounded-full">
          Coming soon
        </span>
      </div>
    );
  }

  /* ── after conversion done ── */
  if (job?.status === "done") {
    return (
      <div className="flex flex-col items-center justify-center py-28 px-4 text-center">
        <CheckCircle2 size={56} className="text-green-500 mb-5" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Conversion complete!</h2>
        <p className="text-gray-500 mb-8">
          {file?.original_filename} →{" "}
          <span className="font-semibold">.{tool.targetFormat}</span>
          {file && ` (${formatBytes(file.size_bytes)})`}
        </p>
        <div className="flex gap-3">
          <a
            href={conversionService.downloadUrl(job.id)}
            download
            className="flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Download size={18} />
            Download
          </a>
          <button
            onClick={reset}
            className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Convert another
          </button>
        </div>
      </div>
    );
  }

  /* ── failed state ── */
  if (job?.status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center py-28 px-4 text-center">
        <AlertCircle size={56} className="text-red-400 mb-5" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Conversion failed</h2>
        <p className="text-gray-500 mb-8">{job.error_message ?? "Something went wrong."}</p>
        <button
          onClick={reset}
          className="px-8 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  /* ── progress state ── */
  if (isUploading || job) {
    return (
      <div className="flex flex-col items-center justify-center py-28 px-4 text-center">
        <Loader2 size={48} className="text-primary animate-spin mb-6" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">{statusLabel}</h2>
        <p className="text-gray-500 mb-8 text-sm">
          {file?.original_filename} ({file && formatBytes(file.size_bytes)})
        </p>
        <div className="w-72 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 mt-3">{progressPct}%</p>
      </div>
    );
  }

  /* ── default: upload UI (Image 3) ── */
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">{tool.pageTitle}</h1>
      <p className="text-gray-500 text-center mb-8 max-w-lg">{tool.pageSubtitle}</p>

      {/* Big upload button + drop area */}
      <div
        onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center",
          dragging && "opacity-80"
        )}
      >
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-3 bg-primary hover:bg-primary-dark text-white font-bold text-lg px-12 py-5 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <CloudUpload size={24} />
          Select {tool.acceptedLabel} file
        </button>

        {/* Cloud upload icon buttons like iLovePDF (decorative) */}
        <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow"
            title="Upload from device"
          >
            <CloudUpload size={16} />
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-400">
          or drop {tool.acceptedLabel} here
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={tool.acceptedMime}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Drag overlay */}
      {dragging && (
        <div className="fixed inset-0 z-50 bg-primary/10 border-4 border-dashed border-primary flex items-center justify-center pointer-events-none">
          <p className="text-primary text-2xl font-bold">Drop your file here</p>
        </div>
      )}
    </div>
  );
}
