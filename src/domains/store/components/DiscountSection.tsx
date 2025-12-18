import clsx from "clsx";
import { Calendar, DollarSign, Percent, Settings } from "lucide-react";
import { useState } from "react";

import { type Discount, DiscountType } from "@/domains/admin";

import { CreateDiscountModal } from "./CreateDiscountModal";

// Discount Card Component
export const DiscountSection = ({
  className,
  discount,
  storeId,
  loading = true,
}: {
  storeId: string;
  className?: string;
  discount?: Discount | null;
  loading?: boolean;
}) => {
  const [discountModal, setDiscountModal] = useState(false);

  const handleOpenDiscountModal = () => {
    setDiscountModal(true);
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Percent className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Descuento de Tienda
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          <span className="ml-3 text-muted-foreground">
            Cargando descuento...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("bg-card rounded-lg shadow p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Percent className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Descuento de Tienda
          </h3>
        </div>
        <button
          onClick={handleOpenDiscountModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
        >
          <Settings className="w-4 h-4" />
          {discount ? "Actualizar Descuento" : "Configurar Descuento"}
        </button>
      </div>

      {discount ? (
        <div className="space-y-4">
          {/* Discount Header */}
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xl font-bold text-foreground">
                {discount.title}
              </h4>
              {discount.description ? (
                <p className="text-muted-foreground mt-1">
                  {discount.description}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  discount.active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {discount.active ? "Activo" : "Inactivo"}
              </span>
              {discount.id.startsWith("temp-") && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Solo Vista Previa
                </span>
              )}
            </div>
          </div>

          {/* Discount Value */}
          <div className="bg-linear-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Valor del Descuento:
                </span>
                <span className="text-2xl font-bold text-foreground">
                  {discount.type === DiscountType.PERCENTAGE
                    ? `${discount.value}%`
                    : `$${discount.value}`}
                </span>
              </div>
              {discount.code ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Código:
                  </span>
                  <code className="px-2 py-1 bg-muted rounded font-mono text-sm font-bold text-foreground">
                    {discount.code}
                  </code>
                </div>
              ) : null}
            </div>
          </div>

          {/* Discount Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Tipo
              </p>
              <p className="text-foreground font-semibold capitalize">
                {discount.type.replace("_", " ")}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Usado
              </p>
              <p className="text-foreground font-semibold">
                {discount.usedCount}
                {discount.maxUses ? ` / ${discount.maxUses}` : ""}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Compra Mínima
              </p>
              <p className="text-foreground font-semibold">
                {discount.minPurchaseAmount
                  ? `$${discount.minPurchaseAmount}`
                  : "Sin límite"}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Descuento Máximo
              </p>
              <p className="text-foreground font-semibold">
                {discount.maxDiscountAmount
                  ? `$${discount.maxDiscountAmount}`
                  : "Sin límite"}
              </p>
            </div>
          </div>

          {/* Validity Period */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Período de Validez
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Desde:</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date(discount.startDate).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Hasta:</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date(discount.endDate).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Restrictions */}
          {(discount.excludedDaysOfWeek.length > 0 ||
            discount.excludedHours.length > 0) && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Restricciones
              </p>
              {discount.excludedDaysOfWeek.length > 0 && (
                <p className="text-sm text-foreground mb-1">
                  <span className="font-medium">Días Excluidos:</span>{" "}
                  {discount.excludedDaysOfWeek
                    .map(
                      (d: number) =>
                        [
                          "Domingo",
                          "Lunes",
                          "Martes",
                          "Miércoles",
                          "Jueves",
                          "Viernes",
                          "Sábado",
                        ][d]
                    )
                    .join(", ")}
                </p>
              )}
              {discount.excludedHours.length > 0 && (
                <p className="text-sm text-foreground">
                  <span className="font-medium">Horas Excluidas:</span>{" "}
                  {discount.excludedHours.join(", ")}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Percent className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No hay descuento configurado</p>
          <p className="text-sm text-muted-foreground mb-4">
            Configura un descuento para atraer más clientes a esta tienda
          </p>
        </div>
      )}

      {discountModal ? (
        <CreateDiscountModal
          storeId={storeId}
          discount={discount || undefined}
          onClose={() => setDiscountModal(false)}
        />
      ) : null}
    </div>
  );
};
