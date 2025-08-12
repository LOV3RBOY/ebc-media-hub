import { api } from "encore.dev/api";
import { mediaBucket, thumbnailBucket } from "./storage";
import { mediaDB } from "./db";
import crypto from "crypto";

export interface UploadUrlRequest {
  filename: string;
  fileSize: number;
  mimeType: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  fileId: string;
  storageKey: string;
}

// Generates a signed upload URL for direct client uploads.
export const getUploadUrl = api<UploadUrlRequest, UploadUrlResponse>(
  { expose: true, method: "POST", path: "/media/upload-url" },
  async (req) => {
    const fileId = crypto.randomUUID();
    const extension = req.filename.split('.').pop() || '';
    const storageKey = `${fileId}.${extension}`;
    
    // Extended TTL for large file uploads
    const { url } = await mediaBucket.signedUploadUrl(storageKey, {
      ttl: 7200, // 2 hours for large video uploads
    });

    return {
      uploadUrl: url,
      fileId,
      storageKey,
    };
  }
);

export interface CompleteUploadRequest {
  fileId: string;
  storageKey: string;
  filename: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  fileType: string;
  storageKey: string;
  thumbnailKey?: string;
  width?: number;
  height?: number;
  duration?: number;
  uploadedAt: Date;
  createdAt: Date;
}

// Completes the upload process and stores metadata in the database.
export const completeUpload = api<CompleteUploadRequest, MediaFile>(
  { expose: true, method: "POST", path: "/media/complete-upload" },
  async (req) => {
    const fileType = req.mimeType.startsWith('image/') ? 'image' : 'video';
    
    const result = await mediaDB.queryRow<{
      id: number;
      filename: string;
      original_filename: string;
      file_size: number;
      mime_type: string;
      file_type: string;
      storage_key: string;
      thumbnail_key: string | null;
      width: number | null;
      height: number | null;
      duration: number | null;
      uploaded_at: Date;
      created_at: Date;
    }>`
      INSERT INTO media_files (
        filename, original_filename, file_size, mime_type, file_type, 
        storage_key, width, height, duration
      ) VALUES (
        ${req.filename}, ${req.originalFilename}, ${req.fileSize}, ${req.mimeType}, 
        ${fileType}, ${req.storageKey}, ${req.width || null}, ${req.height || null}, 
        ${req.duration || null}
      )
      RETURNING *
    `;

    if (!result) {
      throw new Error("Failed to create media file record");
    }

    return {
      id: result.id.toString(),
      filename: result.filename,
      originalFilename: result.original_filename,
      fileSize: result.file_size,
      mimeType: result.mime_type,
      fileType: result.file_type,
      storageKey: result.storage_key,
      thumbnailKey: result.thumbnail_key || undefined,
      width: result.width || undefined,
      height: result.height || undefined,
      duration: result.duration || undefined,
      uploadedAt: result.uploaded_at,
      createdAt: result.created_at,
    };
  }
);
