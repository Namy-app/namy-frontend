import {
  PortalBillingStatus,
  PortalInvoiceStatus,
} from "@/domains/portal/types";

export const BILLING_STATUS_BADGE: Record<
  PortalBillingStatus,
  { label: string; className: string }
> = {
  [PortalBillingStatus.ACTIVE]: {
    label: "Activo",
    className: "bg-green-500/20 text-green-700",
  },
  [PortalBillingStatus.PAYMENT_FAILED]: {
    label: "Pago fallido",
    className: "bg-orange-500/20 text-orange-700",
  },
  [PortalBillingStatus.GRACE_PERIOD]: {
    label: "Periodo de gracia",
    className: "bg-yellow-500/20 text-yellow-800",
  },
  [PortalBillingStatus.HIDDEN]: {
    label: "Oculto",
    className: "bg-destructive/20 text-destructive",
  },
};

export const INVOICE_STATUS_BADGE: Record<
  PortalInvoiceStatus,
  { label: string; className: string }
> = {
  [PortalInvoiceStatus.PAID]: {
    label: "Pagado",
    className: "bg-green-500/20 text-green-700",
  },
  [PortalInvoiceStatus.PENDING]: {
    label: "Pendiente",
    className: "bg-orange-500/20 text-orange-700",
  },
  [PortalInvoiceStatus.FAILED]: {
    label: "Fallido",
    className: "bg-destructive/20 text-destructive",
  },
};

export function formatMxn(amount: number | null | undefined): string {
  if (amount == null) {
    return "-";
  }
  return `$${amount.toLocaleString("es-MX")} MXN`;
}

export function formatCentsAsMxn(cents: number | null | undefined): string {
  if (cents == null) {
    return "-";
  }
  return `$${(cents / 100).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} MXN`;
}

export function formatPortalDate(
  value: string | Date | null | undefined
): string {
  if (!value) {
    return "";
  }
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatInvoiceMonth(month: string): string {
  const [year, rawMonth] = month.split("-");
  if (!year || !rawMonth) {
    return month;
  }
  const date = new Date(Number(year), Number(rawMonth) - 1, 1);
  if (Number.isNaN(date.getTime())) {
    return month;
  }
  const label = date.toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatPortalDiscountValue(type: string, value: number): string {
  const normalized = type.toUpperCase();
  if (normalized === "PERCENTAGE") {
    return `${value}% OFF`;
  }
  if (normalized === "FIXED") {
    return `$${value} MXN`;
  }
  return String(value);
}

export function formatPortalDiscountType(type: string): string {
  const normalized = type.toUpperCase();
  if (normalized === "PERCENTAGE") {
    return "Porcentaje";
  }
  if (normalized === "FIXED") {
    return "Monto fijo";
  }
  return type;
}

export const PORTAL_WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const PORTAL_DAY_LABELS: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export interface Time12Hour {
  hour: string;
  minute: string;
  period: "AM" | "PM";
}

export function parseTimeTo12Hour(time24: string): Time12Hour {
  const [hourPart, minutePart] = time24.split(":");
  const hours24 = Number(hourPart || "9");
  const minute = String(minutePart || "00").padStart(2, "0");
  const period: "AM" | "PM" = hours24 >= 12 ? "PM" : "AM";
  const hour12 = hours24 % 12 || 12;
  return { hour: String(hour12), minute, period };
}

export function format12HourTo24(
  hour: string,
  minute: string,
  period: "AM" | "PM"
): string {
  let hours = Number(hour);
  if (Number.isNaN(hours)) {
    hours = 9;
  }
  if (period === "AM") {
    hours = hours === 12 ? 0 : hours;
  } else {
    hours = hours === 12 ? 12 : hours + 12;
  }
  return `${String(hours).padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

export const BILLING_THRESHOLD_MXN = 100;

export function getCurrentMexicoMonth(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Cancun",
    year: "numeric",
    month: "2-digit",
  })
    .format(new Date())
    .slice(0, 7);
}

export function formatNextBillingDate(now = new Date()): string {
  const yearMonth = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Cancun",
    year: "numeric",
    month: "2-digit",
  }).format(now);
  const [yearPart, monthPart] = yearMonth.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);
  if (!year || !month) {
    return "";
  }
  const next =
    month === 12
      ? new Date(Date.UTC(year + 1, 0, 1))
      : new Date(Date.UTC(year, month, 1));
  const day = next.toLocaleDateString("es-MX", {
    day: "numeric",
    timeZone: "UTC",
  });
  const monthLabel = next.toLocaleDateString("es-MX", {
    month: "long",
    timeZone: "UTC",
  });
  const nextYear = next.toLocaleDateString("es-MX", {
    year: "numeric",
    timeZone: "UTC",
  });
  return `${day} de ${monthLabel} ${nextYear}`;
}

export function formatPortalDateTime(
  value: string | Date | null | undefined
): string {
  if (!value) {
    return "";
  }
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const dayMonth = date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${dayMonth}, ${time}`;
}

export function formatStoreType(type?: string | null): string {
  const normalized = (type ?? "").toUpperCase();
  if (normalized === "RESTAURANT") {
    return "Restaurante";
  }
  if (normalized === "SERVICE") {
    return "Servicio";
  }
  if (normalized === "PRODUCT") {
    return "Producto";
  }
  return "";
}

export function formatPriceRange(price?: string | null): string {
  const normalized = (price ?? "").toUpperCase();
  if (normalized === "BUDGET") {
    return "$";
  }
  if (normalized === "MODERATE") {
    return "$$";
  }
  if (normalized === "EXPENSIVE") {
    return "$$$";
  }
  if (normalized === "LUXURY") {
    return "$$$$";
  }
  return "";
}

export function formatHoursUntil(expiresAt: string | Date): string {
  const date = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  if (date.getTime() <= Date.now()) {
    return "Expirado";
  }
  const hours = Math.max(
    0,
    Math.ceil((date.getTime() - Date.now()) / (60 * 60 * 1000))
  );
  if (hours < 1) {
    return "Expira en menos de 1 hora";
  }
  if (hours === 1) {
    return "Expira en 1 hora";
  }
  return `Expira en ${hours} horas`;
}

export function getStoreBalance(store: {
  accumulatedBalance?: number | null;
  billing?: { accumulatedBalance?: number | null } | null;
}): number {
  return store.billing?.accumulatedBalance ?? store.accumulatedBalance ?? 0;
}

export function formatCardBrand(brand: string): string {
  const labels: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "American Express",
    american_express: "American Express",
    discover: "Discover",
    diners: "Diners Club",
    jcb: "JCB",
    unionpay: "UnionPay",
  };
  const key = brand.toLowerCase();
  return labels[key] ?? brand.charAt(0).toUpperCase() + brand.slice(1);
}
