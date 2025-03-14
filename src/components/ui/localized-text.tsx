import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LocalizedTextProps {
  en: string;
  ar: string;
  className?: string;
}

/**
 * Component to display text in Arabic or English based on current language
 */
export function LocalizedText({ en, ar, className = "" }: LocalizedTextProps) {
  const { getLocalizedText } = useLanguage();

  return (
    <span className={`localized-text ${className}`}>
      {getLocalizedText(en, ar)}
    </span>
  );
}
