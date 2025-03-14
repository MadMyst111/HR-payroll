import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ArabicNumberProps {
  value: number;
  currency?: boolean;
  currencySymbol?: string;
  className?: string;
}

/**
 * Component to display numbers in Arabic or English format based on current language
 */
export function ArabicNumber({
  value,
  currency = false,
  currencySymbol = "ج.م",
  className = "",
}: ArabicNumberProps) {
  const { isRTL, formatNumber } = useLanguage();

  const formattedNumber = formatNumber(value);

  return (
    <span className={`arabic-number ${className}`}>
      {currency ? (
        isRTL ? (
          <>
            {formattedNumber} {currencySymbol}
          </>
        ) : (
          <>
            {currencySymbol} {formattedNumber}
          </>
        )
      ) : (
        formattedNumber
      )}
    </span>
  );
}
