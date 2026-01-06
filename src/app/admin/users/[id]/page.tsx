import { ProtectedRoute } from "@/components/ProtectedRoute";
import UserDetailContainer from "@/containers/admin/UserDetailContainer";
import { UserRole } from "@/domains/admin/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

export async function generateStaticParams() {
  const userId = useUserStore.getState().getUserId();
  return userId ? [{ id: userId }] : [];
}

export default function UserDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { user: currentUser } = useAuthStore();
  const userId = params?.id as string;

  const isAdmin =
    currentUser?.role === UserRole.ADMIN ||
    currentUser?.role === UserRole.SUPER_ADMIN;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <UserDetailContainer userId={userId} />
    </ProtectedRoute>
  );
}
