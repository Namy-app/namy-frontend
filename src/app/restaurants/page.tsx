"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

import { StoreMapListingView } from "@/components/StoreMapListingView";
import { StoreType } from "@/domains/admin/types";
import { useAppTranslation } from "@/lib/i18n/useAppTranslation";

function RestaurantListingContent(): React.JSX.Element {
  const { t } = useAppTranslation();

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
      entityLabelPlural={t("ui.restaurant_results")}
      loadingMessage={t("ui.loading_restaurants")}
      emptyMessage={t("ui.no_restaurants_found")}
      categoriesLoadingLabel={t("ui.loading_categories")}
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
