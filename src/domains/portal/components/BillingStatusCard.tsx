"use client";

import { AlertCircle, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

import { PortalBillingStatusBadge } from "@/domains/portal/components/PortalBillingStatusBadge";
import { PortalCardBrandIcon } from "@/domains/portal/components/PortalCardBrandIcon";
import {
  useMyOwnerBilling,
  useMyPaymentMethod,
  useMyStoresBalance,
} from "@/domains/portal/hooks";
import {
  PortalBillingStatus,
  type PortalOwnerBilling,
  type PortalPaymentMethod,
  type PortalStore,
  type PortalStoreBalance,
} from "@/domains/portal/types";
import {
  BILLING_THRESHOLD_MXN,
  formatInvoiceMonth,
  formatMxn,
  formatNextBillingDate,
  getStoreBalance,
} from "@/domains/portal/utils";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

interface BillingStatusCardProps {
  store: PortalStore;
  stores: PortalStore[];
}

export function BillingStatusCard({
  store,
  stores,
}: BillingStatusCardProps): React.JSX.Element {
  const ownerBillingQuery = useMyOwnerBilling();
  const storeBalancesQuery = useMyStoresBalance();
  const paymentMethodQuery = useMyPaymentMethod();
  const isMultiStore = stores.length > 1;
  const ownerBilling = ownerBillingQuery.data;
  const paymentMethod = paymentMethodQuery.data ?? null;
  const isPaymentFailed = stores.some(
    (item) => item.billingStatus === PortalBillingStatus.PAYMENT_FAILED
  );

  if (ownerBillingQuery.isLoading) {
    return <BillingStatusCardSkeleton />;
  }

  if (!ownerBilling) {
    return (
      <Card className="p-6 sm:p-8 bg-card border-none shadow-card">
        <p className="text-destructive">
          {ownerBillingQuery.error?.message ||
            "No se pudo cargar el estado de facturación."}
        </p>
      </Card>
    );
  }

  if (!isMultiStore) {
    return (
      <SingleStoreBillingCard
        store={store}
        ownerBilling={ownerBilling}
        paymentMethod={paymentMethod}
        paymentMethodLoading={paymentMethodQuery.isLoading}
        isPaymentFailed={isPaymentFailed}
      />
    );
  }

  return (
    <MultiStoreBillingCard
      ownerBilling={ownerBilling}
      storeBalances={storeBalancesQuery.data ?? []}
      storeBalancesLoading={storeBalancesQuery.isLoading}
      paymentMethod={paymentMethod}
      paymentMethodLoading={paymentMethodQuery.isLoading}
      isPaymentFailed={isPaymentFailed}
    />
  );
}

export function BillingStatusCardSkeleton(): React.JSX.Element {
  return (
    <Card className="p-6 sm:p-8 bg-card border-none shadow-card space-y-5">
      <div className="flex justify-between">
        <div className="h-5 w-40 bg-muted rounded animate-pulse" />
        <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
      </div>
      <div className="h-10 w-44 bg-muted rounded animate-pulse" />
      <div className="h-3.5 w-full bg-muted rounded-full animate-pulse" />
      <div className="h-4 w-64 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="h-10 bg-muted rounded animate-pulse" />
      </div>
    </Card>
  );
}

function SingleStoreBillingCard({
  store,
  ownerBilling,
  paymentMethod,
  paymentMethodLoading,
  isPaymentFailed,
}: {
  store: PortalStore;
  ownerBilling: PortalOwnerBilling;
  paymentMethod: PortalPaymentMethod | null;
  paymentMethodLoading: boolean;
  isPaymentFailed: boolean;
}): React.JSX.Element {
  const router = useRouter();
  const accumulatedBalance =
    ownerBilling.accumulatedBalance || getStoreBalance(store);
  const overview = getBillingOverview(accumulatedBalance, isPaymentFailed);

  return (
    <Card className="p-6 sm:p-8 bg-card border-none shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          Estado de facturación
        </h2>
        <PortalBillingStatusBadge status={store.billingStatus} />
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">
            Balance acumulado
          </p>
          <p className="text-4xl font-bold tracking-tight text-foreground">
            {formatMxn(accumulatedBalance)}
          </p>
        </div>

        <BillingProgress
          accumulatedBalance={accumulatedBalance}
          overview={overview}
          isPaymentFailed={isPaymentFailed}
          onUpdatePayment={() => router.push("/portal/payment")}
        />

        <BillingMetaRow
          paymentMethod={paymentMethod}
          paymentMethodLoading={paymentMethodLoading}
          ownerBilling={ownerBilling}
        />
      </div>
    </Card>
  );
}

function MultiStoreBillingCard({
  ownerBilling,
  storeBalances,
  storeBalancesLoading,
  paymentMethod,
  paymentMethodLoading,
  isPaymentFailed,
}: {
  ownerBilling: PortalOwnerBilling;
  storeBalances: PortalStoreBalance[];
  storeBalancesLoading: boolean;
  paymentMethod: PortalPaymentMethod | null;
  paymentMethodLoading: boolean;
  isPaymentFailed: boolean;
}): React.JSX.Element {
  const router = useRouter();
  const accumulatedBalance = ownerBilling.accumulatedBalance;
  const overview = getBillingOverview(accumulatedBalance, isPaymentFailed);

  return (
    <Card className="p-6 sm:p-8 bg-card border-none shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          Estado de facturación
        </h2>
        {isPaymentFailed ? (
          <PortalBillingStatusBadge
            status={PortalBillingStatus.PAYMENT_FAILED}
          />
        ) : null}
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">
            Balance total de tu cuenta
          </p>
          <p className="text-4xl font-bold tracking-tight text-foreground">
            {formatMxn(accumulatedBalance)}
          </p>
        </div>

        <BillingProgress
          accumulatedBalance={accumulatedBalance}
          overview={overview}
          isPaymentFailed={isPaymentFailed}
          onUpdatePayment={() => router.push("/portal/payment")}
        />

        <BillingMetaRow
          paymentMethod={paymentMethod}
          paymentMethodLoading={paymentMethodLoading}
          ownerBilling={ownerBilling}
        />

        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Por ubicación
          </h3>
          {storeBalancesLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 bg-muted rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">Ubicación</th>
                    <th className="pb-3 font-medium">Balance</th>
                    <th className="pb-3 font-medium">Canjes este mes</th>
                    <th className="pb-3 font-medium text-right">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {storeBalances.map((row) => (
                    <tr
                      key={row.storeId}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-3 font-medium text-foreground">
                        {row.storeName}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {formatMxn(row.accumulatedBalance)}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {row.redemptionsThisMonth}{" "}
                        {row.redemptionsThisMonth === 1 ? "canje" : "canjes"}
                      </td>
                      <td className="py-3 text-right">
                        {row.billingEnabled ? (
                          <PortalBillingStatusBadge
                            status={row.billingStatus}
                          />
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            Sin billing
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function getBillingOverview(
  accumulatedBalance: number,
  isPaymentFailed: boolean
): {
  remainingToCharge: number;
  isReadyToCharge: boolean;
  progressPercent: number;
  barColor: string;
} {
  return {
    remainingToCharge: Math.max(0, BILLING_THRESHOLD_MXN - accumulatedBalance),
    isReadyToCharge: accumulatedBalance >= BILLING_THRESHOLD_MXN,
    progressPercent: isPaymentFailed
      ? 100
      : Math.min(
          100,
          Math.max(0, (accumulatedBalance / BILLING_THRESHOLD_MXN) * 100)
        ),
    barColor: isPaymentFailed
      ? "hsl(var(--destructive))"
      : "hsl(var(--primary))",
  };
}

function BillingProgress({
  accumulatedBalance,
  overview,
  isPaymentFailed,
  onUpdatePayment,
}: {
  accumulatedBalance: number;
  overview: ReturnType<typeof getBillingOverview>;
  isPaymentFailed: boolean;
  onUpdatePayment: () => void;
}): React.JSX.Element {
  return (
    <div>
      <div
        className="h-3.5 w-full rounded-full bg-muted overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={BILLING_THRESHOLD_MXN}
        aria-valuenow={Math.min(accumulatedBalance, BILLING_THRESHOLD_MXN)}
        aria-label="Progreso hacia el próximo cobro"
      >
        <div
          className="h-3.5 rounded-full"
          style={{
            width: `${overview.progressPercent}%`,
            backgroundColor: overview.barColor,
          }}
        />
      </div>
      {isPaymentFailed ? (
        <div className="mt-3 rounded-xl bg-destructive/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-foreground">Pago fallido</p>
          </div>
          <Button
            type="button"
            className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shrink-0"
            onClick={onUpdatePayment}
          >
            Actualizar método de pago
          </Button>
        </div>
      ) : overview.isReadyToCharge ? (
        <p className="text-sm font-medium text-green-700 mt-2">
          Listo para cobro a fin de mes
        </p>
      ) : (
        <p className="text-sm text-muted-foreground mt-2">
          {formatMxn(overview.remainingToCharge)} más para el próximo cobro
        </p>
      )}
    </div>
  );
}

function BillingMetaRow({
  paymentMethod,
  paymentMethodLoading,
  ownerBilling,
}: {
  paymentMethod: PortalPaymentMethod | null;
  paymentMethodLoading: boolean;
  ownerBilling: PortalOwnerBilling;
}): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
      <div>
        {paymentMethodLoading ? (
          <div className="h-10 w-48 bg-muted rounded animate-pulse" />
        ) : paymentMethod ? (
          <div className="flex items-center gap-3">
            <PortalCardBrandIcon brand={paymentMethod.brand} />
            <p className="text-sm font-medium text-foreground">
              •••• {paymentMethod.last4}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-medium text-orange-700">
            <CreditCard className="w-4 h-4 shrink-0" />
            Sin método de pago
          </div>
        )}
      </div>
      <div className="space-y-1 text-sm">
        <p className="text-foreground">
          Próximo cobro: {formatNextBillingDate()}
        </p>
        <p className="text-muted-foreground">
          {formatLastChargeLabel(ownerBilling)}
        </p>
      </div>
    </div>
  );
}

function formatLastChargeLabel(ownerBilling: PortalOwnerBilling): string {
  const lastBilledAt = ownerBilling.lastBilledAt;
  const lastChargedAmount = ownerBilling.lastChargedAmount;

  if (lastChargedAmount != null && lastBilledAt) {
    return `Último cobro: ${formatMxn(lastChargedAmount)} en ${formatInvoiceMonth(
      lastBilledAt.slice(0, 7)
    )}`;
  }
  if (lastChargedAmount != null) {
    return `Último cobro: ${formatMxn(lastChargedAmount)}`;
  }
  if (lastBilledAt) {
    return `Último cobro: ${formatInvoiceMonth(lastBilledAt.slice(0, 7))}`;
  }
  return "Sin cobros anteriores";
}
