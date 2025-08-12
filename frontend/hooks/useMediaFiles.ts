import { useQuery } from '@tanstack/react-query';
import backend from '~backend/client';

interface UseMediaFilesOptions {
  search?: string;
  fileType?: 'image' | 'video';
  limit?: number;
  offset?: number;
}

export function useMediaFiles(options: UseMediaFilesOptions = {}) {
  return useQuery({
    queryKey: ['media-files', options],
    queryFn: () => backend.media.listMedia({
      search: options.search,
      fileType: options.fileType,
      limit: options.limit,
      offset: options.offset,
    }),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
