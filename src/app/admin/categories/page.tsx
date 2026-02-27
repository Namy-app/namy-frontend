"use client";

import {
  Plus,
  Pencil,
  X,
  Power,
  ChevronLeft,
  ChevronRight,
  FolderTree,
} from "lucide-react";
import { useState } from "react";

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
} from "@/domains/admin/hooks";
import type { Category, CreateCategoryInput } from "@/domains/admin/types";
import { StoreType } from "@/domains/admin/types";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage } from "@/lib/utils";

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
  const [formData, setFormData] = useState<CategoryFormState>(emptyForm);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: categoriesData, isLoading } = useCategories(undefined, {
    page: currentPage,
    first: itemsPerPage,
  });
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

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

            <div>
              <label
                htmlFor="category-icon-url"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Icon URL
              </label>
              <input
                id="category-icon-url"
                type="url"
                value={formData.iconUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, iconUrl: e.target.value }))
                }
                placeholder="https://..."
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
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
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <FolderTree className="w-4 h-4 text-primary" />
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
    </div>
  );
}
