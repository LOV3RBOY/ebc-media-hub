import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, FileVideo, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useUploadFiles } from '../hooks/useUploadFiles';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onUploadComplete: () => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const { uploadFiles, uploadProgress, isUploading, currentFile } = useUploadFiles();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    try {
      await uploadFiles(acceptedFiles);
      onUploadComplete();
      setIsExpanded(false);
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${acceptedFiles.length} file(s)`,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  }, [uploadFiles, onUploadComplete, toast]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.heic', '.raw'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.wmv', '.flv', '.3gp'],
    },
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB for high-quality videos
    disabled: isUploading,
  });

  React.useEffect(() => {
    if (fileRejections.length > 0) {
      const rejectedFile = fileRejections[0];
      let message = "Some files were rejected.";
      
      if (rejectedFile.errors.some(e => e.code === 'file-too-large')) {
        message = "File too large. Maximum size is 2GB.";
      } else if (rejectedFile.errors.some(e => e.code === 'file-invalid-type')) {
        message = "Invalid file type. Please upload images or videos only.";
      }
      
      toast({
        title: "Upload rejected",
        description: message,
        variant: "destructive",
      });
    }
  }, [fileRejections, toast]);

  if (!isExpanded && !isUploading) {
    return (
      <div className="flex justify-center">
        <Button
          onClick={() => setIsExpanded(true)}
          size="lg"
          className="relative gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 border-0 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
          <Upload className="relative w-5 h-5" />
          <span className="relative">Upload Media</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative bg-zinc-950/80 backdrop-blur-xl rounded-2xl border border-zinc-800/50 shadow-2xl shadow-black/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/20 via-transparent to-zinc-900/20" />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Upload Media</h2>
          {!isUploading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 relative overflow-hidden",
            isDragActive
              ? "border-blue-400/50 bg-blue-500/5 shadow-lg shadow-blue-500/20"
              : "border-zinc-700/50 hover:border-zinc-600/50 hover:bg-zinc-900/20",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isDragActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-pulse" />
          )}
          <input {...getInputProps()} />
          
          <div className="relative space-y-4">
            <div className="flex justify-center">
              {isDragActive ? (
                <div className="relative w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md animate-pulse" />
                  <Upload className="relative w-8 h-8 text-blue-400" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-zinc-900/50 rounded-full flex items-center justify-center border border-zinc-800/50">
                  <Upload className="w-8 h-8 text-zinc-500" />
                </div>
              )}
            </div>

            <div>
              <p className="text-lg font-medium text-white mb-2">
                {isDragActive ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-sm text-zinc-400 mb-4">
                or click to browse your device
              </p>
              
              <div className="flex items-center justify-center gap-6 text-xs text-zinc-600">
                <div className="flex items-center gap-1">
                  <FileImage className="w-4 h-4" />
                  Images
                </div>
                <div className="flex items-center gap-1">
                  <FileVideo className="w-4 h-4" />
                  Videos
                </div>
                <span>Max 2GB</span>
              </div>
            </div>
          </div>
        </div>

        {isUploading && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-300">
                  {currentFile ? `Uploading ${currentFile}...` : 'Uploading files...'}
                </span>
              </div>
              <span className="text-zinc-500">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="relative">
              <Progress value={uploadProgress} className="h-2 bg-zinc-900/50" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm" />
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <p className="text-xs text-zinc-500 text-center">
                Large files may take several minutes to upload
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
