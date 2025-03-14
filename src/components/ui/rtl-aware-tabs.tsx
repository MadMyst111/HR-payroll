import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface RTLAwareTabsProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function RTLAwareTabs({
  children,
  value,
  onValueChange,
  className = "",
}: RTLAwareTabsProps) {
  const { isRTL } = useLanguage();

  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      className={`rtl-aware-tabs ${isRTL ? "rtl" : "ltr"} ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {children}
    </Tabs>
  );
}

interface RTLAwareTabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function RTLAwareTabsList({
  children,
  className = "",
}: RTLAwareTabsListProps) {
  const { isRTL } = useLanguage();

  return (
    <TabsList
      className={`rtl-aware-tabs-list ${isRTL ? "flex-row-reverse" : "flex-row"} ${className}`}
    >
      {children}
    </TabsList>
  );
}

interface RTLAwareTabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function RTLAwareTabsTrigger({
  children,
  value,
  className = "",
}: RTLAwareTabsTriggerProps) {
  return (
    <TabsTrigger
      value={value}
      className={`rtl-aware-tabs-trigger ${className}`}
    >
      {children}
    </TabsTrigger>
  );
}

interface RTLAwareTabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export function RTLAwareTabsContent({
  children,
  value,
  className = "",
}: RTLAwareTabsContentProps) {
  const { isRTL } = useLanguage();

  return (
    <TabsContent
      value={value}
      className={`rtl-aware-tabs-content ${isRTL ? "text-right" : "text-left"} ${className}`}
    >
      {children}
    </TabsContent>
  );
}
