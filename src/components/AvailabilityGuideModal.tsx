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
        <div className="space-y-4">
          {/* Disponible ahora */}
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0" />
            <span className="text-base text-foreground font-medium">
              Disponible ahora
            </span>
          </div>

          {/* Disponible en 2h 15m */}
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-yellow-500 flex-shrink-0" />
            <span className="text-base text-foreground font-medium">
              Disponible bientôt
            </span>
          </div>

          {/* No disponible hoy */}
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0" />
            <span className="text-base text-foreground font-medium">
              No disponible hoy
            </span>
          </div>
        </div>

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
