import { api, APIError } from "encore.dev/api";
import { mediaDB } from "./db";
import { mediaBucket, thumbnailBucket } from "./storage";

export interface DeleteRequest {
  id: string;
}

// Deletes a media file and its associated storage objects.
export const deleteMedia = api<DeleteRequest, void>(
  { expose: true, method: "DELETE", path: "/media/:id" },
  async (req) => {
    const file = await mediaDB.queryRow<{
      storage_key: string;
      thumbnail_key: string | null;
    }>`
      SELECT storage_key, thumbnail_key 
      FROM media_files 
      WHERE id = ${parseInt(req.id)}
    `;

    if (!file) {
      throw APIError.notFound("Media file not found");
    }

    // Delete from storage
    await mediaBucket.remove(file.storage_key);
    if (file.thumbnail_key) {
      await thumbnailBucket.remove(file.thumbnail_key);
    }

    // Delete from database
    await mediaDB.exec`
      DELETE FROM media_files 
      WHERE id = ${parseInt(req.id)}
    `;
  }
);
