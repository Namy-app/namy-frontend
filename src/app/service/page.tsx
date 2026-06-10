"use client";

import { StoreMapListingView } from "@/components/StoreMapListingView";
import { StoreType } from "@/domains/admin/types";

export default function ServicesPage(): React.JSX.Element {
  return (
    <StoreMapListingView
      storeType={StoreType.SERVICE}
      entityLabelPlural="servicios"
      loadingMessage="Cargando servicios..."
      emptyMessage="No se encontraron servicios"
      categoriesLoadingLabel="Cargando categorías..."
      defaultPlaceholderService
    />
  );
}
