"use client";

import { useState } from "react";

import { PortalStoreHoursEditor } from "@/domains/portal/components/PortalStoreHoursEditor";
import { PortalStoreImageUpload } from "@/domains/portal/components/PortalStoreImageUpload";
import { useUpdateStoreInfo } from "@/domains/portal/hooks";
import type { PortalStore } from "@/domains/portal/types";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage } from "@/lib/utils";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

interface StoreEditFormProps {
  store: PortalStore;
}

export function StoreEditForm({
  store,
}: StoreEditFormProps): React.JSX.Element {
  const { toast } = useToast();
  const updateStoreInfo = useUpdateStoreInfo();
  const [description, setDescription] = useState(store.description ?? "");

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      await updateStoreInfo.mutateAsync({
        storeId: store.id,
        description,
      });
      toast({
        title: "Restaurante actualizado",
        description: "Los cambios se guardaron correctamente.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description:
          extractErrorMessage(error) ||
          "No se pudo actualizar el restaurante. Intenta de nuevo.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 sm:p-8 bg-card border-none shadow-card">
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Descripción
            </h2>
            <label htmlFor="store-description" className="sr-only">
              Descripción
            </label>
            <textarea
              id="store-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              disabled={updateStoreInfo.isPending}
              className="flex min-h-[140px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Cuéntale a tus clientes sobre tu restaurante"
            />
          </div>

          <PortalStoreImageUpload store={store} />

          <Button
            type="submit"
            className="w-full sm:w-auto h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-glow"
            disabled={updateStoreInfo.isPending}
          >
            {updateStoreInfo.isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </Card>

      <Card className="p-6 sm:p-8 bg-card border-none shadow-card">
        <PortalStoreHoursEditor store={store} />
      </Card>
    </div>
  );
}

export function StoreEditFormSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <Card className="p-6 sm:p-8 bg-card border-none shadow-card space-y-4">
        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        <div className="h-28 w-full bg-muted rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-full rounded-xl bg-muted animate-pulse"
              style={{ paddingBottom: "56.25%" }}
            />
          ))}
        </div>
      </Card>
      <Card className="p-6 sm:p-8 bg-card border-none shadow-card space-y-3">
        <div className="h-5 w-40 bg-muted rounded animate-pulse" />
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="h-12 w-full bg-muted rounded-xl animate-pulse"
          />
        ))}
      </Card>
    </div>
  );
}
