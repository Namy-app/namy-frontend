"use client";

import { StoreMapListingView } from "@/components/StoreMapListingView";
import { StoreType } from "@/domains/admin/types";
import { useAppTranslation } from "@/lib/i18n/useAppTranslation";

export default function ServicesPage(): React.JSX.Element {
  const { t } = useAppTranslation();

  return (
    <StoreMapListingView
      storeType={StoreType.SERVICE}
      entityLabelPlural={t("ui.service_results")}
      loadingMessage={t("ui.loading_services")}
      emptyMessage={t("ui.no_services_found")}
      categoriesLoadingLabel={t("ui.loading_categories")}
      defaultPlaceholderService
    />
  );
}
