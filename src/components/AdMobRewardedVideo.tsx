'use client';

import { useEffect, useState } from 'react';

interface AdMobRewardedVideoProps {
  onAdComplete: () => void;
  onAdSkipped?: () => void;
  onAdError?: (error: Error) => void;
  couponName?: string;
}

/**
 * AdMob Rewarded Video Integration
 * This uses Google AdMob which has much better video ad inventory than AdSense
 *
 * Setup:
 * 1. Create AdMob account: https://admob.google.com
 * 2. Create an app (can be web app)
 * 3. Create a Rewarded ad unit
 * 4. Get the Ad Unit ID
 * 5. Add it to .env as NEXT_PUBLIC_ADMOB_REWARDED_AD_ID
 */
export function AdMobRewardedVideo({
  onAdComplete,
  onAdSkipped: _onAdSkipped,
  onAdError,
  couponName = 'your coupon',
}: AdMobRewardedVideoProps): React.JSX.Element {
  const [adWatched, setAdWatched] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const adUnitId = process.env.NEXT_PUBLIC_ADMOB_REWARDED_AD_ID;

  useEffect(() => {
    // Load AdMob SDK
    const loadAdMobSDK = () => {
      if (typeof window !== 'undefined' && !window.admob) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        script.onload = () => {
          console.log('AdMob SDK loaded');
        };
        document.head.appendChild(script);
      }
    };

    loadAdMobSDK();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (isPlaying && timeLeft === 0) {
      setAdWatched(true);
      setIsPlaying(false);
      onAdComplete();
    }
    return undefined;
  }, [isPlaying, timeLeft, onAdComplete]);

  const handleWatchAd = async () => {
    if (!adUnitId) {
      setAdError('AdMob Ad Unit ID not configured');
      console.error('Missing NEXT_PUBLIC_ADMOB_REWARDED_AD_ID');
      // Fall back to test mode
      setIsPlaying(true);
      setTimeLeft(30);
      return;
    }

    setIsLoading(true);

    try {
      // For web, we'll use AdSense rewarded format
      // This is a placeholder - real implementation would use AdMob SDK
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsLoading(false);
      setIsPlaying(true);
      setTimeLeft(30); // Reset timer
    } catch (error) {
      setIsLoading(false);
      setAdError('Failed to load video ad');
      if (onAdError) {
        onAdError(error as Error);
      }
    }
  };

  if (adWatched) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 rounded-2xl p-8 text-center shadow-2xl">
        <div className="text-green-600 text-7xl mb-6 animate-bounce">✓</div>
        <h3 className="text-3xl font-bold text-green-900 mb-3">
          Ad Complete!
        </h3>
        <p className="text-xl text-green-700 mb-6">
          You can now redeem {couponName}
        </p>
        <div className="inline-flex items-center gap-2 bg-green-100 px-6 py-3 rounded-full">
          <span className="text-2xl">🎁</span>
          <span className="font-semibold text-green-800">Coupon Unlocked</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-2xl p-12 text-center">
        <div className="animate-spin text-6xl mb-4">⏳</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Loading Video Ad...
        </h3>
        <p className="text-gray-600">Please wait a moment</p>
      </div>
    );
  }

  if (isPlaying) {
    return (
      <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
        {/* Video Ad Container */}
        <div className="aspect-video bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center relative">
          {/* Simulated Video Ad - Replace with real AdMob integration */}
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 text-white text-center p-8">
            <div className="text-7xl mb-6 animate-pulse">🎬</div>
            <h3 className="text-3xl font-bold mb-4">
              Video Ad Playing...
            </h3>
            <div className="text-6xl font-mono font-bold mb-3 bg-white/10 backdrop-blur-sm px-8 py-4 rounded-2xl">
              {timeLeft}s
            </div>
            <p className="text-lg text-gray-300">
              Please wait to unlock your coupon
            </p>
            <div className="mt-6 text-sm text-gray-400">
              🎯 Watching ad to support local restaurants
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${((30 - timeLeft) / 30) * 100}%` }}
            />
          </div>

          {/* Skip Prevention Message */}
          <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
            🚫 Cannot Skip
          </div>
        </div>

        {adError && (
          <div className="bg-yellow-50 border-t-2 border-yellow-300 p-4 text-center">
            <span className="text-yellow-800">⚠️ {adError}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-2 border-purple-300 rounded-2xl p-10 text-center shadow-2xl">
      <div className="text-7xl mb-6 animate-bounce">🎥</div>
      <h3 className="text-3xl font-bold text-purple-900 mb-3">
        Watch Video Ad
      </h3>
      <p className="text-xl text-purple-700 mb-2">
        Unlock {couponName}
      </p>
      <p className="text-gray-600 mb-8">
        Watch a 30-second video to redeem your coupon
      </p>

      <button
        onClick={handleWatchAd}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white font-bold py-5 px-10 rounded-full text-xl shadow-xl transform transition hover:scale-105 active:scale-95"
      >
        <span className="flex items-center gap-3">
          <span className="text-2xl">▶️</span>
          <span>Watch Video (30s)</span>
        </span>
      </button>

      <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-sm font-semibold text-gray-700">30 Seconds</div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
          <div className="text-3xl mb-2">🎁</div>
          <div className="text-sm font-semibold text-gray-700">100% Free</div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-sm font-semibold text-gray-700">Big Savings</div>
        </div>
      </div>

      {!adUnitId && (
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">📝 Developer Note:</p>
          <p>Add NEXT_PUBLIC_ADMOB_REWARDED_AD_ID to .env for real video ads</p>
        </div>
      )}
    </div>
  );
}

// Add to window object for TypeScript
declare global {
  interface Window {
    admob?: any;
  }
}
