// Restaurant detail page (redesigned, with coupon generation)
import RestaurantContainer from "@/containers/RestaurantContainer";
import { useStoresStore } from "@/store/useStoresStore";

export async function generateStaticParams() {
  const storeId = useStoresStore.getState().getStoreId();
  return storeId ? [{ detail: storeId }] : [];
}

export default function RestaurantDetailPage({
  params,
}: {
  params: { detail: string };
}): React.JSX.Element {
  const storeId = (params?.detail as string) || null;

  return <RestaurantContainer storeId={storeId} />;
}
