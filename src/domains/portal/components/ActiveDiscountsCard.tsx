"use client";

import { TicketPercent } from "lucide-react";

import { PortalEmptyState } from "@/domains/portal/components/PortalEmptyState";
import type { PortalDiscount } from "@/domains/portal/types";
import {
  formatPortalDate,
  formatPortalDiscountValue,
} from "@/domains/portal/utils";
import { Card } from "@/shared/components/Card";

interface ActiveDiscountsCardProps {
  discounts: PortalDiscount[];
  isLoading: boolean;
  showTitle?: boolean;
}

export function ActiveDiscountsCard({
  discounts,
  isLoading,
  showTitle = true,
}: ActiveDiscountsCardProps): React.JSX.Element {
  if (isLoading) {
    return <ActiveDiscountsCardSkeleton showTitle={showTitle} />;
  }

  return (
    <section>
      {showTitle ? (
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Descuentos
        </h2>
      ) : null}
      {discounts.length === 0 ? (
        <Card className="p-6 bg-card border-none shadow-card">
          <PortalEmptyState
            icon={TicketPercent}
            title="No hay descuentos activos"
            description="Cuando tengas descuentos publicados aparecerán aquí."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {discounts.map((discount) => (
            <Card
              key={discount.id}
              className="p-5 pl-6 bg-card border-none shadow-card relative overflow-hidden"
            >
              <div className="absolute inset-y-0 left-0 w-1.5 bg-primary" />
              <p className="text-3xl font-bold text-primary tracking-tight">
                {formatPortalDiscountValue(discount.type, discount.value)}
              </p>
              <h3 className="font-semibold text-foreground mt-2 leading-snug">
                {discount.title}
              </h3>
              {discount.customText ? (
                <p className="text-sm text-muted-foreground mt-1">
                  {discount.customText}
                </p>
              ) : null}
              <p className="text-sm text-muted-foreground mt-3">
                Válido hasta {formatPortalDate(discount.endDate)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export function ActiveDiscountsCardSkeleton({
  showTitle = true,
}: {
  showTitle?: boolean;
}): React.JSX.Element {
  return (
    <section>
      {showTitle ? (
        <div className="h-5 w-48 bg-muted rounded animate-pulse mb-4" />
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card
            key={index}
            className="p-5 bg-card border-none shadow-card space-y-3"
          >
            <div className="h-8 w-28 bg-muted rounded animate-pulse" />
            <div className="h-5 w-40 bg-muted rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          </Card>
        ))}
      </div>
    </section>
  );
}
