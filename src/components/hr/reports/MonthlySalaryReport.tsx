import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/ui/print-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeFormData } from "../employees/AddEmployeeForm";
import { Download, Printer, Search, Filter } from "lucide-react";

interface MonthlySalaryReportProps {
  employees?: EmployeeFormData[];
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

// Function to round salary to nearest 5
const roundNetSalary = (salary: number): number => {
  // Get the last digit
  const lastDigit = salary % 10;

  // Round to nearest 5
  if (lastDigit < 3) {
    // Round down to nearest 0 or 5
    return Math.floor(salary / 5) * 5;
  } else if (lastDigit < 8) {
    // Round to nearest 5
    return Math.floor(salary / 10) * 10 + 5;
  } else {
    // Round up to nearest 10
    return Math.ceil(salary / 10) * 10;
  }
};

const MonthlySalaryReport = ({
  employees = defaultEmployees,
}: MonthlySalaryReportProps) => {
  const { isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1 + "",
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear() + "",
  );
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const labels = {
    ar: {
      title: "تقرير الرواتب الشهري",
      search: "بحث عن موظف...",
      month: "الشهر",
      year: "السنة",
      department: "القسم",
      allDepartments: "جميع الأقسام",
      filter: "تصفية",
      print: "طباعة",
      export: "تصدير",
      employeeId: "كود الموظف",
      employeeName: "اسم الموظف",
      position: "الوظيفة",
      department: "القسم",
      baseSalary: "الراتب الأساسي",
      dailyRate: "قيمة وحدة اليوم",
      dailyRateWithIncentive: "قيمة وحدة اليوم بالحوافز الشهرية",
      monthlyIncentives: "الحوافز الشهرية",
      bonus: "مكافأة",
      overtimeAmount: "قيمة الأوفر تايم",
      totalEarnings: "إجمالي الإيرادات",
      purchases: "المشتريات",
      advances: "السلف",
      absenceDays: "أيام الغيابات",
      absenceDeductions: "خصومات الغياب",
      penaltyDays: "أيام الجزاءات",
      penalties: "الجزاءات",
      totalDeductions: "إجمالي الخصومات",
      netSalary: "صافي الراتب",
      roundedNetSalary: "صافي الراتب بالتقريب",
      totalSalaryWithIncentive: "إجمالي المرتب بالحافز",
      totalEmployees: "إجمالي الموظفين",
      totalNetSalaries: "إجمالي صافي الرواتب",
      totalBaseSalaries: "إجمالي الرواتب الأساسية",
      totalIncentives: "إجمالي الحوافز",
      totalDeductionsSum: "إجمالي الخصومات",
    },
    en: {
      title: "Monthly Salary Report",
      search: "Search for employee...",
      month: "Month",
      year: "Year",
      department: "Department",
      allDepartments: "All Departments",
      filter: "Filter",
      print: "Print",
      export: "Export",
      employeeId: "Employee ID",
      employeeName: "Employee Name",
      position: "Position",
      department: "Department",
      baseSalary: "Base Salary",
      dailyRate: "Daily Rate",
      dailyRateWithIncentive: "Daily Rate with Incentives",
      monthlyIncentives: "Monthly Incentives",
      bonus: "Bonus",
      overtimeAmount: "Overtime Amount",
      totalEarnings: "Total Earnings",
      purchases: "Purchases",
      advances: "Advances",
      absenceDays: "Absence Days",
      absenceDeductions: "Absence Deductions",
      penaltyDays: "Penalty Days",
      penalties: "Penalties",
      totalDeductions: "Total Deductions",
      netSalary: "Net Salary",
      roundedNetSalary: "Rounded Net Salary",
      totalSalaryWithIncentive: "Total Salary with Incentive",
      totalEmployees: "Total Employees",
      totalNetSalaries: "Total Net Salaries",
      totalBaseSalaries: "Total Base Salaries",
      totalIncentives: "Total Incentives",
      totalDeductionsSum: "Total Deductions",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  // Get unique departments
  const departments = [
    "all",
    ...new Set(employees.map((emp) => emp.department)),
  ];

  // Filter employees based on search term and department
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" ||
      employee.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Calculate totals
  const totalNetSalary = filteredEmployees.reduce(
    (sum, employee) => sum + employee.netSalary,
    0,
  );

  const totalBaseSalary = filteredEmployees.reduce(
    (sum, employee) => sum + employee.baseSalary,
    0,
  );

  const totalIncentives = filteredEmployees.reduce(
    (sum, employee) => sum + employee.monthlyIncentives,
    0,
  );

  const totalDeductions = filteredEmployees.reduce(
    (sum, employee) =>
      sum +
      employee.purchases +
      employee.advances +
      employee.absenceDeductions +
      employee.penalties,
    0,
  );

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Generate HTML for all employees (not just filtered ones)
    const generateEmployeeRows = () => {
      return employees
        .map((employee) => {
          const totalDeductions =
            employee.purchases +
            employee.advances +
            employee.absenceDeductions +
            employee.penalties;

          return `
          <tr>
            <td style="border: 1px solid #ddd; padding: 6px;">${employee.id}</td>
            <td style="border: 1px solid #ddd; padding: 6px;">${employee.name}</td>
            <td style="border: 1px solid #ddd; padding: 6px;">${employee.department}</td>
            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${employee.baseSalary}</td>
            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${employee.monthlyIncentives}</td>
            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${employee.dailyRate}</td>
            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${employee.dailyRateWithIncentive}</td>
            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${employee.absenceDays}</td>
            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${employee.penaltyDays}</td>
            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${employee.bonus}</td>
            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${employee.overtimeAmount}</td>
            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${employee.advances}</td>
            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${totalDeductions}</td>
            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${employee.netSalary}</td>
          </tr>
        `;
        })
        .join("");
    };

    // Calculate totals for all employees
    const allEmployeesTotalNetSalary = employees.reduce(
      (sum, employee) => sum + employee.netSalary,
      0,
    );
    const allEmployeesTotalBaseSalary = employees.reduce(
      (sum, employee) => sum + employee.baseSalary,
      0,
    );
    const allEmployeesTotalIncentives = employees.reduce(
      (sum, employee) => sum + employee.monthlyIncentives,
      0,
    );

    // Write to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${isRTL ? "ar" : "en"}" dir="${isRTL ? "rtl" : "ltr"}">
      <head>
        <meta charset="UTF-8">
        <title>${t.title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          @page { size: landscape; margin: 0.5cm; }
          body { font-family: 'Cairo', sans-serif; margin: 0; padding: 10px; }
          .report-header { text-align: center; margin-bottom: 20px; }
          .report-header h1 { font-size: 24px; margin: 0 0 5px 0; }
          .report-header h2 { font-size: 18px; font-weight: normal; margin: 0; color: #666; }
          table { border-collapse: collapse; width: 100%; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 6px; }
          th { background-color: #f0f0f0; font-weight: bold; }
          .text-right { text-align: right; }
          tfoot tr { font-weight: bold; background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>${t.title}</h1>
          <h2>${months.find((m) => m.value === selectedMonth)?.labelAr || selectedMonth} / ${selectedYear}</h2>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>${t.employeeId}</th>
              <th>${t.employeeName}</th>
              <th>${t.department}</th>
              <th style="text-align: right;">${t.baseSalary}</th>
              <th style="text-align: right;">${t.monthlyIncentives}</th>
              <th style="text-align: right;">${t.dailyRate}</th>
              <th style="text-align: right;">${t.dailyRateWithIncentive}</th>
              <th style="text-align: right;">${t.absenceDays}</th>
              <th style="text-align: right;">${t.penaltyDays}</th>
              <th style="text-align: right;">${t.bonus}</th>
              <th style="text-align: right;">${t.overtimeAmount}</th>
              <th style="text-align: right;">${t.advances}</th>
              <th style="text-align: right;">${t.totalDeductions}</th>
              <th style="text-align: right;">${t.netSalary}</th>
            </tr>
          </thead>
          <tbody>
            ${generateEmployeeRows()}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 6px; text-align: ${isRTL ? "right" : "left"};">
                ${t.totalEmployees}: ${employees.length}
              </td>
              <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${allEmployeesTotalBaseSalary}</td>
              <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${allEmployeesTotalIncentives}</td>
              <td colspan="7" style="border: 1px solid #ddd; padding: 6px;"></td>
              <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${allEmployeesTotalNetSalary}</td>
            </tr>
          </tfoot>
        </table>
      </body>
      </html>
    `);

    // Wait for resources to load then print
    printWindow.document.close();
    printWindow.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
  };

  const handleExport = () => {
    // In a real app, this would export to CSV or Excel
    console.log("Exporting report...");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-2xl font-semibold">{t.title}</h2>
        <div className="flex gap-2 mt-4 md:mt-0">
          <PrintButton onClick={handlePrint} label={t.print} landscape />
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            {t.export}
          </Button>
        </div>
      </div>

      <Card className="bg-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="search">{t.search}</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
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

            <div className="space-y-2">
              <Label htmlFor="department">{t.department}</Label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allDepartments}</SelectItem>
                  {departments
                    .filter((dept) => dept !== "all")
                    .map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.employeeId}</TableHead>
                  <TableHead>{t.employeeName}</TableHead>
                  <TableHead>{t.department}</TableHead>
                  <TableHead className="text-right">{t.baseSalary}</TableHead>
                  <TableHead className="text-right">
                    {t.monthlyIncentives}
                  </TableHead>
                  <TableHead className="text-right">{t.dailyRate}</TableHead>
                  <TableHead className="text-right">
                    {t.dailyRateWithIncentive}
                  </TableHead>
                  <TableHead className="text-right">{t.absenceDays}</TableHead>
                  <TableHead className="text-right">{t.penaltyDays}</TableHead>
                  <TableHead className="text-right">{t.bonus}</TableHead>
                  <TableHead className="text-right">
                    {t.overtimeAmount}
                  </TableHead>
                  <TableHead className="text-right">{t.advances}</TableHead>
                  <TableHead className="text-right">
                    {t.totalDeductions}
                  </TableHead>
                  <TableHead className="text-right">{t.netSalary}</TableHead>
                  <TableHead className="text-right">
                    {t.roundedNetSalary}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => {
                  const totalDeductions =
                    employee.purchases +
                    employee.advances +
                    employee.absenceDeductions +
                    employee.penalties;

                  return (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.id}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell className="text-right">
                        {employee.baseSalary} ج.م
                      </TableCell>
                      <TableCell className="text-right">
                        {employee.monthlyIncentives} ج.م
                      </TableCell>
                      <TableCell className="text-right">
                        {employee.dailyRate} ج.م
                      </TableCell>
                      <TableCell className="text-right">
                        {employee.dailyRateWithIncentive} ج.م
                      </TableCell>
                      <TableCell className="text-right">
                        {employee.absenceDays}
                      </TableCell>
                      <TableCell className="text-right">
                        {employee.penaltyDays}
                      </TableCell>
                      <TableCell className="text-right">
                        {employee.bonus} ج.م
                      </TableCell>
                      <TableCell className="text-right">
                        {employee.overtimeAmount} ج.م
                      </TableCell>
                      <TableCell className="text-right">
                        {employee.advances} ج.م
                      </TableCell>
                      <TableCell className="text-right">
                        {totalDeductions} ج.م
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {employee.netSalary} ج.م
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {roundNetSalary(employee.netSalary)} ج.م
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 summary-cards">
            <Card className="bg-primary/10 border-primary/20 summary-card">
              <CardHeader className="py-2">
                <CardTitle className="text-sm">{t.totalEmployees}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{filteredEmployees.length}</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/10 border-blue-500/20 dark:bg-blue-500/5 summary-card">
              <CardHeader className="py-2">
                <CardTitle className="text-sm">{t.totalBaseSalaries}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalBaseSalary} ج.م</p>
              </CardContent>
            </Card>

            <Card className="bg-green-500/10 border-green-500/20 dark:bg-green-500/5 summary-card">
              <CardHeader className="py-2">
                <CardTitle className="text-sm">{t.totalIncentives}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalIncentives} ج.م</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-500/10 border-purple-500/20 dark:bg-purple-500/5 summary-card">
              <CardHeader className="py-2">
                <CardTitle className="text-sm">{t.totalNetSalaries}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalNetSalary} ج.م</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlySalaryReport;
