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
