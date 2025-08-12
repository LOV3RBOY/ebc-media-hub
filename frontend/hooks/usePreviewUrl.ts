import { useQuery } from '@tanstack/react-query';
import backend from '~backend/client';

export function usePreviewUrl(fileId: string) {
  return useQuery({
    queryKey: ['preview-url', fileId],
    queryFn: () => backend.media.getPreviewUrl({ id: fileId }),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
