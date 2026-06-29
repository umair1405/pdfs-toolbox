import { create } from "zustand";
import type { ConversionJob, UploadedFile } from "@/types";

interface UploadState {
  file: UploadedFile | null;
  job: ConversionJob | null;
  uploadProgress: number;
  isUploading: boolean;
  setFile: (f: UploadedFile | null) => void;
  setJob: (j: ConversionJob | null) => void;
  setUploadProgress: (n: number) => void;
  setIsUploading: (v: boolean) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  file: null,
  job: null,
  uploadProgress: 0,
  isUploading: false,
  setFile: (file) => set({ file }),
  setJob: (job) => set({ job }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  setIsUploading: (isUploading) => set({ isUploading }),
  reset: () => set({ file: null, job: null, uploadProgress: 0, isUploading: false }),
}));
