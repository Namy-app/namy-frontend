"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";

import { isCapacitorNative, navigateTo } from "@/lib/capacitor-navigate";

export function getStorePath(storeId: string, discountId?: string): string {
  const base = `/stores/${storeId}`;
  if (discountId) {
    return `${base}?discountId=${encodeURIComponent(discountId)}`;
  }
  return base;
}

type StoreNavLinkProps = PropsWithChildren<{
  storeId: string;
  discountId?: string;
  className?: string;
}>;

/**
 * Store detail navigation — Link on web, navigateTo placeholder shell on Capacitor.
 */
export function StoreNavLink({
  storeId,
  discountId,
  className,
  children,
}: StoreNavLinkProps): React.JSX.Element {
  const router = useRouter();
  const href = getStorePath(storeId, discountId);

  if (isCapacitorNative()) {
    return (
      <div
        role="link"
        tabIndex={0}
        className={className}
        onClick={() => navigateTo(href, router)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigateTo(href, router);
          }
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
