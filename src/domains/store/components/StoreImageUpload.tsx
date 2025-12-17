import { useQueryClient } from "@tanstack/react-query";
import { Image, Loader2, Package, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { Store } from "@/domains/admin/types";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

// Store Image Upload Component
export const StoreImageUpload = ({
  storeId,
  storeName,
  currentImageUrl,
}: {
  storeId: string;
  storeName: string;
  currentImageUrl?: string | null;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Sync preview with current image URL when it changes (after refetch)
  useEffect(() => {
    if (currentImageUrl && !selectedFile) {
      setPreviewUrl(currentImageUrl);
    }
  }, [currentImageUrl, selectedFile]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, WebP)",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select an image smaller than 5MB",
      });
      return;
    }

    // Store the file for upload
    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedImage(file.name);
  };

  const handleUpload = async () => {
    if (!selectedFile || !previewUrl) {
      return;
    }

    if (!storeId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Store ID is missing. Please refresh the page.",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("storeId", storeId);

      // Get auth token
      const authStore = useAuthStore.getState();
      const token = authStore.accessToken;

      // Upload to backend (use base URL without /graphql)
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
      ).replace("/graphql", "");
      const response = await fetch(`${baseUrl}/upload/store-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // If we got the full store object back, use it to update the cache
      if (data.store) {
        queryClient.setQueryData(["store", storeId], data.store);
      } else {
        // Fallback: Update just the imageUrl
        queryClient.setQueryData(
          ["store", storeId],
          (oldData: Store | undefined) => {
            if (oldData) {
              const updatedData = { ...oldData, imageUrl: data.url };
              return updatedData;
            }
            return oldData;
          }
        );
      }

      // Update the preview immediately
      setPreviewUrl(data.url);
      setSelectedFile(null);
      setSelectedImage(null);

      toast({
        title: "Image uploaded",
        description: `Successfully uploaded image for ${storeName}. Old image deleted from S3.`,
      });

      // Refetch to ensure fresh data from server (optional now since we have the updated store)
      await queryClient.refetchQueries({ queryKey: ["store", storeId] });
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setSelectedImage(null);
  };

  return (
    <div className="bg-card rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Store Image
      </h2>

      {/* Image Preview Area - 16:9 Aspect Ratio */}
      <div className="mb-4">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          {previewUrl ? (
            <div className="absolute inset-0 rounded-lg overflow-hidden bg-muted border-2 border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={storeName}
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-lg transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="absolute inset-0 rounded-lg border-2 border-dashed border-border bg-muted flex flex-col items-center justify-center text-center p-4">
              <Image
                className="w-12 h-12 text-muted-foreground mb-2"
                aria-label="Upload placeholder"
              />
              <p className="text-sm font-medium text-foreground mb-1">
                16:9 Aspect Ratio
              </p>
              <p className="text-xs text-muted-foreground">
                Recommended: 1920x1080px
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Controls */}
      <div className="space-y-3">
        <div>
          <label
            htmlFor="store-image-upload"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Image className="w-5 h-5" aria-label="Image icon" />
            {previewUrl ? "Change Image" : "Select Image"}
          </label>
          <input
            id="store-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {Boolean(previewUrl) && (
          <button
            onClick={() => void handleUpload()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Package className="w-5 h-5" />
                Upload Image
              </>
            )}
          </button>
        )}

        {Boolean(selectedImage) && (
          <p className="text-xs text-muted-foreground text-center">
            Selected: {selectedImage}
          </p>
        )}
      </div>

      {/* Image Guidelines */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-xs font-medium text-foreground mb-2">
          Image Guidelines:
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Aspect ratio: 16:9 (e.g., 1920x1080px)</li>
          <li>• Max file size: 5MB</li>
          <li>• Formats: PNG, JPG, JPEG, WebP</li>
          <li>• High quality images recommended</li>
        </ul>
      </div>
    </div>
  );
};
