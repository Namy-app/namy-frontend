"use client";

import { ChevronDown, Receipt } from "lucide-react";
import { Fragment, useState } from "react";

import { PortalEmptyState } from "@/domains/portal/components/PortalEmptyState";
import type { PortalOwnerInvoice } from "@/domains/portal/types";
import {
  formatInvoiceMonth,
  formatMxn,
  INVOICE_STATUS_BADGE,
} from "@/domains/portal/utils";
import { Card } from "@/shared/components/Card";

interface InvoicesCardProps {
  invoices: PortalOwnerInvoice[];
  isLoading: boolean;
  limit?: number;
}

export function InvoicesCard({
  invoices,
  isLoading,
  limit = 6,
}: InvoicesCardProps): React.JSX.Element {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return <InvoicesCardSkeleton />;
  }

  const items = invoices.slice(0, limit);

  return (
    <Card className="p-6 bg-card border-none shadow-card overflow-hidden">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Facturas recientes
      </h2>
      {items.length === 0 ? (
        <PortalEmptyState
          icon={Receipt}
          title="Aún no tienes facturas"
          description="Cuando se procesen cobros mensuales aparecerán aquí."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">Mes</th>
                <th className="pb-3 font-medium">Monto</th>
                <th className="pb-3 font-medium text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {items.map((invoice) => {
                const badge = INVOICE_STATUS_BADGE[invoice.status];
                const breakdown = invoice.storeBreakdown ?? [];
                const canExpand = breakdown.length > 0;
                const isExpanded = expandedId === invoice.id;

                return (
                  <Fragment key={invoice.id}>
                    <tr
                      className={`border-b border-border ${
                        canExpand
                          ? "cursor-pointer hover:bg-muted/40"
                          : "last:border-0"
                      } ${isExpanded ? "" : "last:border-0"}`}
                      onClick={() => {
                        if (!canExpand) {
                          return;
                        }
                        setExpandedId(isExpanded ? null : invoice.id);
                      }}
                    >
                      <td className="py-3 font-medium text-foreground">
                        <span className="inline-flex items-center gap-2">
                          {formatInvoiceMonth(invoice.month)}
                          {canExpand ? (
                            <ChevronDown
                              className={`w-4 h-4 text-muted-foreground transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          ) : null}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {invoice.amountCharged == null
                          ? "-"
                          : formatMxn(invoice.amountCharged)}
                      </td>
                      <td className="py-3 text-right">
                        {badge ? (
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                    {isExpanded ? (
                      <tr>
                        <td colSpan={3} className="pb-4">
                          <div className="rounded-xl bg-muted/50 px-4 py-3 space-y-2">
                            {breakdown.map((row) => (
                              <div
                                key={row.storeId}
                                className="flex items-center justify-between gap-3 text-sm"
                              >
                                <p className="font-medium text-foreground">
                                  {row.storeName}
                                </p>
                                <p className="text-muted-foreground">
                                  {row.redemptions}{" "}
                                  {row.redemptions === 1 ? "canje" : "canjes"}
                                  {" · "}
                                  {formatMxn(row.balance)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export function InvoicesCardSkeleton(): React.JSX.Element {
  return (
    <Card className="p-6 bg-card border-none shadow-card">
      <div className="h-5 w-40 bg-muted rounded animate-pulse mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </Card>
  );
}
