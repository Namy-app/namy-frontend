"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";

import { isCapacitorNative, navigateTo } from "@/lib/capacitor-navigate";

export function getStorePath(storeId: string): string {
  return `/stores/${storeId}`;
}

type StoreNavLinkProps = PropsWithChildren<{
  storeId: string;
  className?: string;
}>;

/**
 * Store detail navigation — Link on web, navigateTo placeholder shell on Capacitor.
 */
export function StoreNavLink({
  storeId,
  className,
  children,
}: StoreNavLinkProps): React.JSX.Element {
  const router = useRouter();
  const href = getStorePath(storeId);

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
