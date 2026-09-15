"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Store,
  Ticket,
  X,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PortalBillingStatusDot } from "@/domains/portal/components/PortalBillingStatusBadge";
import {
  usePortalSwitchStore,
  useSelectedPortalStore,
} from "@/domains/portal/hooks";
import { usePortalAuthStore } from "@/domains/portal/store/portalAuthStore";
import { usePortalSelectedStoreStore } from "@/domains/portal/store/portalSelectedStoreStore";
import type { PortalStore } from "@/domains/portal/types";
import { formatStoreType } from "@/domains/portal/utils";
import { useToast } from "@/hooks/use-toast";
import { contentfulImageLoader } from "@/lib/image-utils";
import { extractErrorMessage, cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/portal/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Mis Cupones",
    href: "/portal/redemptions",
    icon: Ticket,
  },
  {
    label: "Mi Restaurante",
    href: "/portal/store",
    icon: Store,
  },
  {
    label: "Método de Pago",
    href: "/portal/payment",
    icon: CreditCard,
  },
] as const;

function isNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface PortalStorePickerProps {
  stores: PortalStore[];
  selectedStore: PortalStore;
  pickerOpen: boolean;
  isSwitching: boolean;
  onToggle: () => void;
  onPickStore: (store: PortalStore) => void;
}

