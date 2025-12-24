"use client";

import { X, DollarSign, AlertCircle, Info } from "lucide-react";

import { DAYS_OF_WEEK_BY_INDEX } from "@/data/constants";

import type { AvailableDay, AvailableDaysAndTimes } from "../admin";

interface RestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  discountTitle: string;
  restrictions: {
    storeRestrictions?: string | null;
    discountRestrictions?: string | null;
    minPurchaseAmount?: number | null;
    maxDiscountAmount?: number | null;
    excludedDaysOfWeek?: number[] | null;
    excludedHours?: number[] | null;
    additionalRestrictions?: string[] | null;
    availableDaysAndTimes?: AvailableDaysAndTimes | null;
  };
}

export function RestrictionModal({
  isOpen,
  onClose,
  storeName,
  discountTitle,
  restrictions,
}: RestrictionModalProps) {
  if (!isOpen) {
    return null;
  }

  const {
    storeRestrictions,
    discountRestrictions,
    minPurchaseAmount,
    maxDiscountAmount,
    availableDaysAndTimes,
    excludedDaysOfWeek,
    excludedHours,
    additionalRestrictions,
  } = restrictions;

  const hasAnyRestrictions =
    storeRestrictions ||
    discountRestrictions ||
    minPurchaseAmount ||
    maxDiscountAmount ||
    (additionalRestrictions && additionalRestrictions.length > 0) ||
    (availableDaysAndTimes && availableDaysAndTimes.availableDays.length > 0) ||
    (excludedDaysOfWeek && excludedDaysOfWeek.length > 0) ||
    (excludedHours && excludedHours.length > 0);

  const daysOfTheWeekIndex = [0, 1, 2, 3, 4, 5, 6];

  const getTimesOfDay = (dayIndex: number) => {
    if (!availableDaysAndTimes) {
      return "--";
    }

    const dayInfo = availableDaysAndTimes.availableDays.find(
      (d) => d.dayIndex === dayIndex
    );
    return dayInfo
      ? dayInfo.timeRanges
          .map(({ start, end }) => `${start} - ${end}`)
          .join(", ")
      : "--";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-primary text-white p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">Restricciones del Cupón</h2>
            <p className="text-sm opacity-90">{storeName}</p>
            <p className="text-xs opacity-75 mt-1">{discountTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          {!hasAnyRestrictions ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Sin Restricciones
              </h3>
              <p className="text-sm text-muted-foreground">
                Este cupón se puede usar en cualquier momento sin condiciones
                especiales.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Discount-level auto-formatted restrictions */}
              {discountRestrictions ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-amber-900 mb-2">
                        Restricciones de Uso
                      </h3>
                      <p className="text-sm text-amber-700">
                        {discountRestrictions}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {availableDaysAndTimes
                ? daysOfTheWeekIndex.map((dayIndex) => {
                    const isExcluded =
                      availableDaysAndTimes.availableDays?.some(
                        (dayAndTime: AvailableDay) =>
                          dayAndTime.dayIndex === dayIndex
                      ) ?? false;
                    if (isExcluded) {
                      return (
                        <div
                          key={dayIndex}
                          className="bg-amber-50 border border-amber-200 rounded-xl p-4"
                        >
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <h3 className="text-sm font-semibold text-amber-900 mb-2">
                                Válido en {DAYS_OF_WEEK_BY_INDEX[dayIndex]}
                              </h3>
                              <p className="text-sm text-amber-700">
                                A las {getTimesOfDay(dayIndex) || "--"}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })
                : null}

              {/* Store-level custom restrictions */}
              {storeRestrictions ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-blue-900 mb-2">
                        Requisitos de la Tienda
                      </h3>
                      <p className="text-sm text-blue-700 whitespace-pre-wrap">
                        {storeRestrictions}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Detailed breakdown */}
              <div className="space-y-3">
                {/* Min Purchase */}
                {minPurchaseAmount ? (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Compra Mínima
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Se requiere un gasto mínimo de $
                        {minPurchaseAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Max Discount */}
                {maxDiscountAmount ? (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Descuento Máximo
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Hasta ${maxDiscountAmount.toFixed(2)} de límite de
                        descuento
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Additional Restrictions */}
                {additionalRestrictions && additionalRestrictions.length > 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          Restricciones Adicionales
                        </h3>
                        {additionalRestrictions.map((restriction, index) => (
                          <p key={index} className="text-sm text-gray-700">
                            &bull; {restriction}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:shadow-glow transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
