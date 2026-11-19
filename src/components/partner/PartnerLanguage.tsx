"use client";

import { useEffect } from "react";

import { useAppTranslation } from "@/lib/i18n/useAppTranslation";

export function PartnerLanguage(): null {
  const { i18n } = useAppTranslation();
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n]);
  return null;
}
