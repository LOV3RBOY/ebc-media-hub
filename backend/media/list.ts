import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { mediaDB } from "./db";

export interface ListMediaRequest {
  limit?: Query<number>;
  offset?: Query<number>;
  fileType?: Query<string>;
  search?: Query<string>;
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

export interface ListMediaResponse {
  files: MediaFile[];
  total: number;
  hasMore: boolean;
}

// Lists all media files with pagination and filtering.
export const listMedia = api<ListMediaRequest, ListMediaResponse>(
  { expose: true, method: "GET", path: "/media" },
  async (req) => {
    const limit = req.limit || 50;
    const offset = req.offset || 0;
    
    let whereClause = "WHERE 1=1";
    const params: any[] = [];
    let paramIndex = 1;

    if (req.fileType && (req.fileType === 'image' || req.fileType === 'video')) {
      whereClause += ` AND file_type = $${paramIndex}`;
      params.push(req.fileType);
      paramIndex++;
    }

    if (req.search) {
      whereClause += ` AND (original_filename ILIKE $${paramIndex} OR filename ILIKE $${paramIndex})`;
      params.push(`%${req.search}%`);
      paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) as total FROM media_files ${whereClause}`;
    const countResult = await mediaDB.rawQueryRow<{ total: number }>(countQuery, ...params);
    const total = countResult?.total || 0;

    const filesQuery = `
      SELECT * FROM media_files 
      ${whereClause}
      ORDER BY uploaded_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const files = await mediaDB.rawQueryAll<{
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
    }>(filesQuery, ...params);

    return {
      files: files.map(file => ({
        id: file.id.toString(),
        filename: file.filename,
        originalFilename: file.original_filename,
        fileSize: file.file_size,
        mimeType: file.mime_type,
        fileType: file.file_type,
        storageKey: file.storage_key,
        thumbnailKey: file.thumbnail_key || undefined,
        width: file.width || undefined,
        height: file.height || undefined,
        duration: file.duration || undefined,
        uploadedAt: file.uploaded_at,
        createdAt: file.created_at,
      })),
      total,
      hasMore: offset + limit < total,
    };
  }
);
