import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button, ButtonProps } from "@/components/ui/button";

interface RTLAwareButtonProps extends ButtonProps {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

/**
 * A button component that automatically adjusts icon placement for RTL layout
 */
export function RTLAwareButton({
  children,
  className = "",
  iconLeft,
  iconRight,
  ...props
}: RTLAwareButtonProps) {
  const { isRTL } = useLanguage();

  // In RTL mode, swap left and right icons
  const leftIcon = isRTL ? iconRight : iconLeft;
  const rightIcon = isRTL ? iconLeft : iconRight;

  return (
    <Button className={`rtl-aware-button ${className}`} {...props}>
      {leftIcon && <span className={isRTL ? "ml-2" : "mr-2"}>{leftIcon}</span>}
      {children}
      {rightIcon && (
        <span className={isRTL ? "mr-2" : "ml-2"}>{rightIcon}</span>
      )}
    </Button>
  );
}
