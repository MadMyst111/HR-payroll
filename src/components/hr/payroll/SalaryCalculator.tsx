import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { EmployeeFormData } from "../employees/AddEmployeeForm";
import { AdvanceData } from "../advances/AddAdvanceForm";

interface SalaryCalculatorProps {
  employees: EmployeeFormData[];
  advances: AdvanceData[];
  onSave: (updatedEmployee: EmployeeFormData) => void;
}

const months = [
  { value: "1", labelAr: "يناير", labelEn: "January", days: 31 },
  { value: "2", labelAr: "فبراير", labelEn: "February", days: 28 },
  { value: "3", labelAr: "مارس", labelEn: "March", days: 31 },
  { value: "4", labelAr: "أبريل", labelEn: "April", days: 30 },
  { value: "5", labelAr: "مايو", labelEn: "May", days: 31 },
  { value: "6", labelAr: "يونيو", labelEn: "June", days: 30 },
  { value: "7", labelAr: "يوليو", labelEn: "July", days: 31 },
  { value: "8", labelAr: "أغسطس", labelEn: "August", days: 31 },
  { value: "9", labelAr: "سبتمبر", labelEn: "September", days: 30 },
  { value: "10", labelAr: "أكتوبر", labelEn: "October", days: 31 },
  { value: "11", labelAr: "نوفمبر", labelEn: "November", days: 30 },
  { value: "12", labelAr: "ديسمبر", labelEn: "December", days: 31 },
];

const years = ["2023", "2024", "2025", "2026", "2027"];

