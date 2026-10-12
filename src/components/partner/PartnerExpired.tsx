"use client";

import { useState, useSyncExternalStore } from "react";

import { isInIframe } from "@/lib/partner";
import { usePartnerStore, type PartnerLang } from "@/store/usePartnerStore";

type FramePlacement = "unknown" | "iframe" | "top";

function subscribeFramePlacement(): () => void {
  return () => {};
}

function readFramePlacement(): FramePlacement {
  return isInIframe() ? "iframe" : "top";
}

const COPY: Record<
  PartnerLang,
  { title: string; button: string; reloading: string; fallback: string }
> = {
  en: {
    title: "Your session has expired",
    button: "Reload",
    reloading: "Reloading…",
    fallback: "Please reopen Promotions from the app.",
  },
  es: {
    title: "Tu sesión ha expirado",
    button: "Recargar",
    reloading: "Recargando…",
    fallback: "Vuelve a abrir Promociones desde la app.",
  },
};

export function PartnerExpired(): React.JSX.Element {
  const lang = usePartnerStore((state) => state.lang);
  const copy = lang === "es" ? COPY.es : COPY.en;
  const placement = useSyncExternalStore(
    subscribeFramePlacement,
    readFramePlacement,
    (): FramePlacement => "unknown"
  );
  const [reloading, setReloading] = useState(false);

  const handleReload = (): void => {
    const { parentOrigin, lastPath } = usePartnerStore.getState();
    window.parent.postMessage(
      { type: "namy:reauth", redirect: lastPath || "/explore" },
      parentOrigin || "*"
    );
    setReloading(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold text-neutral-900">{copy.title}</h1>
        {placement === "iframe" ? (
          <button
            type="button"
            onClick={handleReload}
            disabled={reloading}
            className="mt-6 rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white disabled:opacity-70"
          >
            {reloading ? copy.reloading : copy.button}
          </button>
        ) : null}
        {placement === "top" ? (
          <p className="mt-4 text-sm text-neutral-600">{copy.fallback}</p>
        ) : null}
      </div>
    </div>
  );
}
