"use client";

import { useQuery } from "@tanstack/react-query";
import { Ticket, X, CalendarRange, CheckCircle, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import { DAYS_OF_WEEK_BY_INDEX } from "@/data/constants";
import type { AvailableDay } from "@/domains/admin";
import type { Coupon } from "@/domains/coupon/type";
import CouponCard from "@/domains/coupons/CouponCard";
import { RestrictionModal } from "@/domains/coupons/RestrictionModal";
import { BasicLayout } from "@/layouts/BasicLayout";
import { CouponDecoder, type DecodedCouponData } from "@/lib/coupon-decoder";
import { graphqlRequest, setAuthToken } from "@/lib/graphql-client";
import { COUPONS_QUERY } from "@/lib/graphql-queries";
import StatusCard from "@/shared/components/StatusCard/StatusCard";
import { useAuthStore } from "@/store/useAuthStore";

// ── QR modal sub-components ───────────────────────────────────────────────────

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function QrCountdown({ expiresAt }: { expiresAt: string }) {
  const calc = useCallback(() => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) {
      return null;
    }
    return {
      h: Math.floor(diff / 3_600_000),
      m: Math.floor((diff % 3_600_000) / 60_000),
      s: Math.floor((diff % 60_000) / 1000),
    };
  }, [expiresAt]);

  const [t, setT] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);

  if (!t) {
    return <p className="text-2xl font-black text-gray-400">Expirado</p>;
  }
  return (
    <p className="text-2xl font-black text-[#F1A151]">
      {pad(t.h)}:{pad(t.m)}:{pad(t.s)}
    </p>
  );
}

