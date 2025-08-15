# EBC Media Hub

A modern media storage and management platform built with Encore.ts and React. Designed for communal media storage with support for images and videos.

## Features

- **File Upload**: Drag & drop or click to upload images and videos (up to 2GB)
- **Media Preview**: View images and videos with built-in player controls
- **Search & Filter**: Find files by name and filter by type (images/videos)
- **Download**: Secure download links for all media files
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern dark UI with gradient accents

## Tech Stack

### Backend
- **Encore.ts**: TypeScript backend framework
- **PostgreSQL**: Database for metadata storage
- **Object Storage**: Secure file storage with signed URLs

### Frontend
- **React**: Modern UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Beautiful UI components
- **React Query**: Data fetching and caching

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ebc-media-hub
   ```

2. **Install dependencies**
   Dependencies are automatically managed by the Leap platform.

3. **Run the application**
   The application will start automatically in the Leap environment.

## File Structure

```
├── backend/
│   └── media/
│       ├── encore.service.ts    # Service definition
│       ├── db.ts               # Database configuration
│       ├── storage.ts          # Object storage buckets
│       ├── upload.ts           # File upload endpoints
│       ├── list.ts             # File listing endpoint
│       ├── preview.ts          # Preview URL generation
│       ├── download.ts         # Download URL generation
│       ├── delete.ts           # File deletion
│       ├── thumbnail.ts        # Thumbnail generation
│       └── migrations/         # Database migrations
├── frontend/
│   ├── App.tsx                 # Main application component
│   ├── components/             # React components
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
```

## API Endpoints

- `POST /media/upload-url` - Generate signed upload URL
- `POST /media/complete-upload` - Complete file upload
- `GET /media` - List media files with pagination and filtering
- `GET /media/:id/preview` - Get preview URL for a file
- `GET /media/:id/download` - Get download URL for a file
- `DELETE /media/:id` - Delete a media file
- `POST /media/:id/thumbnail` - Generate video thumbnail

## Database Schema

The application uses a single `media_files` table to store file metadata:

- `id`: Unique identifier
- `filename`: Generated filename
- `original_filename`: Original upload filename
- `file_size`: File size in bytes
- `mime_type`: MIME type
- `file_type`: Either 'image' or 'video'
- `storage_key`: Object storage key
- `thumbnail_key`: Thumbnail storage key (for videos)
- `width`, `height`: Media dimensions
- `duration`: Video duration in seconds
- `uploaded_at`, `created_at`: Timestamps

## Storage

The application uses two object storage buckets:

- `ebc-media-files`: Main media file storage
- `ebc-thumbnails`: Video thumbnail storage

Both buckets are private and use signed URLs for secure access.

## Development

The application is built with modern development practices:

- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Comprehensive error handling with user feedback
- **Performance**: Optimized with React Query caching and lazy loading
- **Security**: Signed URLs and secure file handling
- **Accessibility**: Keyboard navigation and screen reader support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
