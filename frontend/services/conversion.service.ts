import { api } from "@/services/api";
import type { ConversionJob, UploadedFile } from "@/types";

export const conversionService = {
  uploadFile: (file: File, onProgress?: (pct: number) => void) => {
    const form = new FormData();
    form.append("file", file);
    return api
      .post<UploadedFile>("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
        },
      })
      .then((r) => r.data);
  },

  createConversion: (payload: { file_id: string; target_format: string; operation: string }) =>
    api.post<ConversionJob>("/convert", payload).then((r) => r.data),

  getJob: (jobId: string) => api.get<ConversionJob>(`/convert/${jobId}`).then((r) => r.data),

  downloadUrl: (jobId: string) =>
    `${api.defaults.baseURL}/files/${jobId}/download`,

  pollJob: (jobId: string, onTick: (job: ConversionJob) => void, ms = 1500) => {
    const id = setInterval(async () => {
      try {
        const job = await conversionService.getJob(jobId);
        onTick(job);
        if (job.status === "done" || job.status === "failed") clearInterval(id);
      } catch {
        clearInterval(id);
      }
    }, ms);
    return () => clearInterval(id);
  },
};
