import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RTLContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A container component that automatically applies RTL styling based on the current language
 */
export function RTLContainer({ children, className = "" }: RTLContainerProps) {
  const { isRTL } = useLanguage();

  return (
    <div
      className={`${className} ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );
}

export function RTLAwareContainer({
  children,
  className = "",
}: RTLContainerProps) {
  const { isRTL } = useLanguage();

  return (
    <div
      className={`rtl-aware-container ${className} ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );
}
