"use client";

import { Ticket } from "lucide-react";

import { PortalEmptyState } from "@/domains/portal/components/PortalEmptyState";
import type { PortalRedemption } from "@/domains/portal/types";
import { formatCentsAsMxn, formatPortalDateTime } from "@/domains/portal/utils";
import { Card } from "@/shared/components/Card";

interface RedemptionsCardProps {
  redemptions: PortalRedemption[];
  isLoading: boolean;
  limit?: number;
  title?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function RedemptionsCard({
  redemptions,
  isLoading,
  limit,
  title = "Canjes recientes",
  emptyTitle = "Aún no hay canjes este mes",
  emptyDescription,
}: RedemptionsCardProps): React.JSX.Element {
  if (isLoading) {
    return <RedemptionsCardSkeleton title={title} />;
  }

  const items = limit ? redemptions.slice(0, limit) : redemptions;

  return (
    <Card className="p-6 bg-card border-none shadow-card overflow-hidden">
      <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
      {items.length === 0 ? (
        <PortalEmptyState
          icon={Ticket}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">Fecha</th>
                <th className="pb-3 font-medium text-right">
                  Monto de descuento
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((redemption) => (
                <tr
                  key={redemption.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-3 text-foreground">
                    {formatPortalDateTime(redemption.redeemedAt)}
                  </td>
                  <td className="py-3 text-right font-medium text-foreground">
                    {formatCentsAsMxn(redemption.discountCents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export function RedemptionsCardSkeleton({
  title,
}: {
  title?: string;
}): React.JSX.Element {
  return (
    <Card className="p-6 bg-card border-none shadow-card">
      {title ? (
        <div className="h-5 w-40 bg-muted rounded animate-pulse mb-4" />
      ) : (
        <div className="h-5 w-40 bg-muted rounded animate-pulse mb-4" />
      )}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="h-4 w-40 bg-muted rounded animate-pulse" />
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </Card>
  );
}
