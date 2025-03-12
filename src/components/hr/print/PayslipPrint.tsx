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
import { EmployeeFormData } from "../employees/AddEmployeeForm";

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
  employees?: EmployeeFormData[];
  onPrint?: () => void;
  onDownload?: () => void;
}

const defaultEmployees: EmployeeFormData[] = [
  {
    id: "1",
    name: "أحمد محمد",
    position: "مطور برمجيات",
    department: "تكنولوجيا المعلومات",
    joinDate: "2022-01-15",
    baseSalary: 5000,
    dailyRate: 250,
    dailyRateWithIncentive: 300,
    overtimeRate: 50,
    overtimeHours: 10,
    monthlyIncentives: 1000,
    bonus: 500,
    overtimeAmount: 500,
    purchases: 200,
    advances: 500,
    absenceDays: 1,
    absenceDeductions: 250,
    penaltyDays: 0,
    penalties: 0,
    netSalary: 6050,
    totalSalaryWithIncentive: 6000,
  },
  {
    id: "2",
    name: "سارة أحمد",
    position: "محاسب",
    department: "المالية",
    joinDate: "2021-05-10",
    baseSalary: 4500,
    dailyRate: 225,
    dailyRateWithIncentive: 270,
    overtimeRate: 45,
    overtimeHours: 5,
    monthlyIncentives: 900,
    bonus: 300,
    overtimeAmount: 225,
    purchases: 150,
    advances: 300,
    absenceDays: 0,
    absenceDeductions: 0,
    penaltyDays: 0,
    penalties: 0,
    netSalary: 5475,
    totalSalaryWithIncentive: 5400,
  },
  {
    id: "3",
    name: "محمد علي",
    position: "مدير مشروع",
    department: "العمليات",
    joinDate: "2020-11-20",
    baseSalary: 7000,
    dailyRate: 350,
    dailyRateWithIncentive: 420,
    overtimeRate: 70,
    overtimeHours: 8,
    monthlyIncentives: 1400,
    bonus: 700,
    overtimeAmount: 560,
    purchases: 300,
    advances: 1000,
    absenceDays: 0,
    absenceDeductions: 0,
    penaltyDays: 1,
    penalties: 350,
    netSalary: 8010,
    totalSalaryWithIncentive: 8400,
  },
];

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
  employees = defaultEmployees,
  onPrint = () => {
    window.print();
  },
  onDownload = () => {
    console.log("Download payslip");
  },
}: PayslipPrintProps) => {
  const { isRTL } = useLanguage();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    employees[0]?.id || "",
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().getMonth() + 1 + "",
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear() + "",
  );
  const [payslip, setPayslip] = useState<PayslipData | null>(null);

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
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  // Generate payslip from employee data
  useEffect(() => {
    if (selectedEmployeeId) {
      const employee = employees.find((emp) => emp.id === selectedEmployeeId);
      if (employee) {
        // Convert employee data to payslip format
        const newPayslip: PayslipData = {
          id: `PS-${employee.id}-${selectedMonth}-${selectedYear}`,
          employeeId: employee.id,
          employeeName: employee.name,
          position: employee.position,
          department: employee.department,
          month: selectedMonth.padStart(2, "0"),
          year: selectedYear,
          baseSalary: employee.baseSalary,
          monthlyIncentives: employee.monthlyIncentives,
          bonus: employee.bonus,
          overtimeAmount: employee.overtimeAmount,
          absenceDays: employee.absenceDays,
          penaltyDays: employee.penaltyDays,
          allowances: {
            housing: 0,
            transportation: 0,
            other: 0,
          },
          deductions: {
            tax: 0,
            insurance: 0,
            purchases: employee.purchases,
            advances: employee.advances,
            absenceDeductions: employee.absenceDeductions,
            penalties: employee.penalties,
            other: 0,
          },
          netSalary: employee.netSalary,
          totalSalaryWithIncentive: employee.totalSalaryWithIncentive,
        };
        setPayslip(newPayslip);
      }
    }
  }, [selectedEmployeeId, selectedMonth, selectedYear, employees]);

  if (!payslip) {
    return <div>Loading...</div>;
  }

  const totalDeductions =
    payslip.deductions.purchases +
    payslip.deductions.advances +
    payslip.deductions.absenceDeductions +
    payslip.deductions.penalties;

  // Net salary doesn't include monthly incentives
  const totalEarnings =
    payslip.baseSalary + payslip.bonus + payslip.overtimeAmount;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6 bg-card shadow-sm">
        <CardHeader>
          <CardTitle>{t.selectPeriod}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">{t.selectEmployee}</Label>
              <Select
                value={selectedEmployeeId}
                onValueChange={setSelectedEmployeeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.selectEmployee} />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">{t.month}</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {isRTL ? month.labelAr : month.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">{t.year}</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <PrintButton onClick={onPrint} label={t.print} />
            <Button onClick={onDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t.download}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="print-section">
        <Card className="border-2 shadow-lg bg-white dark:bg-gray-900 print:shadow-none print:border-0 print:max-w-[80mm]">
          <CardContent className="p-6 card-content">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-1">{t.title}</h3>
              <p className="text-muted-foreground">{`${months.find((m) => m.value === payslip.month)?.labelAr || payslip.month}/${payslip.year}`}</p>
            </div>

            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <h4 className="font-semibold mb-3 text-primary">
                {t.employeeInfo}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.employeeId}
                  </p>
                  <p>{payslip.employeeId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.employeeName}
                  </p>
                  <p>{payslip.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.position}</p>
                  <p>{payslip.position}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.department}
                  </p>
                  <p>{payslip.department}</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400">
                {t.earnings}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t.baseSalary}</span>
                  <span>{payslip.baseSalary}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.monthlyIncentives}</span>
                  <span>{payslip.monthlyIncentives}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.bonus}</span>
                  <span>{payslip.bonus}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.overtimeAmount}</span>
                  <span>{payslip.overtimeAmount}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>{t.totalEarnings}</span>
                  <span>
                    {payslip.baseSalary +
                      payslip.bonus +
                      payslip.overtimeAmount}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <h4 className="font-semibold mb-3 text-red-700 dark:text-red-400">
                {t.deductions}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t.purchases}</span>
                  <span>{payslip.deductions.purchases}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.advances}</span>
                  <span>{payslip.deductions.advances}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.absenceDeductions}</span>
                  <span>{payslip.deductions.absenceDeductions}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.penalties}</span>
                  <span>{payslip.deductions.penalties}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>{t.totalDeductions}</span>
                  <span>
                    {payslip.deductions.purchases +
                      payslip.deductions.advances +
                      payslip.deductions.absenceDeductions +
                      payslip.deductions.penalties}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>{t.absenceDays}</span>
                  <span>{payslip.absenceDays || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.penaltyDays}</span>
                  <span>{payslip.penaltyDays || 0}</span>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">
                <span>{t.netPay}</span>
                <span>{payslip.netSalary}</span>
              </div>

              <div className="flex justify-between text-lg">
                <span>{t.totalSalaryWithIncentive}</span>
                <span>{payslip.totalSalaryWithIncentive}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @media print {
          @page {
            size: 80mm 297mm; /* Receipt-like size */
            margin: 0.2cm;
          }

          body * {
            visibility: hidden;
          }
          .print-section,
          .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 80mm;
            margin: 0 auto;
            padding: 5px;
            background-color: white;
            color: black;
            font-size: 10px;
          }
          .print-section .card-content {
            page-break-inside: avoid;
            padding: 5px !important;
          }
          .print-section h3,
          .print-section h4 {
            margin: 5px 0 !important;
            font-size: 14px !important;
          }
          .print-section p {
            margin: 2px 0 !important;
            font-size: 10px !important;
          }
          .print-section .space-y-2 > * {
            margin-top: 0.25rem !important;
            margin-bottom: 0.25rem !important;
          }
          .print-section .rounded-lg {
            border-radius: 0 !important;
            margin-bottom: 5px !important;
            padding: 3px !important;
          }
          .print-section .separator {
            margin: 3px 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PayslipPrint;
