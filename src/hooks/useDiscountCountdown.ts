import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  calculateNextAvailableTime,
  formatCountdown,
  isDiscountValid,
} from "@/lib/discount-utils";

interface Discount {
  id?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  availableDaysAndTimes?: {
    availableDays: Array<{
      dayIndex: number;
      timeRanges: Array<{
        start: string;
        end: string;
      }>;
    }>;
  };
}

interface UseDiscountCountdownReturn {
  isValid: boolean;
  countdownText: string;
}

/**
 * Countdown until the discount becomes available (schedule / validity).
 * Uses a single interval per discount target to avoid duplicate timer strings in UI.
 */
export function useDiscountCountdown(
  discount?: Discount | null
): UseDiscountCountdownReturn {
  const queryClient = useQueryClient();
  const [countdownText, setCountdownText] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const discountId = discount?.id;
  const isValid = useMemo(() => isDiscountValid(discount), [discount]);
  const nextAvailableTimeMs = useMemo(() => {
    const next = calculateNextAvailableTime(discount);
    return next?.getTime() ?? null;
  }, [discount, discountId]);

  useEffect(() => {
    const stopInterval = (): void => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (nextAvailableTimeMs == null || isValid) {
      stopInterval();
      const clearTimer = setTimeout(() => setCountdownText(""), 0);
      return () => {
        clearTimeout(clearTimer);
        stopInterval();
      };
    }

    const tick = (): void => {
      const diff = nextAvailableTimeMs - Date.now();

      if (diff <= 0) {
        setCountdownText("Disponible ahora");
        stopInterval();
        void queryClient.invalidateQueries({ queryKey: ["discounts"] });
        void queryClient.invalidateQueries({ queryKey: ["stores"] });
        return;
      }

      setCountdownText(formatCountdown(diff));
    };

    tick();
    stopInterval();
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      stopInterval();
    };
  }, [isValid, nextAvailableTimeMs, queryClient, discountId]);

  return {
    isValid,
    countdownText,
  };
}
