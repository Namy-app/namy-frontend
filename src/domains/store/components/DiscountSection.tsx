import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Calendar, Pencil, Percent, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import {
  type Discount,
  type DiscountsResponse,
  useUpdateDiscount,
} from "@/domains/admin";
import { useToast } from "@/hooks/use-toast";
import {
  formatDiscountTypeLabel,
  resolveDiscountDisplayText,
} from "@/lib/discount-type";

import { inferDiscountPromoDisplayMode } from "../utils/discountPromoDisplay";

import { CreateDiscountModal } from "./CreateDiscountModal";

function formatDiscountValue(discount: Discount): string {
  return (
    resolveDiscountDisplayText({
      customText: discount.customText,
      title: discount.title,
      type: discount.type,
      value: discount.value,
    }) || "—"
  );
}

// Multi-discount management for a single store (admin)
export const DiscountSection = ({
  className,
  discounts = [],
  storeId,
  loading = true,
}: {
  storeId: string;
  className?: string;
  discounts?: Discount[];
  loading?: boolean;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateDiscount = useUpdateDiscount();
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | undefined>(
    undefined
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activeDiscounts = useMemo(
    () => discounts.filter((d) => d.active === true),
    [discounts]
  );

  const openCreateModal = (): void => {
    setEditingDiscount(undefined);
    setDiscountModalOpen(true);
  };

  const openEditModal = (discount: Discount): void => {
    setEditingDiscount(discount);
    setDiscountModalOpen(true);
  };

  const closeModal = (): void => {
    setDiscountModalOpen(false);
    setEditingDiscount(undefined);
  };

  const handleSoftDelete = async (discount: Discount): Promise<void> => {
    if (activeDiscounts.length <= 1) {
      return;
    }
    setDeletingId(discount.id);
    try {
      await updateDiscount.mutateAsync({
        id: discount.id,
        input: { active: false },
      });

      queryClient.setQueriesData<DiscountsResponse>(
        { queryKey: ["discounts"] },
        (cached) => {
          if (!cached?.data) {
            return cached;
          }
          return {
            ...cached,
            data: cached.data.map((d) =>
              d.id === discount.id ? { ...d, active: false } : d
            ),
          };
        }
      );

      await queryClient.refetchQueries({
        queryKey: ["discounts", { storeId }],
        type: "active",
      });

      toast({
        title: "Descuento desactivado",
        description:
          "El descuento ya no está activo. Los cupones reclamados se conservan.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo desactivar el descuento.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Percent className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Descuentos de la Tienda
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          <span className="ml-3 text-muted-foreground">
            Cargando descuentos...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("bg-card rounded-lg shadow py-3 px-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Percent className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Descuentos de la Tienda
            </h3>
            <p className="text-sm text-muted-foreground">
              {activeDiscounts.length}{" "}
              {activeDiscounts.length === 1
                ? "descuento activo"
                : "descuentos activos"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Añadir Nuevo Descuento
        </button>
      </div>

      {activeDiscounts.length === 1 ? (
        <p className="text-xs text-muted-foreground mb-4 -mt-2">
          Cada tienda debe mantener al menos 1 descuento activo
        </p>
      ) : null}

      {activeDiscounts.length > 0 ? (
        <div className="space-y-3">
          {activeDiscounts.map((discount) => {
            const canDelete = activeDiscounts.length > 1;
            return (
              <div
                key={discount.id}
                className="border border-border rounded-xl p-4 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-base font-bold text-foreground truncate">
                        {discount.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Activo
                      </span>
                      {inferDiscountPromoDisplayMode(discount) === "banner" ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-900">
                          Banner
                        </span>
                      ) : null}
                    </div>
                    {discount.description ? (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {discount.description}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <span className="text-muted-foreground">
                        Tipo:{" "}
                        <span className="font-medium text-foreground capitalize">
                          {formatDiscountTypeLabel(discount.type)}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Valor:{" "}
                        <span className="font-medium text-foreground">
                          {resolveDiscountDisplayText({
                            customText: discount.customText,
                            title: discount.title,
                            type: discount.type,
                            value: discount.value,
                          }) || "—"}
                        </span>
                      </span>
                      {discount.customText?.trim() ? (
                        <span className="text-muted-foreground">
                          Texto promo:{" "}
                          <span className="font-medium text-primary">
                            {discount.customText.trim()}
                          </span>
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {new Date(discount.startDate).toLocaleDateString(
                          "es-MX",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}{" "}
                        –{" "}
                        {new Date(discount.endDate).toLocaleDateString(
                          "es-MX",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-lg font-bold text-foreground text-right leading-tight max-w-[140px]">
                      {formatDiscountValue(discount)}
                    </p>
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(discount)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
                        aria-label={`Editar ${discount.title}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      {canDelete ? (
                        <button
                          type="button"
                          onClick={() => void handleSoftDelete(discount)}
                          disabled={deletingId === discount.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          aria-label={`Eliminar ${discount.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {deletingId === discount.id
                            ? "Eliminando..."
                            : "Eliminar"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
                {discount.imageUrl ? (
                  <p className="mt-2 text-xs text-muted-foreground truncate">
                    Imagen: {discount.imageUrl}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-border rounded-xl">
          <Percent className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">
            No hay descuentos activos
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Añade un descuento para esta tienda
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Añadir Nuevo Descuento
          </button>
        </div>
      )}

      {discountModalOpen ? (
        <CreateDiscountModal
          key={editingDiscount?.id ?? "create-new"}
          storeId={storeId}
          discount={editingDiscount}
          onClose={closeModal}
        />
      ) : null}
    </div>
  );
};
