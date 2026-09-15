"use client";

import { Percent, Receipt, Ticket } from "lucide-react";

import {
  BillingStatusCard,
  BillingStatusCardSkeleton,
} from "@/domains/portal/components/BillingStatusCard";
import { InvoicesCard } from "@/domains/portal/components/InvoicesCard";
import { PortalBillingStatusBadge } from "@/domains/portal/components/PortalBillingStatusBadge";
import { PortalPageHeader } from "@/domains/portal/components/PortalPageHeader";
import { RedemptionsCard } from "@/domains/portal/components/RedemptionsCard";
import {
  useMyDiscounts,
  useMyOwnerInvoices,
  useMyRedemptions,
  useSelectedPortalStore,
} from "@/domains/portal/hooks";
import { PortalInvoiceStatus } from "@/domains/portal/types";
import { formatStoreType, getCurrentMexicoMonth } from "@/domains/portal/utils";
import { Card } from "@/shared/components/Card";

export default function PortalDashboardPage(): React.JSX.Element {
  const {
    selectedStore,
    selectedStoreId,
    stores,
    isLoading: storesLoading,
    isSwitchingStore,
    isError,
    error,
  } = useSelectedPortalStore();

  const currentMonth = getCurrentMexicoMonth();
  const invoicesQuery = useMyOwnerInvoices();
  const redemptionsQuery = useMyRedemptions(selectedStoreId, currentMonth);
  const discountsQuery = useMyDiscounts(selectedStoreId);

  if (storesLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-9 w-56 bg-muted rounded animate-pulse mb-2" />
        <div className="h-5 w-40 bg-muted rounded animate-pulse mb-6" />
        <div className="space-y-6">
          <BillingStatusCardSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={index}
                className="p-5 bg-card border-none shadow-card h-24 animate-pulse"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InvoicesCard invoices={[]} isLoading />
            <RedemptionsCard redemptions={[]} isLoading />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 bg-card border-none shadow-card">
          <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard</h1>
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            No tienes restaurantes asignados.
          </p>
        </Card>
      </div>
    );
  }

  const storeType = formatStoreType(selectedStore.type);
  const subtitle = [selectedStore.city, storeType].filter(Boolean).join(" · ");
  const paidInvoices = (invoicesQuery.data ?? []).filter(
    (invoice) => invoice.status === PortalInvoiceStatus.PAID
  ).length;
  const storeContentLoading = isSwitchingStore;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {storeContentLoading ? (
        <div className="mb-6">
          <div className="h-9 w-56 bg-muted rounded animate-pulse mb-2" />
          <div className="h-5 w-40 bg-muted rounded animate-pulse" />
        </div>
      ) : (
        <PortalPageHeader
          title={selectedStore.name}
          subtitle={subtitle || undefined}
          badge={
            <PortalBillingStatusBadge status={selectedStore.billingStatus} />
          }
        />
      )}

      <div className="space-y-6">
        <BillingStatusCard store={selectedStore} stores={stores} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={Ticket}
            label="Canjes este mes"
            value={
              storeContentLoading || redemptionsQuery.isLoading
                ? null
                : String(redemptionsQuery.data?.length ?? 0)
            }
          />
          <StatCard
            icon={Percent}
            label="Descuentos activos"
            value={
              storeContentLoading || discountsQuery.isLoading
                ? null
                : String(discountsQuery.data?.length ?? 0)
            }
          />
          <StatCard
            icon={Receipt}
            label="Facturas pagadas"
            value={invoicesQuery.isLoading ? null : String(paidInvoices)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InvoicesCard
            invoices={invoicesQuery.data ?? []}
            isLoading={invoicesQuery.isLoading}
            limit={6}
          />
          <RedemptionsCard
            redemptions={redemptionsQuery.data ?? []}
            isLoading={storeContentLoading || redemptionsQuery.isLoading}
            limit={10}
            emptyTitle="Aún no hay canjes este mes"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Ticket;
  label: string;
  value: string | null;
}): React.JSX.Element {
  return (
    <Card className="p-5 bg-card border-none shadow-card">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          {value == null ? (
            <div className="h-8 w-12 bg-muted rounded animate-pulse mt-1" />
          ) : (
            <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
