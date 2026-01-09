"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Phone, Clock, Tag, AlertCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";

import { useToast } from "@/hooks/use-toast";
import { CouponDecoder, type DecodedCouponData } from "@/lib/coupon-decoder";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  GET_COUPON_REDEEM_DETAILS_QUERY,
  REDEEM_COUPON_BY_STAFF_MUTATION,
} from "@/lib/graphql-queries";
import { extractErrorMessage } from "@/lib/utils";

type Props = {
  couponData: DecodedCouponData;
  onClose?: () => void;
};

type StoreInfo = {
  id: string;
  name?: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  phoneNumber?: string | null;
  averageRating?: number | null;
  reviewCounter?: number | null;
};

type DiscountInfo = {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  value: number;
  minPurchaseAmount?: number | null;
  maxDiscountAmount?: number | null;
};

type RedeemDetails = {
  id: string;
  code: string;
  used: boolean;
  usedAt?: string | null;
  expiresAt: string;
  createdAt: string;
  valid: boolean;
  store: StoreInfo;
  discount: DiscountInfo;
};

type RedemptionResult = {
  success: boolean;
  leveledUp: boolean;
  newLevel?: number | null;
  oldLevel?: number | null;
  message?: string | null;
};

export default function RedeemDetail({
  couponData: initial,
  onClose,
}: Props): React.JSX.Element {
  const { toast } = useToast();
  const [couponData, _] = useState<DecodedCouponData | null>(initial);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [storePin, setStorePin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const storePinRef = useRef<HTMLInputElement | null>(null);

  const deviceId: string | undefined = ((): string | undefined => {
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

  // Use react-query to fetch coupon redeem details (cached)
  const {
    data: details,
    isLoading: detailsLoading,
    error: detailsError,
  } = useQuery<RedeemDetails | null>({
    queryKey: ["couponRedeemDetails", couponData?.code],
    queryFn: async () => {
      if (!couponData?.code) {
        return null;
      }
      const res = await graphqlRequest<{ couponRedeemDetails: RedeemDetails }>(
        GET_COUPON_REDEEM_DETAILS_QUERY,
        { code: couponData.code }
      );
      return res.couponRedeemDetails ?? null;
    },
    enabled: !!couponData?.code,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();

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
    onSuccess: (_data, vars) => {
      // invalidate coupon list and the specific coupon details
      void queryClient.invalidateQueries({ queryKey: ["coupons"] });
      void queryClient.invalidateQueries({
        queryKey: ["couponRedeemDetails", vars.code],
      });
    },
  });

  useEffect(() => {
    if (!couponData) {
      return;
    }
    if (details) {
      setIsActive(Boolean(details.valid && !details.used));
      if (!details.valid) {
        setError("This coupon is not valid for redemption");
      }
      if (details.used) {
        setError("This coupon has already been redeemed");
      }
    } else if (!details && !detailsLoading) {
      // allow client-side expiry check
      if (CouponDecoder.isExpired(couponData.expiresAt)) {
        setError("This coupon has expired");
      }
    }
    if (detailsError) {
      console.warn("Failed to fetch redeem details:", detailsError);
      if (CouponDecoder.isExpired(couponData.expiresAt)) {
        setError("This coupon has expired");
      }
    }
  }, [couponData, details, detailsLoading, detailsError]);

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

  const handleRedeem = async (): Promise<void> => {
    if (!couponData) {
      return;
    }
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
      if (data?.success) {
        setRedeemed(true);
        toast({ title: "Redemption successful", description: data.message });
      } else {
        toast({
          title: "Redemption failed",
          description: data?.message ?? "Unknown error",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Redeem error:", err);
      toast({
        title: "Error",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setRedeeming(false);
    }
  };

  if (error || !couponData) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md animate-slide-up">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground">{error || "Invalid coupon"}</p>
          <div className="mt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Back
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
    <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-slide-up w-full max-w-2xl mx-auto">
      <div className="bg-gradient-primary p-8 text-center">
        <div className="inline-block bg-white rounded-2xl px-8 py-4 shadow-glow">
          <p className="text-sm text-muted-foreground mb-1">Your Discount</p>
          <p className="text-5xl font-bold text-primary">{discountText}</p>
        </div>
      </div>

      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Coupon Code</p>
            <p className="text-3xl font-bold font-mono tracking-wider text-foreground">
              {couponData.code}
            </p>
          </div>
          <Tag className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${isExpired ? "bg-destructive/10" : "bg-primary/10"}`}
          >
            <Clock
              className={`w-6 h-6 ${isExpired ? "text-destructive" : "text-primary"}`}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Expires in</p>
            <p
              className={`text-xl font-semibold ${isExpired ? "text-destructive" : "text-foreground"}`}
            >
              {timeRemaining}
            </p>
          </div>
        </div>
      </div>

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
        </div>
      </div>

      <div className="p-6 border-t border-border bg-muted/50">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Store PIN
            </label>
            <div className="relative">
              <input
                ref={storePinRef}
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                value={storePin}
                onChange={(e) => setStorePin(e.target.value)}
                placeholder="Enter your PIN"
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-lg tracking-widest text-center"
                maxLength={6}
                required
              />
              <button
                type="button"
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
                onClick={() => setShowPin((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              >
                {showPin ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => void handleRedeem()}
              disabled={!canRedeem || redeeming}
              className="w-full py-3 px-4 bg-gradient-primary text-primary-foreground rounded-xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Redeem
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 text-center">
        <button
          onClick={onClose}
          className="text-sm text-muted-foreground underline"
        >
          Back
        </button>
      </div>
    </div>
  );
}
