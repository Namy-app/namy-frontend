"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface DiscountSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  discountPercentage: number;
  points: number;
}

export function DiscountSuccessModal({
  isOpen,
  onClose,
  restaurantName,
  discountPercentage,
  points,
}: DiscountSuccessModalProps): React.JSX.Element | null {
  const router = useRouter();
  const [confetti, setConfetti] = useState<
    Array<{ left: string; delay: string }>
  >([]);
  const hasGenerated = useRef(false);

  useEffect(() => {
    if (isOpen && !hasGenerated.current) {
      // Generate random confetti - doing this in effect is allowed
      const confettiItems: Array<{ left: string; delay: string }> = [];

      for (let i = 0; i < 50; i++) {
        confettiItems.push({
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 0.5}s`,
        });
      }

      // Update state in a microtask to avoid synchronous setState-in-effect warning
      const t = setTimeout(() => setConfetti(confettiItems), 0);
      hasGenerated.current = true;
      return () => clearTimeout(t);
    } else if (!isOpen) {
      hasGenerated.current = false;
    }
    return undefined;
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleUseNow = (): void => {
    router.push("/my-coupons");
  };

  const handleSaveForLater = (): void => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="confetti-container">
        {confetti.map((item, index) => (
          <div
            key={index}
            className="confetti"
            style={{
              left: item.left,
              animationDelay: item.delay,
            }}
          />
        ))}
      </div>
      <div className="points-float">+{points} points Ñamy 🎉</div>
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="rounded-lg bg-card text-card-foreground shadow-sm p-8 bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-glow animate-scale-in">
          <div className="text-center text-white">
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h2 className="text-3xl font-bold mb-2 animate-fade-in">
              Discount unlocked!
            </h2>
            <p className="text-white/90 mb-6 text-lg">
              {discountPercentage}% OFF at {restaurantName}
            </p>
            <div className="bg-white p-6 rounded-2xl mb-6 qr-glow animate-scale-in">
              <div className="w-48 h-48 bg-gradient-to-br from-gray-50 to-gray-100 mx-auto rounded-xl flex items-center justify-center border-2 border-gray-200">
                <div className="text-center">
                  <span className="text-6xl">📱</span>
                  <p className="text-xs text-gray-700 font-semibold mt-2">
                    Scan QR Code
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-white/90 mb-6">
              Show this code when paying
            </p>
            <div className="space-y-3">
              <button
                onClick={handleUseNow}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 px-8 w-full bg-white text-green-600 hover:bg-white/90 font-bold rounded-full shadow-lg"
              >
                Use now 🎯
              </button>
              <button
                onClick={handleSaveForLater}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background hover:text-accent-foreground h-11 px-8 w-full border-white/30 text-white hover:bg-white/10 rounded-full"
              >
                Save for later 💾
              </button>
            </div>
            <p className="text-xs text-white/80 mt-4">Valid for 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
