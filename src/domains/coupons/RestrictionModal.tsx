"use client";

import {
  X,
  Clock,
  DollarSign,
  Calendar,
  AlertCircle,
  Info,
} from "lucide-react";

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
  };
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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
    excludedDaysOfWeek,
    excludedHours,
  } = restrictions;

  // Format excluded days
  const formatExcludedDays = () => {
    if (!excludedDaysOfWeek || excludedDaysOfWeek.length === 0) {
      return null;
    }

    const availableDays = [0, 1, 2, 3, 4, 5, 6].filter(
      (day) => !excludedDaysOfWeek.includes(day)
    );

    if (availableDays.length === 0) {
      return "Not valid on any day";
    }

    // Check if consecutive
    const isConsecutive = availableDays.every((day, i) => {
      if (i === 0) {
        return true;
      }
      const prevDay = availableDays[i - 1];
      return prevDay !== undefined && day === prevDay + 1;
    });

    const firstDay = availableDays[0];
    const lastDay = availableDays[availableDays.length - 1];

    if (
      isConsecutive &&
      availableDays.length > 1 &&
      typeof firstDay === "number" &&
      typeof lastDay === "number"
    ) {
      return `Valid ${DAY_NAMES[firstDay]} to ${DAY_NAMES[lastDay]}`;
    } else if (availableDays.length === 1 && typeof firstDay === "number") {
      return `Valid on ${DAY_NAMES[firstDay]} only`;
    } else {
      return `Valid on ${availableDays.map((d) => DAY_NAMES[d]).join(", ")}`;
    }
  };

  // Format excluded hours
  const formatExcludedHours = () => {
    if (!excludedHours || excludedHours.length === 0) {
      return null;
    }

    const availableHours = Array.from({ length: 24 }, (_, i) => i).filter(
      (hour) => !excludedHours.includes(hour)
    );

    if (availableHours.length === 0) {
      return "Not valid at any time";
    }

    const minHour = Math.min(...availableHours);
    const maxHour = Math.max(...availableHours);

    const formatHour = (hour: number) => {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour} ${period}`;
    };

    if (minHour === 0 && maxHour === 23) {
      return "Valid all day";
    } else if (maxHour === 23) {
      return `Valid after ${formatHour(minHour)}`;
    } else if (minHour === 0) {
      return `Valid before ${formatHour(maxHour + 1)}`;
    } else {
      return `Valid ${formatHour(minHour)} to ${formatHour(maxHour + 1)}`;
    }
  };

  const hasAnyRestrictions =
    storeRestrictions ||
    discountRestrictions ||
    minPurchaseAmount ||
    maxDiscountAmount ||
    (excludedDaysOfWeek && excludedDaysOfWeek.length > 0) ||
    (excludedHours && excludedHours.length > 0);

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
            <h2 className="text-2xl font-bold mb-1">Coupon Restrictions</h2>
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
                No Restrictions
              </h3>
              <p className="text-sm text-muted-foreground">
                This coupon can be used anytime without special conditions.
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
                        Usage Restrictions
                      </h3>
                      <p className="text-sm text-amber-700">
                        {discountRestrictions}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Store-level custom restrictions */}
              {storeRestrictions ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-blue-900 mb-2">
                        Store Requirements
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
                        Minimum Purchase
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${minPurchaseAmount.toFixed(2)} minimum spend required
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
                        Maximum Discount
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Up to ${maxDiscountAmount.toFixed(2)} discount limit
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Valid Days */}
                {formatExcludedDays() && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Valid Days
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatExcludedDays()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Valid Hours */}
                {formatExcludedHours() && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Valid Hours
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatExcludedHours()}
                      </p>
                    </div>
                  </div>
                )}
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
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
