import ServiceContainer from "@/containers/ServiceContainer";
import { useStoresStore } from "@/store/useStoresStore";

export async function generateStaticParams() {
  const storeId = useStoresStore.getState().getStoreId();
  return storeId ? [{ details: storeId }] : [];
}

export default function ServiceDetailPage({
  params,
}: {
  params: { details: string };
}): React.JSX.Element {
  const serviceId = params?.details as string;

  return <ServiceContainer serviceId={serviceId} />;
}
