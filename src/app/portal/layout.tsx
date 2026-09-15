"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PortalShell } from "@/domains/portal/components/PortalShell";
import { usePortalAuthStore } from "@/domains/portal/store/portalAuthStore";
import { usePortalSelectedStoreStore } from "@/domains/portal/store/portalSelectedStoreStore";
import { contentfulImageLoader } from "@/lib/image-utils";

const LOGIN_PATH = "/portal/login";
const CHANGE_PASSWORD_PATH = "/portal/change-password";
const DASHBOARD_PATH = "/portal/dashboard";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, owner, clearPortalAuth } = usePortalAuthStore();
  const clearSelectedStore = usePortalSelectedStoreStore(
    (state) => state.clearSelectedStore
  );
  const [isHydrated, setIsHydrated] = useState(() =>
    usePortalAuthStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (isHydrated) {
      return;
    }
    const unsub = usePortalAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    if (usePortalAuthStore.persist.hasHydrated()) {
      setTimeout(() => setIsHydrated(true), 0);
    }
    return unsub;
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const isLogin = pathname === LOGIN_PATH;
    const isChangePassword = pathname === CHANGE_PASSWORD_PATH;
    const mustChangePassword = Boolean(owner?.mustChangePassword);

    if (!isAuthenticated) {
      if (!isLogin) {
        router.replace(LOGIN_PATH);
      }
      return;
    }

    if (isLogin) {
      router.replace(
        mustChangePassword ? CHANGE_PASSWORD_PATH : DASHBOARD_PATH
      );
      return;
    }

    if (mustChangePassword && !isChangePassword) {
      router.replace(CHANGE_PASSWORD_PATH);
      return;
    }

    if (!mustChangePassword && isChangePassword) {
      router.replace(DASHBOARD_PATH);
    }
  }, [
    isHydrated,
    isAuthenticated,
    owner?.mustChangePassword,
    pathname,
    router,
  ]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const isLogin = pathname === LOGIN_PATH;
  const isChangePassword = pathname === CHANGE_PASSWORD_PATH;

  if (!isAuthenticated && !isLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (isAuthenticated && !isLogin && !isChangePassword) {
    return <PortalShell>{children}</PortalShell>;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {isAuthenticated && isChangePassword ? (
        <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Image
                  loader={contentfulImageLoader}
                  src="/namy-logo.webp"
                  alt="Ñamy"
                  width={36}
                  height={36}
                  className="rounded-xl shadow-lg shrink-0"
                  priority
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    Portal de Restaurantes
                  </p>
                  {owner?.email ? (
                    <p className="text-xs text-muted-foreground truncate">
                      {owner.email}
                    </p>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  clearSelectedStore();
                  clearPortalAuth();
                  router.replace(LOGIN_PATH);
                }}
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted transition-colors shrink-0"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>
      ) : null}
      <main>{children}</main>
    </div>
  );
}
