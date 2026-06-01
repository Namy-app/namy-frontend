"use client";

import { StoreMapListingView } from "@/components/StoreMapListingView";
import { StoreType } from "@/domains/admin/types";

export default function RestaurantListingPage(): React.JSX.Element {
  return (
    <StoreMapListingView
      storeType={StoreType.RESTAURANT}
      entityLabelPlural="restaurantes"
      loadingMessage="Cargando restaurantes..."
      emptyMessage="No se encontraron restaurantes"
      categoriesLoadingLabel="Cargando categorías..."
    />
  );
}
