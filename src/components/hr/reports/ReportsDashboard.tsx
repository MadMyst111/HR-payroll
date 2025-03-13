import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, FileText, Users, DollarSign, Calendar } from "lucide-react";
import MonthlySalaryReport from "./MonthlySalaryReport.supabase";
import AttendanceReport from "./AttendanceReport";
import LeaveReport from "./LeaveReport";
import AdvancesReport from "./AdvancesReport";

const ReportsDashboard = () => {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("dashboard");

  const labels = {
    ar: {
      title: "لوحة التقارير",
      description: "عرض وتحليل البيانات",
      dashboard: "لوحة التقارير",
      monthlySalary: "تقرير الرواتب الشهري",
      monthlySalaryDesc: "عرض تفاصيل رواتب الموظفين للشهر الحالي",
      employeeAttendance: "تقرير الحضور والغياب",
      employeeAttendanceDesc: "تحليل حضور وغياب الموظفين",
      advancesReport: "تقرير السلف",
      advancesReportDesc: "تفاصيل السلف المصروفة والمستحقة",
      leaveReport: "تقرير الإجازات",
      leaveReportDesc: "تحليل الإجازات المستخدمة والمتبقية",
      viewReport: "عرض التقرير",
    },
    en: {
      title: "Reports Dashboard",
      description: "View and analyze data",
      dashboard: "Dashboard",
      monthlySalary: "Monthly Salary Report",
      monthlySalaryDesc: "View employee salary details for the current month",
      employeeAttendance: "Attendance Report",
      employeeAttendanceDesc: "Analyze employee attendance and absences",
      advancesReport: "Advances Report",
      advancesReportDesc: "Details of disbursed and due advances",
      leaveReport: "Leave Report",
      leaveReportDesc: "Analysis of used and remaining leaves",
      viewReport: "View Report",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const reports = [
    {
      title: t.monthlySalary,
      description: t.monthlySalaryDesc,
      icon: <FileText className="h-12 w-12 text-primary" />,
      link: "salary-report",
      tabId: "salary-report",
    },
    {
      title: t.employeeAttendance,
      description: t.employeeAttendanceDesc,
      icon: <Users className="h-12 w-12 text-primary" />,
      link: "attendance-report",
      tabId: "attendance-report",
    },
    {
      title: t.advancesReport,
      description: t.advancesReportDesc,
      icon: <DollarSign className="h-12 w-12 text-primary" />,
      link: "advances-report",
      tabId: "advances-report",
    },
    {
      title: t.leaveReport,
      description: t.leaveReportDesc,
      icon: <Calendar className="h-12 w-12 text-primary" />,
      link: "leave-report",
      tabId: "leave-report",
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">{t.dashboard}</TabsTrigger>
          <TabsTrigger value="salary-report" id="salary-report-tab">
            {t.monthlySalary}
          </TabsTrigger>
          <TabsTrigger value="attendance-report" id="attendance-report-tab">
            {t.employeeAttendance}
          </TabsTrigger>
          <TabsTrigger value="leave-report" id="leave-report-tab">
            {t.leaveReport}
          </TabsTrigger>
          <TabsTrigger value="advances-report" id="advances-report-tab">
            {t.advancesReport}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div>
            <h2 className="text-2xl font-semibold">{t.title}</h2>
            <p className="text-muted-foreground">{t.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {reports.map((report, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{report.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {report.icon}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-muted-foreground">
                        {report.description}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveTab(report.tabId);
                          document
                            .getElementById(`${report.tabId}-tab`)
                            ?.click();
                        }}
                      >
                        {t.viewReport}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="salary-report">
          <MonthlySalaryReport />
        </TabsContent>

        <TabsContent value="attendance-report">
          <AttendanceReport />
        </TabsContent>

        <TabsContent value="leave-report">
          <LeaveReport />
        </TabsContent>

        <TabsContent value="advances-report">
          <AdvancesReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsDashboard;
