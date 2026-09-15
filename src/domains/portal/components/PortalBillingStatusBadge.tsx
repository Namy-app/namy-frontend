"use client";

import { PortalBillingStatus, type PortalStore } from "@/domains/portal/types";
import { BILLING_STATUS_BADGE } from "@/domains/portal/utils";
import { cn } from "@/lib/utils";

const DOT_CLASS: Record<PortalBillingStatus, string> = {
  [PortalBillingStatus.ACTIVE]: "bg-green-500",
  [PortalBillingStatus.PAYMENT_FAILED]: "bg-orange-500",
  [PortalBillingStatus.GRACE_PERIOD]: "bg-yellow-500",
  [PortalBillingStatus.HIDDEN]: "bg-red-500",
};

interface PortalBillingStatusBadgeProps {
  status: PortalBillingStatus;
  className?: string;
}

export function PortalBillingStatusBadge({
  status,
  className,
}: PortalBillingStatusBadgeProps): React.JSX.Element | null {
  const badge = BILLING_STATUS_BADGE[status];
  if (!badge) {
    return null;
  }
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
        badge.className,
        className
      )}
    >
      {badge.label}
    </span>
  );
}

export function PortalBillingStatusDot({
  store,
}: {
  store: PortalStore;
}): React.JSX.Element {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full shrink-0",
        DOT_CLASS[store.billingStatus] ?? "bg-muted-foreground"
      )}
      title={BILLING_STATUS_BADGE[store.billingStatus]?.label}
    />
  );
}
