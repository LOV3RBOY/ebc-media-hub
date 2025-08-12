CREATE TABLE media_files (
  id BIGSERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
  storage_key TEXT NOT NULL UNIQUE,
  thumbnail_key TEXT,
  width INTEGER,
  height INTEGER,
  duration DOUBLE PRECISION,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_files_uploaded_at ON media_files(uploaded_at DESC);
CREATE INDEX idx_media_files_file_type ON media_files(file_type);
