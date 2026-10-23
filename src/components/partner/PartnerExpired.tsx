"use client";

import { useState, useSyncExternalStore } from "react";

import { trackPartnerJourney } from "@/lib/analytics/trackPartnerJourney";
import { useAppTranslation } from "@/lib/i18n/useAppTranslation";
import { isInIframe } from "@/lib/partner";
import { usePartnerStore } from "@/store/usePartnerStore";

type FramePlacement = "unknown" | "iframe" | "top";

function subscribeFramePlacement(): () => void {
  return () => {};
}

function readFramePlacement(): FramePlacement {
  return isInIframe() ? "iframe" : "top";
}

export function PartnerExpired(): React.JSX.Element {
  const { t } = useAppTranslation(true);
  const placement = useSyncExternalStore(
    subscribeFramePlacement,
    readFramePlacement,
    (): FramePlacement => "unknown"
  );
  const [reloading, setReloading] = useState(false);

  const handleReload = (): void => {
    const { parentOrigin, lastPath } = usePartnerStore.getState();
    trackPartnerJourney("reauth_requested");
    window.parent.postMessage(
      { type: "namy:reauth", redirect: lastPath || "/explore" },
      parentOrigin || "*"
    );
    setReloading(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold text-neutral-900">
          {t("ui.session_expired")}
        </h1>
        {placement === "iframe" ? (
          <button
            type="button"
            onClick={handleReload}
            disabled={reloading}
            className="mt-6 rounded-lg bg-[var(--partner-primary,#03378D)] px-6 py-3 text-sm font-medium text-white disabled:opacity-70"
          >
            {reloading ? t("ui.reloading") : t("ui.reload")}
          </button>
        ) : null}
        {placement === "top" ? (
          <p className="mt-4 text-sm text-neutral-600">
            {t("ui.reopen_promotions")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
