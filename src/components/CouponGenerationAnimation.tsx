"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const COUPON_GENERATION_ANIMATION_URL =
  "https://namy-app.s3.us-west-2.amazonaws.com/video-ads/coupon_animation.mp4";

type WebkitVideo = HTMLVideoElement & {
  webkitDisplayingFullscreen?: boolean;
  webkitExitFullscreen?: () => void;
};

function prepareInlineVideo(video: HTMLVideoElement): void {
  video.muted = true;
  video.defaultMuted = true;
  video.controls = false;
  video.disablePictureInPicture = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("x-webkit-airplay", "deny");
}

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
 *
 * iOS WKWebView treats a viewport-sized <video> as native fullscreen. Exiting
 * that fullscreen (or unmounting the playing video) fires history.back(), which
 * dumps the user off the store page after the coupon was already created.
 */
export function CouponGenerationAnimation({
  isOpen,
}: CouponGenerationAnimationProps): React.JSX.Element | null {
  const videoRef = useRef<HTMLVideoElement>(null);
  const absorbBackRef = useRef(false);
  const [isMounted, setIsMounted] = useState(isOpen);

  if (isOpen && !isMounted) {
    setIsMounted(true);
  }

  // Pause first, then unmount — ripping a playing video out of the DOM is what
  // triggers iOS's fullscreen-dismiss → history.back() navigation.
  useEffect(() => {
    if (isOpen) {
      absorbBackRef.current = true;
      return;
    }

    const video = videoRef.current;
    if (video) {
      video.pause();
    }

    const hideTimer = window.setTimeout(() => {
      setIsMounted(false);
    }, 150);

    return () => {
      window.clearTimeout(hideTimer);
    };
  }, [isOpen]);

  // Absorb the extra history entry iOS adds for video fullscreen, including
  // a short window after close so it cannot race parent navigation.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    absorbBackRef.current = true;
    window.history.pushState(
      { namyCouponAnim: true },
      "",
      window.location.href
    );

    const onPopState = (): void => {
      if (!absorbBackRef.current) {
        return;
      }
      window.history.pushState(
        { namyCouponAnim: true },
        "",
        window.location.href
      );
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.setTimeout(() => {
        absorbBackRef.current = false;
        window.removeEventListener("popstate", onPopState);
      }, 800);
    };
  }, [isOpen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    prepareInlineVideo(video);

    const exitNativeFullscreen = (): void => {
      const webkitVideo = video as WebkitVideo;
      if (webkitVideo.webkitDisplayingFullscreen) {
        webkitVideo.webkitExitFullscreen?.();
      }
    };

    video.addEventListener(
      "webkitbeginfullscreen",
      exitNativeFullscreen as EventListener
    );

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
    }

    return () => {
      video.removeEventListener(
        "webkitbeginfullscreen",
        exitNativeFullscreen as EventListener
      );
    };
  }, [isOpen, isMounted]);

  if ((!isOpen && !isMounted) || typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Generando cupón"
      style={{
        visibility: isOpen ? "visible" : "hidden",
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      {/*
        Keep the video inset (not viewport-sized). A full-bleed <video> on iOS
        WKWebView promotes to native fullscreen and then history.back() on close.
      */}
      <video
        ref={videoRef}
        src={COUPON_GENERATION_ANIMATION_URL}
        className="h-auto w-full max-h-[85vh] max-w-[390px] object-contain"
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        controls={false}
        disablePictureInPicture
      />
    </div>,
    document.body
  );
}
