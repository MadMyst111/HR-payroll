import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/ui/print-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Printer, Download, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useToast } from "@/components/ui/use-toast";

interface PayslipData {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  month: string;
  year: string;
  baseSalary: number;
  monthlyIncentives: number;
  bonus: number;
  overtimeAmount: number;
  absenceDays: number;
  penaltyDays: number;
  allowances: {
    housing: number;
    transportation: number;
    other: number;
  };
  deductions: {
    tax: number;
    insurance: number;
    purchases: number;
    advances: number;
    absenceDeductions: number;
    penalties: number;
    other: number;
  };
  netSalary: number;
  totalSalaryWithIncentive: number;
}

interface PayslipPrintProps {
  onPrint?: () => void;
  onDownload?: () => void;
  selectedPayrollId?: string | null;
}

const months = [
  { value: "01", labelAr: "يناير", labelEn: "January" },
  { value: "02", labelAr: "فبراير", labelEn: "February" },
  { value: "03", labelAr: "مارس", labelEn: "March" },
  { value: "04", labelAr: "أبريل", labelEn: "April" },
  { value: "05", labelAr: "مايو", labelEn: "May" },
  { value: "06", labelAr: "يونيو", labelEn: "June" },
  { value: "07", labelAr: "يوليو", labelEn: "July" },
  { value: "08", labelAr: "أغسطس", labelEn: "August" },
  { value: "09", labelAr: "سبتمبر", labelEn: "September" },
  { value: "10", labelAr: "أكتوبر", labelEn: "October" },
  { value: "11", labelAr: "نوفمبر", labelEn: "November" },
  { value: "12", labelAr: "ديسمبر", labelEn: "December" },
];

const years = ["2023", "2024", "2025"];

