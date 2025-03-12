import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  User,
  Globe,
  Users,
  FileText,
  DollarSign,
  Clock,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const { language, isRTL, toggleLanguage } = useLanguage();
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [info, setInfo] = useState(null);

  const navigate = useNavigate();

  const labels = {
    ar: {
      title: "نظام الموارد البشرية",
      subtitle: "إدارة الموظفين والرواتب بكفاءة",
      dashboard: "لوحة التحكم",
      hrSystem: "نظام الموارد البشرية",
      signIn: "تسجيل الدخول",
      getStarted: "ابدأ الآن",
      myAccount: "حسابي",
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      changeLanguage: "تغيير اللغة",
      features: "المميزات",
      employeeManagement: "إدارة الموظفين",
      employeeManagementDesc: "إدارة بيانات الموظفين بسهولة وكفاءة",
      payrollSystem: "نظام الرواتب",
      payrollSystemDesc: "حساب الرواتب والحوافز والخصومات بدقة",
      advancesManagement: "إدارة السلف",
      advancesManagementDesc: "تتبع وإدارة طلبات السلف للموظفين",
      timeManagement: "إدارة الوقت والإجازات",
      timeManagementDesc: "تسجيل الحضور والغياب وإدارة الإجازات",
      reports: "التقارير",
      reportsDesc: "تقارير شاملة لمساعدتك في اتخاذ القرارات",
    },
    en: {
      title: "HR & Payroll System",
      subtitle: "Efficiently manage employees and payroll",
      dashboard: "Dashboard",
      hrSystem: "HR System",
      signIn: "Sign In",
      getStarted: "Get Started",
      myAccount: "My Account",
      profile: "Profile",
      settings: "Settings",
      logout: "Log out",
      changeLanguage: "Change Language",
      features: "Features",
      employeeManagement: "Employee Management",
      employeeManagementDesc: "Easily manage employee information",
      payrollSystem: "Payroll System",
      payrollSystemDesc:
        "Calculate salaries, incentives, and deductions accurately",
      advancesManagement: "Advances Management",
      advancesManagementDesc: "Track and manage employee advance requests",
      timeManagement: "Time & Leave Management",
      timeManagementDesc: "Record attendance and manage leave requests",
      reports: "Reports",
      reportsDesc: "Comprehensive reports to help you make decisions",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const features = [
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: t.employeeManagement,
      description: t.employeeManagementDesc,
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: t.payrollSystem,
      description: t.payrollSystemDesc,
    },
    {
      icon: <DollarSign className="h-10 w-10 text-primary" />,
      title: t.advancesManagement,
      description: t.advancesManagementDesc,
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: t.timeManagement,
      description: t.timeManagementDesc,
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      title: t.reports,
      description: t.reportsDesc,
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-background to-muted ${isRTL ? "text-right" : "text-left"}`}
    >
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="font-bold text-xl">
              {t.hrSystem}
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" onClick={toggleLanguage} className="mr-2">
              <Globe className="h-4 w-4 mr-2" />
              {t.changeLanguage}
            </Button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/hr">
                  <Button variant="ghost">{t.dashboard}</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                          alt={user.email || ""}
                        />
                        <AvatarFallback>
                          {user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-block">
                        {user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t.myAccount}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      {t.profile}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      {t.settings}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => signOut()}>
                      {t.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">{t.signIn}</Button>
                </Link>
                <Link to="/signup">
                  <Button>{t.getStarted}</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center pt-16 pb-20">
          <div className="relative">
            {/* Gradient orbs */}
            <div className="absolute -top-24 -z-10 h-[300px] w-[300px] rounded-full bg-purple-500/20 blur-[100px]" />
            <div className="absolute -right-24 -top-48 -z-10 h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-[100px]" />

            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <h1 className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl">
                {t.title}
              </h1>

              <p className="max-w-[700px] animate-fade-up text-muted-foreground/80 md:text-xl">
                {t.subtitle}
              </p>

              {user ? (
                <Link to="/hr">
                  <Button size="lg" className="mt-4">
                    {t.dashboard}
                  </Button>
                </Link>
              ) : (
                <Link to="/signup">
                  <Button size="lg" className="mt-4">
                    {t.getStarted}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">{t.features}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-primary/10 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">{t.hrSystem}</h2>
          <p className="text-muted-foreground mb-8">{t.subtitle}</p>
          {user ? (
            <Link to="/hr">
              <Button size="lg">{t.dashboard}</Button>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login">
                <Button variant="outline" size="lg">
                  {t.signIn}
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg">{t.getStarted}</Button>
              </Link>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
