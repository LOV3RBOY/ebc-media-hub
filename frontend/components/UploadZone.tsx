import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, FileVideo, X, CheckCircle, AlertCircle } from 'lucide-react';
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
  const { uploadFiles, uploadProgress, isUploading } = useUploadFiles();

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
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'],
    },
    maxSize: 500 * 1024 * 1024, // 500MB
    disabled: isUploading,
  });

  React.useEffect(() => {
    if (fileRejections.length > 0) {
      toast({
        title: "Upload rejected",
        description: "Some files were rejected. Please check file types and sizes.",
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
          className="gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 border-0"
        >
          <Upload className="w-5 h-5" />
          Upload Media
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Upload Media</h2>
          {!isUploading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
            isDragActive
              ? "border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20"
              : "border-slate-600 hover:border-slate-500 hover:bg-slate-800/30",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              {isDragActive ? (
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Upload className="w-8 h-8 text-blue-400" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-slate-400" />
                </div>
              )}
            </div>

            <div>
              <p className="text-lg font-medium text-white mb-2">
                {isDragActive ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-sm text-slate-400 mb-4">
                or click to browse your device
              </p>
              
              <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <FileImage className="w-4 h-4" />
                  Images
                </div>
                <div className="flex items-center gap-1">
                  <FileVideo className="w-4 h-4" />
                  Videos
                </div>
                <span>Max 500MB</span>
              </div>
            </div>
          </div>
        </div>

        {isUploading && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Uploading files...</span>
              <span className="text-slate-400">{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2 bg-slate-800" />
          </div>
        )}
      </div>
    </div>
  );
}
