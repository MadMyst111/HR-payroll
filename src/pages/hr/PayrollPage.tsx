import React, { useState } from "react";
import HRLayout from "@/components/layout/HRLayout";
import PayrollList from "@/components/hr/payroll/PayrollList.supabase";
import SalaryCalculator from "@/components/hr/payroll/SalaryCalculator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { EmployeeFormData } from "@/components/hr/employees/AddEmployeeForm";
import { AdvanceData } from "@/components/hr/advances/AddAdvanceForm";
import { useSupabaseData } from "@/hooks/useSupabaseData";

const PayrollPage = () => {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("payroll-list");

  // Fetch data from Supabase
  const { data: supabaseEmployees } = useSupabaseData("employees");
  const { data: supabaseAdvances } = useSupabaseData("advances");

  // Convert Supabase data to component format
  const employees: EmployeeFormData[] =
    supabaseEmployees?.map((emp) => ({
      id: emp.id,
      name: emp.name,
      position: emp.position,
      department: emp.department,
      joinDate: emp.join_date,
      baseSalary: Number(emp.base_salary),
      dailyRate: Number(emp.daily_rate || 0),
      dailyRateWithIncentive: Number(emp.daily_rate_with_incentive || 0),
      overtimeRate: Number(emp.overtime_rate || 0),
      overtimeHours: 0,
      monthlyIncentives: Number(emp.monthly_incentives || 0),
      bonus: 0,
      overtimeAmount: 0,
      purchases: 0,
      advances: 0,
      absenceDays: 0,
      absenceDeductions: 0,
      penaltyDays: 0,
      penalties: 0,
      netSalary: Number(emp.base_salary),
      totalSalaryWithIncentive:
        Number(emp.base_salary) + Number(emp.monthly_incentives || 0),
    })) || [];

  const advances: AdvanceData[] =
    supabaseAdvances?.map((adv) => {
      const employee = supabaseEmployees?.find(
        (emp) => emp.id === adv.employee_id,
      );
      return {
        id: adv.id,
        employeeId: adv.employee_id || "",
        employeeName: employee?.name || "Unknown Employee",
        amount: Number(adv.amount),
        requestDate: adv.request_date,
        expectedPaymentDate: adv.expected_payment_date,
        status: adv.status as "pending" | "approved" | "rejected" | "paid",
        approvedBy: adv.approved_by || undefined,
        paymentDate: adv.payment_date || undefined,
        notes: adv.notes || undefined,
      };
    }) || [];

  const labels = {
    ar: {
      payrollList: "كشف الرواتب",
      salaryCalculator: "حاسبة الرواتب",
    },
    en: {
      payrollList: "Payroll List",
      salaryCalculator: "Salary Calculator",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const handleSaveEmployee = async (updatedEmployee: EmployeeFormData) => {
    try {
      // Update employee in Supabase
      const { updateRow } = useSupabaseData("employees");
      await updateRow(updatedEmployee.id, {
        name: updatedEmployee.name,
        position: updatedEmployee.position,
        department: updatedEmployee.department,
        join_date: updatedEmployee.joinDate,
        base_salary: updatedEmployee.baseSalary,
        monthly_incentives: updatedEmployee.monthlyIncentives,
        daily_rate: updatedEmployee.dailyRate,
        daily_rate_with_incentive: updatedEmployee.dailyRateWithIncentive,
        overtime_rate: updatedEmployee.overtimeRate,
      });
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <HRLayout activeNavItem="/payroll">
      <Tabs
        defaultValue="payroll-list"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="payroll-list">{t.payrollList}</TabsTrigger>
          <TabsTrigger value="salary-calculator">
            {t.salaryCalculator}
          </TabsTrigger>
        </TabsList>

        {activeTab === "payroll-list" && (
          <div className="mt-6">
            <PayrollList
              onViewDetails={(id) => console.log("View details", id)}
              onPrint={(id) => console.log("Print", id)}
              onDownload={(id) => console.log("Download", id)}
            />
          </div>
        )}

        {activeTab === "salary-calculator" && (
          <div className="mt-6">
            <SalaryCalculator
              employees={employees}
              advances={advances}
              onSave={handleSaveEmployee}
            />
          </div>
        )}
      </Tabs>
    </HRLayout>
  );
};

export default PayrollPage;
