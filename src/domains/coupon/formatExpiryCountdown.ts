export type CouponExpiryBreakdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

export function getMsUntilExpiry(expiresAt: string): number {
  return new Date(expiresAt).getTime() - Date.now();
}

export function getCouponExpiryBreakdown(
  msRemaining: number
): CouponExpiryBreakdown | null {
  if (msRemaining <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(msRemaining / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalMs: msRemaining };
}

function padTwo(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Formats coupon time remaining for wallet / QR UI.
 * - More than 24h: stable "Nd Nh" (no ticking seconds)
 * - Final 24h: HH:MM:SS urgency clock
 */
export function formatCouponExpiryCountdown(
  msRemaining: number
): string | null {
  const breakdown = getCouponExpiryBreakdown(msRemaining);
  if (!breakdown) {
    return null;
  }

  const { days, hours, minutes, seconds } = breakdown;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  return `${padTwo(hours)}:${padTwo(minutes)}:${padTwo(seconds)}`;
}

/** Tick interval: 1s in final day, 1m when days remain (seconds hidden). */
export function getCouponExpiryCountdownTickMs(msRemaining: number): number {
  const breakdown = getCouponExpiryBreakdown(msRemaining);
  if (!breakdown) {
    return 1000;
  }
  return breakdown.days > 0 ? 60_000 : 1000;
}
