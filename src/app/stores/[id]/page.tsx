import dynamic from "next/dynamic";

const StoreDetailClient = dynamic(
  () => import("../_components/StoreDetailClient")
);

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function Page() {
  return <StoreDetailClient />;
}
