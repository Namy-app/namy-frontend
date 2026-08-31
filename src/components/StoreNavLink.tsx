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
  const isValidStoreId = Boolean(storeId && storeId !== "undefined");

  const handleNavigate = (): void => {
    if (!isValidStoreId) {
      return;
    }
    navigateTo(href, router);
  };

  if (isCapacitorNative()) {
    return (
      <div
        role="link"
        tabIndex={isValidStoreId ? 0 : -1}
        className={className}
        onClick={handleNavigate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNavigate();
          }
        }}
      >
        {children}
      </div>
    );
  }

  if (!isValidStoreId) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
