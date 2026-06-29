"use client";

import { useCallback } from "react";
import { useUploadStore } from "@/store/useUploadStore";
import { conversionService } from "@/services/conversion.service";
import type { Tool } from "@/config/tools";

export function useFileUpload(tool: Tool) {
  const { setFile, setJob, setUploadProgress, setIsUploading } = useUploadStore();

  const upload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadProgress(0);
      try {
        const uploaded = await conversionService.uploadFile(file, setUploadProgress);
        setFile(uploaded);
        const job = await conversionService.createConversion({
          file_id: uploaded.id,
          target_format: tool.targetFormat,
          operation: tool.operation,
        });
        setJob(job);
        conversionService.pollJob(job.id, (updated) => setJob(updated));
      } catch (err) {
        console.error("Upload/conversion failed:", err);
      } finally {
        setIsUploading(false);
      }
    },
    [tool, setFile, setJob, setUploadProgress, setIsUploading]
  );

  return { upload };
}