const SalaryCalculator = ({
  employees,
  advances,
  onSave,
}: SalaryCalculatorProps) => {
  const { isRTL } = useLanguage();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [calculationData, setCalculationData] =
    useState<EmployeeFormData | null>(null);
  const [pendingAdvances, setPendingAdvances] = useState<AdvanceData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (new Date().getMonth() + 1).toString(),
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );

  const labels = {
    ar: {
      title: "حاسبة الرواتب",
      description: "حساب الراتب الشهري للموظف",
      selectEmployee: "اختر موظف",
      baseSalary: "الراتب الأساسي",
      dailyRate: "قيمة وحدة اليوم",
      dailyRateWithIncentive: "قيمة وحدة اليوم بالحوافز الشهرية",
      overtimeRate: "قيمة وحدة الأوفر تايم",
      overtimeHours: "عدد ساعات الأوفر تايم",
      monthlyIncentives: "الحوافز الشهرية",
      bonus: "مكافأة",
      overtimeAmount: "قيمة الأوفر تايم",
      purchases: "المشتريات",
      advances: "السلف",
      absenceDays: "أيام الغيابات",
      absenceDeductions: "غيابات خصومات/ساعات",
      penaltyDays: "أيام الجزاءات",
      penalties: "الجزاءات",
      netSalary: "صافي الراتب",
      totalSalaryWithIncentive: "إجمالي المرتب بالحافز",
      calculate: "حساب الراتب",
      save: "حفظ",
      reset: "إعادة تعيين",
      earnings: "الإيرادات",
      deductions: "الخصومات",
      totalEarnings: "إجمالي الإيرادات",
      totalDeductions: "إجمالي الخصومات",
      pendingAdvances: "السلف المعلقة",
      applyAdvance: "تطبيق",
      month: "الشهر",
      year: "السنة",
      days: "يوم",
      daysInMonth: "عدد أيام الشهر",
    },
    en: {
      title: "Salary Calculator",
      description: "Calculate monthly salary for employee",
      selectEmployee: "Select Employee",
      baseSalary: "Base Salary",
      dailyRate: "Daily Rate",
      dailyRateWithIncentive: "Daily Rate with Monthly Incentives",
      overtimeRate: "Overtime Rate",
      overtimeHours: "Overtime Hours",
      monthlyIncentives: "Monthly Incentives",
      bonus: "Bonus",
      overtimeAmount: "Overtime Amount",
      purchases: "Purchases",
      advances: "Advances",
      absenceDays: "Absence Days",
      absenceDeductions: "Absence Deductions/Hours",
      penaltyDays: "Penalty Days",
      penalties: "Penalties",
      netSalary: "Net Salary",
      totalSalaryWithIncentive: "Total Salary with Incentive",
      calculate: "Calculate Salary",
      save: "Save",
      reset: "Reset",
      earnings: "Earnings",
      deductions: "Deductions",
      totalEarnings: "Total Earnings",
      totalDeductions: "Total Deductions",
      pendingAdvances: "Pending Advances",
      applyAdvance: "Apply",
      month: "Month",
      year: "Year",
      days: "days",
      daysInMonth: "Days in Month",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  useEffect(() => {
    if (selectedEmployeeId) {
      const employee = employees.find((emp) => emp.id === selectedEmployeeId);
      if (employee) {
        setCalculationData({ ...employee });
      }

      // Get pending advances for this employee
      const employeeAdvances = advances.filter(
        (adv) =>
          adv.employeeId === selectedEmployeeId && adv.status === "approved",
      );
      setPendingAdvances(employeeAdvances);
    } else {
      setCalculationData(null);
      setPendingAdvances([]);
    }
  }, [selectedEmployeeId, employees, advances]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!calculationData) return;

    const { name, value } = e.target;
    let newValue: string | number = value;

    // Convert numeric fields to numbers
    if (
      [
        "baseSalary",
        "dailyRate",
        "dailyRateWithIncentive",
        "overtimeRate",
        "overtimeHours",
        "monthlyIncentives",
        "bonus",
        "overtimeAmount",
        "purchases",
        "advances",
        "absenceDays",
        "absenceDeductions",
        "penaltyDays",
        "penalties",
      ].includes(name)
    ) {
      newValue = parseFloat(value) || 0;
    }

    setCalculationData((prev) => {
      if (!prev) return null;

      const updatedData = { ...prev, [name]: newValue };

      // Calculate derived values
      if (
        [
          "baseSalary",
          "monthlyIncentives",
          "bonus",
          "overtimeAmount",
          "purchases",
          "advances",
          "absenceDeductions",
          "penalties",
          "dailyRate",
          "dailyRateWithIncentive",
        ].includes(name)
      ) {
        // Update daily rates when baseSalary or monthlyIncentives change
        if (["baseSalary", "monthlyIncentives"].includes(name)) {
          // Get actual days in the selected month
          const selectedMonthInt = parseInt(
            selectedMonth || (new Date().getMonth() + 1).toString(),
          );
          const selectedYearInt = parseInt(
            selectedYear || new Date().getFullYear().toString(),
          );
          const daysInMonth = new Date(
            selectedYearInt,
            selectedMonthInt,
            0,
          ).getDate();

          // Calculate daily rate based on actual days in month
          updatedData.dailyRate = Math.round(
            updatedData.baseSalary / daysInMonth,
          );
          updatedData.dailyRateWithIncentive = Math.round(
            (updatedData.baseSalary + updatedData.monthlyIncentives) /
              daysInMonth,
          );
        }

        // Calculate net salary (without monthly incentives as per requirements)
        const totalEarnings =
          updatedData.baseSalary +
          updatedData.bonus +
          updatedData.overtimeAmount;

        const totalDeductions =
          updatedData.purchases +
          updatedData.advances +
          updatedData.absenceDeductions +
          updatedData.penalties;

        updatedData.netSalary = totalEarnings - totalDeductions;
        updatedData.totalSalaryWithIncentive =
          updatedData.baseSalary + updatedData.monthlyIncentives;
      }

      // Calculate overtime amount when overtime rate or hours change
      if (["overtimeRate", "overtimeHours"].includes(name)) {
        updatedData.overtimeAmount =
          updatedData.overtimeRate * updatedData.overtimeHours;

        // Recalculate net salary (without monthly incentives)
        const totalEarnings =
          updatedData.baseSalary +
          updatedData.bonus +
          updatedData.overtimeAmount;

        const totalDeductions =
          updatedData.purchases +
          updatedData.advances +
          updatedData.absenceDeductions +
          updatedData.penalties;

        updatedData.netSalary = totalEarnings - totalDeductions;
      }

      return updatedData;
    });
  };

  const calculateSalary = () => {
    if (!calculationData) return;

    // Calculate absence deductions based on whether employee has incentives
    const absenceDeductions =
      calculationData.monthlyIncentives > 0
        ? calculationData.dailyRateWithIncentive * calculationData.absenceDays
        : calculationData.dailyRate * calculationData.absenceDays;

    // Calculate penalty deductions based on daily rate and penalty days
    const penalties = calculationData.dailyRate * calculationData.penaltyDays;

    // Calculate overtime amount
    const overtimeAmount =
      calculationData.overtimeRate * calculationData.overtimeHours;

    // Update calculation data
    setCalculationData((prev) => {
      if (!prev) return null;

      const updatedData = {
        ...prev,
        absenceDeductions,
        penalties,
        overtimeAmount,
      };

      // Get actual days in the selected month
      const month = parseInt(selectedMonth);
      const year = parseInt(selectedYear);
      const daysInMonth = new Date(year, month, 0).getDate();

      // Update daily rates based on actual days in month
      updatedData.dailyRate = Math.round(updatedData.baseSalary / daysInMonth);
      updatedData.dailyRateWithIncentive = Math.round(
        (updatedData.baseSalary + updatedData.monthlyIncentives) / daysInMonth,
      );

      // Calculate total earnings (without monthly incentives for net salary)
      const totalEarnings =
        updatedData.baseSalary + updatedData.bonus + updatedData.overtimeAmount;

      // Calculate total deductions
      const totalDeductions =
        updatedData.purchases +
        updatedData.advances +
        updatedData.absenceDeductions +
        updatedData.penalties;

      // Calculate net salary
      updatedData.netSalary = totalEarnings - totalDeductions;
      updatedData.totalSalaryWithIncentive =
        updatedData.baseSalary + updatedData.monthlyIncentives;

      return updatedData;
    });
  };

  const handleSave = () => {
    if (calculationData) {
      onSave(calculationData);
    }
  };

  const handleReset = () => {
    if (selectedEmployeeId) {
      const employee = employees.find((emp) => emp.id === selectedEmployeeId);
      if (employee) {
        setCalculationData({ ...employee });
      }
    }
  };

  const applyAdvance = (advanceId: string) => {
    const advance = pendingAdvances.find((adv) => adv.id === advanceId);
    if (!advance || !calculationData) return;

    // Add advance amount to deductions
    setCalculationData((prev) => {
      if (!prev) return null;

      const updatedAdvances = prev.advances + advance.amount;
      const updatedData = { ...prev, advances: updatedAdvances };

      // Recalculate net salary (without monthly incentives)
      const totalEarnings =
        updatedData.baseSalary + updatedData.bonus + updatedData.overtimeAmount;

      const totalDeductions =
        updatedData.purchases +
        updatedData.advances +
        updatedData.absenceDeductions +
        updatedData.penalties;

      updatedData.netSalary = totalEarnings - totalDeductions;

      return updatedData;
    });

    // Remove advance from pending advances
    setPendingAdvances(pendingAdvances.filter((adv) => adv.id !== advanceId));
  };

  const getTotalEarnings = () => {
    if (!calculationData) return 0;
    // Net salary doesn't include monthly incentives as per requirements
    return (
      calculationData.baseSalary +
      calculationData.bonus +
      calculationData.overtimeAmount
    );
  };

  const getTotalDeductions = () => {
    if (!calculationData) return 0;
    return (
      calculationData.purchases +
      calculationData.advances +
      calculationData.absenceDeductions +
      calculationData.penalties
    );
  };

  return (
    <div className="w-full">
      <Card className="bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        {employee.name} ({employee.id})
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
                        {isRTL ? month.labelAr : month.labelEn} ({month.days}{" "}
                        {t.days})
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

            {calculationData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30">
                  <h3 className="text-lg font-medium text-green-700 dark:text-green-400">
                    {t.earnings}
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="baseSalary">{t.baseSalary}</Label>
                    <Input
                      id="baseSalary"
                      name="baseSalary"
                      type="number"
                      value={calculationData.baseSalary}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncentives">
                      {t.monthlyIncentives}
                    </Label>
                    <Input
                      id="monthlyIncentives"
                      name="monthlyIncentives"
                      type="number"
                      value={calculationData.monthlyIncentives}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bonus">{t.bonus}</Label>
                    <Input
                      id="bonus"
                      name="bonus"
                      type="number"
                      value={calculationData.bonus}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overtimeRate">{t.overtimeRate}</Label>
                    <Input
                      id="overtimeRate"
                      name="overtimeRate"
                      type="number"
                      value={calculationData.overtimeRate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overtimeHours">{t.overtimeHours}</Label>
                    <Input
                      id="overtimeHours"
                      name="overtimeHours"
                      type="number"
                      value={calculationData.overtimeHours}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overtimeAmount">{t.overtimeAmount}</Label>
                    <Input
                      id="overtimeAmount"
                      name="overtimeAmount"
                      type="number"
                      value={calculationData.overtimeAmount}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-medium">
                      <span>{t.totalEarnings}:</span>
                      <span>{getTotalEarnings()} ج.م</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                  <h3 className="text-lg font-medium text-red-700 dark:text-red-400">
                    {t.deductions}
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="purchases">{t.purchases}</Label>
                    <Input
                      id="purchases"
                      name="purchases"
                      type="number"
                      value={calculationData.purchases}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="advances">{t.advances}</Label>
                    <Input
                      id="advances"
                      name="advances"
                      type="number"
                      value={calculationData.advances}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dailyRate">{t.dailyRate}</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="dailyRate"
                        name="dailyRate"
                        type="number"
                        value={calculationData.dailyRate}
                        onChange={handleChange}
                      />
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {t.daysInMonth}:{" "}
                        {new Date(
                          parseInt(selectedYear),
                          parseInt(selectedMonth),
                          0,
                        ).getDate()}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dailyRateWithIncentive">
                      {t.dailyRateWithIncentive}
                    </Label>
                    <Input
                      id="dailyRateWithIncentive"
                      name="dailyRateWithIncentive"
                      type="number"
                      value={calculationData.dailyRateWithIncentive}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="absenceDays">{t.absenceDays}</Label>
                    <Input
                      id="absenceDays"
                      name="absenceDays"
                      type="number"
                      value={calculationData.absenceDays}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="absenceDeductions">
                      {t.absenceDeductions}
                    </Label>
                    <Input
                      id="absenceDeductions"
                      name="absenceDeductions"
                      type="number"
                      value={calculationData.absenceDeductions}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="penaltyDays">{t.penaltyDays}</Label>
                    <Input
                      id="penaltyDays"
                      name="penaltyDays"
                      type="number"
                      value={calculationData.penaltyDays}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="penalties">{t.penalties}</Label>
                    <Input
                      id="penalties"
                      name="penalties"
                      type="number"
                      value={calculationData.penalties}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-medium">
                      <span>{t.totalDeductions}:</span>
                      <span>{getTotalDeductions()} ج.م</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {calculationData && (
              <div className="space-y-4 mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                <h3 className="text-lg font-medium text-blue-700 dark:text-blue-400">
                  {t.netSalary}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="netSalary">{t.netSalary}</Label>
                    <Input
                      id="netSalary"
                      name="netSalary"
                      type="number"
                      value={calculationData.netSalary}
                      readOnly
                      className="bg-white dark:bg-gray-800 font-bold text-lg border-2 border-blue-200 dark:border-blue-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalSalaryWithIncentive">
                      {t.totalSalaryWithIncentive}
                    </Label>
                    <Input
                      id="totalSalaryWithIncentive"
                      name="totalSalaryWithIncentive"
                      type="number"
                      value={calculationData.totalSalaryWithIncentive}
                      readOnly
                      className="bg-white dark:bg-gray-800 font-bold text-lg border-2 border-blue-200 dark:border-blue-800"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleReset}>
                    {t.reset}
                  </Button>
                  <div className="space-x-2">
                    <Button onClick={calculateSalary}>{t.calculate}</Button>
                    <Button onClick={handleSave}>{t.save}</Button>
                  </div>
                </div>
              </div>
            )}

            {pendingAdvances.length > 0 && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium">{t.pendingAdvances}</h3>
                <div className="space-y-2">
                  {pendingAdvances.map((advance) => (
                    <div
                      key={advance.id}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <div>
                        <div className="font-medium">{advance.amount} ج.م</div>
                        <div className="text-sm text-muted-foreground">
                          {advance.requestDate}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => applyAdvance(advance.id)}
                      >
                        {t.applyAdvance}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryCalculator;
