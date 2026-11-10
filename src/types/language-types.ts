import type { TranslationKey } from "@/lib/i18n";

export type Language = "en" | "ru";

export type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};
