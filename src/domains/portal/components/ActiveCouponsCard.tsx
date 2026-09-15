"use client";

import { Ticket } from "lucide-react";

import { PortalEmptyState } from "@/domains/portal/components/PortalEmptyState";
import type { PortalActiveCoupon } from "@/domains/portal/types";
import { formatHoursUntil } from "@/domains/portal/utils";
import { formatDiscountAmount } from "@/lib/discount-type";
import { Card } from "@/shared/components/Card";

interface ActiveCouponsCardProps {
  coupons: PortalActiveCoupon[];
  isLoading: boolean;
  showTitle?: boolean;
}

export function ActiveCouponsCard({
  coupons,
  isLoading,
  showTitle = true,
}: ActiveCouponsCardProps): React.JSX.Element {
  if (isLoading) {
    return <ActiveCouponsCardSkeleton showTitle={showTitle} />;
  }

  return (
    <section>
      {showTitle ? (
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Cupones activos
        </h2>
      ) : null}
      {coupons.length === 0 ? (
        <Card className="p-6 bg-card border-none shadow-card">
          <PortalEmptyState
            icon={Ticket}
            title="No hay cupones activos en este momento"
            description="Los cupones generados por tus clientes aparecerán aquí hasta que se canjeen o expiren."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <Card
              key={coupon.id}
              className="p-5 bg-card border-none shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-xl font-bold text-foreground tracking-wide break-all">
                  {coupon.code}
                </p>
                <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-700">
                  Activo
                </span>
              </div>
              <p className="text-sm font-medium text-primary mt-2">
                {formatDiscountAmount(coupon.discountType ?? "", coupon.value)}
                {coupon.discountTitle ? ` · ${coupon.discountTitle}` : ""}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {formatHoursUntil(coupon.expiresAt)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export function ActiveCouponsCardSkeleton({
  showTitle = true,
}: {
  showTitle?: boolean;
}): React.JSX.Element {
  return (
    <section>
      {showTitle ? (
        <div className="h-5 w-40 bg-muted rounded animate-pulse mb-4" />
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card
            key={index}
            className="p-5 bg-card border-none shadow-card space-y-3"
          >
            <div className="h-6 w-36 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-4 w-40 bg-muted rounded animate-pulse" />
          </Card>
        ))}
      </div>
    </section>
  );
}
