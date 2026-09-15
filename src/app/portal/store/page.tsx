"use client";

import { ImageIcon, MapPin } from "lucide-react";

import { PortalPageHeader } from "@/domains/portal/components/PortalPageHeader";
import {
  StoreEditForm,
  StoreEditFormSkeleton,
} from "@/domains/portal/components/StoreEditForm";
import { useSelectedPortalStore } from "@/domains/portal/hooks";
import { formatPriceRange } from "@/domains/portal/utils";
import { Card } from "@/shared/components/Card";

export default function PortalStorePage(): React.JSX.Element {
  const { selectedStore, isLoading, isSwitchingStore, isError, error } =
    useSelectedPortalStore();

  if (isLoading || isSwitchingStore) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-7 w-56 bg-muted rounded animate-pulse mb-6" />
        <div className="h-48 w-full bg-muted rounded-2xl animate-pulse mb-6" />
        <StoreEditFormSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 bg-card border-none shadow-card">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Mi Restaurante
          </h1>
          <p className="text-destructive">
            {error?.message || "No se pudo cargar el restaurante."}
          </p>
        </Card>
      </div>
    );
  }

  if (!selectedStore) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 bg-card border-none shadow-card">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Mi Restaurante
          </h1>
          <p className="text-muted-foreground">
            No tienes restaurantes asignados.
          </p>
        </Card>
      </div>
    );
  }

  const priceLabel = formatPriceRange(selectedStore.price);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PortalPageHeader
        title="Mi Restaurante"
        subtitle="Actualiza la descripción, las imágenes y el horario de tu restaurante."
      />

      <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden bg-muted mb-6 shadow-card">
        {selectedStore.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={selectedStore.imageUrl}
            alt={selectedStore.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="w-10 h-10" />
            <p className="text-sm">Sin imagen principal</p>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
          <h2 className="text-2xl font-bold text-white truncate">
            {selectedStore.name}
          </h2>
        </div>
      </div>

      <Card className="p-5 sm:p-6 bg-card border-none shadow-card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Nombre</p>
            <p className="font-medium text-foreground">{selectedStore.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Dirección</p>
            <p className="font-medium text-foreground flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              {selectedStore.address || "Sin dirección"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Rango de precio
            </p>
            <p className="font-medium text-foreground">{priceLabel || "—"}</p>
          </div>
        </div>
      </Card>

      <StoreEditForm key={selectedStore.id} store={selectedStore} />
    </div>
  );
}
