import { Bucket } from "encore.dev/storage/objects";

export const mediaBucket = new Bucket("ebc-media-files", {
  public: false,
  versioned: false,
});

export const thumbnailBucket = new Bucket("ebc-thumbnails", {
  public: false,
  versioned: false,
});
