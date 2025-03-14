import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ArabicDateProps {
  date: string | Date;
  format?: "short" | "medium" | "long" | "full";
  className?: string;
}

/**
 * Component to display dates in Arabic or English format based on current language
 */
export function ArabicDate({
  date,
  format = "medium",
  className = "",
}: ArabicDateProps) {
  const { language, formatDate } = useLanguage();

  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Format options based on requested format
  let options: Intl.DateTimeFormatOptions = {};

  switch (format) {
    case "short":
      options = { day: "numeric", month: "numeric", year: "numeric" };
      break;
    case "medium":
      options = { day: "numeric", month: "short", year: "numeric" };
      break;
    case "long":
      options = { day: "numeric", month: "long", year: "numeric" };
      break;
    case "full":
      options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      break;
  }

  const formattedDate = new Intl.DateTimeFormat(
    language === "ar" ? "ar-EG" : "en-US",
    options,
  ).format(dateObj);

  return <span className={`arabic-date ${className}`}>{formattedDate}</span>;
}
