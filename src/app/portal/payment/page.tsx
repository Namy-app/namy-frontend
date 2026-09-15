"use client";

import { PortalPageHeader } from "@/domains/portal/components/PortalPageHeader";
import {
  PortalPaymentMethodCard,
  PortalPaymentMethodCardSkeleton,
} from "@/domains/portal/components/PortalPaymentMethodCard";
import { useSelectedPortalStore } from "@/domains/portal/hooks";
import { Card } from "@/shared/components/Card";

export default function PortalPaymentPage(): React.JSX.Element {
  const { selectedStore, stores, isLoading, isSwitchingStore, isError, error } =
    useSelectedPortalStore();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-7 w-56 bg-muted rounded animate-pulse mb-6" />
        <PortalPaymentMethodCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 bg-card border-none shadow-card">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Método de Pago
          </h1>
          <p className="text-destructive">
            {error?.message || "No se pudieron cargar tus restaurantes."}
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
            Método de Pago
          </h1>
          <p className="text-muted-foreground">
            No tienes restaurantes asignados.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PortalPageHeader
        title="Método de Pago"
        storeName={selectedStore.name}
        storeNameLoading={isSwitchingStore}
      />
      <PortalPaymentMethodCard
        store={selectedStore}
        storeCount={stores.length}
      />
    </div>
  );
}
