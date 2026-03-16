import dynamic from "next/dynamic";

const AdminStoreDetailClient = dynamic(
  () => import("../_components/AdminStoreDetailClient")
);

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function Page() {
  return <AdminStoreDetailClient />;
}
