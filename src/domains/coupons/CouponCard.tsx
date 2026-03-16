"use client";

import { QrCode, Clock, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import type { CouponItem } from "@/domains/coupon/type";

type Props = {
  coupon: CouponItem;
  discountPercentage: number;
  onViewQr: (c: CouponItem) => void;
  onShare: (c: CouponItem) => void;
  onDelete: (c: CouponItem) => void;
  onViewRestrictions?: (c: CouponItem) => void;
};

// Stable gradient palette cycled by coupon code hash
const GRADIENTS = [
  "from-[#FF0099] to-[#493240]",
  "from-[#11998E] to-[#38EF7D]",
  "from-[#8E2DE2] to-[#4A00E0]",
  "from-[#F97316]/60 to-[#F97316]",
];

function getGradient(code: string): string {
  const idx =
    code.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
    GRADIENTS.length;
  return GRADIENTS[idx]!;
}

function getTimeRemaining(
  expiresAt: string
): { h: number; m: number; s: number; totalMs: number } | null {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) {
    return null;
  }
  return {
    h: Math.floor(diff / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1000),
    totalMs: diff,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function CouponCard({
  coupon,
  discountPercentage,
  onViewQr,
}: Props): React.JSX.Element {
  const [countdown, setCountdown] = useState<string | null>(null);

  const expiresAtMs = new Date(coupon.expiresAt).getTime();
  const [isExpired] = useState(() => expiresAtMs < Date.now());
  const status = useMemo(() => {
    if (coupon.used) {
      return "redeemed";
    }
    if (isExpired) {
      return "expired";
    }
    return "active";
  }, [coupon.used, isExpired]);

  useEffect(() => {
    if (status !== "active") {
      return;
    }
    let timer: number | undefined;
    const update = (): void => {
      const t = getTimeRemaining(coupon.expiresAt);
      if (!t || t.totalMs > 48 * 3_600_000) {
        setCountdown(null);
        return;
      }
      setCountdown(`${pad(t.h)}:${pad(t.m)}:${pad(t.s)}`);
      timer = window.setTimeout(update, 1000);
    };
    update();
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [coupon.expiresAt, status]);

  const isActive = status === "active";
  const isRedeemed = status === "redeemed";

  const bgClass = isActive
    ? `bg-gradient-to-r ${getGradient(coupon.code)}`
    : "bg-gradient-to-r from-gray-400 to-gray-500";

  const storeImage = (coupon as { store?: { imageUrl?: string | null } }).store
    ?.imageUrl;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${bgClass} p-4 flex flex-col gap-3 shadow-md`}
    >
      {/* Top row: store image + discount + name */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-white/20">
          {storeImage ? (
            <Image
              src={storeImage}
              alt={coupon.store?.name ?? "Store"}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/60 text-3xl">
              🏪
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-3xl leading-none tracking-tight">
            {discountPercentage}% OFF
          </p>
          <p className="text-white/90 font-semibold text-base mt-1 truncate">
            {coupon.store?.name ?? "Tienda"}
          </p>
        </div>
      </div>

      {/* Bottom row: timer/status pill left, action right */}
      <div className="flex items-center justify-between gap-3">
        <div className="bg-white/20 rounded-full px-3 py-1.5 flex items-center gap-1.5">
          {isActive && countdown ? (
            <>
              <Clock className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-bold tabular-nums">
                {countdown}
              </span>
            </>
          ) : isRedeemed ? (
            <CheckCircle className="w-5 h-5 text-white" />
          ) : (
            <XCircle className="w-5 h-5 text-white" />
          )}
        </div>

        {isActive ? (
          <button
            onClick={() => onViewQr(coupon)}
            className="bg-white rounded-full px-4 py-1.5 flex items-center gap-1.5 font-semibold text-sm text-gray-800 hover:bg-white/90 transition-colors"
          >
            <QrCode className="w-4 h-4" />
            Ver QR
          </button>
        ) : null}
      </div>
    </div>
  );
}
