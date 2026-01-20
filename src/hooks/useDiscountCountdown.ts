import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  calculateNextAvailableTime,
  formatCountdown,
  isDiscountValid,
} from "@/lib/discount-utils";

interface Discount {
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
 * Optimized hook for managing discount countdown without excessive re-renders
 * Updates countdown display every second using refs, only re-renders when validity changes
 */
export function useDiscountCountdown(
  discount?: Discount | null
): UseDiscountCountdownReturn {
  const queryClient = useQueryClient();
  const [countdownText, setCountdownText] = useState("");
  const countdownRef = useRef("");

  // Memoize validity and next available time
  const isValid = useMemo(() => isDiscountValid(discount), [discount]);
  const nextAvailableTime = useMemo(
    () => calculateNextAvailableTime(discount),
    [discount]
  );

  // Countdown timer - only updates text, minimal re-renders
  useEffect(() => {
    if (!nextAvailableTime || isValid) {
      // Clear countdown asynchronously to avoid cascading renders
      const timer = setTimeout(() => setCountdownText(""), 0);
      return () => clearTimeout(timer);
    }

    const updateCountdown = () => {
      const now = Date.now();
      const diff = nextAvailableTime.getTime() - now;

      if (diff <= 0) {
        // Discount is now available - invalidate queries to refresh
        setCountdownText("Disponible ahora");

        // Refresh discount data instead of full page reload
        void queryClient.invalidateQueries({ queryKey: ["discounts"] });
        void queryClient.invalidateQueries({ queryKey: ["stores"] });

        return;
      }

      const formatted = formatCountdown(diff);

      // Only update state if the text actually changed (reduces re-renders)
      if (formatted !== countdownRef.current) {
        countdownRef.current = formatted;
        setCountdownText(formatted);
      }
    };

    // Update immediately
    updateCountdown();

    // Then update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isValid, nextAvailableTime, queryClient]);

  return {
    isValid,
    countdownText,
  };
}
