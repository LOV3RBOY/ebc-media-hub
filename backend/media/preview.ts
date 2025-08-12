import { api, APIError } from "encore.dev/api";
import { mediaDB } from "./db";
import { mediaBucket, thumbnailBucket } from "./storage";

export interface PreviewRequest {
  id: string;
}

export interface PreviewResponse {
  previewUrl: string;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number;
}

// Generates a signed preview URL for a media file.
export const getPreviewUrl = api<PreviewRequest, PreviewResponse>(
  { expose: true, method: "GET", path: "/media/:id/preview" },
  async (req) => {
    const file = await mediaDB.queryRow<{
      mime_type: string;
      storage_key: string;
      thumbnail_key: string | null;
      width: number | null;
      height: number | null;
      duration: number | null;
    }>`
      SELECT mime_type, storage_key, thumbnail_key, width, height, duration
      FROM media_files 
      WHERE id = ${parseInt(req.id)}
    `;

    if (!file) {
      throw APIError.notFound("Media file not found");
    }

    // For images, use the original file for preview
    // For videos, use thumbnail if available, otherwise the original file
    let previewUrl: string;

    if (file.mime_type.startsWith('video/') && file.thumbnail_key) {
      const { url } = await thumbnailBucket.signedDownloadUrl(file.thumbnail_key, {
        ttl: 3600, // 1 hour
      });
      previewUrl = url;
    } else {
      const { url } = await mediaBucket.signedDownloadUrl(file.storage_key, {
        ttl: 3600, // 1 hour
      });
      previewUrl = url;
    }

    return {
      previewUrl,
      mimeType: file.mime_type,
      width: file.width || undefined,
      height: file.height || undefined,
      duration: file.duration || undefined,
    };
  }
);
