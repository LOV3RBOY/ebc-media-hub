import React from 'react';
import { RefreshCw, Image, Video, Download, Eye, Calendar, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { MediaThumbnail } from './MediaThumbnail';
import { formatFileSize, formatDate } from '../utils/format';
import { useDownloadFile } from '../hooks/useDownloadFile';
import type { MediaFile } from '../types/media';

interface MediaGridProps {
  files: MediaFile[];
  isLoading: boolean;
  onFileSelect: (file: MediaFile) => void;
  onRefresh: () => void;
}

export function MediaGrid({ files, isLoading, onFileSelect, onRefresh }: MediaGridProps) {
  const { toast } = useToast();
  const { downloadFile, isDownloading } = useDownloadFile();

  const handleDownload = async (file: MediaFile, e: React.MouseEvent) => {
    e.stopPropagation();
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32 bg-zinc-900/50" />
          <Skeleton className="h-10 w-24 bg-zinc-900/50" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-zinc-950/80 rounded-xl border border-zinc-800/50 overflow-hidden">
              <Skeleton className="aspect-video w-full bg-zinc-900/50" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4 bg-zinc-900/50" />
                <Skeleton className="h-3 w-1/2 bg-zinc-900/50" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1 bg-zinc-900/50" />
                  <Skeleton className="h-8 w-8 bg-zinc-900/50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white">
            Media Library
          </h2>
          <Badge variant="secondary" className="bg-zinc-900/50 text-zinc-300 border-zinc-800/50 shadow-inner">
            {files.length} files
          </Badge>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="gap-2 bg-zinc-950/80 border-zinc-800/50 text-zinc-200 hover:bg-zinc-900/90 hover:border-zinc-700/50 hover:shadow-lg hover:shadow-black/20 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800/50">
            <Image className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No media files yet</h3>
          <p className="text-zinc-500">Upload some photos or videos to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative bg-zinc-950/80 backdrop-blur-sm rounded-xl border border-zinc-800/50 overflow-hidden hover:shadow-2xl hover:shadow-black/40 hover:border-zinc-700/50 hover:bg-zinc-950/90 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
              onClick={() => onFileSelect(file)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/10 via-transparent to-zinc-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative aspect-video bg-zinc-900/50">
                <MediaThumbnail file={file} />
                
                <div className="absolute top-3 left-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-black/60 text-white border-0 backdrop-blur-sm shadow-lg"
                  >
                    {file.fileType === 'image' ? (
                      <Image className="w-3 h-3 mr-1" />
                    ) : (
                      <Video className="w-3 h-3 mr-1" />
                    )}
                    {file.fileType}
                  </Badge>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-black/60 text-white border-0 backdrop-blur-sm hover:bg-black/80 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileSelect(file);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="relative p-4 space-y-3">
                <div>
                  <h3 className="font-medium text-white truncate" title={file.originalFilename}>
                    {file.originalFilename}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                    <div className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      {formatFileSize(file.fileSize)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(file.uploadedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2 text-xs bg-zinc-900/50 border-zinc-800/50 text-zinc-200 hover:bg-zinc-800/80 hover:border-zinc-700/50 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileSelect(file);
                    }}
                  >
                    <Eye className="w-3 h-3" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleDownload(file, e)}
                    disabled={isDownloading}
                    className="gap-2 text-xs bg-zinc-900/50 border-zinc-800/50 text-zinc-200 hover:bg-zinc-800/80 hover:border-zinc-700/50 transition-all"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
