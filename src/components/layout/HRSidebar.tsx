import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Printer,
  Settings,
  Globe,
  Clock,
  LayoutDashboard,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";

interface NavItem {
  icon: React.ReactNode;
  labelAr: string;
  labelEn: string;
  href: string;
}

interface HRSidebarProps {
  activeItem?: string;
}

const HRSidebar = ({ activeItem = "/employees" }: HRSidebarProps) => {
  const { language, isRTL, toggleLanguage } = useLanguage();

  const navItems: NavItem[] = [
    {
      icon: <LayoutDashboard size={20} />,
      labelAr: "لوحة التحكم",
      labelEn: "Dashboard",
      href: "/hr",
    },
    {
      icon: <Users size={20} />,
      labelAr: "الموظفين",
      labelEn: "Employees",
      href: "/employees",
    },
    {
      icon: <FileText size={20} />,
      labelAr: "الرواتب",
      labelEn: "Payroll",
      href: "/payroll",
    },
    {
      icon: <DollarSign size={20} />,
      labelAr: "السلف",
      labelEn: "Advances",
      href: "/advances",
    },
    {
      icon: <BarChart3 size={20} />,
      labelAr: "الحوافز",
      labelEn: "Incentives",
      href: "/incentives",
    },
    {
      icon: <Clock size={20} />,
      labelAr: "إدارة الوقت",
      labelEn: "Time Management",
      href: "/time",
    },
    {
      icon: <BarChart3 size={20} />,
      labelAr: "التقارير",
      labelEn: "Reports",
      href: "/reports",
    },
    {
      icon: <Printer size={20} />,
      labelAr: "الطباعة",
      labelEn: "Print",
      href: "/print",
    },
    {
      icon: <Settings size={20} />,
      labelAr: "الإعدادات",
      labelEn: "Settings",
      href: "/settings",
    },
  ];

  return (
    <div className="w-[280px] h-full bg-background border-r flex flex-col overflow-hidden">
      <div className="p-6 border-b bg-muted/10">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {isRTL ? "نظام الموارد البشرية" : "HR System"}
        </h2>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1">
          {/* Main Navigation */}
          <div className="py-2">
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              {isRTL ? "القائمة الرئيسية" : "MAIN MENU"}
            </h3>
            <div className="space-y-1">
              {navItems.slice(0, 1).map((item) => (
                <Link to={item.href} key={item.href}>
                  <Button
                    variant={item.href === activeItem ? "secondary" : "ghost"}
                    className={`w-full justify-${isRTL ? "end" : "start"} gap-2 flex-row${isRTL ? "-reverse" : ""}`}
                  >
                    {item.icon}
                    {isRTL ? item.labelAr : item.labelEn}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Employee Management */}
          <div className="py-2">
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              {isRTL ? "إدارة الموظفين" : "EMPLOYEE MANAGEMENT"}
            </h3>
            <div className="space-y-1">
              {navItems.slice(1, 2).map((item) => (
                <Link to={item.href} key={item.href}>
                  <Button
                    variant={item.href === activeItem ? "secondary" : "ghost"}
                    className={`w-full justify-${isRTL ? "end" : "start"} gap-2 flex-row${isRTL ? "-reverse" : ""}`}
                  >
                    {item.icon}
                    {isRTL ? item.labelAr : item.labelEn}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Financial Management */}
          <div className="py-2">
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              {isRTL ? "الإدارة المالية" : "FINANCIAL MANAGEMENT"}
            </h3>
            <div className="space-y-1">
              {navItems.slice(2, 5).map((item) => (
                <Link to={item.href} key={item.href}>
                  <Button
                    variant={item.href === activeItem ? "secondary" : "ghost"}
                    className={`w-full justify-${isRTL ? "end" : "start"} gap-2 flex-row${isRTL ? "-reverse" : ""}`}
                  >
                    {item.icon}
                    {isRTL ? item.labelAr : item.labelEn}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Time Management */}
          <div className="py-2">
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              {isRTL ? "إدارة الوقت" : "TIME MANAGEMENT"}
            </h3>
            <div className="space-y-1">
              {navItems.slice(5, 6).map((item) => (
                <Link to={item.href} key={item.href}>
                  <Button
                    variant={item.href === activeItem ? "secondary" : "ghost"}
                    className={`w-full justify-${isRTL ? "end" : "start"} gap-2 flex-row${isRTL ? "-reverse" : ""}`}
                  >
                    {item.icon}
                    {isRTL ? item.labelAr : item.labelEn}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Reports & Printing */}
          <div className="py-2">
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              {isRTL ? "التقارير والطباعة" : "REPORTS & PRINTING"}
            </h3>
            <div className="space-y-1">
              {navItems.slice(6, 8).map((item) => (
                <Link to={item.href} key={item.href}>
                  <Button
                    variant={item.href === activeItem ? "secondary" : "ghost"}
                    className={`w-full justify-${isRTL ? "end" : "start"} gap-2 flex-row${isRTL ? "-reverse" : ""}`}
                  >
                    {item.icon}
                    {isRTL ? item.labelAr : item.labelEn}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="py-2">
            <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              {isRTL ? "الإعدادات" : "SETTINGS"}
            </h3>
            <div className="space-y-1">
              {navItems.slice(8, 9).map((item) => (
                <Link to={item.href} key={item.href}>
                  <Button
                    variant={item.href === activeItem ? "secondary" : "ghost"}
                    className={`w-full justify-${isRTL ? "end" : "start"} gap-2 flex-row${isRTL ? "-reverse" : ""}`}
                  >
                    {item.icon}
                    {isRTL ? item.labelAr : item.labelEn}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 mt-auto border-t space-y-3">
        <Link to="/">
          <Button
            variant="ghost"
            className={`w-full justify-${isRTL ? "end" : "start"} gap-2 mb-2 flex-row${isRTL ? "-reverse" : ""}`}
          >
            <Home size={20} />
            {isRTL ? "الصفحة الرئيسية" : "Home Page"}
          </Button>
        </Link>
        <Button
          variant="ghost"
          className={`w-full justify-${isRTL ? "end" : "start"} gap-2 mb-2 flex-row${isRTL ? "-reverse" : ""}`}
          onClick={toggleLanguage}
        >
          <Globe size={20} />
          {isRTL ? "تغيير اللغة" : "Change Language"}
        </Button>
        <div className="flex items-center justify-between px-2 py-2 bg-muted/20 rounded-md">
          <span className="text-sm text-muted-foreground">
            {isRTL ? "المظهر" : "Theme"}
          </span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default HRSidebar;
