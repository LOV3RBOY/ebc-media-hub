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
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden shadow-2xl border border-slate-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1 bg-slate-800/50 text-slate-300 border-slate-700">
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
              className="gap-2 bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-700/80 hover:border-slate-600/50"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Media Display */}
          <div className="flex-1 bg-slate-950/50 flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
            {isLoading ? (
              <div className="animate-pulse">
                {file.fileType === 'image' ? (
                  <ImageIcon className="w-16 h-16 text-slate-500" />
                ) : (
                  <Video className="w-16 h-16 text-slate-500" />
                )}
              </div>
            ) : error || imageError || !previewData ? (
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">Preview unavailable</p>
              </div>
            ) : file.fileType === 'image' ? (
              <img
                src={previewData.previewUrl}
                alt={file.originalFilename}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <video
                src={previewData.previewUrl}
                controls
                className="max-w-full max-h-full rounded-lg"
                onError={() => setImageError(true)}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Metadata Sidebar */}
          <div className="w-full lg:w-80 p-6 border-t lg:border-t-0 lg:border-l border-slate-700/50 bg-slate-900/50">
            <h3 className="font-semibold text-white mb-4">File Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-400">Filename</label>
                <p className="text-sm text-slate-200 break-all">{file.originalFilename}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400">File Size</label>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <HardDrive className="w-4 h-4" />
                  {formatFileSize(file.fileSize)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400">Upload Date</label>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <Calendar className="w-4 h-4" />
                  {formatDate(file.uploadedAt)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-400">Type</label>
                <p className="text-sm text-slate-200">{file.mimeType}</p>
              </div>

              {file.width && file.height && (
                <div>
                  <label className="text-sm font-medium text-slate-400">Dimensions</label>
                  <p className="text-sm text-slate-200">{file.width} × {file.height}</p>
                </div>
              )}

              {file.duration && (
                <div>
                  <label className="text-sm font-medium text-slate-400">Duration</label>
                  <p className="text-sm text-slate-200">
                    {Math.floor(file.duration / 60)}:{String(Math.floor(file.duration % 60)).padStart(2, '0')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
