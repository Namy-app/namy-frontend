"use client";

import { Capacitor } from "@capacitor/core";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export const COUPON_GENERATION_ANIMATION_URL =
  "https://namy-app.s3.us-west-2.amazonaws.com/video-ads/coupon_animation.mp4";

/**
 * Hidden video that warms the browser cache as soon as the store page mounts,
 * so the fullscreen overlay can start with zero buffering lag.
 */
export function CouponAnimationPreloader(): React.JSX.Element {
  return (
    <video
      src={COUPON_GENERATION_ANIMATION_URL}
      preload="auto"
      muted
      playsInline
      aria-hidden
      tabIndex={-1}
      style={{ display: "none" }}
    />
  );
}

interface CouponGenerationAnimationProps {
  isOpen: boolean;
}

/**
 * Full-screen looping MP4 overlay that replaces the "Generando Cupón" spinner.
 * Parent opens it immediately on unlock tap and closes it only after the API
 * responds (isOpen → false). No onEnded-driven dismiss.
 */
export function CouponGenerationAnimation({
  isOpen,
}: CouponGenerationAnimationProps): React.JSX.Element | null {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    // Ensure muted before play() — required for autoplay on iOS Safari/WKWebView
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    if (isOpen) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        void playPromise.catch(() => {
          // Autoplay blocked — overlay still covers the screen; parent will close it
        });
      }
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isOpen]);

  if (!isOpen || typeof window === "undefined") {
    return null;
  }

  const isNativeApp = Capacitor.isNativePlatform();

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Generando cupón"
    >
      <video
        ref={videoRef}
        src={COUPON_GENERATION_ANIMATION_URL}
        className={
          isNativeApp
            ? "h-full w-full object-cover"
            : "h-auto w-full max-h-[85vh] max-w-[390px] object-contain"
        }
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
      />
    </div>,
    document.body
  );
}
