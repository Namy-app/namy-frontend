"use client";

import { Share2, Trash2, QrCode, Copy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useToast } from "@/hooks/use-toast";

type Coupon = {
  code: string;
  used?: boolean;
  expiresAt: string;
  usedAt?: string;
  store?: { name?: string } | null;
  discount?: { title?: string; type?: string; value?: number } | null;
};

type Props = {
  coupon: Coupon;
  onViewQr: (c: Coupon) => void;
  onShare: (c: Coupon) => void;
  onDelete: (c: Coupon) => void;
};

function formatDiscount(
  discount: { type?: string; value?: number } | null
): string {
  if (!discount) {
    return "";
  }
  const t = String(discount.type ?? "").toLowerCase();
  if (t === "percentage" || t === "percent") {
    return `${discount.value}% OFF`;
  }
  if (t.includes("fixed") || t === "fixed") {
    return `$${discount.value} OFF`;
  }
  return `${discount.value} OFF`;
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
}: Props): React.JSX.Element {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState<string | null>(null);

  const status = useMemo(() => {
    if (coupon.used) {
      return "redeemed";
    }
    if (new Date() > new Date(coupon.expiresAt)) {
      return "expired";
    }
    return "active";
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
        title: "Copied",
        description: "Coupon code copied to clipboard.",
      });
    } catch (_e) {
      toast({ title: "Error", description: "Unable to copy." });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 animate-slide-up">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Coupon Code</p>
              <p className="text-2xl font-bold font-mono tracking-wider text-foreground truncate">
                {coupon.code}
              </p>

              {/* store name and discount title */}
              <div className="mt-2">
                <p className="text-sm text-muted-foreground truncate">
                  {coupon.store?.name ?? "Store"}
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  {coupon.discount?.title ?? "Discount"}
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
                  ? "Active"
                  : status === "redeemed"
                    ? "Redeemed"
                    : "Expired"}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="inline-flex items-center gap-2">
                ⏰{" "}
                {status === "active"
                  ? `Expires on ${new Date(coupon.expiresAt).toLocaleDateString()}`
                  : status === "expired"
                    ? `Expired on ${new Date(coupon.expiresAt).toLocaleDateString()}`
                    : coupon.usedAt
                      ? `Redeemed on ${new Date(coupon.usedAt).toLocaleDateString()}`
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
                  {formatDiscount(coupon.discount)}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Description / Actions */}
      <div className="flex items-center justify-between mt-4 gap-3">
        {/* <div className="text-sm text-muted-foreground truncate">
          {coupon.discount?.description ?? ""}
        </div> */}

        <div className="flex items-center gap-3">
          <button
            onClick={() => void onViewQr(coupon)}
            className="px-8 py-3 bg-gradient-primary text-primary-foreground rounded-full font-semibold flex items-center gap-2"
          >
            <QrCode className="w-5 h-5" /> View QR
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
            className="p-3 rounded-xl bg-destructive/10 text-destructive"
            aria-label="delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
