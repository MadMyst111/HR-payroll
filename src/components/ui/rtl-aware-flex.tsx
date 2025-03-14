import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RTLAwareFlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: "row" | "column";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "start" | "end" | "center" | "stretch" | "baseline";
  gap?: number;
}

/**
 * A flex container component that automatically adjusts for RTL layout
 */
export function RTLAwareFlex({
  children,
  className = "",
  direction = "row",
  justify = "start",
  align = "start",
  gap = 4,
}: RTLAwareFlexProps) {
  const { isRTL } = useLanguage();

  // Adjust direction for RTL
  const rtlDirection = direction === "row" && isRTL ? "row-reverse" : direction;

  // Adjust justify for RTL
  let rtlJustify = justify;
  if (isRTL && direction === "row") {
    if (justify === "start") rtlJustify = "end";
    else if (justify === "end") rtlJustify = "start";
  }

  return (
    <div
      className={`rtl-aware-flex flex flex-${rtlDirection} justify-${rtlJustify} items-${align} gap-${gap} ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );
}

interface RTLAwareFlexItemProps {
  children: React.ReactNode;
  className?: string;
  grow?: boolean;
  shrink?: boolean;
  basis?: string;
}

/**
 * A flex item component that automatically adjusts for RTL layout
 */
export function RTLAwareFlexItem({
  children,
  className = "",
  grow = false,
  shrink = true,
  basis = "auto",
}: RTLAwareFlexItemProps) {
  const { isRTL } = useLanguage();

  return (
    <div
      className={`rtl-aware-flex-item ${grow ? "flex-grow" : ""} ${shrink ? "flex-shrink" : ""} flex-basis-${basis} ${isRTL ? "text-right" : "text-left"} ${className}`}
    >
      {children}
    </div>
  );
}
