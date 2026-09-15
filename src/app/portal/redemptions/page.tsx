"use client";

import { ActiveCouponsCard } from "@/domains/portal/components/ActiveCouponsCard";
import { ActiveDiscountsCard } from "@/domains/portal/components/ActiveDiscountsCard";
import { PortalMonthlyExportCard } from "@/domains/portal/components/PortalMonthlyExportCard";
import { PortalPageHeader } from "@/domains/portal/components/PortalPageHeader";
import { RedemptionsCard } from "@/domains/portal/components/RedemptionsCard";
import {
  useMyActiveCoupons,
  useMyDiscounts,
  useMyRedemptions,
  useSelectedPortalStore,
} from "@/domains/portal/hooks";
import { Card } from "@/shared/components/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/Tabs";

export default function PortalRedemptionsPage(): React.JSX.Element {
  const {
    selectedStore,
    selectedStoreId,
    isLoading: storesLoading,
    isSwitchingStore,
    isError,
    error,
  } = useSelectedPortalStore();
  const discountsQuery = useMyDiscounts(selectedStoreId);
  const couponsQuery = useMyActiveCoupons(selectedStoreId);
  const redemptionsQuery = useMyRedemptions(selectedStoreId);

  if (storesLoading || isSwitchingStore) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-40 bg-muted rounded animate-pulse mb-2" />
        <div className="h-7 w-56 bg-muted rounded animate-pulse mb-6" />
        <div className="h-10 w-full bg-muted rounded-xl animate-pulse mb-6" />
        <div className="h-28 w-full bg-muted rounded-2xl animate-pulse mb-6" />
        <ActiveDiscountsCard discounts={[]} isLoading showTitle={false} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 bg-card border-none shadow-card">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Mis Cupones
          </h1>
          <p className="text-destructive">
            {error?.message || "No se pudieron cargar los cupones."}
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
            Mis Cupones
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
        title="Mis Cupones"
        subtitle="Descuentos, cupones generados y canjes de tu restaurante."
        storeName={selectedStore.name}
      />
      <PortalMonthlyExportCard
        storeId={selectedStore.id}
        storeName={selectedStore.name}
      />
      <Tabs defaultValue="discounts" className="w-full">
        <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1 rounded-xl bg-muted p-1 mb-6">
          <TabsTrigger
            value="discounts"
            className="flex-1 min-w-[120px] rounded-lg data-[state=active]:rounded-lg"
          >
            Descuentos
          </TabsTrigger>
          <TabsTrigger
            value="coupons"
            className="flex-1 min-w-[120px] rounded-lg data-[state=active]:rounded-lg"
          >
            Cupones activos
          </TabsTrigger>
          <TabsTrigger
            value="redemptions"
            className="flex-1 min-w-[120px] rounded-lg data-[state=active]:rounded-lg"
          >
            Canjes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="discounts">
          <ActiveDiscountsCard
            discounts={discountsQuery.data ?? []}
            isLoading={discountsQuery.isLoading}
            showTitle={false}
          />
        </TabsContent>
        <TabsContent value="coupons">
          <ActiveCouponsCard
            coupons={couponsQuery.data ?? []}
            isLoading={couponsQuery.isLoading}
            showTitle={false}
          />
        </TabsContent>
        <TabsContent value="redemptions">
          <RedemptionsCard
            title="Canjes"
            redemptions={redemptionsQuery.data ?? []}
            isLoading={redemptionsQuery.isLoading}
            emptyTitle="Aún no hay canjes registrados"
            emptyDescription="Los canjes de cupones de tus clientes aparecerán en esta lista."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
