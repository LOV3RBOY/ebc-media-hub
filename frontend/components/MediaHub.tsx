import React, { useState } from 'react';
import { Header } from './Header';
import { UploadZone } from './UploadZone';
import { MediaGrid } from './MediaGrid';
import { MediaPreview } from './MediaPreview';
import { useMediaFiles } from '../hooks/useMediaFiles';
import type { MediaFile } from '../types/media';

export function MediaHub() {
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  
  const { data, isLoading, refetch } = useMediaFiles({
    search: searchQuery,
    fileType: filterType === 'all' ? undefined : filterType,
  });

  const handleUploadComplete = () => {
    refetch();
  };

  const handleFileSelect = (file: MediaFile) => {
    setSelectedFile(file);
  };

  const handleClosePreview = () => {
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterType={filterType}
        onFilterChange={setFilterType}
      />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <UploadZone onUploadComplete={handleUploadComplete} />
        
        <MediaGrid
          files={data?.files || []}
          isLoading={isLoading}
          onFileSelect={handleFileSelect}
          onRefresh={refetch}
        />
      </main>

      {selectedFile && (
        <MediaPreview
          file={selectedFile}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
}
