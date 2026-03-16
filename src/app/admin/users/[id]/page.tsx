import dynamic from "next/dynamic";

const AdminUserDetailClient = dynamic(
  () => import("../_components/AdminUserDetailClient")
);

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function Page() {
  return <AdminUserDetailClient />;
}
