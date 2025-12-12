"use client";

import { useEffect, useRef, useState } from "react";

interface CongratulationsModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function CongratulationsModal({
  isOpen,
  onComplete,
}: CongratulationsModalProps): React.JSX.Element | null {
  const [confetti, setConfetti] = useState<
    Array<{ left: string; delay: string; icon: string }>
  >([]);
  const hasAutoClosed = useRef(false);
  const hasGenerated = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      hasAutoClosed.current = false;
      hasGenerated.current = false;
      return undefined;
    }

    if (!hasGenerated.current) {
      const icons = ["✨", "🎉", "💫", "🌟"];
      const confettiItems: Array<{
        left: string;
        delay: string;
        icon: string;
      }> = [];

      for (let i = 0; i < 30; i++) {
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        confettiItems.push({
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 0.5}s`,
          icon: randomIcon || "✨",
        });
      }

      // Schedule state update to avoid synchronous setState inside effect
      const t = setTimeout(() => setConfetti(confettiItems), 0);
      hasGenerated.current = true;

      // Auto close after 2 seconds and proceed to next screen
      if (!hasAutoClosed.current) {
        hasAutoClosed.current = true;
        const closeTimer = setTimeout(() => {
          onComplete();
        }, 2000);

        return () => {
          clearTimeout(t);
          clearTimeout(closeTimer);
        };
      }
    }

    return undefined;
  }, [isOpen, onComplete]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="rounded-lg border text-card-foreground shadow-sm w-full max-w-md p-6 bg-card border-border shadow-glow">
        <div className="text-center animate-bounce-in">
          <div className="text-8xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-primary mb-2">You Did It!</h3>
          <p className="text-muted-foreground">
            Discount unlocked! +100 points earned
          </p>
          <div className="fixed inset-0 pointer-events-none">
            {confetti.map((item, index) => (
              <div
                key={index}
                className="absolute animate-confetti"
                style={{
                  left: item.left,
                  top: "-20px",
                  animationDelay: item.delay,
                }}
              >
                {item.icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
