import { createInstance, type i18n } from "i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";
import normal from "./locales/normal.json";

export type AppLanguage = "en" | "es";
const instances = new Map<AppLanguage, i18n>();

/** Instances never change language, preventing cross-request SSR language leaks. */
export function getI18n(language: AppLanguage): i18n {
  const existing = instances.get(language);
  if (existing) {
    return existing;
  }
  const instance = createInstance();
  void instance.init({
    lng: language,
    fallbackLng: "es",
    supportedLngs: ["en", "es"],
    resources: {
      en: { translation: en, normal },
      es: { translation: es, normal },
    },
    initAsync: false,
    interpolation: { escapeValue: false },
    returnNull: false,
    react: { useSuspense: false },
  });
  instances.set(language, instance);
  return instance;
}
