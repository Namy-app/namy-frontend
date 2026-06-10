import { Loader2, Percent, X } from "lucide-react";
import { useState, useCallback } from "react";

import {
  type Discount,
  type AvailableDaysAndTimes,
  useCreateDiscount,
  useUpdateDiscount,
} from "@/domains/admin";
import { useToast } from "@/hooks/use-toast";
import { formatDateToYMDSafe } from "@/lib/date.lib";
import {
  DiscountType,
  normalizeDiscountType,
  toApiDiscountType,
} from "@/lib/discount-type";
import { extractErrorMessage } from "@/lib/utils";

import {
  buildPromoSlidePayload,
  inferDiscountPromoDisplayMode,
  type PromoDisplayMode,
} from "../utils/discountPromoDisplay";
import { buildDiscountQuantityLimitInput } from "../utils/discountQuantityLimits";

import {
  computeExcludedDaysOfWeek,
  resolveInitialAvailableDays,
} from "./defaultDiscountSchedule";
import { TimeRestrictionsEditor } from "./TimeRestrictionsEditor";

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
    title: discount?.title ?? "",
    description: discount?.description ?? "",
    type: normalizeDiscountType(discount?.type) ?? DiscountType.PERCENTAGE,
    value: discount?.value?.toString() ?? "15",
    customText: discount?.customText ?? "",
    imageUrl: discount?.imageUrl ?? "",
    promoDisplayMode: discount
      ? inferDiscountPromoDisplayMode(discount)
      : ("text" as PromoDisplayMode),
    code: discount?.code ?? undefined,
    startDate: discount?.startDate
      ? formatDateToYMDSafe(discount.startDate)
      : "",
    endDate: discount?.endDate ? formatDateToYMDSafe(discount.endDate) : "",
    active: discount?.active ?? true,
    excludedStartHour: discount?.excludedHours?.[0],
    excludedEndHour: discount?.excludedHours?.[1],
    maxUses: discount?.maxUses?.toString() ?? "",
    maxUsesPerUserPerMonth: discount?.maxUsesPerUserPerMonth?.toString() ?? "",
    minPurchaseAmount: discount?.minPurchaseAmount?.toString() ?? "",
    maxDiscountAmount: discount?.maxDiscountAmount?.toString() ?? "",
    availableDaysAndTimes: resolveInitialAvailableDays(discount),
    additionalRestrictions: discount?.additionalRestrictions ?? [],
  });

  const [newRestriction, setNewRestriction] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const minStartDate = discount?.id ? undefined : today;
  const loading = createDiscount.isPending || updateDiscount.isPending;

  const handleavailableDaysAndTimesChange = useCallback(
    (restrictions: AvailableDaysAndTimes) => {
      setFormData((prev) => ({ ...prev, availableDaysAndTimes: restrictions }));
    },
    []
  );

  const handleAddRestriction = () => {
    if (newRestriction.trim()) {
      setFormData((prev) => ({
        ...prev,
        additionalRestrictions: [
          ...prev.additionalRestrictions,
          newRestriction.trim(),
        ],
      }));
      setNewRestriction("");
    }
  };

  const handleRemoveRestriction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalRestrictions: prev.additionalRestrictions.filter(
        (_: string, i: number) => i !== index
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const promoPayload = buildPromoSlidePayload(
      formData.promoDisplayMode,
      formData.imageUrl,
      formData.customText
    );

    if (formData.promoDisplayMode === "banner" && !promoPayload.imageUrl) {
      toast({
        variant: "destructive",
        title: "Imagen requerida",
        description:
          "En modo banner, sube o pega la URL de una imagen promocional completa.",
      });
      return;
    }

    const parsedValue = Number.parseFloat(formData.value);
    const apiType = toApiDiscountType(formData.type);

    try {
      const computedExcludedDaysOfWeek = computeExcludedDaysOfWeek(
        formData.availableDaysAndTimes
      );

      const parsedExcludedHours: number[] = [];

      if (formData.excludedStartHour !== undefined) {
        parsedExcludedHours.push(formData.excludedStartHour);
      }
      if (formData.excludedEndHour !== undefined) {
        parsedExcludedHours.push(formData.excludedEndHour);
      }

      const schedulePayload =
        formData.availableDaysAndTimes.availableDays.length > 0
          ? formData.availableDaysAndTimes
          : undefined;

      const quantityLimits = buildDiscountQuantityLimitInput(formData);

      const eodEndDate = `${formData.endDate.split("T")[0]}T23:59:59.999Z`;

      if (discount?.id) {
        await updateDiscount.mutateAsync({
          id: discount.id,
          input: {
            title: formData.title,
            description: formData.description,
            type: apiType,
            value: parsedValue,
            code: formData.code,
            startDate: formData.startDate,
            endDate: eodEndDate,
            active: formData.active,
            excludedDaysOfWeek: computedExcludedDaysOfWeek,
            excludedHours: parsedExcludedHours,
            ...quantityLimits,
            minPurchaseAmount: formData.minPurchaseAmount
              ? Number.parseFloat(formData.minPurchaseAmount)
              : undefined,
            maxDiscountAmount: formData.maxDiscountAmount
              ? Number.parseFloat(formData.maxDiscountAmount)
              : undefined,
            availableDaysAndTimes: schedulePayload,
            additionalRestrictions:
              formData.additionalRestrictions.length > 0
                ? formData.additionalRestrictions
                : undefined,
            ...promoPayload,
          },
        });
      } else {
        await createDiscount.mutateAsync({
          storeId,
          title: formData.title,
          description: formData.description || undefined,
          type: apiType,
          value: parsedValue,
          code: formData.code,
          startDate: formData.startDate,
          endDate: eodEndDate,
          active: formData.active,
          excludedDaysOfWeek: computedExcludedDaysOfWeek,
          excludedHours: parsedExcludedHours,
          ...quantityLimits,
          minPurchaseAmount: formData.minPurchaseAmount
            ? Number.parseFloat(formData.minPurchaseAmount)
            : undefined,
          maxDiscountAmount: formData.maxDiscountAmount
            ? Number.parseFloat(formData.maxDiscountAmount)
            : undefined,
          availableDaysAndTimes: schedulePayload,
          additionalRestrictions:
            formData.additionalRestrictions.length > 0
              ? formData.additionalRestrictions
              : undefined,
          ...promoPayload,
        });
      }
      toast({
        title: `Discount ${discount?.id ? "updated" : "created"}`,
        description: `The discount has been ${discount?.id ? "updated" : "created"} successfully.`,
      });
      onClose();
    } catch (_error) {
      const message =
        extractErrorMessage(_error) ??
        (discount?.id
          ? "No se pudo actualizar el descuento."
          : "No se pudo crear el descuento.");
      toast({
        variant: "destructive",
        title: discount?.id ? "Error al actualizar" : "Error al crear",
        description: message,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="flex max-h-[90dvh] w-full min-w-0 max-w-2xl flex-col rounded-lg bg-card shadow-card sm:max-h-[90vh]">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-4 sm:items-center sm:p-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="shrink-0 rounded-lg bg-accent/20 p-2">
              <Percent className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">
                {discount?.id
                  ? "Descuento de actualización"
                  : "Crear nuevo descuento"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Configurar un nuevo descuento u oferta promocional
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={createDiscount.isPending}
            className="shrink-0 rounded-lg p-2 transition-colors hover:bg-muted disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-w-0 flex-1 space-y-6 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Información Básica
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Título <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="ej. Venta de Verano, Oferta Black Friday"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Describe la oferta de descuento..."
                  />
                </div>
              </div>
            </div>

            {/* Discount Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Detalles del Descuento
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tipo <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as DiscountType,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value={DiscountType.PERCENTAGE}>
                      Porcentaje (%)
                    </option>
                    <option value={DiscountType.FIXED}>
                      Cantidad Fija ($)
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Valor <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={
                      formData.type === DiscountType.PERCENTAGE
                        ? "ej. 20 (usa 0 para BOGO)"
                        : "ej. 10.00"
                    }
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
                  <p className="text-sm font-semibold text-foreground">
                    Visualización en la tienda
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="promo-display-mode"
                        checked={formData.promoDisplayMode === "banner"}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            promoDisplayMode: "banner",
                            customText: "",
                          })
                        }
                        className="text-primary"
                      />
                      <span className="text-sm text-foreground">
                        Banner completo (solo imagen)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="promo-display-mode"
                        checked={formData.promoDisplayMode === "text"}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            promoDisplayMode: "text",
                          })
                        }
                        className="text-primary"
                      />
                      <span className="text-sm text-foreground">
                        Fondo + texto personalizado
                      </span>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formData.promoDisplayMode === "banner"
                      ? "Pide al restaurante un banner con el texto incluido. No se superpone texto en la app."
                      : "Usa el degradado de la app y escribe el mensaje (ej. 2-for-1 Milkshakes)."}
                  </p>
                </div>
                {formData.promoDisplayMode === "banner" ? (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      URL del banner promocional{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://..."
                      required
                    />
                  </div>
                ) : (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Texto promocional / BOGO
                      </label>
                      <input
                        type="text"
                        value={formData.customText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customText: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Ej: 2-for-1 Milkshakes"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Imagen de fondo (opcional)
                      </label>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            imageUrl: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Usos máximos por mes
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.maxUsesPerUserPerMonth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxUsesPerUserPerMonth: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="ej., 20"
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
                    placeholder="ej., 100"
                  />
                </div>
              </div>
            </div>

            {/* Validity Period */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Período de Validez
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Fecha de Inicio <span className="text-destructive">*</span>
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
                    Fecha de Fin <span className="text-destructive">*</span>
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
                Condiciones
              </h4>

              {/* Exclude Hours */}
              {/* TODO: Remove once confirmed that new configuratin is working */}
              <div className="hidden">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Horas Excluidas
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Hora de Inicio
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
                      placeholder="ej. 22"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Hora de Fin
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
                      placeholder="ej. 6"
                    />
                  </div>
                </div>
              </div>

              {/* Time Restrictions Editor */}
              <div className="space-y-4">
                <TimeRestrictionsEditor
                  value={formData.availableDaysAndTimes}
                  onChange={handleavailableDaysAndTimesChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cantidad Mínima de Compra
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
                    placeholder="ej. 50.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cantidad Máxima de Descuento
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
                    placeholder="ej. 100.00"
                  />
                </div>
              </div>
            </div>

            {/* Additional Restrictions */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Restricciones Adicionales
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRestriction}
                  onChange={(e) => setNewRestriction(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddRestriction();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Agregar restricción adicional..."
                />
                <button
                  type="button"
                  onClick={handleAddRestriction}
                  className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-colors"
                >
                  Agregar
                </button>
              </div>
              {formData.additionalRestrictions.length > 0 && (
                <div className="space-y-2">
                  {formData.additionalRestrictions.map(
                    (restriction: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                      >
                        <span className="text-sm text-foreground">
                          {restriction}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRestriction(index)}
                          className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                          title="Eliminar restricción"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
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
                El descuento está activo y disponible para los usuarios
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:gap-3 sm:p-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full rounded-lg border border-border px-4 py-3 font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando...
                </>
              ) : discount?.id ? (
                "Actualizar Descuento"
              ) : (
                "Crear Descuento"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
