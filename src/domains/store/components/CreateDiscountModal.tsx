import { Loader2, Percent, X } from "lucide-react";
import { useState } from "react";

import {
  type Discount,
  DiscountType,
  useCreateDiscount,
  useUpdateDiscount,
} from "@/domains/admin";
import { useToast } from "@/hooks/use-toast";
import { formatDateToYMDSafe } from "@/lib/date.lib";
import { extractValidationErrors } from "@/lib/utils";

const daysOfTheWeek = [
  { label: "Lunes", index: 1 },
  { label: "Martes", index: 2 },
  { label: "Miércoles", index: 3 },
  { label: "Jueves", index: 4 },
  { label: "Viernes", index: 5 },
  { label: "Sábado", index: 6 },
  { label: "Domingo", index: 0 },
];

// Create Discount Modal - Unused, can be removed
export const CreateDiscountModal = ({
  storeId,
  discount,
  onClose,
}: {
  storeId: string;
  discount?: Discount;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount();
  const [formData, setFormData] = useState({
    title: discount?.title || "",
    description: discount?.description || "",
    type: discount?.type || DiscountType.PERCENTAGE,
    value: discount?.value.toString() || "15",
    code: discount?.code || "",
    startDate: discount?.startDate
      ? formatDateToYMDSafe(discount.startDate)
      : "",
    endDate: discount?.endDate ? formatDateToYMDSafe(discount.endDate) : "",
    active: discount?.active ?? true,
    excludedDaysOfWeek: discount?.excludedDaysOfWeek || [],
    excludedStartHour: discount?.excludedHours[0],
    excludedEndHour: discount?.excludedHours[1],
    maxUses: discount?.maxUses?.toString() || "",
    maxUsesPerUserPerMonth: discount?.maxUsesPerUserPerMonth?.toString() || "",
    minPurchaseAmount: discount?.minPurchaseAmount?.toString() || "",
    maxDiscountAmount: discount?.maxDiscountAmount?.toString() || "",
  });

  const today = new Date().toISOString().split("T")[0];
  const minStartDate = discount?.id ? undefined : today;
  const loading = createDiscount.isPending || updateDiscount.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedExcludedHours = [];

      if (formData.excludedStartHour !== undefined) {
        parsedExcludedHours.push(formData.excludedStartHour);
      }
      if (formData.excludedEndHour !== undefined) {
        parsedExcludedHours.push(formData.excludedEndHour);
      }

      if (discount?.id) {
        await updateDiscount.mutateAsync({
          id: discount.id,
          input: {
            title: formData.title,
            description: formData.description || undefined,
            type: formData.type,
            value: parseFloat(formData.value),
            code: formData.code || undefined,
            startDate: formData.startDate,
            endDate: formData.endDate,
            active: formData.active,
            excludedDaysOfWeek: formData.excludedDaysOfWeek,
            excludedHours: parsedExcludedHours,
            maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
            maxUsesPerUserPerMonth: formData.maxUsesPerUserPerMonth
              ? parseInt(formData.maxUsesPerUserPerMonth)
              : undefined,
            minPurchaseAmount: formData.minPurchaseAmount
              ? parseFloat(formData.minPurchaseAmount)
              : undefined,
            maxDiscountAmount: formData.maxDiscountAmount
              ? parseFloat(formData.maxDiscountAmount)
              : undefined,
          },
        });
      } else {
        await createDiscount.mutateAsync({
          storeId,
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          value: parseFloat(formData.value),
          code: formData.code || undefined,
          startDate: formData.startDate,
          endDate: formData.endDate,
          active: formData.active,
          excludedDaysOfWeek: formData.excludedDaysOfWeek,
          excludedHours: parsedExcludedHours,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
          maxUsesPerUserPerMonth: formData.maxUsesPerUserPerMonth
            ? parseInt(formData.maxUsesPerUserPerMonth)
            : undefined,
          minPurchaseAmount: formData.minPurchaseAmount
            ? parseFloat(formData.minPurchaseAmount)
            : undefined,
          maxDiscountAmount: formData.maxDiscountAmount
            ? parseFloat(formData.maxDiscountAmount)
            : undefined,
        });
      }
      toast({
        title: `Discount ${discount?.id ? "updated" : "created"}`,
        description: `The discount has been ${discount?.id ? "updated" : "created"} successfully.`,
      });
      onClose();
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: _error
          ? extractValidationErrors(_error).join(", ")
          : "Failed to create discount.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-card max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Percent className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {discount?.id ? "Update Discount" : "Create New Discount"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Set up a new discount or promotional offer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={createDiscount.isPending}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
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
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Summer Sale, Black Friday Deal"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Describe the discount offer..."
                  />
                </div>
              </div>
            </div>

            {/* Discount Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Discount Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Type <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as DiscountType,
                      })
                    }
                    disabled
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value={DiscountType.PERCENTAGE}>
                      Percentage (%)
                    </option>
                    <option value={DiscountType.FIXED_AMOUNT}>
                      Fixed Amount ($)
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Value <span className="text-destructive">*</span>
                  </label>
                  {/* For Now it would be read only */}
                  <input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={
                      formData.type === DiscountType.PERCENTAGE
                        ? "e.g., 20"
                        : "e.g., 10.00"
                    }
                    disabled
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Usos máximos por mes
                  </label>
                  <input
                    type="text"
                    value={formData.maxUsesPerUserPerMonth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxUsesPerUserPerMonth: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 20"
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Discount Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., SAVE20"
                  />
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Usos máximos en total
                  </label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) =>
                      setFormData({ ...formData, maxUses: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
            </div>

            {/* Validity Period */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Validity Period
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Start Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    min={minStartDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    End Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    min={today}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Conditions
              </h4>

              {/* Exclude Days */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Exclude Days
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {daysOfTheWeek.map((day) => (
                    <label
                      key={day.index}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.excludedDaysOfWeek.includes(
                          day.index
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              excludedDaysOfWeek: [
                                ...formData.excludedDaysOfWeek,
                                day.index,
                              ],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              excludedDaysOfWeek:
                                formData.excludedDaysOfWeek.filter(
                                  (d) => d !== day.index
                                ),
                            });
                          }
                        }}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">
                        {day.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Exclude Hours */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Excluded Hours
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Start Hour
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={formData.excludedStartHour ?? ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          excludedStartHour: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        });
                      }}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 22"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      End Hour
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={formData.excludedEndHour ?? ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          excludedEndHour: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        });
                      }}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 6"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Min Purchase Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minPurchaseAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minPurchaseAmount: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 50.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max Discount Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.maxDiscountAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxDiscountAmount: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 100.00"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 p-4 bg-gradient-hero rounded-lg border border-border">
              <input
                type="checkbox"
                id="discount-active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label
                htmlFor="discount-active"
                className="text-sm font-medium text-foreground"
              >
                Discount is active and available to users
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-border shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : discount?.id ? (
                "Update Discount"
              ) : (
                "Create Discount"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