const PayslipPrint = ({
  onPrint = () => {
    window.print();
  },
  onDownload = () => {
    console.log("Download payslip");
  },
  selectedPayrollId = null,
}: PayslipPrintProps) => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();

  // Fetch data from Supabase
  const {
    data: supabaseEmployees,
    loading: employeesLoading,
    error: employeesError,
  } = useSupabaseData("employees");

  const {
    data: supabasePayroll,
    loading: payrollLoading,
    error: payrollError,
  } = useSupabaseData(
    "payroll",
    selectedPayrollId
      ? {
          filter: [{ column: "id", value: selectedPayrollId }],
        }
      : undefined,
  );

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (new Date().getMonth() + 1).toString().padStart(2, "0"),
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear() + "",
  );
  const [payslip, setPayslip] = useState<PayslipData | null>(null);

  // Set initial employee when data loads or when selectedPayrollId changes
  useEffect(() => {
    if (selectedPayrollId && supabasePayroll && supabasePayroll.length > 0) {
      // If we have a selected payroll ID, use the employee from that payroll record
      const payrollRecord = supabasePayroll[0];
      if (payrollRecord.employee_id) {
        setSelectedEmployeeId(payrollRecord.employee_id);

        // Also set the month and year from the payroll record
        if (payrollRecord.month) {
          setSelectedMonth(payrollRecord.month.toString().padStart(2, "0"));
        }
        if (payrollRecord.year) {
          setSelectedYear(payrollRecord.year.toString());
        }
      }
    } else if (
      supabaseEmployees &&
      supabaseEmployees.length > 0 &&
      !selectedEmployeeId
    ) {
      // Otherwise use the first employee
      setSelectedEmployeeId(supabaseEmployees[0].id);
    }
  }, [
    supabaseEmployees,
    selectedEmployeeId,
    selectedPayrollId,
    supabasePayroll,
  ]);

  // Generate payslip from employee and payroll data
  useEffect(() => {
    if (selectedEmployeeId && supabaseEmployees && supabasePayroll) {
      const employee = supabaseEmployees.find(
        (emp) => emp.id === selectedEmployeeId,
      );
      if (employee) {
        // Find payroll record for this employee in the selected month/year
        const monthNum = parseInt(selectedMonth);
        const yearNum = parseInt(selectedYear);

        const payrollRecord = supabasePayroll.find(
          (p) =>
            p.employee_id === employee.id &&
            p.month === monthNum &&
            p.year === yearNum,
        );

        // Convert employee data to payslip format
        const newPayslip: PayslipData = {
          id: `PS-${employee.id.substring(0, 8)}-${selectedMonth}-${selectedYear}`,
          employeeId: employee.id,
          employeeName: employee.name,
          position: employee.position,
          department: employee.department,
          month: selectedMonth,
          year: selectedYear,
          baseSalary: payrollRecord
            ? Number(payrollRecord.base_salary)
            : Number(employee.base_salary),
          monthlyIncentives: payrollRecord
            ? Number(payrollRecord.monthly_incentives || 0)
            : Number(employee.monthly_incentives || 0),
          bonus: payrollRecord ? Number(payrollRecord.bonus || 0) : 0,
          overtimeAmount: payrollRecord
            ? Number(payrollRecord.overtime_amount || 0)
            : 0,
          absenceDays: payrollRecord
            ? Number(payrollRecord.absence_days || 0)
            : 0,
          penaltyDays: payrollRecord
            ? Number(payrollRecord.penalty_days || 0)
            : 0,
          allowances: {
            housing: 0,
            transportation: 0,
            other: 0,
          },
          deductions: {
            tax: 0,
            insurance: 0,
            purchases: payrollRecord ? Number(payrollRecord.purchases || 0) : 0,
            advances: payrollRecord ? Number(payrollRecord.advances || 0) : 0,
            absenceDeductions: payrollRecord
              ? Number(payrollRecord.absence_deductions || 0)
              : 0,
            penalties: payrollRecord ? Number(payrollRecord.penalties || 0) : 0,
            other: 0,
          },
          netSalary: payrollRecord
            ? Number(payrollRecord.net_salary)
            : Number(employee.base_salary),
          totalSalaryWithIncentive: payrollRecord
            ? Number(payrollRecord.total_salary_with_incentive)
            : Number(employee.base_salary) +
              Number(employee.monthly_incentives || 0),
        };
        setPayslip(newPayslip);
      }
    }
  }, [
    selectedEmployeeId,
    selectedMonth,
    selectedYear,
    supabaseEmployees,
    supabasePayroll,
  ]);

  const labels = {
    ar: {
      title: "قسيمة الراتب",
      employeeInfo: "معلومات الموظف",
      employeeId: "رقم الموظف",
      employeeName: "اسم الموظف",
      position: "المنصب",
      department: "القسم",
      payPeriod: "فترة الدفع",
      earnings: "الإيرادات",
      baseSalary: "الراتب الأساسي",
      monthlyIncentives: "الحوافز الشهرية",
      bonus: "مكافأة",
      overtimeAmount: "قيمة الأوفر تايم",
      allowances: "البدلات",
      housing: "بدل السكن",
      transportation: "بدل النقل",
      other: "أخرى",
      totalEarnings: "إجمالي الإيرادات",
      deductions: "الخصومات",
      tax: "الضريبة",
      insurance: "التأمين",
      purchases: "المشتريات",
      advances: "السلف",
      absenceDeductions: "خصومات الغياب",
      penalties: "الجزاءات",
      totalDeductions: "إجمالي الخصومات",
      netPay: "صافي الراتب",
      totalSalaryWithIncentive: "إجمالي المرتب بالحافز",
      print: "طباعة",
      download: "تحميل",
      selectEmployee: "اختر موظف",
      month: "الشهر",
      year: "السنة",
      generate: "إنشاء قسيمة الراتب",
      selectPeriod: "اختر الفترة",
      absenceDays: "أيام الغياب",
      penaltyDays: "أيام الجزاءات",
      loading: "جاري التحميل...",
      error: "حدث خطأ أثناء تحميل البيانات",
    },
    en: {
      title: "Payslip",
      employeeInfo: "Employee Information",
      employeeId: "Employee ID",
      employeeName: "Employee Name",
      position: "Position",
      department: "Department",
      payPeriod: "Pay Period",
      earnings: "Earnings",
      baseSalary: "Base Salary",
      monthlyIncentives: "Monthly Incentives",
      bonus: "Bonus",
      overtimeAmount: "Overtime Amount",
      allowances: "Allowances",
      housing: "Housing",
      transportation: "Transportation",
      other: "Other",
      totalEarnings: "Total Earnings",
      deductions: "Deductions",
      tax: "Tax",
      insurance: "Insurance",
      purchases: "Purchases",
      advances: "Advances",
      absenceDeductions: "Absence Deductions",
      penalties: "Penalties",
      totalDeductions: "Total Deductions",
      netPay: "Net Pay",
      totalSalaryWithIncentive: "Total Salary with Incentive",
      print: "Print",
      download: "Download",
      selectEmployee: "Select Employee",
      month: "Month",
      year: "Year",
      generate: "Generate Payslip",
      selectPeriod: "Select Period",
      absenceDays: "Absence Days",
      penaltyDays: "Penalty Days",
      loading: "Loading...",
      error: "Error loading data",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const handleGeneratePayslip = () => {
    // This function is called when the user clicks the generate button
    // The actual generation happens in the useEffect above
    toast({
      title: isRTL ? "تم إنشاء قسيمة الراتب" : "Payslip generated",
      duration: 3000,
    });
  };

  const calculateTotalEarnings = () => {
    if (!payslip) return 0;
    return (
      payslip.baseSalary +
      payslip.monthlyIncentives +
      payslip.bonus +
      payslip.overtimeAmount +
      payslip.allowances.housing +
      payslip.allowances.transportation +
      payslip.allowances.other
    );
  };

  const calculateTotalDeductions = () => {
    if (!payslip) return 0;
    return (
      payslip.deductions.tax +
      payslip.deductions.insurance +
      payslip.deductions.purchases +
      payslip.deductions.advances +
      payslip.deductions.absenceDeductions +
      payslip.deductions.penalties +
      payslip.deductions.other
    );
  };

  if (employeesLoading || payrollLoading) {
    return <div className="p-8 text-center">{t.loading}</div>;
  }

  if (employeesError || payrollError) {
    return (
      <div className="p-8 text-center text-red-500">
        {t.error}: {(employeesError || payrollError)?.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center no-print">
        <h2 className="text-2xl font-semibold">{t.title}</h2>
        <div className="flex gap-2 mt-4 md:mt-0">
          <PrintButton onClick={onPrint} label={t.print} />
          <Button variant="outline" onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            {t.download}
          </Button>
        </div>
      </div>

      <Card className="bg-card no-print">
        <CardHeader>
          <CardTitle>{t.selectPeriod}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">{t.selectEmployee}</Label>
              <Select
                value={selectedEmployeeId || "default"}
                onValueChange={setSelectedEmployeeId}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supabaseEmployees?.map((employee) =>
                    employee.id ? (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name || "Employee"}
                      </SelectItem>
                    ) : null,
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">{t.month}</Label>
              <Select
                value={selectedMonth || "01"}
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) =>
                    month.value ? (
                      <SelectItem key={month.value} value={month.value}>
                        {isRTL ? month.labelAr : month.labelEn}
                      </SelectItem>
                    ) : null,
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">{t.year}</Label>
              <Select
                value={selectedYear || "2024"}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) =>
                    year ? (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ) : null,
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="mt-4" onClick={handleGeneratePayslip}>
            {t.generate}
          </Button>
        </CardContent>
      </Card>

      {payslip && (
        <div className="print-section">
          <Card className="bg-card payslip-card">
            <CardHeader className="border-b payslip-header">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">{t.title}</CardTitle>
                  <p className="text-muted-foreground">
                    {months.find((m) => m.value === payslip.month)?.labelAr ||
                      payslip.month}{" "}
                    / {payslip.year}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold">شركة الموارد البشرية</h3>
                  <p className="text-muted-foreground">HR Company</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 payslip-content">
              <div className="space-y-6">
                <div className="bg-muted/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{t.employeeInfo}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t.employeeId}
                      </p>
                      <p className="font-medium">
                        {payslip.employeeId.substring(0, 8)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t.employeeName}
                      </p>
                      <p className="font-medium">{payslip.employeeName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t.position}
                      </p>
                      <p className="font-medium">{payslip.position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t.department}
                      </p>
                      <p className="font-medium">{payslip.department}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-green-600 dark:text-green-400">
                      {t.earnings}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t.baseSalary}</span>
                        <span>{payslip.baseSalary} ج.م</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>{t.monthlyIncentives}</span>
                        <span>{payslip.monthlyIncentives} ج.م</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>{t.bonus}</span>
                        <span>{payslip.bonus} ج.م</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>{t.overtimeAmount}</span>
                        <span>{payslip.overtimeAmount} ج.م</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>{t.totalEarnings}</span>
                        <span>{calculateTotalEarnings()} ج.م</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-red-600 dark:text-red-400">
                      {t.deductions}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t.purchases}</span>
                        <span>{payslip.deductions.purchases} ج.م</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>{t.advances}</span>
                        <span>{payslip.deductions.advances} ج.م</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>{t.absenceDeductions}</span>
                        <span>{payslip.deductions.absenceDeductions} ج.م</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>{t.penalties}</span>
                        <span>{payslip.deductions.penalties} ج.م</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>{t.totalDeductions}</span>
                        <span>{calculateTotalDeductions()} ج.م</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t.netPay}
                      </p>
                      <p className="text-2xl font-bold">
                        {payslip.netSalary} ج.م
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t.totalSalaryWithIncentive}
                      </p>
                      <p className="text-2xl font-bold">
                        {payslip.totalSalaryWithIncentive} ج.م
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PayslipPrint;
