export type RedeemAvailabilityErrorDisplay = {
  title: string;
  description: string;
};

const REDEEM_AVAILABILITY_ERRORS: Record<
  string,
  RedeemAvailabilityErrorDisplay
> = {
  "Discount is not available today. Please try again on an allowed day.": {
    title: "Descuento no disponible hoy",
    description:
      "Este descuento no se puede canjear hoy. Consulta los horarios permitidos e inténtalo en un día válido.",
  },
  "Discount is not available at this time": {
    title: "Fuera del horario permitido",
    description:
      "Este descuento no está activo a esta hora. Revisa los horarios disponibles e inténtalo dentro del rango indicado.",
  },
  "Discount is not available at the moment. Please try again later": {
    title: "No disponible en este momento",
    description:
      "Este descuento no se puede canjear ahora. Inténtalo más tarde dentro del horario permitido.",
  },
};

/**
 * Maps backend redeemCouponByStaff schedule errors to clear staff-facing copy.
 */
export function resolveRedeemAvailabilityError(
  message: string | null | undefined
): RedeemAvailabilityErrorDisplay | null {
  if (!message?.trim()) {
    return null;
  }

  const trimmed = message.trim();
  const exact = REDEEM_AVAILABILITY_ERRORS[trimmed];
  if (exact) {
    return exact;
  }

  const lower = trimmed.toLowerCase();
  if (lower.includes("not available today")) {
    return REDEEM_AVAILABILITY_ERRORS[
      "Discount is not available today. Please try again on an allowed day."
    ]!;
  }
  if (lower.includes("not available at this time")) {
    return REDEEM_AVAILABILITY_ERRORS[
      "Discount is not available at this time"
    ]!;
  }
  if (lower.includes("not available at the moment")) {
    return REDEEM_AVAILABILITY_ERRORS[
      "Discount is not available at the moment. Please try again later"
    ]!;
  }

  return null;
}
