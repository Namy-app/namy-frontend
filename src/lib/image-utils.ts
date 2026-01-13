/**
 * Image utility functions for compression and optimization
 */

import type { ImageLoader, ImageLoaderProps } from "next/image";

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

export const contentfulImageLoader: ImageLoader = ({
  src,
  width,
  quality,
}: ImageLoaderProps) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

/**
 * Compress an image file before upload
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    maxSizeMB = 1,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        // Create canvas and compress
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }

            // Check if compressed size is acceptable
            if (blob.size > maxSizeMB * 1024 * 1024) {
              // If still too large, try with lower quality
              const newQuality = quality * 0.8;
              if (newQuality < 0.5) {
                // Quality too low, reject
                reject(
                  new Error(
                    `Image too large even after compression: ${(blob.size / 1024 / 1024).toFixed(2)}MB`
                  )
                );
                return;
              }

              // Retry with lower quality
              compressImage(file, { ...options, quality: newQuality })
                .then(resolve)
                .catch(reject);
              return;
            }

            // Create new file from blob
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  options: { maxSizeMB?: number; allowedTypes?: string[] } = {}
): { valid: boolean; error?: string } {
  const {
    maxSizeMB = 5,
    allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  } = options;

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Please use ${allowedTypes.map((t) => t.split("/")[1]?.toUpperCase() || t).join(", ")}`,
    };
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}
