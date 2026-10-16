"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

import { usePartnerConfig, usePartnerHydrated } from "@/store/usePartnerStore";

export function GoogleAdsense(): React.JSX.Element {
  const pathname = usePathname();
  const partner = usePartnerConfig();
  const hydrated = usePartnerHydrated();
  const adsenseClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;

  if (!hydrated || pathname?.startsWith("/partner") || partner?.adsDisabled) {
    return <></>;
  }

  if (!adsenseClientId) {
    console.warn(
      "Google AdSense client ID is not configured. Please add NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID to your .env.local"
    );
    return <></>;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
