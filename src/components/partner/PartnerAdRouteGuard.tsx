"use client";

import { useRouter } from "next/navigation";
import { useEffect, type PropsWithChildren } from "react";

import { usePartnerConfig, usePartnerHydrated } from "@/store/usePartnerStore";

/** Do not mount video-ad queries on legacy unlock routes for ad-free sessions. */
export function PartnerAdRouteGuard({
  children,
}: PropsWithChildren): React.JSX.Element | null {
  const router = useRouter();
  const partner = usePartnerConfig();
  const hydrated = usePartnerHydrated();
  const adsDisabled = partner?.adsDisabled === true;

  useEffect(() => {
    if (hydrated && adsDisabled) {
      router.replace("/explore");
    }
  }, [hydrated, adsDisabled, router]);

  return hydrated && !adsDisabled ? <>{children}</> : null;
}
