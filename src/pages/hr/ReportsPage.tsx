import React, { useState } from "react";
import HRLayout from "@/components/layout/HRLayout";
import ReportsDashboard from "@/components/hr/reports/ReportsDashboard";
import ReportBuilder from "@/components/hr/reports/ReportBuilder";
import AdvancesMonthlyReport from "@/components/hr/reports/AdvancesMonthlyReport";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

const ReportsPage = () => {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("dashboard");

  const labels = {
    ar: {
      dashboard: "لوحة التقارير",
      customReports: "تقارير مخصصة",
      advancesReport: "تقرير السلف",
    },
    en: {
      dashboard: "Reports Dashboard",
      customReports: "Custom Reports",
      advancesReport: "Advances Report",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  return (
    <HRLayout activeNavItem="/reports">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">{t.dashboard}</TabsTrigger>
          <TabsTrigger value="custom-reports">{t.customReports}</TabsTrigger>
          <TabsTrigger value="advances-report">{t.advancesReport}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ReportsDashboard />
        </TabsContent>

        <TabsContent value="custom-reports">
          <ReportBuilder />
        </TabsContent>

        <TabsContent value="advances-report">
          <AdvancesMonthlyReport />
        </TabsContent>
      </Tabs>
    </HRLayout>
  );
};

export default ReportsPage;
