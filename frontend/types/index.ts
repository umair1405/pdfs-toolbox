export type ConversionStatus = "queued" | "processing" | "done" | "failed";

export interface UploadedFile {
  id: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

export interface ConversionJob {
  id: string;
  file_id: string;
  target_format: string;
  operation: string;
  status: ConversionStatus;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
  download_url: string | null;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
