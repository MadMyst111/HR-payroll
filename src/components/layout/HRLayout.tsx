import React from "react";
import HRSidebar from "./HRSidebar";
import HRTopNavigation from "./HRTopNavigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRTL } from "@/lib/rtl-utils";

interface HRLayoutProps {
  children: React.ReactNode;
  activeNavItem?: string;
}

const HRLayout = ({ children, activeNavItem }: HRLayoutProps) => {
  const { isRTL } = useLanguage();

  // Apply RTL direction to document
  useRTL(isRTL);

  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? "text-right" : "text-left"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <HRTopNavigation />
      <div
        className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"} h-[calc(100vh-64px)] mt-16`}
      >
        <HRSidebar activeItem={activeNavItem} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default HRLayout;
