import React, { useState } from "react";
import HRLayout from "@/components/layout/HRLayout";
import ReportsDashboard from "@/components/hr/reports/ReportsDashboard";
import MonthlySalaryReport from "@/components/hr/reports/MonthlySalaryReport";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

const ReportsPage = () => {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("dashboard");

  const labels = {
    ar: {
      dashboard: "لوحة التقارير",
      salaryReport: "تقرير الرواتب الشهري",
    },
    en: {
      dashboard: "Reports Dashboard",
      salaryReport: "Monthly Salary Report",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  return (
    <HRLayout activeNavItem="/reports">
      <Tabs
        defaultValue="dashboard"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="dashboard">{t.dashboard}</TabsTrigger>
          <TabsTrigger value="salary-report" id="salary-report-tab">
            {t.salaryReport}
          </TabsTrigger>
        </TabsList>

        {activeTab === "dashboard" && (
          <div className="mt-6">
            <ReportsDashboard />
          </div>
        )}

        {activeTab === "salary-report" && (
          <div className="mt-6">
            <MonthlySalaryReport />
          </div>
        )}
      </Tabs>
    </HRLayout>
  );
};

export default ReportsPage;
