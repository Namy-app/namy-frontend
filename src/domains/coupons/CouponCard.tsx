"use client";

import clsx from "clsx";
import { Share2, Trash2, QrCode, Copy, Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { CouponItem } from "@/domains/coupon/type";
import { useToast } from "@/hooks/use-toast";

import { useMyLevel } from "../user/hooks/query/useMyLevel";

type Props = {
  coupon: CouponItem;
  onViewQr: (c: CouponItem) => void;
  onShare: (c: CouponItem) => void;
  onDelete: (c: CouponItem) => void;
  onViewRestrictions?: (c: CouponItem) => void;
};

function formatDiscount(type?: string, value?: number): string {
  if (!type || value === undefined) {
    return "--";
  }
  const t = String(type ?? "").toLowerCase();
  if (t === "percentage" || t === "percent") {
    return `${value}% OFF`;
  }
  if (t.includes("fixed") || t === "fixed") {
    return `$${value} OFF`;
  }
  return `${value} OFF`;
}

function getTimeRemaining(
  expiresAt: string
): { hours: number; minutes: number; seconds: number; totalMs: number } | null {
  const now = new Date();
  const exp = new Date(expiresAt);
  const diff = exp.getTime() - now.getTime();
  if (diff <= 0) {
    return null;
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds, totalMs: diff };
}

export default function CouponCard({
  coupon,
  onViewQr,
  onShare,
  onDelete,
  onViewRestrictions,
}: Props): React.JSX.Element {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState<string | null>(null);
  const { data: myLevel } = useMyLevel();

  const status = useMemo(() => {
    if (coupon.used) {
      return "redeemed";
    }
    if (new Date() > new Date(coupon.expiresAt)) {
      return "expired";
    }
    return "active";
  }, [coupon]);
  const disableDelete = status === "redeemed" || status === "expired";

  // Check if any restrictions exist
  const hasRestrictions = useMemo(() => {
    return !!(
      coupon.store?.restrictions ||
      coupon.discount?.restrictions ||
      coupon.discount?.minPurchaseAmount ||
      coupon.discount?.maxDiscountAmount ||
      (coupon.discount?.additionalRestrictions &&
        coupon.discount.additionalRestrictions.length > 0) ||
      (coupon.discount?.availableDaysAndTimes &&
        coupon.discount.availableDaysAndTimes.availableDays.length > 0) ||
      (coupon.discount?.excludedDaysOfWeek &&
        coupon.discount.excludedDaysOfWeek.length > 0) ||
      (coupon.discount?.excludedHours &&
        coupon.discount.excludedHours.length > 0)
    );
  }, [coupon]);

  useEffect(() => {
    // Only run countdown when coupon is active
    if (status !== "active") {
      // Clear asynchronously to avoid synchronous setState inside effect
      setTimeout(() => setCountdown(null), 0);
      return;
    }

    let timer: number | undefined;
    const update = (): void => {
      const t = getTimeRemaining(coupon.expiresAt);
      if (!t) {
        setCountdown(null);
        return;
      }
      if (t.totalMs <= 48 * 60 * 60 * 1000) {
        setCountdown(`${t.hours}h ${t.minutes}m ${t.seconds}s`);
        timer = window.setTimeout(update, 1000);
      } else {
        setCountdown(null);
      }
    };
    update();
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [coupon.expiresAt, status]);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      toast({
        title: "Copiado",
        description: "Código del cupón copiado al portapapeles.",
      });
    } catch (_e) {
      toast({ title: "Error", description: "No se pudo copiar." });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 animate-slide-up">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Código del Cupón</p>
              <p className="text-2xl font-bold font-mono tracking-wider text-foreground truncate">
                {coupon.code}
              </p>

              {/* store name and discount title */}
              <div className="mt-2">
                <p className="text-sm text-muted-foreground truncate">
                  {coupon.store?.name ?? "Tienda"}
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  {coupon.discount?.title ?? "Descuento"}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  status === "active"
                    ? "bg-green-100 text-green-700"
                    : status === "redeemed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {status === "active"
                  ? "Activo"
                  : status === "redeemed"
                    ? "Canjeado"
                    : "Expirado"}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="inline-flex items-center gap-2">
                ⏰{" "}
                {status === "active"
                  ? `Expira el ${new Date(coupon.expiresAt).toLocaleDateString()}`
                  : status === "expired"
                    ? `Expiró el ${new Date(coupon.expiresAt).toLocaleDateString()}`
                    : coupon.usedAt
                      ? `Canjeado el ${new Date(coupon.usedAt).toLocaleDateString()}`
                      : ""}
              </span>
              {countdown ? (
                <span className="ml-2 text-sm text-destructive font-medium">
                  {countdown}
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              {coupon.discount ? (
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold whitespace-nowrap">
                  {formatDiscount(
                    coupon.discount.type,
                    myLevel?.discountPercentage
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Description / Actions */}
      <div className="mt-4">
        {/* Restrictions Link */}
        {hasRestrictions && onViewRestrictions ? (
          <button
            onClick={() => void onViewRestrictions(coupon)}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 transition-colors mb-3"
          >
            <Info className="w-4 h-4" />
            Ver Restricciones
          </button>
        ) : null}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => void onViewQr(coupon)}
            className="px-8 py-3 bg-gradient-primary text-primary-foreground rounded-full font-semibold flex items-center gap-2 text-xs md:text-base"
          >
            <QrCode className="w-5 h-5" />
            <span className="hidden md:inline-block">Ver QR</span>
          </button>

          <button
            onClick={() => void onShare(coupon)}
            className="p-3 rounded-xl bg-secondary/10 text-secondary-foreground"
            aria-label="share"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => void handleCopy()}
            className="p-3 rounded-xl bg-muted text-foreground"
            aria-label="copy"
          >
            <Copy className="w-5 h-5" />
          </button>

          <button
            onClick={() => void onDelete(coupon)}
            className={clsx(
              "p-3 rounded-xl bg-destructive/10 text-destructive",
              disableDelete ? "opacity-30 cursor-not-allowed" : ""
            )}
            aria-label="delete"
            disabled={disableDelete}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
