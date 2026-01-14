"use client";

import confetti from "canvas-confetti";
import { X, Loader2, Gift } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { VideoPlayer } from "@/components/VideoPlayer";
import { useExchangeUnlock } from "@/domains/ads/hooks/mutation/useExchangeUnlock";
import { useGetVideoAdPair, useWatchVideoAd } from "@/domains/video-ads";
import type { VideoAd } from "@/domains/video-ads/types";

interface VideoAdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (couponCode: string) => void;
  discountId: string;
}

export function VideoAdsModal({
  isOpen,
  onClose,
  onSuccess,
  discountId,
}: VideoAdsModalProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [unlockToken, setUnlockToken] = useState<string | null>(null);
  const [isGeneratingCoupon, setIsGeneratingCoupon] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deviceId] = useState(() => {
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("deviceId");
      if (!id) {
        const randomStr = Math.random().toString(36).substring(2, 15);
        id = `device-${randomStr}`;
        localStorage.setItem("deviceId", id);
      }
      return id;
    }
    return undefined;
  });

  // Fetch video ad pair
  const {
    data: adPairData,
    isLoading: loadingAds,
    error: adError,
  } = useGetVideoAdPair(deviceId);

  const watchAdMutation = useWatchVideoAd();
  const exchangeUnlockMutation = useExchangeUnlock();

  const ads = adPairData?.ads || [];
  const sessionId = adPairData?.sessionId;
  const currentAd: VideoAd | undefined = ads[currentAdIndex];

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentAdIndex(0);
      setUnlockToken(null);
      setIsGeneratingCoupon(false);
      setProgress(0);
    }
  }, [isOpen]);

  // Progress bar animation (8 seconds)
  useEffect(() => {
    if (!isGeneratingCoupon) {return;}

    const duration = 8000; // 8 seconds
    const intervalTime = 50; // Update every 50ms for smooth animation
    const increment = (100 / duration) * intervalTime;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isGeneratingCoupon]);

  // Trigger confetti when unlock token is received
  useEffect(() => {
    if (unlockToken) {
      // Fire confetti from multiple positions
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ["#10b981", "#059669", "#34d399", "#6ee7b7"];

      (function frame() {
        void confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        void confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      // Fire a big burst in the center
      void confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
      });
    }
  }, [unlockToken]);

  // Handle watch completion
  const handleWatchComplete = async (watchDuration: number, ad: VideoAd) => {
    if (!ad || !sessionId) {
      console.error("Missing ad or sessionId:", { ad, sessionId });
      return;
    }

    if (!ad.id) {
      console.error("Ad is missing id:", ad);
      return;
    }

    // Determine the next action BEFORE making the API call
    const isLastAd = currentAdIndex === ads.length - 1;

    // Optimistically move to next video immediately for better UX
    // The API call will happen in the background
    if (!isLastAd) {
      setCurrentAdIndex((prevIndex) => prevIndex + 1);
    }

    // Track the watch in the background (non-blocking)
    try {
      const result = await watchAdMutation.mutateAsync({
        videoAdId: ad.id,
        videoKey: ad.videoKey,
        watchDuration: Math.floor(watchDuration),
        deviceId,
        sessionId,
      });

      // Only set unlock token if this was the last ad or if we can generate coupon
      if (result.canGenerateCoupon && result.token) {
        setUnlockToken(result.token);
      }
    } catch (error) {
      console.error("Failed to track watch:", error);
      // On error, we could optionally revert to previous video
      // but for now we'll just log it to avoid bad UX
    }
  };

  // Exchange token for coupon
  const handleExchangeToken = async () => {
    if (!unlockToken || !discountId) {
      return;
    }

    // Start generating coupon with progress bar
    setIsGeneratingCoupon(true);
    setProgress(0);

    try {
      // Start the API call
      const couponPromise = exchangeUnlockMutation.mutateAsync({
        token: unlockToken,
        discountId,
      });

      // Wait minimum 8 seconds for progress bar to complete
      const [coupon] = await Promise.all([
        couponPromise,
        new Promise((resolve) => setTimeout(resolve, 8000)),
      ]);

      // Redirect after progress completes
      onSuccess(coupon.code as string);
      onClose();
    } catch (error) {
      setIsGeneratingCoupon(false);
      setProgress(0);
      console.error("Failed to exchange unlock:", error);
      // Error will be displayed via exchangeUnlockMutation.error
    }
  };

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4">
      <div className="relative w-full max-w-md sm:max-w-lg sm:max-h-[95vh] overflow-y-auto bg-background rounded-xl sm:rounded-2xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        {/* Loading state */}
        {loadingAds ? (
          <div className="flex flex-col items-center justify-center p-6 sm:p-12">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-primary mb-4" />
            <p className="text-base sm:text-lg text-muted-foreground">
              Cargando anuncios...
            </p>
          </div>
        ) : null}

        {/* Error state */}
        {adError || (!loadingAds && !ads.length) ? (
          <div className="flex flex-col items-center justify-center p-6 sm:p-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl sm:text-3xl">❌</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 text-center px-2">
              No hay anuncios disponibles
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 text-center px-4">
              {adError
                ? "Error al cargar los anuncios. Por favor intenta más tarde."
                : "No hay suficientes anuncios disponibles."}
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm sm:text-base"
            >
              Cerrar
            </button>
          </div>
        ) : null}

        {/* Unlock success screen / Generating coupon screen */}
        {unlockToken && !loadingAds ? (
          <div className="p-4 sm:p-6 md:p-8">
            {!isGeneratingCoupon ? (
              <>
                <div className="bg-linear-to-r from-green-500 to-emerald-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white text-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    ¡Felicitaciones!
                  </h1>
                  <p className="text-base sm:text-lg opacity-90">
                    Has visto ambos anuncios de video
                  </p>
                </div>

                <button
                  onClick={() => void handleExchangeToken()}
                  disabled={isGeneratingCoupon}
                  className="w-full py-3 sm:py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                  Generar cupón
                </button>
              </>
            ) : (
              <>
                <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white text-center mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 animate-spin" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    Generando tu cupón
                  </h1>
                  <p className="text-base sm:text-lg opacity-90 mb-6">
                    Por favor espera, generando tu cupón...
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm mt-2 opacity-75">
                    {Math.round(progress)}%
                  </p>
                </div>
              </>
            )}
            {exchangeUnlockMutation?.isError && !isGeneratingCoupon ? (
              <p className="text-sm text-red-500 mt-4 bg-gray-900 text-center p-3">
                {(exchangeUnlockMutation.error as Error).message}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Video player */}
        {!loadingAds && !adError && ads.length > 0 && !unlockToken && (
          <>
            <div className="rounded-t-lg text-card-foreground h-full flex items-center bg-[linear-gradient(180deg,#f5e6c8_0%,#f0c999_50%,#e8b884_100%)] shadow-sm  border-0 hover:shadow-glow transition-all cursor-pointer group">
              <Link
                href="/subscription
              "
                className="w-full h-full"
              >
                <div className="flex h-full items-center gap-4">
                  <div className="flex-1 text-center p-10">
                    <h3 className="text-3xl font-bold text-secondary-foreground mb-1">
                      ¿Quieres hacerlo sin anuncios?
                    </h3>
                    <p className="text-secondary-foreground/80 text-sm">
                      Premium desde $99/mes
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Video Player */}
            {currentAd ? (
              <div className="animate-fade-in">
                <VideoPlayer
                  key={currentAd.id}
                  videoUrl={currentAd.videoUrl}
                  title=""
                  description=""
                  duration={currentAd.duration}
                  autoplay
                  onWatchComplete={(watchDuration) => {
                    const adToReport = currentAd;
                    void handleWatchComplete(watchDuration, adToReport);
                  }}
                />
              </div>
            ) : null}
            <div className="m-6 sm:mb-8 text-center">
              <p className="text-sm sm:text-base text-muted-foreground">
                Video {currentAdIndex + 1} de {ads.length}
              </p>
            </div>

            {/* Watching Status - Subtle indicator */}
            {watchAdMutation.isPending ? (
              <div className="mt-3 flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" />
                <p className="text-xs">Guardando...</p>
              </div>
            ) : null}
            {/* </div> */}
          </>
        )}
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
