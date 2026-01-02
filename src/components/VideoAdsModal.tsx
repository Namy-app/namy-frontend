"use client";

import confetti from "canvas-confetti";
import { X, Loader2, Gift } from "lucide-react";
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
    }
  }, [isOpen]);

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

    try {
      const result = await watchAdMutation.mutateAsync({
        videoAdId: ad.id,
        videoKey: ad.videoKey,
        watchDuration: Math.floor(watchDuration),
        deviceId,
        sessionId,
      });

      if (result.canGenerateCoupon && result.token) {
        setUnlockToken(result.token);
      } else {
        // Move to next ad immediately
        setCurrentAdIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < ads.length) {
            return nextIndex;
          }
          return prevIndex;
        });
      }
    } catch (error) {
      console.error("Failed to track watch:", error);
    }
  };

  // Exchange token for coupon
  const handleExchangeToken = async () => {
    if (!unlockToken || !discountId) {
      return;
    }

    try {
      const coupon = await exchangeUnlockMutation.mutateAsync({
        token: unlockToken,
        discountId,
      });

      onSuccess(coupon.code as string);
      onClose();
    } catch (error) {
      console.error("Failed to exchange unlock:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Loading state */}
        {loadingAds ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">
              Cargando anuncios...
            </p>
          </div>
        ) : null}

        {/* Error state */}
        {adError || (!loadingAds && !ads.length) ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No hay anuncios disponibles
            </h2>
            <p className="text-muted-foreground mb-6 text-center">
              {adError
                ? "Error al cargar los anuncios. Por favor intenta más tarde."
                : "No hay suficientes anuncios disponibles."}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Cerrar
            </button>
          </div>
        ) : null}

        {/* Unlock success screen */}
        {unlockToken && !loadingAds ? (
          <div className="p-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white text-center mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold mb-2">¡Felicitaciones!</h1>
              <p className="text-lg opacity-90">
                Has visto ambos anuncios de video
              </p>
            </div>

            {/* <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Anuncios vistos:
              </h3>
              <div className="space-y-2">
                {ads.map((ad) => (
                  <div
                    key={ad.id}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{ad.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Video de {ad.duration}s
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            <button
              onClick={() => void handleExchangeToken()}
              disabled={exchangeUnlockMutation.isPending}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {exchangeUnlockMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Desbloqueando cupón...
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5" />
                  Desbloquear tu cupón
                </>
              )}
            </button>

            {exchangeUnlockMutation.isError ? (
              <p className="text-sm text-red-500 mt-4 text-center">
                Error al desbloquear el cupón. Por favor intenta de nuevo.
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Video player */}
        {!loadingAds && !adError && ads.length > 0 && !unlockToken && (
          <div className="p-8">
            {/* Progress Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Mira los videos para desbloquear tu cupón
              </h1>
              <p className="text-muted-foreground">
                Video {currentAdIndex + 1} de {ads.length}
              </p>
            </div>

            {/* Video Player */}
            {currentAd ? (
              <VideoPlayer
                key={currentAd.id} // Force re-mount when ad changes
                videoUrl={currentAd.videoUrl}
                title=""
                description=""
                duration={currentAd.duration}
                autoplay // Autoplay all videos
                onWatchComplete={(watchDuration) => {
                  // Capture the current ad in the callback closure
                  const adToReport = currentAd;
                  void handleWatchComplete(watchDuration, adToReport);
                }}
              />
            ) : null}

            {/* Watching Status */}
            {watchAdMutation.isPending ? (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Registrando tu progreso...
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
