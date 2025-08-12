import React, { useState } from 'react';
import { Image as ImageIcon, Video, AlertCircle } from 'lucide-react';
import { usePreviewUrl } from '../hooks/usePreviewUrl';
import type { MediaFile } from '../types/media';

interface MediaThumbnailProps {
  file: MediaFile;
  className?: string;
}

export function MediaThumbnail({ file, className = "" }: MediaThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const { data: previewData, isLoading, error } = usePreviewUrl(file.id);

  if (isLoading) {
    return (
      <div className={`w-full h-full bg-slate-200 flex items-center justify-center ${className}`}>
        <div className="animate-pulse">
          {file.fileType === 'image' ? (
            <ImageIcon className="w-8 h-8 text-slate-400" />
          ) : (
            <Video className="w-8 h-8 text-slate-400" />
          )}
        </div>
      </div>
    );
  }

  if (error || imageError || !previewData) {
    return (
      <div className={`w-full h-full bg-slate-200 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Preview unavailable</p>
        </div>
      </div>
    );
  }

  if (file.fileType === 'image') {
    return (
      <img
        src={previewData.previewUrl}
        alt={file.originalFilename}
        className={`w-full h-full object-cover ${className}`}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  }

  // For videos, show a thumbnail with play overlay
  return (
    <div className={`relative w-full h-full ${className}`}>
      <img
        src={previewData.previewUrl}
        alt={file.originalFilename}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
          <Video className="w-6 h-6 text-slate-700 ml-1" />
        </div>
      </div>
      {file.duration && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {Math.floor(file.duration / 60)}:{String(Math.floor(file.duration % 60)).padStart(2, '0')}
        </div>
      )}
    </div>
  );
}
