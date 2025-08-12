import { useState } from 'react';
import backend from '~backend/client';

export function useUploadFiles() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = files.length;
      let completedFiles = 0;

      for (const file of files) {
        // Get upload URL
        const { uploadUrl, fileId, storageKey } = await backend.media.getUploadUrl({
          filename: file.name,
          fileSize: file.size,
          mimeType: file.type,
        });

        // Upload file directly to storage
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        // Get file dimensions for images/videos
        let width: number | undefined;
        let height: number | undefined;
        let duration: number | undefined;

        if (file.type.startsWith('image/')) {
          const dimensions = await getImageDimensions(file);
          width = dimensions.width;
          height = dimensions.height;
        } else if (file.type.startsWith('video/')) {
          const metadata = await getVideoMetadata(file);
          width = metadata.width;
          height = metadata.height;
          duration = metadata.duration;
        }

        // Complete upload
        await backend.media.completeUpload({
          fileId,
          storageKey,
          filename: file.name,
          originalFilename: file.name,
          fileSize: file.size,
          mimeType: file.type,
          width,
          height,
          duration,
        });

        completedFiles++;
        setUploadProgress((completedFiles / totalFiles) * 100);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadFiles,
    isUploading,
    uploadProgress,
  };
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = URL.createObjectURL(file);
  });
}

function getVideoMetadata(file: File): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      });
    };
    video.onerror = () => {
      resolve({ width: 0, height: 0, duration: 0 });
    };
    video.src = URL.createObjectURL(file);
  });
}
