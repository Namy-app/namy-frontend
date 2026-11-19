"use client";

import { useTranslation } from "react-i18next";

import { usePartnerStore } from "@/store/usePartnerStore";

import { getI18n } from "./core";

/** Normal Namy stays Spanish; partner sessions follow their configured lang. */
export function useAppTranslation(forcePartner = false) {
  const partner = usePartnerStore((state) => state.partner);
  const language = usePartnerStore((state) =>
    state.partner || forcePartner ? state.lang : "es"
  );
  const result = useTranslation(
    partner || forcePartner ? "translation" : "normal",
    {
      i18n: getI18n(language),
    }
  );
  return {
    t: result.t,
    i18n: result.i18n,
    ready: result.ready,
    locale: language === "en" ? "en-US" : "es-MX",
  };
}

/** For pure formatting helpers called while rendering a translated screen. */
export function getAppTranslator() {
  const { partner, lang } = usePartnerStore.getState();
  return getI18n(partner ? lang : "es").getFixedT(
    partner ? lang : "es",
    partner ? "translation" : "normal"
  );
}
