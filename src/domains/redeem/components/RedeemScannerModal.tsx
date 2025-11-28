"use client";

import { X, AlertCircle } from "lucide-react";
import React from "react";

type Props = {
  show: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onClose: () => void;
};

export default function RedeemScannerModal({
  show,
  videoRef,
  onClose,
}: Props): React.JSX.Element | null {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">Scan QR Code</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative bg-black rounded-xl overflow-hidden mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 border-4 border-primary/50 rounded-xl pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary rounded-xl" />
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center mb-2">
          Position the QR code within the frame
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-xs text-blue-800 text-center">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Scanning automatically... The code will be detected when in focus
          </p>
        </div>
      </div>
    </div>
  );
}
