"use client";

import { CreditCard } from "lucide-react";

import { formatCardBrand } from "@/domains/portal/utils";

interface PortalCardBrandIconProps {
  brand: string;
}

export function PortalCardBrandIcon({
  brand,
}: PortalCardBrandIconProps): React.JSX.Element {
  const key = brand.toLowerCase();
  if (key === "visa") {
    return (
      <span className="inline-flex h-8 min-w-12 items-center justify-center rounded-md bg-[#1A1F71] px-2 text-xs font-bold tracking-wide text-white">
        VISA
      </span>
    );
  }
  if (key === "mastercard") {
    return (
      <span className="inline-flex h-8 min-w-12 items-center justify-center rounded-md bg-[#111] px-2">
        <span className="flex items-center">
          <span className="h-4 w-4 rounded-full bg-[#EB001B]" />
          <span className="-ml-2 h-4 w-4 rounded-full bg-[#F79E1B]" />
        </span>
      </span>
    );
  }
  if (key === "amex" || key === "american_express") {
    return (
      <span className="inline-flex h-8 min-w-12 items-center justify-center rounded-md bg-[#2E77BC] px-2 text-[10px] font-bold tracking-wide text-white">
        AMEX
      </span>
    );
  }
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-md bg-muted px-2 text-xs font-semibold text-foreground">
      <CreditCard className="w-3.5 h-3.5" />
      {formatCardBrand(brand)}
    </span>
  );
}
