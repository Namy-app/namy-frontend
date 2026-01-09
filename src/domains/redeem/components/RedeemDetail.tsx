"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  Phone,
  Clock,
  Tag,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Sparkles,
  EyeClosed,
  Eye,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

import { DAYS_OF_WEEK_BY_INDEX } from "@/data/constants";
import { useToast } from "@/hooks/use-toast";
import { CouponDecoder, type DecodedCouponData } from "@/lib/coupon-decoder";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  REDEEM_COUPON_BY_STAFF_MUTATION,
  GET_COUPON_REDEEM_DETAILS_QUERY,
} from "@/lib/graphql-queries";
import { extractErrorMessage } from "@/lib/utils";

type Props = {
  couponData: DecodedCouponData;
  onClose?: () => void;
};

type RedemptionResult = {
  success: boolean;
  leveledUp: boolean;
  newLevel?: number | null;
  oldLevel?: number | null;
  message?: string | null;
};

export default function RedeemDetail({
  couponData,
  onClose,
}: Props): React.JSX.Element {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [storePin, setStorePin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [redemptionResult, setRedemptionResult] =
    useState<RedemptionResult | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [blockReason, setBlockReason] = useState<string | null>(null);
  const storePinRef = useRef<HTMLInputElement | null>(null);
  const fetchedCodeRef = useRef<string | null>(null);

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
    onSuccess: (_data, vars: { code: string }) => {
      void queryClient.invalidateQueries({ queryKey: ["coupons"] });
      void queryClient.invalidateQueries({
        queryKey: ["couponRedeemDetails", vars.code],
      });
    },
  });

  useEffect(() => {
    const init = async (): Promise<void> => {
      if (!couponData || fetchedCodeRef.current === couponData.code) {
        return;
      }

      fetchedCodeRef.current = couponData.code;

      try {
        // fetch server-side redeem details to check valid/used
        const detailsRes = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: GET_COUPON_REDEEM_DETAILS_QUERY,
            variables: { code: couponData.code },
          }),
        });
        const detailsJson = await detailsRes.json();
        const details = detailsJson.data?.couponRedeemDetails;
        if (details) {
          setIsActive(Boolean(details.valid && !details.used));
          if (!details.valid) {
            setError("This coupon is not valid for redemption");
            setBlockReason("This coupon is not valid");
          }
          if (details.used) {
            setError("This coupon has already been redeemed");
            setBlockReason("Already redeemed");
          }
        } else {
          // allow client-side expiry check
          if (CouponDecoder.isExpired(couponData.expiresAt)) {
            setError("This coupon has expired");
            setBlockReason("Coupon expired");
          }
        }
      } catch (err) {
        console.warn("Failed to fetch redeem details:", err);
        if (CouponDecoder.isExpired(couponData.expiresAt)) {
          setError("This coupon has expired");
          setBlockReason("Coupon expired");
        }
      }
    };
    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponData?.code]);

  useEffect(() => {
    if (!couponData) {
      return;
    }
    const updateTimer = (): void => {
      const formatted = CouponDecoder.formatExpirationTime(
        couponData.expiresAt
      );
      setTimeRemaining((prev) => (prev !== formatted ? formatted : prev));
      if (formatted === "Expired") {
        setError((prev) =>
          prev !== "This coupon has expired" ? "This coupon has expired" : prev
        );
        setBlockReason((prev) =>
          prev !== "Coupon expired" ? "Coupon expired" : prev
        );
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponData?.expiresAt]);

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
      if (data.success) {
        setRedeemed(true);
        setRedemptionResult(data);
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
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setRedeeming(false);
    }
  };

  // Success State - Show celebration UI
  if (redeemed && redemptionResult && couponData) {
    return (
      <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-slide-up w-full max-w-2xl mx-auto relative">
        {/* Confetti-like decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Sparkles className="absolute top-4 left-4 w-6 h-6 text-yellow-400 animate-pulse" />
          <Sparkles className="absolute top-8 right-8 w-4 h-4 text-primary animate-pulse delay-100" />
          <Sparkles className="absolute bottom-20 left-12 w-5 h-5 text-green-400 animate-pulse delay-200" />
          <Sparkles className="absolute bottom-32 right-16 w-4 h-4 text-purple-400 animate-pulse delay-300" />
        </div>

        {/* Success Header */}
        <div className="bg-linear-to-br from-green-500 to-emerald-600 p-8 text-center relative">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-glow animate-bounce-once">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            ¡Canjeo Exitoso!
          </h2>
          <p className="text-green-50 text-lg">
            {redemptionResult.message ||
              "The coupon has been successfully redeemed"}
          </p>
        </div>

        {/* Level Up Notification */}
        {redemptionResult.leveledUp ? (
          <div className="bg-linear-to-r from-purple-500 to-pink-500 p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-bold text-white">
                ¡Subiste de Nivel!
              </h3>
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <p className="text-white text-lg">
              ¡Felicidades! Has avanzado del Nivel {redemptionResult.oldLevel}{" "}
              al Nivel {redemptionResult.newLevel}
            </p>
            <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <span className="text-white font-bold text-xl">
                🎉 Nuevo Nivel: {redemptionResult.newLevel} 🎉
              </span>
            </div>
          </div>
        ) : null}

        {/* Store Details */}
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-lg text-foreground mb-4">
            Canjeado en
          </h3>
          <div className="space-y-3">
            <p className="text-xl font-bold text-foreground">
              {couponData.store.name}
            </p>
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
          </div>
        </div>

        {/* Discount Applied */}
        <div className="p-6 bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Descuento Aplicado
              </p>
              <p className="text-3xl font-bold text-primary">
                {CouponDecoder.formatDiscountValue(
                  couponData.discount.type,
                  couponData.discount.value
                )}
              </p>
            </div>
            <Tag className="w-12 h-12 text-primary opacity-20" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 text-center space-y-3">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gradient-primary text-primary-foreground rounded-xl font-semibold hover:shadow-glow transition-all"
          >
            Listo
          </button>
          <p className="text-xs text-muted-foreground">
            Este cupón ha sido marcado como usado y no se puede redimir
            nuevamente
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !couponData) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md animate-slide-up">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            ¡Vaya! Algo salió mal
          </h2>
          <p className="text-muted-foreground">{error || "Cupón inválido"}</p>
          <div className="mt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Volver
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
          <p className="text-sm text-muted-foreground mb-1">Tu Descuento</p>
          <p className="text-5xl font-bold text-primary">{discountText}</p>
        </div>
      </div>

      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Código del Cupón
            </p>
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
              <span className="text-muted-foreground">Gasto mínimo:</span>
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
          {couponData.discount.availableDaysAndTimes
            ? couponData.discount.availableDaysAndTimes.availableDays.length >
                0 && (
                <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">
                        Días/horarios disponibles
                      </p>
                      <ul className="text-sm text-foreground gap-x-4">
                        {couponData.discount.availableDaysAndTimes.availableDays.map(
                          ({ dayIndex, timeRanges }, index) => (
                            <li key={index} className="flex gap-x-2">
                              <span>
                                &bull; {DAYS_OF_WEEK_BY_INDEX[dayIndex]}
                              </span>
                              <span>
                                {`(${timeRanges
                                  .map(
                                    (timeRange) =>
                                      `${timeRange.start} - ${timeRange.end}`
                                  )
                                  .join(", ")})`}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            : null}
          {couponData.discount.additionalRestrictions ? (
            <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-primary mb-1">
                    Restricciones de uso
                  </p>
                  <ul className="text-sm text-foreground">
                    {couponData.discount.additionalRestrictions?.map(
                      (restriction, index) => (
                        <li key={index}>&bull; {restriction}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-semibold text-lg text-foreground mb-4">
          Información de la tienda
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-xl font-bold text-foreground">
              {couponData.store.name}
            </p>
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
        {/* Block Reason Alert */}
        {!canRedeem && blockReason ? (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive mb-1">
                No se puede redimir
              </p>
              <p className="text-sm text-destructive/80">
                {blockReason === "Already redeemed" &&
                  "This coupon has already been used and cannot be redeemed again."}
                {blockReason === "Coupon expired" &&
                  "This coupon has expired and is no longer valid."}
                {blockReason === "This coupon is not valid" &&
                  "This coupon is not valid for redemption."}
              </p>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-semibold text-foreground mb-2">
              PIN de la tienda
            </label>
            <div className="relative col-span-2 md:col-span-1">
              <input
                ref={storePinRef}
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                value={storePin}
                onChange={(e) => setStorePin(e.target.value)}
                placeholder="Enter your PIN"
                disabled={!canRedeem}
                className="w-full text-sm px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono md:text-lg tracking-widest text-center disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted"
                maxLength={6}
                required
              />
              <button
                type="button"
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
                onClick={() => setShowPin((s) => !s)}
                disabled={!canRedeem}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showPin ? <EyeClosed /> : <Eye />}
              </button>
            </div>
          </div>

          <div className="flex items-end col-span-2 md:col-span-1">
            <button
              onClick={() => void handleRedeem()}
              disabled={!canRedeem || redeeming}
              className="w-full py-3 px-4 bg-gradient-primary text-primary-foreground rounded-xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
              title={
                !canRedeem
                  ? blockReason || "No se puede canjear este cupón"
                  : "Canjear cupón"
              }
            >
              {redeeming ? (
                <span className="h-5 w-5 block border-2 border-dashed border-white rounded-full animate-spin" />
              ) : (
                "Canjear"
              )}
            </button>
          </div>
        </div>

        {/* Help Text */}
        {canRedeem ? (
          <p className="mt-3 text-xs text-muted-foreground text-center">
            Ingresa tu PIN para redimir el cupón
          </p>
        ) : null}
      </div>

      <div className="p-4 text-center">
        <button
          onClick={onClose}
          className="text-sm text-muted-foreground underline"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
