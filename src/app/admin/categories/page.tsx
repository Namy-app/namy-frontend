"use client";

import {
  Plus,
  FolderTree,
  Trash2,
  Edit,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/domains/category/hooks";
import type { Category, CreateCategoryInput } from "@/domains/category/types";
import {
  useCreateSubCategory,
  useDeleteSubCategory,
} from "@/domains/subcategory/hooks";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage } from "@/lib/utils";

export default function CategoriesPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form data
  const [formData, setFormData] = useState<CreateCategoryInput>({
    name: "",
  });
  const [subcategoryInput, setSubcategoryInput] = useState<string>("");
  const [subcategories, setSubcategories] = useState<string[]>([]);

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Hooks
  const { data: categories, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // Pagination calculations
  const totalPages = Math.ceil((categories?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories =
    categories?.slice(startIndex, startIndex + itemsPerPage) || [];

  const createSubCategoryMutation = useCreateSubCategory();
  const deleteSubCategoryMutation = useDeleteSubCategory();

  const handleAddSubcategory = () => {
    if (!subcategoryInput.trim()) {
      return;
    }

    if (subcategories.includes(subcategoryInput.trim())) {
      toast({
        title: "Error",
        description: "This subcategory already exists in the list",
        variant: "destructive",
      });
      return;
    }

    setSubcategories([...subcategories, subcategoryInput.trim()]);
    setSubcategoryInput("");
  };

  const handleRemoveSubcategory = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const handleDeleteSubcategory = async (
    _categoryId: string,
    subcategoryId: string
  ) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) {
      return;
    }

    try {
      await deleteSubCategoryMutation.mutateAsync(subcategoryId);
      toast({
        title: "Success",
        description: "Subcategory deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleCreate = async () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    try {
      const category = await createMutation.mutateAsync({
        name: formData.name,
      });

      // Create subcategories if any
      if (subcategories.length > 0) {
        await Promise.all(
          subcategories.map((subcategoryName) =>
            createSubCategoryMutation.mutateAsync({
              name: subcategoryName,
              categoryId: category.id,
            })
          )
        );
      }

      toast({
        title: "Success",
        description: `Category created successfully with ${subcategories.length} subcategories`,
      });

      // Reset form
      setShowForm(false);
      setFormData({ name: "" });
      setSubcategories([]);
      setSubcategoryInput("");
    } catch (error) {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingCategory.id,
        name: formData.name || undefined,
      });

      // Create new subcategories if any
      if (subcategories.length > 0) {
        await Promise.all(
          subcategories.map((subcategoryName) =>
            createSubCategoryMutation.mutateAsync({
              name: subcategoryName,
              categoryId: editingCategory.id,
            })
          )
        );
      }

      toast({
        title: "Success",
        description: `Category updated successfully${subcategories.length > 0 ? ` with ${subcategories.length} new subcategories` : ""}`,
      });

      setEditingCategory(null);
      setShowForm(false);
      setFormData({ name: "" });
      setSubcategories([]);
      setSubcategoryInput("");
    } catch (error) {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
    });
    setSubcategories([]);
    setSubcategoryInput("");
    setShowForm(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Categories Management
        </h1>
        <p className="text-muted-foreground">
          Manage store categories and their subcategories
        </p>
      </div>

      {/* Create/Edit Form */}
      {showForm ? (
        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {editingCategory ? "Edit Category" : "Create New Category"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingCategory(null);
                setFormData({ name: "" });
                setSubcategories([]);
                setSubcategoryInput("");
              }}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Restaurant, Services, Retail"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Subcategories Section - Only for Create */}
            {!editingCategory ? (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subcategories (Optional)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={subcategoryInput}
                    onChange={(e) => setSubcategoryInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubcategory();
                      }
                    }}
                    placeholder="e.g., Pizza, Italian, Fast Food"
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* List of added subcategories */}
                {subcategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {subcategories.map((subcategory, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg border border-border"
                      >
                        <span className="text-sm text-foreground">
                          {subcategory}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategory(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Existing Subcategories - Only for Edit */}
            {editingCategory?.subcategories &&
            editingCategory.subcategories.length > 0 ? (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Existing Subcategories
                </label>
                <div className="flex flex-wrap gap-2">
                  {editingCategory.subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg border border-border"
                    >
                      <span className="text-sm text-foreground">
                        {subcategory.name}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          void handleDeleteSubcategory(
                            editingCategory.id,
                            subcategory.id
                          )
                        }
                        disabled={deleteSubCategoryMutation.isPending}
                        className="text-destructive hover:text-destructive/80 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Add New Subcategories to Existing Category */}
            {editingCategory ? (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Add New Subcategories
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={subcategoryInput}
                    onChange={(e) => setSubcategoryInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubcategory();
                      }
                    }}
                    placeholder="e.g., Pizza, Italian, Fast Food"
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* List of subcategories to be added */}
                {subcategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {subcategories.map((subcategory, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg border border-border"
                      >
                        <span className="text-sm text-foreground">
                          {subcategory}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategory(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Submit Button */}
            <button
              onClick={() =>
                void (editingCategory ? handleUpdate() : handleCreate())
              }
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : editingCategory
                  ? "Update Category"
                  : "Create Category"}
            </button>
          </div>
        </div>
      ) : null}

      {/* Create Button */}
      {!showForm ? (
        <button
          onClick={() => {
            setShowForm(true);
            setEditingCategory(null);
            setFormData({ name: "" });
            setSubcategories([]);
            setSubcategoryInput("");
          }}
          className="mb-6 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Category
        </button>
      ) : null}

      {/* Categories Table */}
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">
            Categories ({categories?.length || 0})
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : categories && categories.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Subcategories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {paginatedCategories.map((category) => {
                    const isExpanded = expandedCategories.has(category.id);
                    const hasSubcategories =
                      (category.subcategories?.length || 0) > 0;

                    return (
                      <>
                        <tr
                          key={category.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-foreground">
                              {category.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {hasSubcategories ? (
                              <button
                                onClick={() =>
                                  toggleCategoryExpansion(category.id)
                                }
                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                                <span>
                                  {category.subcategories?.length || 0}{" "}
                                  subcategories
                                </span>
                              </button>
                            ) : (
                              <span className="text-muted-foreground">
                                0 subcategories
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                            {formatDate(category.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(category)}
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title="Edit category"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => void handleDelete(category.id)}
                                disabled={deleteMutation.isPending}
                                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Subcategories Row */}
                        {isExpanded && hasSubcategories ? (
                          <tr
                            key={`${category.id}-expanded`}
                            className="bg-muted/20"
                          >
                            <td colSpan={4} className="px-6 py-4">
                              <div className="ml-8">
                                <h4 className="text-sm font-semibold text-foreground mb-3">
                                  Subcategories:
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {category.subcategories?.map(
                                    (subcategory) => (
                                      <div
                                        key={subcategory.id}
                                        className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border"
                                      >
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <span className="text-sm text-foreground">
                                          {subcategory.name}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 ? (
              <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, categories.length)} of{" "}
                  {categories.length} categories
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-muted hover:bg-muted/80 text-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg transition-colors ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80 text-foreground"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-muted hover:bg-muted/80 text-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center py-12">
            <FolderTree className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No categories yet. Create your first category to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
