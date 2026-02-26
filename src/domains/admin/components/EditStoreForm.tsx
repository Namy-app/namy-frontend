"use client";

import { X, Store as StoreIcon, Loader2 } from "lucide-react";
import { useState } from "react";

import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import {
  Autocomplete,
  type AutocompleteOption,
} from "@/components/Autocomplete";
import { DAYS_OF_WEEK_BY_INDEX } from "@/data/constants";
import {
  useUpdateStore,
  useGetCategoriesByStoreType,
} from "@/domains/admin/hooks";
import {
  type Store,
  type UpdateStoreInput,
  type OpenDay,
  StoreType,
} from "@/domains/admin/types";
import { StoreHoursEditor } from "@/domains/store/components/StoreHoursEditor";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage } from "@/lib/utils";

interface EditStoreFormProps {
  store: Store;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditStoreForm({
  store,
  onClose,
  onSuccess,
}: EditStoreFormProps) {
  const { toast } = useToast();
  const updateStore = useUpdateStore();

  const [categoryQuery, setCategoryQuery] = useState("");

  const [formData, setFormData] = useState<UpdateStoreInput>({
    name: store.name,
    description: store.description,
    categoryIds: store.categoryIds ?? [],
    type: store.type,
    city: store.city,
    address: store.address,
    placeId: store.placeId,
    phoneNumber: store.phoneNumber,
    email: store.email,
    price: store.price,
    active: store.active,
    url: store.url,
    tags: store.tags,
    restrictions: store.restrictions,
    lat: store.lat,
    lng: store.lng,
    isRestaurant: store.isRestaurant,
  });

  // Convert openDays to availableDays array format if needed
  const getInitialHours = (): OpenDay[] => {
    if (!store.openDays) {
      return [];
    }

    // Check if it's already in the new format
    if (store.openDays.availableDays) {
      return store.openDays.availableDays;
    }

    // Convert from old format to new format
    const oldFormatDays = store.openDays as unknown as Record<
      string,
      { open?: string; close?: string }
    >;

    // return Object.values(DAYS_OF_WEEK_BY_INDEX)
    return Object.values(DAYS_OF_WEEK_BY_INDEX)
      .filter((day) => day in oldFormatDays && oldFormatDays[day])
      .map((day) => {
        const hours = oldFormatDays[day];
        return {
          day: day,
          startTime: hours?.open || "09:00",
          endTime: hours?.close || "17:00",
          closed: false,
        };
      });
  };

  const [openHours, setOpenHours] = useState<OpenDay[]>(getInitialHours());

  const storeTypeFilter =
    formData.type === StoreType.RESTAURANT ? "restaurant" : "service";
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetCategoriesByStoreType({
      storeType: storeTypeFilter,
      name: categoryQuery || undefined,
      enabled: true,
      pagination: { page: 1, first: 50 },
    });
  const categories = categoriesResponse?.data ?? [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === "lat" || name === "lng") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseFloat(value) : undefined,
      }));
    } else if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        type: value as StoreType,
        categoryIds: [], // Reset when type changes
      }));
      setCategoryQuery("");
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value || undefined,
      }));
    }
  };

  const currentCategoryIds = formData.categoryIds ?? [];

  const handleAddCategory = (
    option: AutocompleteOption<{ id: string; name: string }>
  ) => {
    if (currentCategoryIds.includes(option.value.id)) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      categoryIds: [...(prev.categoryIds ?? []), option.value.id],
    }));
    setCategoryQuery("");
  };

  const handleRemoveCategory = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: (prev.categoryIds ?? []).filter((cid) => cid !== id),
    }));
  };

  const handleCategoryQueryUpdate = (query: string) => {
    setCategoryQuery(query);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.city || !formData.address) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, City, Address)",
        variant: "destructive",
      });
      return;
    }

    if (!(formData.categoryIds?.length ?? 0)) {
      toast({
        title: "Validation Error",
        description: "Please select at least one category",
        variant: "destructive",
      });
      return;
    }

    try {
      const updateInput: UpdateStoreInput = {
        ...formData,
        categoryIds: formData.categoryIds,
        openDays:
          openHours.length > 0 ? { availableDays: openHours } : undefined,
      };
      await updateStore.mutateAsync({ id: store.id, input: updateInput });

      toast({
        title: "✅ Store Updated Successfully",
        description: `${formData.name} has been updated.`,
        duration: 5000,
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error: unknown) {
      console.error("Error updating store:", error);
      toast({
        title: "Error",
        description:
          extractErrorMessage(error) ||
          "Failed to update store. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <StoreIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Edit Store</h2>
              <p className="text-sm text-muted-foreground">
                Update store information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            disabled={updateStore.isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Store Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Starbucks Coffee"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Brief description of the store..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type <span className="text-destructive">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={StoreType.PRODUCT}>Product</option>
                  <option value={StoreType.RESTAURANT}>Restaurant</option>
                  <option value={StoreType.SERVICE}>Service</option>
                </select>
              </div>
            </div>

            {/* Categories (multi-select) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Categories
              </h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select at least one category{" "}
                  <span className="text-destructive">*</span>
                </label>
                {currentCategoryIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {currentCategoryIds.map((id) => {
                      const cat = categories.find((c) => c.id === id);
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                        >
                          {cat?.name ?? id}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(id)}
                            className="hover:bg-primary/20 rounded p-0.5"
                            aria-label="Remove category"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
                <Autocomplete<{ id: string; name: string }>
                  options={categories
                    .filter((c) => !currentCategoryIds.includes(c.id))
                    .map((cat) => ({
                      id: cat.id,
                      label: cat.name,
                      value: { id: cat.id, name: cat.name },
                    }))}
                  query={categoryQuery}
                  onQueryUpdate={handleCategoryQueryUpdate}
                  onSelect={handleAddCategory}
                  placeholder="Search to add category..."
                  isLoading={isCategoriesLoading}
                  noResultsMessage="No categories found"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Location
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    City <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Mexico City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+52 55 1234 5678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="store@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address <span className="text-destructive">*</span>
                </label>
                <AddressAutocomplete
                  value={formData.address || ""}
                  onChange={(address, placeId, lat, lng) => {
                    setFormData((prev) => ({
                      ...prev,
                      address,
                      placeId: placeId !== null ? placeId : prev.placeId,
                      lat: lat !== null ? lat : prev.lat,
                      lng: lng !== null ? lng : prev.lng,
                    }));
                  }}
                  placeholder="Search for store address..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="lat"
                    value={formData.lat || ""}
                    onChange={handleChange}
                    step="any"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="19.4326"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="lng"
                    value={formData.lng || ""}
                    onChange={handleChange}
                    step="any"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="-99.1332"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Coordinates are auto-filled when selecting from address search,
                or enter manually
              </p>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Additional Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="coffee, breakfast, wifi"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <label
                  htmlFor="active"
                  className="text-sm font-medium text-foreground"
                >
                  Store is active
                </label>
              </div>
            </div>

            {/* Custom Restrictions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Custom Restrictions
              </h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Restrictions
                </label>
                <textarea
                  name="restrictions"
                  value={formData.restrictions || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Enter any restrictions or special conditions for this store (e.g., age requirements, dress code, booking required, etc.)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional: Add any restrictions or requirements customers
                  should know about
                </p>
              </div>
            </div>

            {/* Store Hours */}
            <StoreHoursEditor value={openHours} onChange={setOpenHours} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-border shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={updateStore.isPending}
              className="flex-1 px-4 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateStore.isPending}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {updateStore.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Store"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
