"use client";

import { X, Play, CreditCard } from "lucide-react";

import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { useAuthStore } from "@/store/useAuthStore";

interface UnlockDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchAd: () => void;
  onQuickPay: () => void;
}

export function UnlockDiscountModal({
  isOpen,
  onClose,
  onWatchAd,
  onQuickPay,
}: UnlockDiscountModalProps): React.JSX.Element | null {
  const { data: levelInfo } = useMyLevel();
  const { user } = useAuthStore();
  const discountPercentage =
    (user?.isPremium ? 15 : levelInfo?.discountPercentage) ?? 10;
  const levelName = levelInfo?.levelName ?? "Novato";

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-9999 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-lime-300 h-10 w-10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="rounded-lg border text-card-foreground shadow-sm p-8 bg-card border-border shadow-card">
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
            ¡Desbloquea tu {discountPercentage}% de descuento!
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Nivel: {levelName}
          </p>
          <div className="space-y-4 mt-6">
            <div className="rounded-lg text-card-foreground shadow-sm p-6 bg-gradient-primary border-0 hover:shadow-glow transition-all cursor-pointer group">
              <button onClick={onWatchAd} className="w-full">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold text-white mb-1">
                      Ver Anuncio
                    </h3>
                    <p className="text-white/90 text-sm">
                      Gratis • 30 segundos
                    </p>
                  </div>
                </div>
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">O</span>
              </div>
            </div>
            <div className="rounded-lg text-card-foreground bg-lime-300 shadow-sm p-6 bg-secondary border-0 hover:shadow-glow transition-all cursor-pointer group">
              <button onClick={onQuickPay} className="w-full">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CreditCard className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold text-secondary-foreground mb-1">
                      Pago Rápido
                    </h3>
                    <p className="text-secondary-foreground/80 text-sm">
                      $9 MXN • Sin anuncios
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-6">
            Al desbloquear obtendrás un código QR único para usar en el
            restaurante/almacenar
          </p>
        </div>
      </div>
    </div>
  );
}
