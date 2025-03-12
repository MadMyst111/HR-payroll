import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRTL } from "@/lib/rtl-utils";

type LanguageContextType = {
  language: "ar" | "en";
  isRTL: boolean;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const isRTL = language === "ar";

  // Apply RTL direction to document
  useRTL(isRTL);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ar" ? "en" : "ar"));
  };

  return (
    <LanguageContext.Provider value={{ language, isRTL, toggleLanguage }}>
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
