"use client";

import {
  Plus,
  Pencil,
  Trash2,
  X,
  Power,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  Upload,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/domains/admin/hooks";
import type { Category, CreateCategoryInput } from "@/domains/admin/types";
import { StoreType } from "@/domains/admin/types";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

const STORE_TYPE_OPTIONS: { value: StoreType | ""; label: string }[] = [
  { value: "", label: "Any" },
  { value: StoreType.PRODUCT, label: "Product" },
  { value: StoreType.RESTAURANT, label: "Restaurant" },
  { value: StoreType.SERVICE, label: "Service" },
];

function getStoreTypeLabel(storeType: StoreType | undefined): string {
  if (!storeType) {
    return "—";
  }
  const opt = STORE_TYPE_OPTIONS.find((o) => o.value === storeType);
  return opt?.label ?? storeType;
}

type CategoryFormState = Omit<CreateCategoryInput, "storeType"> & {
  storeType: StoreType | "";
};

const emptyForm: CategoryFormState = {
  name: "",
  iconUrl: "",
  storeType: "",
  isActive: true,
};

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [formData, setFormData] = useState<CategoryFormState>(emptyForm);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [iconUploading, setIconUploading] = useState(false);
  const [iconUploadError, setIconUploadError] = useState<string | null>(null);
  const iconFileInputRef = useRef<HTMLInputElement>(null);
  const [categoryViewing, setCategoryViewing] = useState<Category | null>(null);

  const { data: categoriesData, isLoading } = useCategories(undefined, {
    page: currentPage,
    first: itemsPerPage,
  });
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const categories = categoriesData?.data ?? [];
  const paginationInfo = categoriesData?.paginationInfo;

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      iconUrl: category.iconUrl ?? "",
      storeType: category.storeType ?? "",
      isActive: category.isActive,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData(emptyForm);
    setIconUploadError(null);
  };

  const handleIconFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setIconUploadError("Only JPG, PNG, and WebP are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setIconUploadError("Image must be smaller than 2MB.");
      return;
    }

    setIconUploadError(null);
    setIconUploading(true);

    try {
      const { accessToken } = useAuthStore.getState();
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
      ).replace("/graphql", "");

      const body = new FormData();
      body.append("file", file);

      const res = await fetch(`${baseUrl}/upload/category-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { message?: string }).message ?? "Upload failed"
        );
      }

      const data = (await res.json()) as { url: string };
      setFormData((prev) => ({ ...prev, iconUrl: data.url }));
    } catch (err) {
      setIconUploadError(
        err instanceof Error ? err.message : "Failed to upload image."
      );
    } finally {
      setIconUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteClick = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) {
      return;
    }
    try {
      await deleteCategory.mutateAsync(categoryToDelete.id);
      toast({
        title: "Category deleted",
        description: `${categoryToDelete.name} has been deleted.`,
      });
      setCategoryToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (
    category: Category,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const nextActive = !category.isActive;
    try {
      await updateCategory.mutateAsync({
        id: category.id,
        input: { isActive: nextActive },
      });
      toast({
        title: "Success",
        description: `${category.name} is now ${nextActive ? "active" : "inactive"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    const name = formData.name.trim();
    if (!name) {
      toast({
        title: "Validation",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    const payload: CreateCategoryInput = {
      name,
      iconUrl: formData.iconUrl?.trim() || undefined,
      storeType: formData.storeType || undefined,
      isActive: formData.isActive,
    };

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          input: payload,
        });
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await createCategory.mutateAsync(payload);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }
      handleCloseForm();
    } catch (error) {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const isCreatingOrUpdating =
    createCategory.isPending || updateCategory.isPending;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Categories Management
          </h1>
          <p className="text-muted-foreground">
            Create and edit store categories
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Category
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm ? (
        <div className="bg-card rounded-lg shadow-card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {editingCategory ? "Edit Category" : "New Category"}
            </h2>
            <button
              onClick={handleCloseForm}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="category-name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Name *
              </label>
              <input
                id="category-name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Coffee, Fast Food"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="category-store-type"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Store type
              </label>
              <select
                id="category-store-type"
                value={formData.storeType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    storeType: e.target.value as StoreType | "",
                  }))
                }
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {STORE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value || "any"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Category image
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => iconFileInputRef.current?.click()}
                    disabled={iconUploading}
                    className="w-32 h-32 rounded-lg border-2 border-dashed border-border bg-muted/40 hover:border-primary hover:bg-muted/70 transition-colors flex flex-col items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {formData.iconUrl ? (
                      <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <Image
                          src={formData.iconUrl}
                          alt="Category icon"
                          fill
                          className="object-cover"
                          unoptimized
                          onError={() => {}}
                        />
                        {iconUploading ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <>
                        {iconUploading ? (
                          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                        ) : (
                          <Upload className="w-8 h-8 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground text-center px-2">
                          {iconUploading ? "Uploading…" : "Upload image"}
                        </span>
                      </>
                    )}
                  </button>
                  <input
                    ref={iconFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => void handleIconFileChange(e)}
                  />
                  <span className="text-xs text-muted-foreground">
                    JPG, PNG, WebP · max 2MB
                  </span>
                </div>
                <div className="flex-1 w-full min-w-0">
                  <label
                    htmlFor="category-icon-url"
                    className="block text-sm text-muted-foreground mb-1"
                  >
                    Or paste image URL
                  </label>
                  <input
                    id="category-icon-url"
                    type="url"
                    value={formData.iconUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        iconUrl: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              {iconUploadError ? (
                <p className="text-sm text-destructive mt-1">
                  {iconUploadError}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="rounded border-border"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-foreground"
              >
                Active
              </label>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleCloseForm}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => void handleSubmit()}
              disabled={
                createCategory.isPending ||
                updateCategory.isPending ||
                !formData.name.trim()
              }
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isCreatingOrUpdating ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              ) : null}
              {editingCategory ? "Update Category" : "Create Category"}
            </button>
          </div>
        </div>
      ) : null}

      {/* Categories Table */}
      <div className="bg-card rounded-lg shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Categories</h3>
        </div>

        {(() => {
          if (isLoading) {
            return (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <p className="text-muted-foreground mt-2">
                  Loading categories...
                </p>
              </div>
            );
          }
          if (categories.length > 0) {
            return (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-hero">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Store type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {categories.map((category) => {
                      const toggleTitle = category.isActive
                        ? "Deactivate category"
                        : "Activate category";
                      const toggleClassName = category.isActive
                        ? "p-2 rounded-lg transition-colors text-green-500 hover:bg-green-500/10"
                        : "p-2 rounded-lg transition-colors text-muted-foreground hover:bg-muted";
                      return (
                        <tr
                          key={category.id}
                          className="hover:bg-gradient-hero transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg w-10 h-10 flex items-center justify-center overflow-hidden">
                                {category.iconUrl ? (
                                  <Image
                                    src={category.iconUrl}
                                    alt=""
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                    unoptimized
                                  />
                                ) : (
                                  <FolderTree className="w-4 h-4 text-primary shrink-0" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-foreground">
                                  {category.name}
                                </div>
                                {category.iconUrl ? (
                                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {category.iconUrl}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                              {getStoreTypeLabel(category.storeType)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {category.isActive ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary/20 text-secondary-foreground">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-destructive/20 text-destructive">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              {category.iconUrl ? (
                                <button
                                  onClick={() => setCategoryViewing(category)}
                                  className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                                  title="View category image"
                                >
                                  <ImageIcon className="w-4 h-4" />
                                </button>
                              ) : null}
                              <button
                                onClick={(e) =>
                                  void handleToggleActive(category, e)
                                }
                                className={toggleClassName}
                                title={toggleTitle}
                                disabled={updateCategory.isPending}
                              >
                                <Power className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(category)}
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title="Edit category"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteClick(category, e)}
                                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                title="Delete category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {paginationInfo && paginationInfo.totalPages > 1 ? (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        paginationInfo.total
                      )}{" "}
                      of {paginationInfo.total} categories
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={!paginationInfo.hasPreviousPage}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      >
                        <span className="text-sm font-medium">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          }
          return (
            <div className="p-8 text-center">
              <FolderTree className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No categories yet</p>
              <button
                onClick={handleOpenCreate}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                Create first category
              </button>
            </div>
          );
        })()}
      </div>

      {/* View category image modal */}
      {categoryViewing ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setCategoryViewing(null)}
          role="dialog"
          aria-modal="true"
          aria-label="View category image"
        >
          <div
            className="bg-card rounded-xl shadow-xl max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                {categoryViewing.name}
              </h2>
              <button
                onClick={() => setCategoryViewing(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex justify-center bg-muted/30">
              <Image
                src={categoryViewing.iconUrl!}
                alt={categoryViewing.name}
                width={400}
                height={400}
                className="object-contain max-h-[70vh] w-auto rounded-lg"
                unoptimized
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete confirmation modal */}
      {categoryToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Delete category
              </h2>
              <button
                onClick={() => setCategoryToDelete(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                disabled={deleteCategory.isPending}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-muted-foreground mb-4">
                Are you sure you want to delete{" "}
                <strong className="text-foreground">
                  {categoryToDelete.name}
                </strong>
                ? This category will be removed from any stores that use it.
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCategoryToDelete(null)}
                disabled={deleteCategory.isPending}
                className="flex-1 px-4 py-2 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleConfirmDelete()}
                disabled={deleteCategory.isPending}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteCategory.isPending ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />{" "}
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
