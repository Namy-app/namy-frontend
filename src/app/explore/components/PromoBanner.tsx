"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { navigateTo } from "@/lib/capacitor-navigate";

export interface PromoBannerData {
  title: string;
  body: string;
  imageUrl?: string;
  deepLink?: string;
  expiresAt?: string;
  /** Novu inbox message id — used to mark read when the user dismisses. */
  novuMessageId?: string;
  type: "promo_banner";
}

interface PromoBannerProps {
  promo: PromoBannerData;
  onClose: () => void;
}

const FOOD_PLACEHOLDERS: [string, string, string] = [
  "/img/placeholders/placeholder-restaurant.jpg",
  "/img/placeholders/placeholder-shop.jpg",
  "/img/placeholders/placeholder-restaurant.jpg",
];

export function PromoBanner({
  promo,
  onClose,
}: PromoBannerProps): React.JSX.Element | null {
  const router = useRouter();

  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return null;
  }

  const handleCta = (): void => {
    onClose();
    if (promo.deepLink?.startsWith("/")) {
      navigateTo(promo.deepLink, router);
    }
  };

  const images: [string, string, string] = promo.imageUrl
    ? [promo.imageUrl, promo.imageUrl, promo.imageUrl]
    : FOOD_PLACEHOLDERS;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xs overflow-hidden rounded-2xl shadow-2xl"
        style={{ background: "#fdf0dc" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button — inside top-right of card, not overlapping content */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow"
        >
          <X className="h-3 w-3 text-gray-500" />
        </button>

        {/* ── TOP: Text content ── */}
        <div className="px-5 pt-5 pb-2 text-center">
          <p className="mb-0.5 text-[10px] font-extrabold uppercase tracking-widest text-orange-500">
            {promo.title}
          </p>
          <h2 className="text-lg font-extrabold leading-snug text-gray-900">
            {promo.body}
          </h2>
        </div>

        {/* ── MIDDLE: Illustration + food circles ── */}
        <div
          className="relative overflow-hidden mx-3 my-2 rounded-xl"
          style={{ height: 160, background: "#fde8c4" }}
        >
          {/* City silhouette */}
          <svg
            viewBox="0 0 400 160"
            className="absolute bottom-0 left-0 w-full"
            style={{ opacity: 0.15 }}
            preserveAspectRatio="xMidYMax meet"
          >
            <rect x="10" y="80" width="30" height="80" fill="#c8813a" />
            <rect x="15" y="60" width="20" height="20" fill="#c8813a" />
            <rect x="50" y="60" width="40" height="100" fill="#c8813a" />
            <rect x="100" y="40" width="50" height="120" fill="#c8813a" />
            <rect x="110" y="25" width="30" height="18" fill="#c8813a" />
            <rect x="160" y="70" width="35" height="90" fill="#c8813a" />
            <rect x="205" y="50" width="45" height="110" fill="#c8813a" />
            <rect x="260" y="75" width="30" height="85" fill="#c8813a" />
            <rect x="300" y="55" width="40" height="105" fill="#c8813a" />
            <rect x="350" y="80" width="30" height="80" fill="#c8813a" />
          </svg>

          {/* Location pin */}
          <div className="absolute right-6 top-2">
            <svg width="20" height="26" viewBox="0 0 32 40" fill="none">
              <path
                d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z"
                fill="#f97316"
              />
              <circle cx="16" cy="16" r="6" fill="white" />
            </svg>
          </div>

          {/* Dotted path */}
          <svg
            className="absolute right-4 top-5 w-10 h-10"
            viewBox="0 0 60 60"
            fill="none"
          >
            <path
              d="M50 5 Q30 20 10 50"
              stroke="#f97316"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
          </svg>

          {/* Leaf decorations */}
          <svg
            className="absolute left-1 bottom-10 w-7 h-7"
            viewBox="0 0 40 40"
            fill="none"
          >
            <ellipse
              cx="20"
              cy="20"
              rx="12"
              ry="18"
              fill="#7cb87a"
              transform="rotate(-30 20 20)"
            />
            <line
              x1="20"
              y1="5"
              x2="20"
              y2="35"
              stroke="#5a9a58"
              strokeWidth="1.5"
            />
          </svg>
          <svg
            className="absolute right-2 bottom-10 w-6 h-6"
            viewBox="0 0 40 40"
            fill="none"
          >
            <ellipse
              cx="20"
              cy="20"
              rx="10"
              ry="16"
              fill="#7cb87a"
              transform="rotate(15 20 20)"
            />
          </svg>

          {/* Three food circles */}
          <div className="absolute bottom-2 left-0 right-0 flex items-end justify-center gap-2 px-4">
            <div
              className="relative overflow-hidden rounded-full border-2 border-white shadow-md"
              style={{ width: 60, height: 60, flexShrink: 0 }}
            >
              <Image
                src={images[0]}
                alt="food"
                fill
                className="object-cover"
                sizes="60px"
              />
            </div>
            <div
              className="relative overflow-hidden rounded-full border-2 border-white shadow-lg"
              style={{ width: 80, height: 80, flexShrink: 0, marginBottom: 8 }}
            >
              <Image
                src={images[1]}
                alt="food"
                fill
                className="object-cover scale-110"
                sizes="80px"
              />
            </div>
            <div
              className="relative overflow-hidden rounded-full border-2 border-white shadow-md"
              style={{ width: 60, height: 60, flexShrink: 0 }}
            >
              <Image
                src={images[2]}
                alt="food"
                fill
                className="object-cover"
                sizes="60px"
              />
            </div>
          </div>
        </div>

        {/* ── BOTTOM: CTA ── */}
        <div className="px-5 pb-5 pt-1">
          <button
            onClick={handleCta}
            className="w-full rounded-full py-3 text-sm font-bold text-white shadow-md transition-opacity active:scale-95"
            style={{ background: "#f97316" }}
          >
            Descubrir ahora
          </button>
          <button
            onClick={onClose}
            className="mt-2 w-full text-xs text-gray-400"
          >
            No, gracias
          </button>
        </div>
      </div>
    </div>
  );
}
