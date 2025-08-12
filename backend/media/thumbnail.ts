import { api, APIError } from "encore.dev/api";
import { mediaDB } from "./db";
import { mediaBucket, thumbnailBucket } from "./storage";

export interface GenerateThumbnailRequest {
  id: string;
}

export interface GenerateThumbnailResponse {
  thumbnailKey: string;
  success: boolean;
}

// Generates a thumbnail for a video file.
export const generateThumbnail = api<GenerateThumbnailRequest, GenerateThumbnailResponse>(
  { expose: true, method: "POST", path: "/media/:id/thumbnail" },
  async (req) => {
    const file = await mediaDB.queryRow<{
      id: number;
      storage_key: string;
      mime_type: string;
      file_type: string;
    }>`
      SELECT id, storage_key, mime_type, file_type
      FROM media_files 
      WHERE id = ${parseInt(req.id)} AND file_type = 'video'
    `;

    if (!file) {
      throw APIError.notFound("Video file not found");
    }

    // Generate thumbnail key
    const thumbnailKey = `thumb_${file.storage_key.replace(/\.[^/.]+$/, '')}.jpg`;

    // For now, we'll mark that a thumbnail should be generated
    // In a production environment, you would use a video processing service
    // like FFmpeg or a cloud service to generate actual thumbnails
    
    // Update the database with the thumbnail key
    await mediaDB.exec`
      UPDATE media_files 
      SET thumbnail_key = ${thumbnailKey}
      WHERE id = ${file.id}
    `;

    return {
      thumbnailKey,
      success: true,
    };
  }
);
