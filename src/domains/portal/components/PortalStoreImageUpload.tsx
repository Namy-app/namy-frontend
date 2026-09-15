"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import { useState } from "react";

import { PORTAL_STORES_QUERY_KEY } from "@/domains/portal/hooks";
import type { PortalStore } from "@/domains/portal/types";
import { useToast } from "@/hooks/use-toast";
import {
  getPortalAuthToken,
  getPortalRestBaseUrl,
} from "@/lib/portalGraphqlClient";

const SLOT_LABELS = [
  "Imagen principal",
  "Imagen 1",
  "Imagen 2",
  "Imagen 3",
] as const;

interface ImageSlot {
  url: string | null;
  isUploading: boolean;
}

interface PortalStoreImageUploadProps {
  store: PortalStore;
}

export function PortalStoreImageUpload({
  store,
}: PortalStoreImageUploadProps): React.JSX.Element {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [slots, setSlots] = useState<ImageSlot[]>(() => slotsFromStore(store));

  const handleSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ): Promise<void> => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Tipo de archivo inválido",
        description:
          "Por favor selecciona un archivo de imagen (PNG, JPG, WebP)",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Archivo muy grande",
        description: "Por favor selecciona una imagen menor a 5MB",
      });
      return;
    }

    setSlots((prev) =>
      prev.map((slot, slotIndex) =>
        slotIndex === index
          ? { url: URL.createObjectURL(file), isUploading: true }
          : slot
      )
    );

    try {
      const token = getPortalAuthToken();
      if (!token) {
        throw new Error("Tu sesión ha expirado. Inicia sesión de nuevo.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("storeId", store.id);
      formData.append("imageIndex", String(index));

      const response = await fetch(
        `${getPortalRestBaseUrl()}/upload/store-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(await readUploadError(response));
      }

      const data = (await response.json()) as { url?: string };
      setSlots((prev) =>
        prev.map((slot, slotIndex) =>
          slotIndex === index
            ? { url: data.url || slot.url, isUploading: false }
            : slot
        )
      );

      await queryClient.invalidateQueries({
        queryKey: PORTAL_STORES_QUERY_KEY,
      });
      toast({
        title: "Imagen subida",
        description: `${SLOT_LABELS[index]} se actualizó correctamente.`,
      });
    } catch (error) {
      setSlots(slotsFromStore(store));
      toast({
        variant: "destructive",
        title: "Error al subir",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo subir la imagen. Intenta de nuevo.",
      });
    }
  };

  const handleRemove = async (index: number): Promise<void> => {
    try {
      const token = getPortalAuthToken();
      if (!token) {
        throw new Error("Tu sesión ha expirado. Inicia sesión de nuevo.");
      }

      const response = await fetch(
        `${getPortalRestBaseUrl()}/upload/store-image?storeId=${store.id}&imageIndex=${index}`,
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

      setSlots((prev) =>
        prev.map((slot, slotIndex) =>
          slotIndex === index ? { url: null, isUploading: false } : slot
        )
      );
      await queryClient.invalidateQueries({
        queryKey: PORTAL_STORES_QUERY_KEY,
      });
      toast({
        title: "Imagen eliminada",
        description: "Imagen eliminada exitosamente.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description:
          "No se pudo eliminar la imagen. Por favor intenta de nuevo.",
      });
    }
  };

  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-3">Imágenes</p>
      <div className="grid grid-cols-2 gap-4">
        {slots.map((slot, index) => (
          <div key={SLOT_LABELS[index]} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {SLOT_LABELS[index]}
            </p>
            <label
              htmlFor={`portal-store-image-${index}`}
              className="relative w-full block cursor-pointer"
              style={{ paddingBottom: "56.25%" }}
            >
              {slot.url ? (
                <div className="absolute inset-0 rounded-xl overflow-hidden bg-muted border-2 border-border group hover:border-primary transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slot.url}
                    alt={SLOT_LABELS[index]}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Seleccionar imagen
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      void handleRemove(index);
                    }}
                    className="absolute top-2 right-2 p-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-lg transition-colors z-10"
                    title="Eliminar imagen"
                    disabled={slot.isUploading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {slot.isUploading ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="absolute inset-0 rounded-xl border-2 border-dashed border-border bg-muted flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-muted/80 transition-colors">
                  {slot.isUploading ? (
                    <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Seleccionar imagen
                      </span>
                    </>
                  )}
                </div>
              )}
            </label>
            <input
              id={`portal-store-image-${index}`}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={slot.isUploading}
              onChange={(event) => {
                void handleSelect(event, index);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function slotsFromStore(store: PortalStore): ImageSlot[] {
  return [
    store.imageUrl,
    store.image1Url,
    store.image2Url,
    store.image3Url,
  ].map((url) => ({ url: url || null, isUploading: false }));
}

async function readUploadError(response: Response): Promise<string> {
  const fallback = "No se pudo subir la imagen. Intenta de nuevo.";
  try {
    const text = await response.text();
    const json = JSON.parse(text) as { message?: string | string[] };
    if (typeof json.message === "string" && json.message.trim()) {
      return json.message;
    }
    if (Array.isArray(json.message) && json.message[0]) {
      return json.message[0];
    }
  } catch {
    return fallback;
  }
  return fallback;
}
