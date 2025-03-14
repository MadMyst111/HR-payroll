import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReportGenerator } from "@/components/ui/report-generator";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useDataCache } from "@/hooks/useDataCache";
import { supabase } from "@/lib/supabase";

const ReportBuilder = () => {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("employees");

  // Use data cache for employees
  const { data: cachedEmployees, loading: employeesLoading } = useDataCache(
    async () => {
      const { data } = await supabase.from("employees").select("*");
      return data || [];
    },
    [],
    { cacheKey: "employees", expirationTime: 5 * 60 * 1000 }, // 5 minutes cache
  );

  // Use data cache for advances
  const { data: cachedAdvances, loading: advancesLoading } = useDataCache(
    async () => {
      const { data } = await supabase.from("advances").select("*");
      return data || [];
    },
    [],
    { cacheKey: "advances", expirationTime: 5 * 60 * 1000 }, // 5 minutes cache
  );

  // Use data cache for attendance
  const { data: cachedAttendance, loading: attendanceLoading } = useDataCache(
    async () => {
      const { data } = await supabase.from("attendance").select("*");
      return data || [];
    },
    [],
    { cacheKey: "attendance", expirationTime: 5 * 60 * 1000 }, // 5 minutes cache
  );

  // Define report fields for each report type
  const employeeFields = [
    { key: "id", label: isRTL ? "كود الموظف" : "Employee ID", include: true },
    {
      key: "name",
      label: isRTL ? "اسم الموظف" : "Employee Name",
      include: true,
    },
    { key: "position", label: isRTL ? "الوظيفة" : "Position", include: true },
    { key: "department", label: isRTL ? "القسم" : "Department", include: true },
    {
      key: "join_date",
      label: isRTL ? "تاريخ التعيين" : "Join Date",
      include: true,
    },
    {
      key: "base_salary",
      label: isRTL ? "الراتب الأساسي" : "Base Salary",
      include: true,
    },
    {
      key: "monthly_incentives",
      label: isRTL ? "الحوافز الشهرية" : "Monthly Incentives",
      include: false,
    },
    {
      key: "daily_rate",
      label: isRTL ? "المعدل اليومي" : "Daily Rate",
      include: false,
    },
    {
      key: "overtime_rate",
      label: isRTL ? "معدل العمل الإضافي" : "Overtime Rate",
      include: false,
    },
  ];

  const advanceFields = [
    { key: "id", label: isRTL ? "رقم السلفة" : "Advance ID", include: true },
    {
      key: "employee_id",
      label: isRTL ? "كود الموظف" : "Employee ID",
      include: true,
    },
    { key: "amount", label: isRTL ? "المبلغ" : "Amount", include: true },
    {
      key: "request_date",
      label: isRTL ? "تاريخ الطلب" : "Request Date",
      include: true,
    },
    {
      key: "expected_payment_date",
      label: isRTL ? "تاريخ السداد المتوقع" : "Expected Payment Date",
      include: true,
    },
    { key: "status", label: isRTL ? "الحالة" : "Status", include: true },
    {
      key: "is_deducted",
      label: isRTL ? "تم الخصم" : "Is Deducted",
      include: false,
    },
    {
      key: "remaining_amount",
      label: isRTL ? "المبلغ المتبقي" : "Remaining Amount",
      include: true,
    },
    {
      key: "deduction_date",
      label: isRTL ? "تاريخ الخصم" : "Deduction Date",
      include: false,
    },
    { key: "notes", label: isRTL ? "ملاحظات" : "Notes", include: false },
  ];

  const attendanceFields = [
    { key: "id", label: isRTL ? "رقم السجل" : "Record ID", include: true },
    {
      key: "employee_id",
      label: isRTL ? "كود الموظف" : "Employee ID",
      include: true,
    },
    { key: "date", label: isRTL ? "التاريخ" : "Date", include: true },
    { key: "status", label: isRTL ? "الحالة" : "Status", include: true },
    {
      key: "check_in",
      label: isRTL ? "وقت الحضور" : "Check In",
      include: true,
    },
    {
      key: "check_out",
      label: isRTL ? "وقت الانصراف" : "Check Out",
      include: true,
    },
    {
      key: "work_hours",
      label: isRTL ? "ساعات العمل" : "Work Hours",
      include: true,
    },
    { key: "notes", label: isRTL ? "ملاحظات" : "Notes", include: false },
  ];

  const labels = {
    ar: {
      title: "منشئ التقارير المخصصة",
      description: "إنشاء تقارير مخصصة وتصديرها",
      employees: "الموظفين",
      advances: "السلف",
      attendance: "الحضور والغياب",
      employeesReport: "تقرير الموظفين",
      employeesDescription: "إنشاء تقارير مخصصة عن بيانات الموظفين",
      advancesReport: "تقرير السلف",
      advancesDescription: "إنشاء تقارير مخصصة عن السلف",
      attendanceReport: "تقرير الحضور والغياب",
      attendanceDescription: "إنشاء تقارير مخصصة عن الحضور والغياب",
      loading: "جاري التحميل...",
    },
    en: {
      title: "Custom Report Builder",
      description: "Create and export custom reports",
      employees: "Employees",
      advances: "Advances",
      attendance: "Attendance",
      employeesReport: "Employees Report",
      employeesDescription: "Create custom reports for employee data",
      advancesReport: "Advances Report",
      advancesDescription: "Create custom reports for advances data",
      attendanceReport: "Attendance Report",
      attendanceDescription: "Create custom reports for attendance data",
      loading: "Loading...",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  if (employeesLoading || advancesLoading || attendanceLoading) {
    return <div className="p-8 text-center">{t.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="employees">{t.employees}</TabsTrigger>
              <TabsTrigger value="advances">{t.advances}</TabsTrigger>
              <TabsTrigger value="attendance">{t.attendance}</TabsTrigger>
            </TabsList>

            <TabsContent value="employees" className="mt-6">
              <ReportGenerator
                data={cachedEmployees || []}
                fields={employeeFields}
                title={t.employeesReport}
                description={t.employeesDescription}
                isRTL={isRTL}
                onGenerate={(report) => {
                  console.log("Generated employees report:", report);
                }}
              />
            </TabsContent>

            <TabsContent value="advances" className="mt-6">
              <ReportGenerator
                data={cachedAdvances || []}
                fields={advanceFields}
                title={t.advancesReport}
                description={t.advancesDescription}
                isRTL={isRTL}
                onGenerate={(report) => {
                  console.log("Generated advances report:", report);
                }}
              />
            </TabsContent>

            <TabsContent value="attendance" className="mt-6">
              <ReportGenerator
                data={cachedAttendance || []}
                fields={attendanceFields}
                title={t.attendanceReport}
                description={t.attendanceDescription}
                isRTL={isRTL}
                onGenerate={(report) => {
                  console.log("Generated attendance report:", report);
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportBuilder;
