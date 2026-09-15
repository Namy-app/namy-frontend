"use client";

import type { PortalStore } from "@/domains/portal/types";

interface StoreSelectorProps {
  stores: PortalStore[];
  selectedStoreId: string | null;
  onChange: (storeId: string) => void;
}

export function StoreSelector({
  stores,
  selectedStoreId,
  onChange,
}: StoreSelectorProps): React.JSX.Element | null {
  if (stores.length <= 1) {
    return null;
  }

  return (
    <div className="w-full sm:w-auto sm:min-w-[220px]">
      <label
        htmlFor="portal-store-selector"
        className="text-sm font-medium text-foreground mb-2 block"
      >
        Restaurante
      </label>
      <select
        id="portal-store-selector"
        value={selectedStoreId ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      >
        {stores.map((store) => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>
    </div>
  );
}
