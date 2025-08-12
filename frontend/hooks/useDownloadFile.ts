import { useState } from 'react';
import backend from '~backend/client';
import type { MediaFile } from '../types/media';

export function useDownloadFile() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = async (file: MediaFile) => {
    setIsDownloading(true);
    
    try {
      const { downloadUrl, filename } = await backend.media.getDownloadUrl({ id: file.id });
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadFile,
    isDownloading,
  };
}