function PortalStorePicker({
  stores,
  selectedStore,
  pickerOpen,
  isSwitching,
  onToggle,
  onPickStore,
}: PortalStorePickerProps): React.JSX.Element {
  return (
    <div
      data-portal-store-picker="true"
      className="relative px-5 py-3 border-b border-border/50 overflow-visible"
    >
      <p className="text-[11px] font-medium text-muted-foreground mb-1.5">
        Restaurante
      </p>
      <button
        type="button"
        onClick={onToggle}
        disabled={isSwitching}
        className="w-full flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-left hover:border-primary transition-colors disabled:opacity-70 disabled:cursor-wait"
        aria-expanded={pickerOpen}
        aria-busy={isSwitching}
      >
        <PortalBillingStatusDot store={selectedStore} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">
            {selectedStore.name}
          </p>
          {selectedStore.city ? (
            <p className="text-xs text-muted-foreground truncate">
              {selectedStore.city}
            </p>
          ) : null}
        </div>
        {isSwitching ? (
          <Loader2 className="w-4 h-4 text-primary shrink-0 animate-spin" />
        ) : (
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground shrink-0 transition-transform",
              pickerOpen ? "rotate-180" : ""
            )}
          />
        )}
      </button>
      {pickerOpen && !isSwitching ? (
        <div className="absolute left-full top-3 z-[70] pl-2">
          <div className="w-64 max-h-72 overflow-y-auto rounded-xl border border-border bg-card py-1 shadow-xl">
            {stores.map((store) => {
              const active = store.id === selectedStore.id;
              return (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => onPickStore(store)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 transition-colors",
                    active
                      ? "bg-muted"
                      : "hover:bg-primary/10 hover:text-foreground"
                  )}
                >
                  <p className="text-sm font-semibold text-foreground truncate">
                    {store.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {[store.city, formatStoreType(store.type)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface PortalShellProps {
  children: React.ReactNode;
}

export function PortalShell({ children }: PortalShellProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const owner = usePortalAuthStore((state) => state.owner);
  const switchStoreAuth = usePortalAuthStore((state) => state.switchStore);
  const clearPortalAuth = usePortalAuthStore((state) => state.clearPortalAuth);
  const setSelectedStoreId = usePortalSelectedStoreStore(
    (state) => state.setSelectedStoreId
  );
  const setIsSwitchingStore = usePortalSelectedStoreStore(
    (state) => state.setIsSwitchingStore
  );
  const isSwitchingStore = usePortalSelectedStoreStore(
    (state) => state.isSwitchingStore
  );
  const clearSelectedStore = usePortalSelectedStoreStore(
    (state) => state.clearSelectedStore
  );
  const { stores, selectedStore } = useSelectedPortalStore();
  const switchStoreMutation = usePortalSwitchStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (!pickerOpen) {
      return;
    }
    const onPointerDown = (event: MouseEvent): void => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-portal-store-picker]")) {
        return;
      }
      setPickerOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [pickerOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = (): void => {
    clearSelectedStore();
    clearPortalAuth();
    router.replace("/portal/login");
  };

  const handlePickStore = (store: PortalStore): void => {
    setPickerOpen(false);
    if (store.id === selectedStore?.id || isSwitchingStore) {
      return;
    }
    const previousStoreId = selectedStore?.id ?? null;
    setSelectedStoreId(store.id);
    setIsSwitchingStore(true);
    void (async () => {
      try {
        const result = await switchStoreMutation.mutateAsync({
          storeId: store.id,
        });
        switchStoreAuth(result.accessToken);
        await queryClient.invalidateQueries({ queryKey: ["portal"] });
        setMenuOpen(false);
      } catch (error) {
        if (previousStoreId) {
          setSelectedStoreId(previousStoreId);
        }
        const message =
          extractErrorMessage(error) || "No se pudo cambiar de restaurante";
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });
      } finally {
        setIsSwitchingStore(false);
      }
    })();
  };

  const navButtons = (opts: { onNavigate?: () => void; stacked: boolean }) =>
    NAV_ITEMS.map((item) => {
      const active = isNavActive(pathname, item.href);
      return (
        <button
          key={item.href}
          type="button"
          onClick={() => {
            router.push(item.href);
            opts.onNavigate?.();
          }}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors",
            opts.stacked ? "w-full text-left" : "",
            active
              ? "bg-primary text-primary-foreground shadow-glow"
              : "text-foreground/80 hover:bg-muted hover:text-foreground"
          )}
          aria-current={active ? "page" : undefined}
        >
          <item.icon className="w-5 h-5 shrink-0" />
          <span>{item.label}</span>
        </button>
      );
    });

  const renderBrand = (): React.JSX.Element => (
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
  );

  const renderStoreBlock = (): React.JSX.Element | null => {
    if (!selectedStore) {
      return null;
    }

    if (stores.length <= 1) {
      return (
        <div className="px-5 py-3 border-b border-border/50">
          <div className="flex items-center gap-2 min-w-0">
            <PortalBillingStatusDot store={selectedStore} />
            <p className="text-sm font-semibold text-foreground truncate">
              {selectedStore.name}
            </p>
          </div>
          {selectedStore.city ? (
            <p className="text-xs text-muted-foreground truncate mt-0.5 pl-4">
              {selectedStore.city}
            </p>
          ) : null}
        </div>
      );
    }

    return (
      <PortalStorePicker
        stores={stores}
        selectedStore={selectedStore}
        pickerOpen={pickerOpen}
        isSwitching={isSwitchingStore}
        onToggle={() => {
          if (isSwitchingStore) {
            return;
          }
          setPickerOpen((open) => !open);
        }}
        onPickStore={handlePickStore}
      />
    );
  };

  const renderSidebar = (): React.JSX.Element => (
    <>
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border/50">
        {renderBrand()}
      </div>
      {renderStoreBlock()}
      <nav className="flex-1 p-4 space-y-1.5">
        {navButtons({ stacked: true })}
      </nav>
      <div className="p-4 border-t border-border/50">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-hero lg:flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 h-screen overflow-visible z-30">
        {renderSidebar()}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
          <div className="flex items-center justify-between h-16 px-4 gap-3">
            {renderBrand()}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>

        <div
          className={cn(
            "lg:hidden fixed inset-0 z-40 transition-opacity",
            menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            className={cn(
              "absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-card shadow-xl flex flex-col overflow-visible transition-transform duration-300",
              menuOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            {renderSidebar()}
          </aside>
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
