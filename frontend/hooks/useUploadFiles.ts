import { useState } from 'react';
import backend from '~backend/client';

export function useUploadFiles() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    setCurrentFile(null);

    try {
      const totalFiles = files.length;
      let completedFiles = 0;

      for (const file of files) {
        setCurrentFile(file.name);
        
        // Get upload URL with extended timeout for large files
        const { uploadUrl, fileId, storageKey } = await backend.media.getUploadUrl({
          filename: file.name,
          fileSize: file.size,
          mimeType: file.type,
        });

        // Upload file directly to storage with progress tracking
        const uploadResponse = await uploadWithProgress(uploadUrl, file, (progress) => {
          const fileProgress = (completedFiles + progress) / totalFiles * 100;
          setUploadProgress(fileProgress);
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed for ${file.name}: ${uploadResponse.statusText}`);
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
      setCurrentFile(null);
    }
  };

  return {
    uploadFiles,
    isUploading,
    uploadProgress,
    currentFile,
  };
}

function uploadWithProgress(
  url: string, 
  file: File, 
  onProgress: (progress: number) => void
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(new Response(xhr.response, {
          status: xhr.status,
          statusText: xhr.statusText,
        }));
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.addEventListener('timeout', () => {
      reject(new Error('Upload timed out'));
    });

    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.timeout = 300000; // 5 minutes timeout for large files
    xhr.send(file);
  });
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}

function getVideoMetadata(file: File): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      });
      URL.revokeObjectURL(video.src);
    };
    
    video.onerror = () => {
      resolve({ width: 0, height: 0, duration: 0 });
      URL.revokeObjectURL(video.src);
    };
    
    video.src = URL.createObjectURL(file);
  });
}
