"use client";

import {
  Plus,
  Store as StoreIcon,
  ShoppingBag,
  Package,
  ArrowLeft,
  Pencil,
  Trash2,
  X,
  Power,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CreateStoreForm } from "@/domains/admin/components/CreateStoreForm";
import { EditStoreForm } from "@/domains/admin/components/EditStoreForm";
import {
  useStoreStatistics,
  useStores,
  useDeleteStore,
  useToggleStoreActive,
} from "@/domains/admin/hooks";
import { UserRole, type Store } from "@/domains/admin/types";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminStoresPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);
  const [storeToEdit, setStoreToEdit] = useState<Store | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for client-side hydration
  useEffect(() => {
    // Mark as hydrated after Zustand rehydrates from localStorage
    // Use a small delay to ensure Zustand has fully rehydrated
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!user) {
      router.replace("/auth");
    }
  }, [router, user, isHydrated]);

  const { data: stats, isLoading: statsLoading } = useStoreStatistics({
    active: null,
  });
  const { data: storesData, isLoading: storesLoading } = useStores(
    {},
    { first: itemsPerPage, page: currentPage }
  );
  const deleteStore = useDeleteStore();
  const toggleStoreActive = useToggleStoreActive();

  const stores = storesData?.data ?? [];
  const paginationInfo = storesData?.paginationInfo;

  // Check if user is admin
  const isAdmin =
    user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  // Handle delete store
  const handleDeleteStore = async () => {
    if (!storeToDelete) {
      return;
    }

    try {
      await deleteStore.mutateAsync(storeToDelete.id);
      toast({
        title: "Store Deleted",
        description: `${storeToDelete.name} has been successfully deleted.`,
      });
      setStoreToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete store",
        variant: "destructive",
      });
    }
  };

  // Handle edit store
  const handleEditStore = (store: Store, e: React.MouseEvent) => {
    e.stopPropagation();
    setStoreToEdit(store);
  };

  // Handle delete click
  const handleDeleteClick = (store: Store, e: React.MouseEvent) => {
    e.stopPropagation();
    setStoreToDelete(store);
  };

  // Handle toggle store active status
  const handleToggleStoreActive = async (store: Store, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleStoreActive.mutateAsync(store.id);
      toast({
        title: "Success",
        description: `${store.name} is now ${!store.active ? "active" : "inactive"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to toggle store status",
        variant: "destructive",
      });
    }
  };

  // Redirect effect will run on client after hydration
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-6">
            You don&apos;t have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={() => router.push("/admin")}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Dashboard
                </button>
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage stores and platform settings
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Store
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Stores */}
          <div className="bg-card rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Stores
              </p>
              <div className="p-2 bg-primary/10 rounded-lg">
                <StoreIcon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {statsLoading ? (
                <span className="inline-block animate-pulse w-16 h-8 bg-gray-300 rounded-md" />
              ) : (
                stats?.total || 0
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {statsLoading ? (
                <span className="inline-block animate-pulse w-16 h-8 bg-gray-300 rounded-md" />
              ) : (
                `${stats?.active || 0} active, ${stats?.inactive || 0} inactive`
              )}
            </p>
          </div>

          {/* Product Stores */}
          <div className="bg-card rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Product Stores
              </p>
              <div className="p-2 bg-secondary/20 rounded-lg">
                <Package className="w-5 h-5 text-secondary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {statsLoading ? (
                <span className="inline-block animate-pulse w-16 h-8 bg-gray-300 rounded-md" />
              ) : (
                stats?.byType.product || 0
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Product-based businesses
            </p>
          </div>

          {/* Service Stores */}
          <div className="bg-card rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Service Stores
              </p>
              <div className="p-2 bg-accent/20 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-accent-foreground" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {statsLoading ? "..." : stats?.byType.service || 0}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Service-based businesses
            </p>
          </div>
        </div>

        {/* Recent Stores Table */}
        <div className="bg-card rounded-lg shadow-card overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-foreground">
              Recent Stores
            </h3>
          </div>

          {storesLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <p className="text-muted-foreground mt-2">Loading stores...</p>
            </div>
          ) : stores.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-hero">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {stores.map((store) => (
                    <tr
                      key={store.id}
                      className="hover:bg-gradient-hero transition-colors"
                    >
                      <td
                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                        onClick={() => router.push(`/admin/stores/${store.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-3 h-3 rounded-full ${
                              store.active
                                ? "bg-secondary-foreground"
                                : "bg-destructive"
                            }`}
                            title={store.active ? "Active" : "Inactive"}
                          />
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {store.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {store.description?.slice(0, 50)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                        onClick={() => router.push(`/admin/stores/${store.id}`)}
                      >
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary capitalize">
                          {store.type}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground cursor-pointer"
                        onClick={() => router.push(`/admin/stores/${store.id}`)}
                      >
                        {store.city}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                        onClick={() => router.push(`/admin/stores/${store.id}`)}
                      >
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            store.active
                              ? "bg-secondary/20 text-secondary-foreground"
                              : "bg-destructive/20 text-destructive"
                          }`}
                        >
                          {store.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground cursor-pointer"
                        onClick={() => router.push(`/admin/stores/${store.id}`)}
                      >
                        ⭐ {store.averageRating}/5 ({store.reviewCounter})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) =>
                              void handleToggleStoreActive(store, e)
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              store.active
                                ? "text-orange-500 hover:bg-orange-500/10"
                                : "text-secondary-foreground hover:bg-secondary/10"
                            }`}
                            title={
                              store.active
                                ? "Deactivate store"
                                : "Activate store"
                            }
                            disabled={toggleStoreActive.isPending}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleEditStore(store, e)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit store"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(store, e)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Delete store"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {paginationInfo ? (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, paginationInfo.total)}{" "}
                    of {paginationInfo.total} stores
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={!paginationInfo.hasPreviousPage}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="text-sm font-medium">Previous</span>
                    </button>

                    <div className="flex items-center gap-2 px-3 py-2">
                      {Array.from(
                        { length: paginationInfo.totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors ${
                            page === currentPage
                              ? "bg-primary text-primary-foreground"
                              : "border border-border hover:bg-muted"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={!paginationInfo.hasNextPage}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Next page"
                    >
                      <span className="text-sm font-medium">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="p-8 text-center">
              <StoreIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No stores found</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                Create First Store
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Store Modal */}
      {showCreateForm ? (
        <CreateStoreForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            // Queries will auto-refresh due to invalidation in the hook
          }}
        />
      ) : null}

      {/* Edit Store Modal */}
      {storeToEdit ? (
        <EditStoreForm
          store={storeToEdit}
          onClose={() => setStoreToEdit(null)}
          onSuccess={() => {
            setStoreToEdit(null);
            // Queries will auto-refresh due to invalidation in the hook
          }}
        />
      ) : null}

      {/* Delete Confirmation Modal */}
      {storeToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Delete Store
              </h2>
              <button
                onClick={() => setStoreToDelete(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                disabled={deleteStore.isPending}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-muted-foreground mb-4">
                Are you sure you want to delete{" "}
                <strong className="text-foreground">
                  {storeToDelete.name}
                </strong>
                ?
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive">
                  ⚠️ This action cannot be undone. All associated data including
                  discounts and coupons will be permanently deleted.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStoreToDelete(null)}
                disabled={deleteStore.isPending}
                className="flex-1 px-4 py-2 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleDeleteStore()}
                disabled={deleteStore.isPending}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteStore.isPending ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Deleting...
                  </>
                ) : (
                  "Delete Store"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
