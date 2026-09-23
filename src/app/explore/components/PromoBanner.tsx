"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { analytics } from "@/lib/analytics";
import { navigateTo } from "@/lib/capacitor-navigate";

export type BannerNotificationType =
  | "promo_banner"
  | "prize_won"
  | "prize_expiry";

export interface PromoBannerData {
  title: string;
  body: string;
  imageUrl?: string;
  storeImages?: string[];
  deepLink?: string;
  expiresAt?: string;
  /** Novu inbox message id — used to mark read when the user dismisses. */
  novuMessageId?: string;
  type: BannerNotificationType;
}

interface PromoBannerProps {
  promo: PromoBannerData;
  onClose: () => void;
}

const FOOD_PLACEHOLDER = "/img/placeholders/placeholder-restaurant.jpg";

export function PromoBanner({
  promo,
  onClose,
}: PromoBannerProps): React.JSX.Element | null {
  const router = useRouter();

  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return null;
  }

  const isPrize = promo.type === "prize_won" || promo.type === "prize_expiry";

  const handleCta = (): void => {
    analytics.track("promo_banner_clicked", {
      ...(promo.novuMessageId ? { novu_message_id: promo.novuMessageId } : {}),
      ...(promo.deepLink ? { deep_link: promo.deepLink } : {}),
      banner_type: promo.type,
    });
    onClose();
    if (promo.deepLink?.startsWith("/")) {
      navigateTo(promo.deepLink, router);
    }
  };

  const imageSrc = promo.imageUrl?.trim() || FOOD_PLACEHOLDER;
  const ctaLabel = isPrize
    ? promo.type === "prize_expiry"
      ? "Ver mi cupón"
      : "Ver mi premio"
    : "Descubrir ahora";

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
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow"
        >
          <X className="h-3 w-3 text-gray-500" />
        </button>

        <div className="px-5 pt-5 pb-2 text-center">
          <p className="mb-0.5 text-[10px] font-extrabold uppercase tracking-widest text-orange-500">
            {promo.title}
          </p>
          <h2 className="text-lg font-extrabold leading-snug text-gray-900">
            {promo.body}
          </h2>
        </div>

        <div className="relative mx-3 my-2 aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 320px) 90vw, 320px"
          />
        </div>

        <div className="px-5 pb-5 pt-1">
          <button
            onClick={handleCta}
            className="w-full rounded-full py-3 text-sm font-bold text-white shadow-md transition-opacity active:scale-95"
            style={{ background: "#f97316" }}
          >
            {ctaLabel}
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