function QrRestrictions({
  coupon,
  decodedData,
}: {
  coupon: Coupon;
  decodedData: DecodedCouponData | null;
}) {
  const additionalRestrictions = coupon.discount?.additionalRestrictions ?? [];
  const storeRestrictions = coupon.store?.restrictions;
  const discountRestrictions =
    coupon.discount?.restrictions ?? decodedData?.discount?.restrictions;
  const availableDaysAndTimes = coupon.discount?.availableDaysAndTimes;

  const textRestrictions: string[] = [
    ...(storeRestrictions ? [storeRestrictions] : []),
    ...(discountRestrictions ? [discountRestrictions] : []),
    ...additionalRestrictions,
  ];

  const hasDays =
    availableDaysAndTimes && availableDaysAndTimes.availableDays.length > 0;

  if (textRestrictions.length === 0 && !hasDays) {
    return null;
  }

  return (
    <div>
      <h3 className="text-2xl font-black text-gray-900 mb-4">Restricciones</h3>
      <div className="space-y-3">
        {textRestrictions.map((r, i) => (
          <div key={i} className="flex items-start gap-3">
            <X className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
            <span className="text-base text-gray-700">{r}</span>
          </div>
        ))}

        {hasDays ? (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CalendarRange className="w-5 h-5 text-green-600 shrink-0" />
              <span className="text-base text-gray-700 font-semibold">
                Horarios disponibles
              </span>
            </div>
            <div className="pl-8 space-y-1">
              {availableDaysAndTimes!.availableDays.map(
                (d: AvailableDay, i: number) => (
                  <p key={i} className="text-base text-gray-700">
                    {DAYS_OF_WEEK_BY_INDEX[d.dayIndex]}:{" "}
                    {d.timeRanges
                      .map((r) => `${r.start} - ${r.end}`)
                      .join(", ")}
                  </p>
                )
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type CouponStatus = "active" | "redeemed" | "expired";

type FilterTab = "all" | CouponStatus;

export default function MyCouponsPage(): React.JSX.Element {
  const router = useRouter();
  const { isAuthenticated, accessToken, user } = useAuthStore();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [decodedData, setDecodedData] = useState<DecodedCouponData | null>(
    null
  );
  const [hydrated, setHydrated] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [restrictionModalOpen, setRestrictionModalOpen] = useState(false);
  const [restrictionCoupon, setRestrictionCoupon] = useState<Coupon | null>(
    null
  );

  // Helper function to get coupon status
  const getCouponStatus = (coupon: Coupon): CouponStatus => {
    if (coupon.used) {
      return "redeemed";
    }
    const now = new Date();
    const expiresAt = new Date(coupon.expiresAt);
    if (now > expiresAt) {
      return "expired";
    }
    return "active";
  };

  // Filter coupons based on active tab
  const filteredCoupons = coupons.filter((coupon) => {
    if (activeFilter === "all") {
      return true;
    }
    return getCouponStatus(coupon) === activeFilter;
  });

  // Handle hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Fetch user's coupons via react-query to enable client-side caching
  const filters: Record<string, unknown> = { includeExpired: true };
  if (user?.id) {
    filters.userId = user.id;
  }

  const {
    data: rawCoupons = [],
    isLoading: queryLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["coupons", { filters }],
    queryFn: async () => {
      // Ensure auth header is set for the graphql client
      setAuthToken(accessToken ?? null);
      const res = await graphqlRequest<{ myCoupons: Coupon[] }>(COUPONS_QUERY, {
        filters,
      });
      return res.myCoupons ?? [];
    },
    enabled: hydrated && isAuthenticated,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (queryError) {
      setError(
        queryError instanceof Error ? queryError.message : String(queryError)
      );
    }
  }, [queryError]);

  useEffect(() => {
    setLoading(queryLoading);
  }, [queryLoading]);

  useEffect(() => {
    if (rawCoupons && rawCoupons.length > 0) {
      const enriched = (rawCoupons || []).map((c) => ({
        ...c,
        store: c.store ?? null,
        discount: c.discount ?? null,
      }));

      // Only update if the length or content actually changed
      if (
        enriched.length !== coupons.length ||
        enriched.some((c, i) => c.id !== coupons[i]?.id)
      ) {
        setCoupons(enriched);
      }
    }
  }, [rawCoupons, coupons]);

  // Handle share
  const handleShare = async (coupon: Coupon): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mi Cupón",
          text: `Canjea este cupón: ${coupon.code}`,
          url: coupon.url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      void navigator.clipboard.writeText(coupon.url);
      alert("¡URL del cupón copiada al portapapeles!");
    }
  };

  // Handle delete
  const handleDelete = async (coupon: Coupon): Promise<void> => {
    const confirmDelete = confirm(
      `¿Estás seguro de que deseas eliminar el cupón ${coupon.code}?`
    );
    if (!confirmDelete) {
      return;
    }

    // TODO: Implement delete mutation
    alert("¡La funcionalidad de eliminación estará disponible próximamente!");
  };

  // Handle view QR code
  const handleViewQR = async (coupon: Coupon): Promise<void> => {
    setSelectedCoupon(coupon);

    // Decode the coupon URL to extract restrictions
    try {
      const urlParts = coupon.url.split("/redeem/");
      if (urlParts.length === 2 && urlParts[1]) {
        const encryptedData = urlParts[1];
        const decoded = await CouponDecoder.decodeAsync(encryptedData);
        setDecodedData(decoded);
      }
    } catch (err) {
      console.error("Failed to decode coupon:", err);
      setDecodedData(null);
    }
  };

  // Handle view restrictions
  const handleViewRestrictions = (coupon: Coupon): void => {
    setRestrictionCoupon(coupon);
    setRestrictionModalOpen(true);
  };

  // Count coupons by status
  const statusCounts = {
    all: coupons.length,
    active: coupons.filter((c) => getCouponStatus(c) === "active").length,
    redeemed: coupons.filter((c) => getCouponStatus(c) === "redeemed").length,
    expired: coupons.filter((c) => getCouponStatus(c) === "expired").length,
  };

  // Helper to get status badge
  // const getStatusBadge = (status: CouponStatus) => {
  //   switch (status) {
  //     case "active":
  //       return (
  //         <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
  //           <CheckCircle className="w-3 h-3" />
  //           <span className="text-xs font-semibold">Active</span>
  //         </div>
  //       );
  //     case "redeemed":
  //       return (
  //         <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
  //           <CheckCircle className="w-3 h-3" />
  //           <span className="text-xs font-semibold">Redeemed</span>
  //         </div>
  //       );
  //     case "expired":
  //       return (
  //         <div className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
  //           <Clock className="w-3 h-3" />
  //           <span className="text-xs font-semibold">Expired</span>
  //         </div>
  //       );
  //   }
  // };

  // Format discount value for display
  // const formatDiscount = (discount: any) => {
  //   if (!discount) return "";
  //   const t = String(discount.type ?? "").toLowerCase();
  //   if (t === "percentage" || t === "percent") return `${discount.value}% OFF`;
  //   if (t.includes("fixed") || t === "fixed") return `$${discount.value} OFF`;
  //   return `${discount.value} OFF`;
  // };

  // Loading state
  if (loading) {
    return (
      <BasicLayout className="bg-gradient-hero">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando tus cupones...</p>
          </div>
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout className="bg-gradient-hero">
      <div className="min-h-screen">
        {error ? (
          <StatusCard
            variant="error"
            title="¡Ups! Algo salió mal"
            message={error}
            primaryAction={{
              label: "Explorar Descuentos",
              onClick: () => router.push("/explore"),
            }}
          />
        ) : null}

        {coupons.length === 0 ? (
          <div className="pt-14 flex items-center justify-center p-8 min-h-[60vh]">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Ticket className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Aún no tienes cupones
              </h2>
              <p className="text-muted-foreground mb-6">
                ¡Explora descuentos y genera tu primer cupón!
              </p>
              <button
                onClick={() => router.push("/explore")}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:shadow-glow transition-all"
              >
                Explorar Descuentos
              </button>
            </div>
          </div>
        ) : (
          <div className="pb-20">
            {/* Page Title */}
            <div className="pt-16 pb-4 max-w-2xl mx-auto px-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">
                  Mis Cupones
                </h1>
                <div className="bg-primary/10 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-primary">
                    {filteredCoupons.length}{" "}
                    {filteredCoupons.length === 1 ? "Cupón" : "Cupones"}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 pb-4 max-w-2xl mx-auto">
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                    activeFilter === "all"
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-white text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Todos ({statusCounts.all})
                </button>
                <button
                  onClick={() => setActiveFilter("active")}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                    activeFilter === "active"
                      ? "bg-green-500 text-white shadow-glow"
                      : "bg-white text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Activos ({statusCounts.active})
                </button>
                <button
                  onClick={() => setActiveFilter("redeemed")}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                    activeFilter === "redeemed"
                      ? "bg-blue-500 text-white shadow-glow"
                      : "bg-white text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Canjeados ({statusCounts.redeemed})
                </button>
                <button
                  onClick={() => setActiveFilter("expired")}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                    activeFilter === "expired"
                      ? "bg-gray-500 text-white shadow-glow"
                      : "bg-white text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Expirados ({statusCounts.expired})
                </button>
              </div>
            </div>

            {/* Empty State - Filtered */}
            {filteredCoupons.length === 0 && coupons.length > 0 && (
              <div className="flex items-center justify-center p-8 min-h-[40vh]">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    {activeFilter === "active" && (
                      <CheckCircle className="w-10 h-10 text-muted-foreground" />
                    )}
                    {activeFilter === "redeemed" && (
                      <CheckCircle className="w-10 h-10 text-muted-foreground" />
                    )}
                    {activeFilter === "expired" && (
                      <Clock className="w-10 h-10 text-muted-foreground" />
                    )}
                    {activeFilter === "all" && (
                      <Ticket className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {activeFilter === "active" && "No hay cupones activos"}
                    {activeFilter === "redeemed" && "No hay cupones canjeados"}
                    {activeFilter === "expired" && "No hay cupones expirados"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {activeFilter === "active" &&
                      "No tienes cupones activos en este momento. ¡Genera nuevos cupones desde los descuentos disponibles!"}
                    {activeFilter === "redeemed" &&
                      "Aún no has canjeado ningún cupón. ¡Visita las tiendas y comienza a ahorrar!"}
                    {activeFilter === "expired" &&
                      "No se encontraron cupones expirados. ¡Tus cupones activos siguen siendo válidos!"}
                  </p>
                  <button
                    onClick={() => setActiveFilter("all")}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:shadow-glow transition-all"
                  >
                    Ver todos los cupones
                  </button>
                </div>
              </div>
            )}

            {/* Coupons List */}
            {filteredCoupons.length > 0 && (
              <div className="grid md:grid-cols-2 grid-cols-1  gap-4 px-4 pb-6 max-w-5xl mx-auto">
                {filteredCoupons.map((coupon, index) => (
                  <div
                    key={coupon.code}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    className="animate-slide-up"
                  >
                    <CouponCard
                      coupon={coupon}
                      discountPercentage={
                        (user?.isPremium
                          ? coupon.discount?.value
                          : coupon?.value) ?? 10
                      }
                      onViewQr={() => void handleViewQR(coupon)}
                      onShare={() => void handleShare(coupon)}
                      onDelete={() => void handleDelete(coupon)}
                      onViewRestrictions={() => handleViewRestrictions(coupon)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedCoupon ? (
          <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto animate-slide-up">
            {/* Fixed close button */}
            <button
              onClick={() => {
                setSelectedCoupon(null);
                setDecodedData(null);
              }}
              className="fixed top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md text-gray-500 hover:text-gray-800"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Centred content */}
            <div className="w-full max-w-md mx-auto px-4 pt-6 pb-16">
              {/* White QR card */}
              <div className="bg-white rounded-3xl shadow-sm p-6 mb-4">
                <p className="text-xs text-gray-400 mb-0.5">Negocio</p>
                <h2 className="text-2xl font-black text-[#F1A151] mb-5">
                  {selectedCoupon.store?.name ?? "Tienda"}
                </h2>

                {/* QR Code */}
                <div className="flex justify-center mb-6">
                  <Image
                    src={selectedCoupon.qrCode}
                    alt="Coupon QR Code"
                    width={260}
                    height={260}
                    className="object-contain"
                  />
                </div>

                {/* Timer + Discount */}
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      Tiempo restante
                    </p>
                    <QrCountdown expiresAt={selectedCoupon.expiresAt} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Descuento</p>
                    <p className="text-2xl font-black text-[#F1A151]">
                      {selectedCoupon.value ??
                        selectedCoupon.discount?.value ??
                        0}
                      % OFF
                    </p>
                  </div>
                </div>
              </div>

              {/* Help link */}
              <button
                onClick={() => {
                  if (typeof window !== "undefined" && window.$crisp) {
                    window.$crisp.push(["do", "chat:show"]);
                    window.$crisp.push(["do", "chat:open"]);
                  }
                }}
                className="w-full text-center text-sm font-semibold text-[#F1A151] mb-5 hover:underline"
              >
                ¿Problemas con tu descuento?
              </button>

              {/* Restrictions */}
              <QrRestrictions
                coupon={selectedCoupon}
                decodedData={decodedData}
              />
            </div>
          </div>
        ) : null}

        {/* Restriction Modal */}
        {restrictionCoupon ? (
          <RestrictionModal
            isOpen={restrictionModalOpen}
            onClose={() => {
              setRestrictionModalOpen(false);
              setRestrictionCoupon(null);
            }}
            storeName={restrictionCoupon.store?.name ?? "Tienda"}
            discountTitle={restrictionCoupon.discount?.title ?? "Descuento"}
            restrictions={{
              storeRestrictions: restrictionCoupon.store?.restrictions,
              discountRestrictions: restrictionCoupon.discount?.restrictions,
              minPurchaseAmount: restrictionCoupon.discount?.minPurchaseAmount,
              maxDiscountAmount: restrictionCoupon.discount?.maxDiscountAmount,
              availableDaysAndTimes:
                restrictionCoupon.discount?.availableDaysAndTimes ?? undefined,
              excludedDaysOfWeek:
                restrictionCoupon.discount?.excludedDaysOfWeek,
              excludedHours: restrictionCoupon.discount?.excludedHours,
              additionalRestrictions:
                restrictionCoupon.discount?.additionalRestrictions ?? [],
            }}
          />
        ) : null}
      </div>
    </BasicLayout>
  );
}
