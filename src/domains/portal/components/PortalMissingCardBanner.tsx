"use client";

import { AlertCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useMyPaymentMethod } from "@/domains/portal/hooks";
import { Button } from "@/shared/components/Button";

const PAYMENT_PATH = "/portal/payment";

export function PortalMissingCardBanner(): React.JSX.Element | null {
  const pathname = usePathname();
  const router = useRouter();
  const paymentMethodQuery = useMyPaymentMethod();

  if (pathname === PAYMENT_PATH) {
    return null;
  }

  if (
    paymentMethodQuery.isLoading ||
    paymentMethodQuery.isPending ||
    paymentMethodQuery.isError
  ) {
    return null;
  }

  if (paymentMethodQuery.data) {
    return null;
  }

  return (
    <div
      role="alert"
      className="sticky top-16 lg:top-0 z-20 bg-red-600 text-white"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold">
            Necesitas agregar una tarjeta de pago para tu cuenta.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="h-9 px-4 rounded-full font-bold shrink-0 bg-white text-red-700 hover:bg-white/90"
          onClick={() => router.push(PAYMENT_PATH)}
        >
          Agregar tarjeta
        </Button>
      </div>
    </div>
  );
}
