import AsyncStorage from "@react-native-async-storage/async-storage";
import { LanguageContext } from "@/hooks/use-language";
import { translate } from "@/lib/i18n";
import { Language } from "@/types/language-types";
import { useEffect, useState } from "react";

const LANGUAGE_STORAGE_KEY = "app_language";

interface LanguageProviderProps {
  children: React.ReactNode;
}

export default function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((stored) => {
      if (stored === "en" || stored === "ru") {
        setLanguageState(stored);
      }
    });
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, next).catch(() => {});
  };

  const t = (
    key: Parameters<typeof translate>[1],
    params?: Parameters<typeof translate>[2],
  ) => translate(language, key, params);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
