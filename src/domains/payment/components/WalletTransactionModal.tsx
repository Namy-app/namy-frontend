"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { createPortal } from "react-dom";

interface WalletTransactionModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function WalletTransactionModal({
  isOpen,
  isSuccess,
  title,
  message,
  onClose,
}: WalletTransactionModalProps) {
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

        {/* Content */}
        <div className="flex flex-col items-center justify-center text-center">
          {/* Icon */}
          {isSuccess ? (
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
          ) : (
            <AlertCircle className="w-16 h-16 text-destructive mb-6" />
          )}

          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>

          {/* Message */}
          <p className="text-base text-muted-foreground whitespace-pre-line">
            {message}
          </p>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`mt-8 w-full px-6 py-2 rounded-lg transition-colors ${
              isSuccess
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
