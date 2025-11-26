"use client";

import { Camera, QrCode } from "lucide-react";

type Props = {
  onStartCamera: () => void;
  onUpload: (file: File) => void;
};

export default function RedeemScanOptions({
  onStartCamera,
  onUpload,
}: Props): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onStartCamera}
        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary/20 text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors"
      >
        <Camera className="w-5 h-5" />
        <span className="text-sm">Scan Camera</span>
      </button>

      <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-secondary/20 text-secondary rounded-xl font-semibold hover:bg-secondary/5 transition-colors cursor-pointer">
        <QrCode className="w-5 h-5" />
        <span className="text-sm">Upload QR</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onUpload(e.target.files[0]);
            }
          }}
        />
      </label>
    </div>
  );
}
