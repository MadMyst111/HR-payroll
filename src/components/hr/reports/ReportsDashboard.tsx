import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Users, DollarSign, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import MonthlySalaryReport from "./MonthlySalaryReport.supabase";

const ReportsDashboard = () => {
  const { isRTL } = useLanguage();

  const labels = {
    ar: {
      title: "لوحة التقارير",
      description: "عرض وتحليل البيانات",
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
    },
    {
      title: t.employeeAttendance,
      description: t.employeeAttendanceDesc,
      icon: <Users className="h-12 w-12 text-primary" />,
      link: "#",
    },
    {
      title: t.advancesReport,
      description: t.advancesReportDesc,
      icon: <DollarSign className="h-12 w-12 text-primary" />,
      link: "#",
    },
    {
      title: t.leaveReport,
      description: t.leaveReportDesc,
      icon: <Calendar className="h-12 w-12 text-primary" />,
      link: "#",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{t.title}</h2>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <p className="text-muted-foreground">{report.description}</p>
                  <Button
                    variant="outline"
                    asChild={report.link !== "#"}
                    disabled={report.link === "#"}
                  >
                    {report.link !== "#" ? (
                      <Link
                        to="#"
                        onClick={() =>
                          document.getElementById("salary-report-tab")?.click()
                        }
                      >
                        {t.viewReport}
                      </Link>
                    ) : (
                      <span>{t.viewReport}</span>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportsDashboard;
