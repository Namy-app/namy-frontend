"use client";

import { Loader2 } from "lucide-react";
import { createPortal } from "react-dom";

interface GeneratingCouponModalProps {
  isOpen: boolean;
}

export function GeneratingCouponModal({ isOpen }: GeneratingCouponModalProps) {
  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Generando Cupón
          </h2>
          <p className="text-base text-muted-foreground">Por favor espera...</p>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
