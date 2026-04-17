import dynamic from "next/dynamic";

const StoreDetailClient = dynamic(
  () => import("../_components/StoreDetailClient")
);

// Generate a wildcard entry so the static export serves this shell
// for any /stores/[id] path at runtime via Capacitor.
export function generateStaticParams() {
  return [{ id: "id" }];
}

export default function Page() {
  return <StoreDetailClient />;
}
