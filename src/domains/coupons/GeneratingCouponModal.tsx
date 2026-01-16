"use client";

import { Loader2, AlertCircle, X } from "lucide-react";
import { createPortal } from "react-dom";

interface GeneratingCouponModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  error?: string | null;
  onClose?: () => void;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export function GeneratingCouponModal({
  isOpen,
  isLoading = true,
  error = null,
  onClose,
  actionButton,
}: GeneratingCouponModalProps) {
  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl p-8">
        {/* Loading State */}
        {isLoading && !error ? <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Generando Cupón
            </h2>
            <p className="text-base text-muted-foreground">
              Por favor espera...
            </p>
          </div> : null}

        {/* Error State */}
        {error ? <div className="flex flex-col items-center justify-center text-center">
            {onClose ? <button
                onClick={onClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button> : null}
            <AlertCircle className="w-16 h-16 text-destructive mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Error al crear cupón
            </h2>
            <p className="text-base text-muted-foreground whitespace-pre-line">
              {error}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full mt-6">
              {actionButton ? <button
                  onClick={() => {
                    actionButton.onClick();
                    onClose?.();
                  }}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {actionButton.label}
                </button> : null}
              {onClose ? <button
                  onClick={onClose}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    actionButton
                      ? "bg-muted text-foreground hover:bg-muted/80"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {actionButton ? "Cancelar" : "Cerrar"}
                </button> : null}
            </div>
          </div> : null}
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
