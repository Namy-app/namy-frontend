"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

import { StoreMapListingView } from "@/components/StoreMapListingView";
import { StoreType } from "@/domains/admin/types";

function RestaurantListingContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const promoIds = useMemo(() => {
    const raw = searchParams.get("ids");
    if (!raw) {
      return undefined;
    }
    const ids = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return ids.length > 0 ? ids : undefined;
  }, [searchParams]);

  return (
    <StoreMapListingView
      storeType={StoreType.RESTAURANT}
      entityLabelPlural="restaurantes"
      loadingMessage="Cargando restaurantes..."
      emptyMessage="No se encontraron restaurantes"
      categoriesLoadingLabel="Cargando categorías..."
      promoIds={promoIds}
      promoListPath="/restaurants"
    />
  );
}

export default function RestaurantListingPage(): React.JSX.Element {
  return (
    <Suspense>
      <RestaurantListingContent />
    </Suspense>
  );
}
