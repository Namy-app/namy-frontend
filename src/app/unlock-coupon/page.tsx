"use client";

import { Check, Gift, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

import { VideoPlayer } from "@/components/VideoPlayer";
import { useExchangeUnlock } from "@/domains/ads/hooks/mutation/useExchangeUnlock";
import { useGetVideoAdPair, useWatchVideoAd } from "@/domains/video-ads";
import type { VideoAd } from "@/domains/video-ads/types";

export default function UnlockCouponVideoAdsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Cargando...</p>
          </div>
        </div>
      }
    >
      <UnlockCouponContent />
    </Suspense>
  );
}

function UnlockCouponContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const discountId = searchParams?.get("discountId") ?? null;

  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [watchedAds, setWatchedAds] = useState<string[]>([]);
  const [unlockToken, setUnlockToken] = useState<string | null>(null);
  const [deviceId] = useState(() => {
    // Generate or retrieve device ID
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("deviceId");
      if (!id) {
        id = `device-${Math.random().toString(36).substring(2, 15)}`;
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

  // Log for debugging
  console.log("Video Ads Debug:", {
    loadingAds,
    adError: adError?.message,
    adsCount: adPairData?.ads?.length,
    sessionId: adPairData?.sessionId,
    deviceId,
    discountId,
  });

  // Watch ad mutation
  const watchAdMutation = useWatchVideoAd();

  // Exchange unlock mutation
  const exchangeUnlockMutation = useExchangeUnlock();

  const ads = adPairData?.ads || [];
  const sessionId = adPairData?.sessionId;
  const currentAd: VideoAd | undefined = ads[currentAdIndex];

  // Handle watch completion
  const handleWatchComplete = async (watchDuration: number) => {
    if (!currentAd || !sessionId) {
      return;
    }

    try {
      const result = await watchAdMutation.mutateAsync({
        videoAdId: currentAd.id,
        videoKey: currentAd.videoKey,
        watchDuration: Math.floor(watchDuration),
        deviceId,
        sessionId,
      });

      // Mark ad as watched
      setWatchedAds((prev) => [...prev, currentAd.id]);

      if (result.canGenerateCoupon && result.token) {
        // Got unlock token, ready to exchange for coupon
        setUnlockToken(result.token);
      } else {
        // Need to watch more ads
        if (currentAdIndex < ads.length - 1) {
          // Move to next ad automatically
          setTimeout(() => {
            setCurrentAdIndex(currentAdIndex + 1);
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Failed to track watch:", error);
    }
  };

  // Exchange token for coupon
  const handleExchangeToken = async () => {
    if (!unlockToken || !discountId) {
      console.error("Missing token or discountId");
      return;
    }

    try {
      const coupon = await exchangeUnlockMutation.mutateAsync({
        token: unlockToken,
        discountId,
      });

      // Redirect to coupon page
      router.push(`/coupon/${coupon.code}`);
    } catch (error) {
      console.error("Failed to exchange unlock:", error);
    }
  };

  // Show loading state
  if (loadingAds) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Cargando anuncios...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (adError || !ads.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            No hay anuncios disponibles
          </h2>
          <p className="text-muted-foreground mb-6">
            {adError
              ? "Error al cargar los anuncios. Por favor intenta más tarde."
              : "No hay suficientes anuncios disponibles. Por favor contacta soporte."}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Show unlock token exchange screen
  if (unlockToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-background p-6">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">¡Felicitaciones!</h1>
            <p className="text-lg opacity-90">
              Has visto ambos anuncios de video
            </p>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Anuncios vistos:
              </h3>
            </div>

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
        </div>
      </div>
    );
  }

  // Show video player for current ad
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Progress Header */}
        <div className="mb-8 text-center">
          {/* <h1 className="text-3xl font-bold text-foreground mb-2">
            Mira los videos para desbloquear tu cupón
          </h1> */}
          <p className="text-muted-foreground">
            Video {currentAdIndex + 1} de {ads.length}
          </p>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {ads.map((ad, index) => (
              <div key={ad.id} className="flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    watchedAds.includes(ad.id)
                      ? "bg-green-500 text-white"
                      : index === currentAdIndex
                        ? "bg-primary text-white ring-4 ring-primary/30"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {watchedAds.includes(ad.id) ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {watchedAds.includes(ad.id)
                    ? "Completado"
                    : index === currentAdIndex
                      ? "Viendo"
                      : "Pendiente"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Video Player */}
        {currentAd ? (
          <VideoPlayer
            videoUrl={currentAd.videoUrl}
            title={currentAd.title}
            description={currentAd.description}
            duration={currentAd.duration}
            autoplay={currentAdIndex > 0} // Autoplay second video
            // VideoPlayer component is designed to accept async callbacks
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onWatchComplete={handleWatchComplete}
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
    </div>
  );
}
