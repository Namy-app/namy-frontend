"use client";

import { Ticket, Share2, CheckCircle, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BottomNavigation } from "@/app/explore/components/BottomNavigation";
import { ExploreHeader } from "@/app/explore/components/ExploreHeader";
import CouponCard from "@/domains/coupons/CouponCard";
import {
  MY_COUPONS_QUERY,
  GET_STORE_FOR_REDEEM_QUERY,
  GET_DISCOUNT_BY_ID_QUERY,
} from "@/lib/graphql-queries";
import StatusCard from "@/shared/components/StatusCard/StatusCard";
import { useAuthStore } from "@/store/useAuthStore";

interface Coupon {
  id: string;
  code: string;
  qrCode: string;
  url: string;
  used: boolean;
  usedAt?: string;
  expiresAt: string;
  createdAt: string;
  storeId: string;
  discountId: string;
  // populated client-side
  store?: Record<string, unknown> | null;
  discount?: Record<string, unknown> | null;
}

type CouponStatus = "active" | "redeemed" | "expired";

type FilterTab = "all" | CouponStatus;

export default function MyCouponsPage(): React.JSX.Element {
  const router = useRouter();
  const { isAuthenticated, accessToken } = useAuthStore();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

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

  // Fetch user's coupons
  useEffect(() => {
    // Wait for hydration before checking auth
    if (!hydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    const fetchCoupons = async (): Promise<void> => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            query: MY_COUPONS_QUERY,
            variables: {}, // Removed filter to show all coupons
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const rawCoupons = (result.data.myCoupons ?? []) as unknown as Coupon[];

        // Helper to fetch store and discount for a coupon
        const fetchStore = async (
          storeId: string
        ): Promise<Record<string, unknown> | null> => {
          try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                query: GET_STORE_FOR_REDEEM_QUERY,
                variables: { id: storeId },
              }),
            });
            const j = await res.json();
            return j.data?.store ?? null;
          } catch (e) {
            console.warn("Failed to fetch store", e);
            return null;
          }
        };

        const fetchDiscount = async (
          discountId: string
        ): Promise<Record<string, unknown> | null> => {
          try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                query: GET_DISCOUNT_BY_ID_QUERY,
                variables: { id: discountId },
              }),
            });
            const j = await res.json();
            return j.data?.discount ?? null;
          } catch (e) {
            console.warn("Failed to fetch discount", e);
            return null;
          }
        };

        // Enrich coupons with store & discount details in parallel
        const enriched = await Promise.all(
          rawCoupons.map(async (c) => {
            const [store, discount] = await Promise.all([
              c.storeId ? fetchStore(c.storeId) : null,
              c.discountId ? fetchDiscount(c.discountId) : null,
            ]);
            return { ...c, store, discount } as Coupon;
          })
        );

        setCoupons(enriched);
      } catch (err) {
        console.error("Error fetching coupons:", err);
        setError(err instanceof Error ? err.message : "Failed to load coupons");
      } finally {
        setLoading(false);
      }
    };

    void fetchCoupons();
  }, [hydrated, isAuthenticated, accessToken, router]);

  // Handle share
  const handleShare = async (coupon: Coupon): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Coupon",
          text: `Redeem this coupon: ${coupon.code}`,
          url: coupon.url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      void navigator.clipboard.writeText(coupon.url);
      alert("Coupon URL copied to clipboard!");
    }
  };

  // Handle delete
  const handleDelete = async (coupon: Coupon): Promise<void> => {
    const confirmDelete = confirm(
      `Are you sure you want to delete coupon ${coupon.code}?`
    );
    if (!confirmDelete) {
      return;
    }

    // TODO: Implement delete mutation
    alert("Delete functionality coming soon!");
  };

  // Handle view QR code
  const handleViewQR = (coupon: Coupon): void => {
    setSelectedCoupon(coupon);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero pb-20">
        <ExploreHeader isAuthenticated={isAuthenticated} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your coupons...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Error state - centralized StatusCard
  if (error) {
    return (
      <>
        <ExploreHeader isAuthenticated={isAuthenticated} />
        <div className="min-h-screen">
          <StatusCard
            variant="error"
            title="Oops! Something went wrong"
            message={error}
            primaryAction={{
              label: "Browse Discounts",
              onClick: () => router.push("/explore"),
            }}
          />
          <BottomNavigation />
        </div>
      </>
    );
  }

  // QR Code Modal (fixed overlay, vertically centered)
  if (selectedCoupon) {
    return (
      <div className="min-h-screen bg-gradient-hero pb-20">
        <ExploreHeader isAuthenticated={isAuthenticated} />

        {/* Fixed overlay centered modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop - clicking closes modal */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedCoupon(null)}
          />

          <div className="relative z-10 bg-white rounded-2xl shadow-card p-8 w-full max-w-md animate-slide-up">
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-2xl font-bold text-foreground">
                Your QR Code
              </h2>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-2xl shadow-glow qr-glow">
                <Image
                  src={selectedCoupon.qrCode}
                  alt="Coupon QR Code"
                  width={256}
                  height={256}
                  className="w-64 h-64 object-contain"
                />
              </div>

              {/* Coupon Code */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Coupon Code
                </p>
                <p className="text-3xl font-bold font-mono tracking-wider text-foreground">
                  {selectedCoupon.code}
                </p>
              </div>

              {/* Help Text */}
              <p className="text-sm text-muted-foreground text-center">
                Show this QR code at the store to redeem your discount
              </p>

              {/* Actions */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => void handleShare(selectedCoupon!)}
                  className="flex-1 py-3 px-4 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={() => setSelectedCoupon(null)}
                  className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  // Empty state
  if (coupons.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero pb-20">
        <ExploreHeader isAuthenticated={isAuthenticated} />

        {/* Empty State */}
        <div className="pt-14 flex items-center justify-center p-8 min-h-[60vh]">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No Coupons Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Explore discounts and generate your first coupon!
            </p>
            <button
              onClick={() => router.push("/explore")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:shadow-glow transition-all"
            >
              Browse Discounts
            </button>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

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

  // Count coupons by status
  const statusCounts = {
    all: coupons.length,
    active: coupons.filter((c) => getCouponStatus(c) === "active").length,
    redeemed: coupons.filter((c) => getCouponStatus(c) === "redeemed").length,
    expired: coupons.filter((c) => getCouponStatus(c) === "expired").length,
  };

  // Format discount value for display
  // const formatDiscount = (discount: any) => {
  //   if (!discount) return "";
  //   const t = String(discount.type ?? "").toLowerCase();
  //   if (t === "percentage" || t === "percent") return `${discount.value}% OFF`;
  //   if (t.includes("fixed") || t === "fixed") return `$${discount.value} OFF`;
  //   return `${discount.value} OFF`;
  // };

  // List view
  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      <ExploreHeader isAuthenticated={isAuthenticated} />

      {/* Page Title */}
      <div className="pt-16 pb-4 max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">My Coupons</h1>
          <div className="bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-primary">
              {filteredCoupons.length}{" "}
              {filteredCoupons.length === 1 ? "Coupon" : "Coupons"}
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
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setActiveFilter("active")}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
              activeFilter === "active"
                ? "bg-green-500 text-white shadow-glow"
                : "bg-white text-muted-foreground hover:bg-muted"
            }`}
          >
            Active ({statusCounts.active})
          </button>
          <button
            onClick={() => setActiveFilter("redeemed")}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
              activeFilter === "redeemed"
                ? "bg-blue-500 text-white shadow-glow"
                : "bg-white text-muted-foreground hover:bg-muted"
            }`}
          >
            Redeemed ({statusCounts.redeemed})
          </button>
          <button
            onClick={() => setActiveFilter("expired")}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
              activeFilter === "expired"
                ? "bg-gray-500 text-white shadow-glow"
                : "bg-white text-muted-foreground hover:bg-muted"
            }`}
          >
            Expired ({statusCounts.expired})
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
              {activeFilter === "active" && "No Active Coupons"}
              {activeFilter === "redeemed" && "No Redeemed Coupons"}
              {activeFilter === "expired" && "No Expired Coupons"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {activeFilter === "active" &&
                "You do not have any active coupons at the moment. Generate new coupons from available discounts!"}
              {activeFilter === "redeemed" &&
                "You have not redeemed any coupons yet. Visit stores and start saving!"}
              {activeFilter === "expired" &&
                "No expired coupons found. Your active coupons are still valid!"}
            </p>
            <button
              onClick={() => setActiveFilter("all")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:shadow-glow transition-all"
            >
              View All Coupons
            </button>
          </div>
        </div>
      )}

      {/* Coupons List */}
      {filteredCoupons.length > 0 && (
        <div className="grid grid-cols-2 gap-4 px-4 pb-6 max-w-5xl mx-auto">
          {filteredCoupons.map((coupon, index) => (
            <div
              key={coupon.code}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="animate-slide-up"
            >
              <CouponCard
                coupon={coupon}
                onViewQr={() => handleViewQR(coupon)}
                onShare={() => void handleShare(coupon)}
                onDelete={() => void handleDelete(coupon)}
              />
            </div>
          ))}
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
