import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RTLAwareCardProps {
  children: React.ReactNode;
  className?: string;
}

export function RTLAwareCard({ children, className = "" }: RTLAwareCardProps) {
  const { isRTL } = useLanguage();

  return (
    <Card className={`rtl-aware-card ${isRTL ? "rtl" : "ltr"} ${className}`}>
      {children}
    </Card>
  );
}

export function RTLAwareCardHeader({
  children,
  className = "",
}: RTLAwareCardProps) {
  const { isRTL } = useLanguage();

  return (
    <CardHeader
      className={`rtl-aware-card-header ${isRTL ? "text-right" : "text-left"} ${className}`}
    >
      {children}
    </CardHeader>
  );
}

export function RTLAwareCardTitle({
  children,
  className = "",
}: RTLAwareCardProps) {
  return (
    <CardTitle className={`rtl-aware-card-title ${className}`}>
      {children}
    </CardTitle>
  );
}

export function RTLAwareCardDescription({
  children,
  className = "",
}: RTLAwareCardProps) {
  return (
    <CardDescription className={`rtl-aware-card-description ${className}`}>
      {children}
    </CardDescription>
  );
}

export function RTLAwareCardContent({
  children,
  className = "",
}: RTLAwareCardProps) {
  const { isRTL } = useLanguage();

  return (
    <CardContent
      className={`rtl-aware-card-content ${isRTL ? "text-right" : "text-left"} ${className}`}
    >
      {children}
    </CardContent>
  );
}

export function RTLAwareCardFooter({
  children,
  className = "",
}: RTLAwareCardProps) {
  const { isRTL } = useLanguage();

  return (
    <CardFooter
      className={`rtl-aware-card-footer ${isRTL ? "flex-row-reverse" : "flex-row"} ${className}`}
    >
      {children}
    </CardFooter>
  );
}
