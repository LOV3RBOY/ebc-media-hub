import { api, APIError } from "encore.dev/api";
import { mediaDB } from "./db";
import { mediaBucket } from "./storage";

export interface DownloadRequest {
  id: string;
}

export interface DownloadResponse {
  downloadUrl: string;
  filename: string;
  mimeType: string;
  fileSize: number;
}

// Generates a signed download URL for a media file.
export const getDownloadUrl = api<DownloadRequest, DownloadResponse>(
  { expose: true, method: "GET", path: "/media/:id/download" },
  async (req) => {
    const file = await mediaDB.queryRow<{
      filename: string;
      original_filename: string;
      file_size: number;
      mime_type: string;
      storage_key: string;
    }>`
      SELECT filename, original_filename, file_size, mime_type, storage_key 
      FROM media_files 
      WHERE id = ${parseInt(req.id)}
    `;

    if (!file) {
      throw APIError.notFound("Media file not found");
    }

    const { url } = await mediaBucket.signedDownloadUrl(file.storage_key, {
      ttl: 3600, // 1 hour
    });

    return {
      downloadUrl: url,
      filename: file.original_filename,
      mimeType: file.mime_type,
      fileSize: file.file_size,
    };
  }
);
