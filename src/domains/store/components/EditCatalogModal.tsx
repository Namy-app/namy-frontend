import { Loader2, Package, Plus, X } from "lucide-react";
import { useState } from "react";

import { useUpdateCatalog, type Catalog } from "@/domains/admin";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { compressImage, formatFileSize, validateImageFile } from "@/lib/image-utils";

interface ImageUploadProgress {
  slot: number;
  status: "pending" | "compressing" | "uploading" | "completed" | "error";
  progress: number;
  originalSize?: number;
  compressedSize?: number;
  error?: string;
}

// Edit Catalog Modal
export const EditCatalogModal = ({
  catalog,
  onClose,
}: {
  catalog: Catalog;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const updateCatalog = useUpdateCatalog();
  const [name, setName] = useState(catalog.name);
  const [description, setDescription] = useState(catalog.description || "");
  const [selectedFiles, setSelectedFiles] = useState<{
    file1?: File;
    file2?: File;
    file3?: File;
    file4?: File;
    file5?: File;
    file6?: File;
    file7?: File;
    file8?: File;
    file9?: File;
    file10?: File;
  }>({});
  const [imagePreviews, setImagePreviews] = useState<{
    preview1?: string;
    preview2?: string;
    preview3?: string;
    preview4?: string;
    preview5?: string;
    preview6?: string;
    preview7?: string;
    preview8?: string;
    preview9?: string;
    preview10?: string;
  }>({
    preview1: catalog.image1Url,
    preview2: catalog.image2Url,
    preview3: catalog.image3Url,
    preview4: catalog.image4Url,
    preview5: catalog.image5Url,
    preview6: catalog.image6Url,
    preview7: catalog.image7Url,
    preview8: catalog.image8Url,
    preview9: catalog.image9Url,
    preview10: catalog.image10Url,
  });
  const [uploadProgress, setUploadProgress] = useState<ImageUploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = async (
    slot: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file using utility function
    const validation = validateImageFile(file, { maxSizeMB: 5 });
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: validation.error,
      });
      return;
    }

    try {
      // Show compression status
      toast({
        title: "Compressing image...",
        description: `Original size: ${formatFileSize(file.size)}`,
      });

      // Compress image before storing
      const compressedFile = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85,
        maxSizeMB: 1,
      });

      // Show compression result
      const compressionRatio = ((1 - compressedFile.size / file.size) * 100).toFixed(0);
      toast({
        title: "Image compressed",
        description: `Reduced by ${compressionRatio}% to ${formatFileSize(compressedFile.size)}`,
      });

      // Store compressed file and create preview
      setSelectedFiles((prev: typeof selectedFiles) => ({
        ...prev,
        [`file${slot}`]: compressedFile,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev: typeof imagePreviews) => ({
          ...prev,
          [`preview${slot}`]: reader.result as string,
        }));
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Compression failed",
        description: error instanceof Error ? error.message : "Failed to compress image",
      });
    }
  };

  const removeImage = (slot: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) => {
    setSelectedFiles((prev: typeof selectedFiles) => ({
      ...prev,
      [`file${slot}`]: undefined,
    }));
    setImagePreviews((prev: typeof imagePreviews) => ({
      ...prev,
      [`preview${slot}`]: undefined,
    }));
  };

  // Upload individual image with progress tracking
  const uploadSingleImage = async (
    file: File,
    slot: number,
    token: string,
    baseUrl: string
  ): Promise<string> => {
    setUploadProgress((prev) => [
      ...prev.filter((p) => p.slot !== slot),
      { slot, status: "uploading", progress: 0 },
    ]);

    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch(`${baseUrl}/upload/catalog-images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      setUploadProgress((prev) =>
        prev.map((p) =>
          p.slot === slot
            ? { ...p, status: "error", error: "Upload failed" }
            : p
        )
      );
      throw new Error(`Failed to upload image ${slot}`);
    }

    const { urls } = await response.json();
    const url = urls[0];

    setUploadProgress((prev) =>
      prev.map((p) =>
        p.slot === slot ? { ...p, status: "completed", progress: 100 } : p
      )
    );

    return url;
  };

  // Upload images in batches with concurrency control
  const uploadImagesInBatches = async (
    filesToUpload: Array<{ file: File; slot: number }>,
    token: string,
    baseUrl: string,
    concurrency: number = 3
  ): Promise<Array<{ slot: number; url: string }>> => {
    const results: Array<{ slot: number; url: string }> = [];
    const queue = [...filesToUpload];

    // Process images in batches
    while (queue.length > 0) {
      const batch = queue.splice(0, concurrency);
      const batchResults = await Promise.all(
        batch.map(async ({ file, slot }) => {
          try {
            const url = await uploadSingleImage(file, slot, token, baseUrl);
            return { slot, url };
          } catch (error) {
            console.error(`Failed to upload image ${slot}:`, error);
            throw error;
          }
        })
      );
      results.push(...batchResults);
    }

    return results;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress([]);

    try {
      // Upload new images to S3 if any
      const imageUrls: {
        image1Url?: string;
        image2Url?: string;
        image3Url?: string;
        image4Url?: string;
        image5Url?: string;
        image6Url?: string;
        image7Url?: string;
        image8Url?: string;
        image9Url?: string;
        image10Url?: string;
      } = {
        image1Url: catalog.image1Url,
        image2Url: catalog.image2Url,
        image3Url: catalog.image3Url,
        image4Url: catalog.image4Url,
        image5Url: catalog.image5Url,
        image6Url: catalog.image6Url,
        image7Url: catalog.image7Url,
        image8Url: catalog.image8Url,
        image9Url: catalog.image9Url,
        image10Url: catalog.image10Url,
      };

      // Prepare files to upload with their slot numbers
      const filesToUpload: Array<{ file: File; slot: number }> = [];
      if (selectedFiles.file1) filesToUpload.push({ file: selectedFiles.file1, slot: 1 });
      if (selectedFiles.file2) filesToUpload.push({ file: selectedFiles.file2, slot: 2 });
      if (selectedFiles.file3) filesToUpload.push({ file: selectedFiles.file3, slot: 3 });
      if (selectedFiles.file4) filesToUpload.push({ file: selectedFiles.file4, slot: 4 });
      if (selectedFiles.file5) filesToUpload.push({ file: selectedFiles.file5, slot: 5 });
      if (selectedFiles.file6) filesToUpload.push({ file: selectedFiles.file6, slot: 6 });
      if (selectedFiles.file7) filesToUpload.push({ file: selectedFiles.file7, slot: 7 });
      if (selectedFiles.file8) filesToUpload.push({ file: selectedFiles.file8, slot: 8 });
      if (selectedFiles.file9) filesToUpload.push({ file: selectedFiles.file9, slot: 9 });
      if (selectedFiles.file10) filesToUpload.push({ file: selectedFiles.file10, slot: 10 });

      if (filesToUpload.length > 0) {
        const authStore = useAuthStore.getState();
        const token = authStore.accessToken;

        if (!token) {
          throw new Error("No authentication token found");
        }

        const baseUrl = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
        ).replace("/graphql", "");

        // Upload images in batches with progress tracking
        const uploadResults = await uploadImagesInBatches(
          filesToUpload,
          token,
          baseUrl,
          3 // Upload 3 images concurrently
        );

        // Map uploaded URLs to their slots
        uploadResults.forEach(({ slot, url }) => {
          const imageKey = `image${slot}Url` as keyof typeof imageUrls;
          imageUrls[imageKey] = url;
        });
      }

      // Handle removed images (set to null only if user explicitly removed an existing image)
      // Check each slot to see if an image was removed
      const catalogImageKeys = [
        { slot: 1, catalogUrl: catalog.image1Url },
        { slot: 2, catalogUrl: catalog.image2Url },
        { slot: 3, catalogUrl: catalog.image3Url },
        { slot: 4, catalogUrl: catalog.image4Url },
        { slot: 5, catalogUrl: catalog.image5Url },
        { slot: 6, catalogUrl: catalog.image6Url },
        { slot: 7, catalogUrl: catalog.image7Url },
        { slot: 8, catalogUrl: catalog.image8Url },
        { slot: 9, catalogUrl: catalog.image9Url },
        { slot: 10, catalogUrl: catalog.image10Url },
      ];

      catalogImageKeys.forEach(({ slot, catalogUrl }) => {
        const previewKey = `preview${slot}` as keyof typeof imagePreviews;
        const imageKey = `image${slot}Url` as keyof typeof imageUrls;
        const fileKey = `file${slot}` as keyof typeof selectedFiles;

        // Only mark as removed if:
        // 1. The catalog originally had an image (catalogUrl exists)
        // 2. The preview is now undefined (user removed it)
        // 3. No new file is selected for this slot
        if (catalogUrl && !imagePreviews[previewKey] && !selectedFiles[fileKey]) {
          imageUrls[imageKey] = null;
        }
      });

      // Update catalog
      await updateCatalog.mutateAsync({
        id: catalog.id,
        name,
        description: description || undefined,
        ...imageUrls,
      });

      toast({
        title: "Catalog updated",
        description: "The catalog has been updated successfully.",
      });
      onClose();
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update catalog. Please try again.",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card rounded-lg shadow-card max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Edit Catalog
              </h3>
              <p className="text-sm text-muted-foreground">
                Update catalog details and images
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={(e) => void handleSubmit(e)} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Catalog Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              placeholder="e.g., Menu Items, Products, Services"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-background text-foreground"
              rows={3}
              placeholder="Describe your catalog..."
            />
          </div>

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Upload Progress ({uploadProgress.filter((p) => p.status === "completed").length}/
                {uploadProgress.length})
              </h4>
              <div className="space-y-1">
                {uploadProgress.map((progress) => (
                  <div key={progress.slot} className="flex items-center gap-2 text-xs">
                    <span className="w-16 text-muted-foreground">Image {progress.slot}</span>
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          progress.status === "completed"
                            ? "bg-green-500"
                            : progress.status === "error"
                              ? "bg-red-500"
                              : "bg-primary animate-pulse"
                        }`}
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                    <span
                      className={`w-20 ${
                        progress.status === "completed"
                          ? "text-green-600"
                          : progress.status === "error"
                            ? "text-red-600"
                            : "text-primary"
                      }`}
                    >
                      {progress.status === "completed"
                        ? "✓ Done"
                        : progress.status === "error"
                          ? "✗ Failed"
                          : "Uploading..."}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images Grid */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Images (Up to 10)
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((slot) => {
                const slotKey = slot as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
                const preview = imagePreviews[`preview${slotKey}`];
                return (
                  <div key={slot} className="space-y-2">
                    <div className="relative aspect-square bg-muted rounded-lg border-2 border-dashed border-border overflow-hidden">
                      {preview ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt={`Preview ${slot}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(slotKey)}
                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-muted/80 transition-colors">
                          <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                          <span className="text-[10px] text-muted-foreground">
                            {slot}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageSelect(slotKey, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Max 5MB per image • PNG, JPG, WebP • Click X to remove, + to add
              new
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={updateCatalog.isPending || isUploading}
              className="flex-1 px-4 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateCatalog.isPending || isUploading}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading Images...
                </>
              ) : updateCatalog.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating Catalog...
                </>
              ) : (
                "Update Catalog"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
