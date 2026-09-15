"use client";

import { StoreSelector } from "@/domains/portal/components/StoreSelector";
import type { PortalStore } from "@/domains/portal/types";

interface PortalPageHeaderProps {
  title: string;
  subtitle?: string;
  storeName?: string | null;
  storeNameLoading?: boolean;
  badge?: React.ReactNode;
  stores?: PortalStore[];
  selectedStoreId?: string | null;
  onStoreChange?: (storeId: string) => void;
}

export function PortalPageHeader({
  title,
  subtitle,
  storeName,
  storeNameLoading = false,
  badge,
  stores = [],
  selectedStoreId,
  onStoreChange,
}: PortalPageHeaderProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
        {storeNameLoading ? (
          <div className="h-7 w-56 bg-muted rounded animate-pulse mt-1" />
        ) : storeName ? (
          <p className="text-xl font-semibold text-primary mt-1 truncate">
            {storeName}
          </p>
        ) : null}
        {subtitle ? (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        ) : null}
        {badge ? <div className="mt-3">{badge}</div> : null}
      </div>
      {onStoreChange ? (
        <StoreSelector
          stores={stores}
          selectedStoreId={selectedStoreId ?? null}
          onChange={onStoreChange}
        />
      ) : null}
    </div>
  );
}
