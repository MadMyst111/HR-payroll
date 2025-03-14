import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRTL } from "@/lib/rtl-utils";
import { useSupabase } from "./SupabaseContext";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  getLocalizedText: (enText: string, arText: string) => string;
  formatNumber: (num: number) => string;
  formatDate: (date: string | Date) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { settings } = useSupabase();
  const [language, setLanguage] = useState<Language>("ar");
  const isRTL = language === "ar";

  // Apply RTL direction to document
  useRTL(isRTL);

  // Initialize language from settings if available
  useEffect(() => {
    if (settings?.default_language) {
      setLanguage(settings.default_language as Language);
    }
  }, [settings]);

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "ar" : "en"));
  };

  // Helper function to get localized text based on current language
  const getLocalizedText = (enText: string, arText: string): string => {
    return language === "ar" ? arText : enText;
  };

  // Helper function to format numbers based on locale
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US").format(
      num,
    );
  };

  // Helper function to format dates based on locale
  const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(
      language === "ar" ? "ar-EG" : "en-US",
    ).format(dateObj);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isRTL,
        toggleLanguage,
        setLanguage,
        getLocalizedText,
        formatNumber,
        formatDate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
