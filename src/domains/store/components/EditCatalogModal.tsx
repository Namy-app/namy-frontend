import { Loader2, Package, Plus, X } from "lucide-react";
import { useState } from "react";

import { useUpdateCatalog, type Catalog } from "@/domains/admin";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

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

  const handleImageSelect = (
    slot: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

    // Store file and create preview
    setSelectedFiles((prev: typeof selectedFiles) => ({
      ...prev,
      [`file${slot}`]: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev: typeof imagePreviews) => ({
        ...prev,
        [`preview${slot}`]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const filesToUpload = [
        selectedFiles.file1,
        selectedFiles.file2,
        selectedFiles.file3,
        selectedFiles.file4,
        selectedFiles.file5,
        selectedFiles.file6,
        selectedFiles.file7,
        selectedFiles.file8,
        selectedFiles.file9,
        selectedFiles.file10,
      ].filter(Boolean) as File[];

      if (filesToUpload.length > 0) {
        const formData = new FormData();
        filesToUpload.forEach((file) => {
          formData.append("files", file);
        });

        const authStore = useAuthStore.getState();
        const token = authStore.accessToken;

        const baseUrl = (
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
        ).replace("/graphql", "");

        const uploadResponse = await fetch(`${baseUrl}/upload/catalog-images`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }

        const { urls } = await uploadResponse.json();

        // Map URLs to the correct slots (only update slots with new files)
        let urlIndex = 0;
        if (selectedFiles.file1) {
          imageUrls.image1Url = urls[urlIndex++];
        }
        if (selectedFiles.file2) {
          imageUrls.image2Url = urls[urlIndex++];
        }
        if (selectedFiles.file3) {
          imageUrls.image3Url = urls[urlIndex++];
        }
        if (selectedFiles.file4) {
          imageUrls.image4Url = urls[urlIndex++];
        }
        if (selectedFiles.file5) {
          imageUrls.image5Url = urls[urlIndex++];
        }
        if (selectedFiles.file6) {
          imageUrls.image6Url = urls[urlIndex++];
        }
        if (selectedFiles.file7) {
          imageUrls.image7Url = urls[urlIndex++];
        }
        if (selectedFiles.file8) {
          imageUrls.image8Url = urls[urlIndex++];
        }
        if (selectedFiles.file9) {
          imageUrls.image9Url = urls[urlIndex++];
        }
        if (selectedFiles.file10) {
          imageUrls.image10Url = urls[urlIndex++];
        }
      }

      // Handle removed images (set to undefined if preview was removed but no new file)
      Object.keys(imagePreviews).forEach((key) => {
        const slot = key.replace("preview", "") as
          | "1"
          | "2"
          | "3"
          | "4"
          | "5"
          | "6"
          | "7"
          | "8"
          | "9"
          | "10";
        const imageKey = `image${slot}Url` as keyof typeof imageUrls;
        const previewKey = key as keyof typeof imagePreviews;

        if (
          !imagePreviews[previewKey] &&
          !selectedFiles[`file${slot}` as keyof typeof selectedFiles]
        ) {
          imageUrls[imageKey] = undefined;
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
              disabled={updateCatalog.isPending}
              className="flex-1 px-4 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateCatalog.isPending}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {updateCatalog.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
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
