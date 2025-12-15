"use client";

import { X, Store as StoreIcon, Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/hooks/use-toast";

import { useCreateStore } from "../hooks";
import { type CreateStoreInput, StoreType, PriceRange } from "../types";

interface CreateStoreFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateStoreForm({ onClose, onSuccess }: CreateStoreFormProps) {
  const { toast } = useToast();
  const createStore = useCreateStore();
  const [copiedPin, setCopiedPin] = useState(false);
  const [generatedPin, setGeneratedPin] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateStoreInput>({
    name: "",
    description: "",
    categoryId: "",
    subCategory: "",
    type: StoreType.PRODUCT,
    city: "",
    address: "",
    phoneNumber: "",
    price: PriceRange.BUDGET,
    active: true,
    url: "",
    tags: "",
  });

  const [categoryType, setCategoryType] = useState<"restaurant" | "others">(
    "restaurant"
  );

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
    } else if (name === "categoryType") {
      setCategoryType(value as "restaurant" | "others");
      // Reset category fields when switching types
      setFormData((prev) => ({
        ...prev,
        categoryId: "",
        subCategory: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value || undefined,
      }));
    }
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

    // Validate category requirements based on type
    if (categoryType === "restaurant") {
      if (!formData.subCategory) {
        toast({
          title: "Validation Error",
          description: "Please enter a Sub-Category for restaurant",
          variant: "destructive",
        });
        return;
      }
    } else if (categoryType === "others") {
      if (!formData.categoryId || !formData.subCategory) {
        toast({
          title: "Validation Error",
          description: "Please enter both Category and Sub-Category",
          variant: "destructive",
        });
        return;
      }
    }

    // Set categoryId based on categoryType
    const finalFormData = {
      ...formData,
      categoryId:
        categoryType === "restaurant" ? "restaurant" : formData.categoryId,
    };

    try {
      const result = await createStore.mutateAsync(finalFormData);

      setGeneratedPin(result.plainPin);

      toast({
        title: "✅ Store Created Successfully",
        description: "Store has been created successfully",
        duration: 5000,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error("Error creating store:", error);
      toast({
        title: "Error",
        description:
          (error instanceof Error ? error.message : null) ||
          "Failed to create store. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyPin = async () => {
    if (generatedPin) {
      await navigator.clipboard.writeText(generatedPin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);

      toast({
        title: "PIN Copied!",
        description: "Store PIN copied to clipboard",
      });
    }
  };

  // Show PIN success screen
  if (generatedPin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Store Created!
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-secondary/10 border-2 border-secondary rounded-lg p-6 mb-6">
            <p className="text-sm text-secondary-foreground mb-4 font-medium">
              ⚠️ IMPORTANT: Save this PIN immediately! You won&apos;t be able to
              see it again.
            </p>
            <div className="bg-card rounded-lg p-4 border-2 border-secondary">
              <p className="text-xs text-muted-foreground mb-2">Store PIN:</p>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-mono font-bold text-foreground">
                  {generatedPin}
                </p>
                <button
                  onClick={() => void handleCopyPin()}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Copy PIN"
                >
                  {copiedPin ? (
                    <Check className="w-5 h-5 text-secondary-foreground" />
                  ) : (
                    <Copy className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary rounded-lg p-4 mb-6">
            <p className="text-sm text-primary">
              <strong>Note:</strong> This PIN is used by the store to redeem
              coupons. Store it securely and share it only with the store owner.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-foreground text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Show create form
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
              <h2 className="text-2xl font-bold text-foreground">
                Create Store
              </h2>
              <p className="text-sm text-muted-foreground">
                Add a new store to the platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            disabled={createStore.isPending}
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
                  value={formData.description}
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
                  <option value={StoreType.SERVICE}>Service</option>
                </select>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Category
              </h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Store Category <span className="text-destructive">*</span>
                </label>
                <select
                  name="categoryType"
                  value={categoryType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="others">Others</option>
                </select>
              </div>

              {categoryType === "restaurant" ? (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Sub Category <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., coffee-shop, pizza-restaurant, sushi-bar"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., grocery, retail"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Sub Category <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="subCategory"
                      value={formData.subCategory || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., organic, convenience"
                    />
                  </div>
                </div>
              )}
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
                  Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Full street address"
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
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-border shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={createStore.isPending}
              className="flex-1 px-4 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createStore.isPending}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createStore.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Store"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
