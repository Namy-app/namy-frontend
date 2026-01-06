import StoreDetailContainer from "@/containers/admin/StoreDetailContainer";
import { useStoresStore } from "@/store/useStoresStore";

export async function generateStaticParams() {
  const storeId = useStoresStore.getState().getStoreId();
  return storeId ? [{ id: storeId }] : [];
}

export default function StoreDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const storeId = params?.id as string;

  return <StoreDetailContainer storeId={storeId} />;
}
