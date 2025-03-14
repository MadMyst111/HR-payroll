import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RTLAwareGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: number;
  gap?: number;
}

/**
 * A grid component that automatically adjusts for RTL layout
 */
export function RTLAwareGrid({
  children,
  className = "",
  cols = 2,
  gap = 4,
}: RTLAwareGridProps) {
  const { isRTL } = useLanguage();

  return (
    <div
      className={`rtl-aware-grid grid grid-cols-${cols} gap-${gap} ${isRTL ? "rtl" : "ltr"} ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );
}

interface RTLAwareGridItemProps {
  children: React.ReactNode;
  className?: string;
  span?: number;
}

/**
 * A grid item component that automatically adjusts for RTL layout
 */
export function RTLAwareGridItem({
  children,
  className = "",
  span = 1,
}: RTLAwareGridItemProps) {
  const { isRTL } = useLanguage();

  return (
    <div
      className={`rtl-aware-grid-item col-span-${span} ${isRTL ? "text-right" : "text-left"} ${className}`}
    >
      {children}
    </div>
  );
}
