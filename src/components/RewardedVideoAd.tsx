"use client";

import { useEffect, useState } from "react";

interface RewardedVideoAdProps {
  onAdComplete: () => void;
  onAdSkipped?: () => void;
  onAdError?: (error: Error) => void;
  couponName?: string;
}

export function RewardedVideoAd({
  onAdComplete,
  onAdSkipped,
  onAdError,
  couponName = "your coupon",
}: RewardedVideoAdProps): React.JSX.Element {
  const [adWatched, setAdWatched] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds video
  const [isPlaying, setIsPlaying] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);

  useEffect(() => {
    // Try to load AdSense rewarded ad
    const loadRewardedAd = () => {
      try {
        if (typeof window === "undefined") {
          return;
        }

        const win = window as unknown as {
          adsbygoogle?: Array<Record<string, unknown>>;
          adBreak?: (opts: Record<string, unknown>) => void;
          adConfig?: (opts: Record<string, unknown>) => void;
        };

        if (!win.adsbygoogle) {
          // Fallback: AdSense not available
          console.warn("AdSense not available - entering test mode");
          setAdError("Test mode - simulating video ad");
          return;
        }

        const { adBreak, adConfig } = win;
        if (adBreak && adConfig) {
          adConfig({
            preloadAdBreaks: "on",
            onReady: () => console.warn("AdSense rewarded ad ready"),
          });

          adBreak({
            type: "reward",
            name: "coupon-unlock",
            beforeAd: () => setIsPlaying(true),
            afterAd: () => {
              setAdWatched(true);
              setIsPlaying(false);
              onAdComplete();
            },
            adDismissed: () => {
              setIsPlaying(false);
              if (onAdSkipped) {
                onAdSkipped();
              }
            },
            adBreakDone: () => {
              setAdWatched(true);
              onAdComplete();
            },
          });
        } else {
          console.warn("AdSense rewarded ads not available, using test mode");
          setAdError("Test mode - simulating video ad");
        }
      } catch (err) {
        console.error("Error loading rewarded ad:", err);
        if (onAdError) {
          onAdError(err as Error);
        }
        setAdError("Failed to load ad");
      }
    };

    loadRewardedAd();
  }, [onAdComplete, onAdError, onAdSkipped]);

  // Countdown timer for test mode
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (isPlaying && timeLeft === 0) {
      // Schedule state updates to avoid synchronous setState-in-effect
      const t = setTimeout(() => {
        setAdWatched(true);
        setIsPlaying(false);
        onAdComplete();
      }, 0);

      return () => clearTimeout(t);
    }

    return undefined;
  }, [isPlaying, timeLeft, onAdComplete]);

  const handleWatchAd = () => {
    setIsPlaying(true);
    setTimeLeft(30); // Reset timer
  };

  if (adWatched) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h3 className="text-xl font-bold text-green-900 mb-2">Ad Complete!</h3>
        <p className="text-green-700">You can now redeem {couponName}</p>
      </div>
    );
  }

  if (isPlaying) {
    return (
      <div className="bg-black rounded-lg overflow-hidden relative">
        {/* Video Ad Container */}
        <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
          {/* AdSense Video Ad Slot */}
          <ins
            className="adsbygoogle"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}
            data-ad-slot="YOUR_VIDEO_AD_SLOT_ID"
            data-ad-format="fluid"
            data-adtest="on"
          />

          {/* Test Mode Overlay */}
          <div className="relative z-10 text-white text-center p-8">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-2xl font-bold mb-2">Watching Video Ad...</h3>
            <div className="text-4xl font-mono mb-2">{timeLeft}s</div>
            <p className="text-sm text-gray-300">
              Please wait to unlock your coupon
            </p>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700">
            <div
              className="h-full bg-green-500 transition-all duration-1000"
              style={{ width: `${((30 - timeLeft) / 30) * 100}%` }}
            />
          </div>
        </div>

        {adError ? (
          <div className="bg-yellow-50 border-t border-yellow-200 p-3 text-sm text-yellow-800">
            ⚠️ {adError}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-8 text-center">
      <div className="text-6xl mb-4">🎬</div>
      <h3 className="text-2xl font-bold text-purple-900 mb-2">
        Watch Ad to Unlock Coupon
      </h3>
      <p className="text-purple-700 mb-6">
        Watch a short video to redeem {couponName}
      </p>

      <button
        onClick={handleWatchAd}
        className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform transition hover:scale-105"
      >
        Watch Video (30s)
      </button>

      <div className="mt-6 text-sm text-gray-600">
        <p>✨ Free coupons in exchange for watching ads</p>
        <p>🎯 Support local restaurants and save money</p>
      </div>
    </div>
  );
}
