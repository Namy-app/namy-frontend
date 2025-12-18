import { useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";

import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

interface ImageSlot {
  url: string | null;
  file: File | null;
  isUploading: boolean;
}

// Store Image Upload Component with 4 Fixed Slots
export const StoreImageUpload = ({
  storeId,
  storeName,
  imageUrl,
  image1Url,
  image2Url,
  image3Url,
}: {
  storeId: string;
  storeName: string;
  imageUrl?: string | null;
  image1Url?: string | null;
  image2Url?: string | null;
  image3Url?: string | null;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize 4 fixed image slots
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([
    { url: imageUrl || null, file: null, isUploading: false },
    { url: image1Url || null, file: null, isUploading: false },
    { url: image2Url || null, file: null, isUploading: false },
    { url: image3Url || null, file: null, isUploading: false },
  ]);

  // Sync state when props change (after refetch from server)
  useEffect(() => {
    setImageSlots((prev) => {
      // Only update if there's an actual change in URLs and no pending file operations
      const shouldUpdate =
        (imageUrl !== prev[0]?.url && !prev[0]?.file) ||
        (image1Url !== prev[1]?.url && !prev[1]?.file) ||
        (image2Url !== prev[2]?.url && !prev[2]?.file) ||
        (image3Url !== prev[3]?.url && !prev[3]?.file);

      if (!shouldUpdate) {
        return prev;
      }

      return [
        {
          url: imageUrl || null,
          file: prev[0]?.file || null,
          isUploading: prev[0]?.isUploading || false,
        },
        {
          url: image1Url || null,
          file: prev[1]?.file || null,
          isUploading: prev[1]?.isUploading || false,
        },
        {
          url: image2Url || null,
          file: prev[2]?.file || null,
          isUploading: prev[2]?.isUploading || false,
        },
        {
          url: image3Url || null,
          file: prev[3]?.file || null,
          isUploading: prev[3]?.isUploading || false,
        },
      ];
    });
  }, [imageUrl, image1Url, image2Url, image3Url]);

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Tipo de archivo inválido",
        description:
          "Por favor selecciona un archivo de imagen (PNG, JPG, WebP)",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Archivo muy grande",
        description: "Por favor selecciona una imagen menor a 5MB",
      });
      return;
    }

    // Create preview URL and immediately upload
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;

      // Set preview state
      setImageSlots((prev) => {
        const newSlots = [...prev];
        newSlots[index] = {
          url: previewUrl,
          file,
          isUploading: false,
        };
        return newSlots;
      });

      // Immediately start upload with the file we have
      void handleUploadWithFile(index, file);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadWithFile = async (index: number, file: File) => {
    if (!storeId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Falta el ID de la tienda. Por favor recarga la página.",
      });
      return;
    }

    // Set uploading state
    setImageSlots((prev) => {
      const newSlots = [...prev];
      const currentSlot = newSlots[index];
      if (currentSlot) {
        newSlots[index] = {
          url: currentSlot.url,
          file: currentSlot.file,
          isUploading: true,
        };
      }
      return newSlots;
    });

    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("storeId", storeId);
      formData.append("imageIndex", index.toString());

      // Get auth token
      const authStore = useAuthStore.getState();
      const token = authStore.accessToken;

      // Upload to backend
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
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // Update the local state with the S3 URL immediately
      setImageSlots((prev) => {
        const newSlots = [...prev];
        const currentSlot = newSlots[index];
        if (currentSlot) {
          newSlots[index] = {
            url: data.url || currentSlot.url,
            file: null,
            isUploading: false,
          };
        }
        return newSlots;
      });

      // Update cache with new store data from backend
      if (data.store) {
        queryClient.setQueryData(["store", storeId], data.store);
      }

      toast({
        title: "Imagen subida",
        description: `Imagen ${index + 1} subida exitosamente para ${storeName}.`,
      });

      // Refetch store to ensure we have the latest data
      await queryClient.refetchQueries({
        queryKey: ["store", storeId],
        exact: true,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error al subir",
        description: "No se pudo subir la imagen. Por favor intenta de nuevo.",
      });

      // Reset uploading state on error
      setImageSlots((prev) => {
        const newSlots = [...prev];
        const currentSlot = newSlots[index];
        if (currentSlot) {
          newSlots[index] = {
            url: currentSlot.url,
            file: currentSlot.file,
            isUploading: false,
          };
        }
        return newSlots;
      });
    }
  };

  const handleRemove = async (index: number) => {
    if (!storeId) {
      return;
    }

    try {
      // Get auth token
      const authStore = useAuthStore.getState();
      const token = authStore.accessToken;

      // Delete from backend
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
      ).replace("/graphql", "");
      const response = await fetch(
        `${baseUrl}/upload/store-image?storeId=${storeId}&imageIndex=${index}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      // Clear the slot
      setImageSlots((prev) => {
        const newSlots = [...prev];
        newSlots[index] = { url: null, file: null, isUploading: false };
        return newSlots;
      });

      toast({
        title: "Imagen eliminada",
        description: "Imagen eliminada exitosamente.",
      });

      // Refetch to ensure fresh data
      await queryClient.refetchQueries({ queryKey: ["store", storeId] });
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description:
          "No se pudo eliminar la imagen. Por favor intenta de nuevo.",
      });
    }
  };

  const handleCancelSelection = (index: number) => {
    setImageSlots((prev) => {
      const newSlots = [...prev];
      // Reset to original URL or null
      const originalUrls = [imageUrl, image1Url, image2Url, image3Url];
      newSlots[index] = {
        url: originalUrls[index] || null,
        file: null,
        isUploading: false,
      };
      return newSlots;
    });
  };

  return (
    <div className="bg-card rounded-lg shadow p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Imágenes de Tienda
        </h2>
        <span className="text-sm text-muted-foreground">
          {imageSlots.filter((slot) => slot.url).length} / 4 imágenes
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {imageSlots.map((slot, index) => (
          <div key={index} className="space-y-2">
            {/* Image Preview - Clickable */}
            <label
              htmlFor={`store-image-upload-${index}`}
              className="relative w-full block cursor-pointer"
              style={{ paddingBottom: "56.25%" }}
            >
              {slot.url ? (
                <div className="absolute inset-0 rounded-lg overflow-hidden bg-muted border-2 border-border group hover:border-primary transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slot.url}
                    alt={`${storeName} - Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Hover overlay with change icon */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Cambiar</span>
                    </div>
                  </div>

                  {/* Delete or Cancel button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (slot.file) {
                        handleCancelSelection(index);
                      } else {
                        void handleRemove(index);
                      }
                    }}
                    className="absolute top-2 right-2 p-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-lg transition-colors z-10"
                    title={slot.file ? "Cancelar" : "Eliminar imagen"}
                    disabled={slot.isUploading}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Uploading overlay */}
                  {slot.isUploading === true && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 rounded-lg border-2 border-dashed border-border bg-muted flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-muted/80 transition-colors">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Seleccionar imagen
                  </span>
                </div>
              )}
            </label>

            {/* Hidden file input */}
            <input
              id={`store-image-upload-${index}`}
              type="file"
              accept="image/*"
              onChange={(e) => {
                void handleImageSelect(e, index);
              }}
              className="hidden"
              disabled={slot.isUploading}
            />
          </div>
        ))}
      </div>

      {/* Image Guidelines */}
      <div className="mt-6 p-3 bg-muted rounded-lg">
        <p className="text-xs font-medium text-foreground mb-2">
          Pautas de Imagen:
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Proporción de aspecto: 16:9 (ej., 1920x1080px)</li>
          <li>• Tamaño máximo por imagen: 5MB</li>
          <li>• Formatos: PNG, JPG, JPEG, WebP</li>
          <li>• Se recomiendan imágenes de alta calidad</li>
          <li>• La primera imagen se mostrará en las listas de búsqueda</li>
        </ul>
      </div>
    </div>
  );
};
