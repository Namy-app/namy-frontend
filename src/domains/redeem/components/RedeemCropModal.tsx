"use client";

import { X, AlertCircle, QrCode } from "lucide-react";
import React from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

type Props = {
  show: boolean;
  uploadedImage: string | null;
  onClose: () => void;
  crop: { x: number; y: number };
  setCrop: (c: { x: number; y: number }) => void;
  zoom: number;
  setZoom: (z: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onScan: () => void;
  cropCanvasRef: React.RefObject<HTMLCanvasElement>;
  croppedAreaPixels: Area | null;
};

export default function RedeemCropModal({
  show,
  uploadedImage,
  onClose,
  crop,
  setCrop,
  zoom,
  setZoom,
  onCropComplete,
  onScan,
  cropCanvasRef,
  croppedAreaPixels,
}: Props): React.JSX.Element | null {
  if (!show || !uploadedImage) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">
            Crop QR Code Area
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Adjust the crop area to focus on the QR code, then click &quot;Scan QR
          Code&quot;
        </p>

        <div className="relative bg-black rounded-xl overflow-hidden flex-1 min-h-[400px] mb-4">
          <Cropper
            image={uploadedImage}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Zoom: {zoom.toFixed(1)}x
          </label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <canvas ref={cropCanvasRef} className="hidden" />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onScan}
            disabled={!croppedAreaPixels}
            className="flex-1 py-3 px-4 bg-gradient-primary text-primary-foreground rounded-xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <QrCode className="w-5 h-5" />
            Scan QR Code
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-4">
          <p className="text-xs text-blue-800 text-center">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Drag to reposition • Pinch or use slider to zoom • Make sure the
            entire QR code is visible
          </p>
        </div>
      </div>
    </div>
  );
}
