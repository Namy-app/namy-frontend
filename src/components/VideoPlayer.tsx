"use client";

import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  description?: string;
  duration: number; // in seconds
  autoplay?: boolean;
  onWatchComplete: (watchDuration: number) => void;
  onProgress?: (currentTime: number, duration: number) => void;
}

export function VideoPlayer({
  videoUrl,
  title,
  description,
  duration,
  autoplay = false,
  onWatchComplete,
  onProgress,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  // const progress = (currentTime / duration) * 100;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    // Autoplay if enabled
    if (autoplay) {
      video.play().catch((error) => {
        console.log("Autoplay prevented:", error);
        // If autoplay is blocked, mute and try again
        video.muted = true;
        setIsMuted(true);
        video.play().catch((err) => console.error("Autoplay failed:", err));
      });
    }

    // Track time updates
    const handleTimeUpdate = () => {
      const current = video.currentTime;
      setCurrentTime(current);

      // Report progress
      if (onProgress) {
        onProgress(current, duration);
      }
    };

    // Track playing state
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      setIsPlaying(false);
      // When video ends, mark as completed and report the watch duration
      if (!hasCompleted) {
        setHasCompleted(true);
        onWatchComplete(Math.floor(video.duration)); // Report actual video duration
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [autoplay, duration, hasCompleted, onWatchComplete, onProgress]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (isPlaying) {
      video.pause();
    } else {
      void video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Video Title */}
      {title ? (
        <div className="mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Video Container - Mobile Portrait Aspect Ratio (9:16) */}
      <div className="relative bg-black rounded-lg sm:rounded-xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-50 object-cover"
          playsInline
          preload="auto"
        >
          Your browser does not support video playback.
        </video>

        {/* Custom Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
          {/* Progress Bar */}
          <div className="mb-2 sm:mb-3">
            {/* <div className="h-1.5 sm:h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div> */}
            <div className="flex justify-between text-[10px] sm:text-xs text-white mt-1">
              <span>{formatTime(currentTime)}</span>
              {/* <span>{formatTime(duration)}</span> */}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={togglePlay}
                className="w-full h-full p-2 flex items-center justify-center bg-primary rounded-full hover:bg-primary/80 transition-colors active:scale-95"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="w-full h-full p-2  flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600 transition-colors active:scale-95"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </button>
            </div>

            {/* <div className="text-xs sm:text-sm text-white font-medium">
              {currentTime.toFixed(0)}s / {duration}s
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
