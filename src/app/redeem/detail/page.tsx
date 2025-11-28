"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Phone, Clock, Tag, Star, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";

import { useToast } from "@/hooks/use-toast";
import { CouponDecoder, type DecodedCouponData } from "@/lib/coupon-decoder";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  REDEEM_COUPON_BY_STAFF_MUTATION,
  GET_COUPON_REDEEM_DETAILS_QUERY,
} from "@/lib/graphql-queries";
import {
  getRedeemViewData,
  clearRedeemViewData,
} from "@/lib/redeem-view-store";

function RedeemContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [couponData, setCouponData] = useState<DecodedCouponData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const { toast } = useToast();

  const [storePin, setStorePin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const storePinRef = useRef<HTMLInputElement | null>(null);

  const deviceId = (() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    let id = localStorage.getItem("deviceId");
    if (!id) {
      id = `device-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem("deviceId", id);
    }
    return id;
  })();

  const queryClient = useQueryClient();

  type RedemptionResult = {
    success: boolean;
    leveledUp: boolean;
    newLevel?: number | null;
    oldLevel?: number | null;
    message?: string | null;
  };

  const redeemMutation = useMutation<
    { redeemCouponByStaff: RedemptionResult },
    Error,
    { code: string; storeId: string; staffPin: string; deviceId?: string }
  >({
    mutationFn: async (vars) =>
      graphqlRequest<{ redeemCouponByStaff: RedemptionResult }>(
        REDEEM_COUPON_BY_STAFF_MUTATION,
        vars
      ),
    onSuccess: (
      _data: { redeemCouponByStaff: RedemptionResult },
      vars: { code: string }
    ) => {
      void queryClient.invalidateQueries({ queryKey: ["coupons"] });
      void queryClient.invalidateQueries({
        queryKey: ["couponRedeemDetails", vars.code],
      });
    },
  });

  // Decrypt coupon data from URL
  useEffect(() => {
    const decryptOrFetch = async (): Promise<void> => {
      try {
        // First check for client-side stored view data to avoid putting details in the URL
        const stored = getRedeemViewData();
        if (stored) {
          setCouponData(stored);
          clearRedeemViewData();
          setIsActive(true);
          return;
        }

        const token = searchParams?.get("token");
        if (token) {
          try {
            // Fetch coupon details by opaque token from the server
            const resp = await fetch(
              `/api/redeem/view-by-token?token=${encodeURIComponent(token)}`
            );
            if (!resp.ok) {
              throw new Error(`Token lookup failed: ${resp.status}`);
            }
            const json = await resp.json();
            // Expect { coupon: { ... } } or similar; try common shapes
            const payload = json.coupon ?? json.data?.coupon ?? json;
            if (!payload || !payload.code) {
              throw new Error("Invalid token response");
            }

            // If the API returns a full DecodedCouponData-shaped object, use it.
            const mapped: DecodedCouponData = {
              code: payload.code,
              expiresAt: payload.expiresAt,
              createdAt: payload.createdAt,
              storeId: payload.storeId ?? payload.store?.id ?? "",
              store: {
                name: payload.store?.name ?? payload.storeName ?? "",
                description: payload.store?.description,
                address: payload.store?.address,
                city: payload.store?.city,
                phoneNumber: payload.store?.phoneNumber,
                averageRating: payload.store?.averageRating,
                reviewCounter: payload.store?.reviewCounter,
              },
              discount: {
                title: payload.discount?.title ?? payload.discountTitle ?? "",
                description: payload.discount?.description,
                type: payload.discount?.type ?? "fixed",
                value: payload.discount?.value ?? 0,
                minPurchaseAmount: payload.discount?.minPurchaseAmount,
                maxDiscountAmount: payload.discount?.maxDiscountAmount,
              },
            };

            setCouponData(mapped);
            // optionally check server-side flags if provided
            if (payload.valid === false) {
              setError("This coupon is not valid for redemption");
            }
            if (payload.used === true) {
              setError("This coupon has already been redeemed");
            }
            setIsActive(!(payload.used || payload.valid === false));
            return;
          } catch (tokenErr) {
            console.warn(
              "Token lookup failed, falling back to enc/code handling:",
              tokenErr
            );
            // continue to fallback flows below
          }
        }
        const enc = searchParams?.get("enc");
        const codeParam = searchParams?.get("code");

        if (enc) {
          // Decrypt the coupon data from the encrypted query param
          const decoded = await CouponDecoder.decodeAsync(enc);
          setCouponData(decoded);

          // Fetch server-side redeem details to determine if coupon is still valid/unused
          try {
            const detailsRes = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: GET_COUPON_REDEEM_DETAILS_QUERY,
                variables: { code: decoded.code },
              }),
            });
            const detailsJson = await detailsRes.json();
            const details = detailsJson.data?.couponRedeemDetails;
            if (details) {
              // active if server reports valid and not used
              setIsActive(Boolean(details.valid && !details.used));
              if (!details.valid) {
                setError("This coupon is not valid for redemption");
              }
              if (details.used) {
                setError("This coupon has already been redeemed");
              }
            }
          } catch (err) {
            console.warn("Failed to fetch redeem details:", err);
          }

          // Client-side expiry fallback
          if (CouponDecoder.isExpired(decoded.expiresAt)) {
            setError("This coupon has expired");
          }

          return;
        }

        if (codeParam) {
          // Fetch coupon details by code and map to DecodedCouponData
          try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: GET_COUPON_REDEEM_DETAILS_QUERY,
                variables: { code: codeParam },
              }),
            });
            const json = await res.json();
            if (json.errors) {
              throw new Error(json.errors[0].message);
            }
            const details = json.data?.couponRedeemDetails;
            if (!details) {
              setError("Coupon not found");
              return;
            }

            // Map server details to DecodedCouponData shape
            const mapped: DecodedCouponData = {
              code: details.code,
              expiresAt: details.expiresAt,
              createdAt: details.createdAt,
              storeId: details.store?.id ?? "",
              store: {
                name: details.store?.name ?? "",
                description: details.store?.description,
                address: details.store?.address,
                city: details.store?.city,
                phoneNumber: details.store?.phoneNumber,
                averageRating: details.store?.averageRating,
                reviewCounter: details.store?.reviewCounter,
              },
              discount: {
                title: details.discount?.title ?? "",
                description: details.discount?.description,
                type: details.discount?.type ?? "fixed",
                value: details.discount?.value ?? 0,
                minPurchaseAmount: details.discount?.minPurchaseAmount,
                maxDiscountAmount: details.discount?.maxDiscountAmount,
              },
            };

            setCouponData(mapped);
            setIsActive(Boolean(details.valid && !details.used));
            if (!details.valid) {
              setError("This coupon is not valid for redemption");
            }
            if (details.used) {
              setError("This coupon has already been redeemed");
            }
          } catch (err) {
            console.error("Error fetching coupon details:", err);
            setError(
              err instanceof Error ? err.message : "Failed to load coupon"
            );
          }
        } else {
          setError("Invalid coupon URL");
        }
      } catch (err) {
        console.error("Error loading coupon:", err);
        setError(err instanceof Error ? err.message : "Invalid coupon");
      }
    };

    void decryptOrFetch();
  }, [searchParams]);

  // Update countdown timer
  useEffect(() => {
    if (!couponData) {
      return;
    }

    const updateTimer = (): void => {
      const formatted = CouponDecoder.formatExpirationTime(
        couponData.expiresAt
      );
      setTimeRemaining(formatted);

      if (formatted === "Expired") {
        setError("This coupon has expired");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [couponData]);

  // Handle redeem action
  const handleRedeem = async (): Promise<void> => {
    if (!couponData) {
      return;
    }

    // Validate PIN
    if (!/^[0-9]{4,6}$/.test(storePin)) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be 4 to 6 digits.",
        variant: "destructive",
      });
      return;
    }

    setRedeeming(true);
    try {
      const result = await redeemMutation.mutateAsync({
        code: couponData.code,
        storeId: couponData.storeId,
        staffPin: storePin,
        deviceId,
      });
      const data = result?.redeemCouponByStaff ?? result;
      if (data.success) {
        setRedeemed(true);
        toast({ title: "Redemption successful", description: data.message });
      } else {
        toast({
          title: "Redemption failed",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Redeem error:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setRedeeming(false);
    }
  };

  // Error state
  if (error || !couponData) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md animate-slide-up">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground">{error || "Invalid coupon"}</p>
            <button
              onClick={() => void router.push("/explore")}
              className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Browse Discounts
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isExpired = timeRemaining === "Expired";
  const canRedeem = isActive && !isExpired && !redeemed;
  const discountText = CouponDecoder.formatDiscountValue(
    couponData.discount.type,
    couponData.discount.value
  );

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Coupon Card */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-slide-up">
          {/* Discount Badge */}
          <div className="bg-gradient-primary p-8 text-center">
            <div className="inline-block bg-white rounded-2xl px-8 py-4 shadow-glow">
              <p className="text-sm text-muted-foreground mb-1">
                Your Discount
              </p>
              <p className="text-5xl font-bold text-primary">{discountText}</p>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Coupon Code
                </p>
                <p className="text-3xl font-bold font-mono tracking-wider text-foreground">
                  {couponData.code}
                </p>
              </div>
              <Tag className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Timer */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isExpired ? "bg-destructive/10" : "bg-primary/10"
                }`}
              >
                <Clock
                  className={`w-6 h-6 ${
                    isExpired ? "text-destructive" : "text-primary"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expires in</p>
                <p
                  className={`text-xl font-semibold ${
                    isExpired ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {timeRemaining}
                </p>
              </div>
            </div>
          </div>

          {/* Discount Details */}
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-lg text-foreground mb-3">
              {couponData.discount.title}
            </h3>
            {couponData.discount.description ? (
              <p className="text-sm text-muted-foreground mb-4">
                {couponData.discount.description}
              </p>
            ) : null}
            <div className="space-y-2">
              {couponData.discount.minPurchaseAmount ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Minimum spend:</span>
                  <span className="font-semibold text-foreground">
                    ${couponData.discount.minPurchaseAmount}
                  </span>
                </div>
              ) : null}
              {couponData.discount.maxDiscountAmount ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Max discount:</span>
                  <span className="font-semibold text-foreground">
                    ${couponData.discount.maxDiscountAmount}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Store Details */}
          <div className="p-6">
            <h3 className="font-semibold text-lg text-foreground mb-4">
              Store Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xl font-bold text-foreground">
                  {couponData.store.name}
                </p>
                {couponData.store.description ? (
                  <p className="text-sm text-muted-foreground mt-1">
                    {couponData.store.description}
                  </p>
                ) : null}
              </div>

              {couponData.store.address ? (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">
                      {couponData.store.address}
                    </p>
                    {couponData.store.city ? (
                      <p className="text-sm text-muted-foreground">
                        {couponData.store.city}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {couponData.store.phoneNumber ? (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a
                    href={`tel:${couponData.store.phoneNumber}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {couponData.store.phoneNumber}
                  </a>
                </div>
              ) : null}

              {couponData.store.averageRating !== undefined &&
              couponData.store.reviewCounter ? (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-foreground">
                    {couponData.store.averageRating}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({couponData.store.reviewCounter} reviews)
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Staff PIN / Redeem Action */}
          <div className="p-6 border-t border-border bg-muted/10">
            <h3 className="font-semibold text-lg text-foreground mb-3">
              Store Confirmation
            </h3>

            {redeemed ? (
              <div className="mb-4 text-center">
                <p className="text-green-600 font-semibold">
                  Coupon redeemed successfully
                </p>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label
                    htmlFor="storePin"
                    className="block text-sm font-semibold text-foreground mb-2"
                  >
                    Enter Store PIN
                  </label>
                  <div className="relative">
                    <input
                      id="storePin"
                      ref={storePinRef}
                      type={showPin ? "text" : "password"}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={storePin}
                      onChange={(e) => setStorePin(e.target.value)}
                      placeholder="••••"
                      maxLength={6}
                      disabled={!canRedeem}
                      className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-lg tracking-widest text-center disabled:opacity-50"
                    />
                    <button
                      type="button"
                      aria-label={showPin ? "Hide PIN" : "Show PIN"}
                      onClick={() => setShowPin((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                    >
                      {showPin ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5.523 0-10-4.477-10-10 0-1.07.163-2.098.463-3.062" />
                          <path d="M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M1.05 12a10 10 0 0 1 1.6-3.1" />
                          <path d="M12 5c5.523 0 10 4.477 10 10 0 1.07-.163 2.098-.463 3.062" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => void router.back()}
                    className="flex-1 py-3 px-4 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => void handleRedeem()}
                    disabled={!canRedeem || redeeming}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-lg transition-all ${!canRedeem ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-primary text-primary-foreground hover:shadow-glow active:scale-[0.98]"}`}
                  >
                    {redeeming ? "Redeeming..." : "Confirm Redeem"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RedeemPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <RedeemContent />
    </Suspense>
  );
}
