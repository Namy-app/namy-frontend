"use client";

import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface AvailabilityGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AvailabilityGuideModal({
  isOpen,
  onClose,
}: AvailabilityGuideModalProps) {
  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Guía de Disponibilidad
        </h2>

        {/* Availability Guide Items */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-3"> */}
        {/* Disponible ahora */}
        {/* <AvailabilityStatusBadge status="available" /> */}
        {/* Disponible en 2h 15m */}
        {/* <AvailabilityStatusBadge status="soon" /> */}

        {/* No disponible hoy */}
        {/* <AvailabilityStatusBadge status="unavailable" /> */}
        {/* </div> */}
        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-8 w-full px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
