import React, { useState } from 'react';
import { X, Download, Calendar, HardDrive, Image as ImageIcon, Video, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { usePreviewUrl } from '../hooks/usePreviewUrl';
import { useDownloadFile } from '../hooks/useDownloadFile';
import { formatFileSize, formatDate } from '../utils/format';
import type { MediaFile } from '../types/media';

interface MediaPreviewProps {
  file: MediaFile;
  onClose: () => void;
}

export function MediaPreview({ file, onClose }: MediaPreviewProps) {
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();
  const { data: previewData, isLoading, error } = usePreviewUrl(file.id);
  const { downloadFile, isDownloading } = useDownloadFile();

  const handleDownload = async () => {
    try {
      await downloadFile(file);
      toast({
        title: "Download started",
        description: `Downloading ${file.originalFilename}`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-zinc-950/95 backdrop-blur-2xl rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden shadow-2xl border border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/20 via-transparent to-zinc-900/20" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-zinc-800/50">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1 bg-zinc-900/50 text-zinc-300 border-zinc-800/50 shadow-inner">
              {file.fileType === 'image' ? (
                <ImageIcon className="w-3 h-3" />
              ) : (
                <Video className="w-3 h-3" />
              )}
              {file.fileType}
            </Badge>
            <h2 className="font-semibold text-white truncate" title={file.originalFilename}>
              {file.originalFilename}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="gap-2 bg-zinc-900/50 border-zinc-800/50 text-zinc-200 hover:bg-zinc-800/80 hover:border-zinc-700/50 transition-all"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Media Display */}
          <div className="flex-1 bg-black/50 flex items-center justify-center min-h-[300px] lg:min-h-[400px] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/20 via-transparent to-zinc-950/20" />
            {isLoading ? (
              <div className="relative animate-pulse">
                {file.fileType === 'image' ? (
                  <ImageIcon className="w-16 h-16 text-zinc-600" />
                ) : (
                  <Video className="w-16 h-16 text-zinc-600" />
                )}
              </div>
            ) : error || imageError || !previewData ? (
              <div className="relative text-center">
                <AlertCircle className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-500">Preview unavailable</p>
              </div>
            ) : file.fileType === 'image' ? (
              <img
                src={previewData.previewUrl}
                alt={file.originalFilename}
                className="relative max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onError={() => setImageError(true)}
              />
            ) : (
              <video
                src={previewData.previewUrl}
                controls
                className="relative max-w-full max-h-full rounded-lg shadow-2xl"
                onError={() => setImageError(true)}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Metadata Sidebar */}
          <div className="relative w-full lg:w-80 p-6 border-t lg:border-t-0 lg:border-l border-zinc-800/50 bg-zinc-950/50">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/10 via-transparent to-zinc-900/10" />
            <div className="relative">
              <h3 className="font-semibold text-white mb-4">File Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-500">Filename</label>
                  <p className="text-sm text-zinc-200 break-all">{file.originalFilename}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-500">File Size</label>
                  <div className="flex items-center gap-2 text-sm text-zinc-200">
                    <HardDrive className="w-4 h-4" />
                    {formatFileSize(file.fileSize)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-500">Upload Date</label>
                  <div className="flex items-center gap-2 text-sm text-zinc-200">
                    <Calendar className="w-4 h-4" />
                    {formatDate(file.uploadedAt)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-500">Type</label>
                  <p className="text-sm text-zinc-200">{file.mimeType}</p>
                </div>

                {file.width && file.height && (
                  <div>
                    <label className="text-sm font-medium text-zinc-500">Dimensions</label>
                    <p className="text-sm text-zinc-200">{file.width} × {file.height}</p>
                  </div>
                )}

                {file.duration && (
                  <div>
                    <label className="text-sm font-medium text-zinc-500">Duration</label>
                    <p className="text-sm text-zinc-200">
                      {Math.floor(file.duration / 60)}:{String(Math.floor(file.duration % 60)).padStart(2, '0')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
