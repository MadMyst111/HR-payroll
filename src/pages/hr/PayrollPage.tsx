import React, { useState } from "react";
import HRLayout from "@/components/layout/HRLayout";
import PayrollList from "@/components/hr/payroll/PayrollList.supabase";
import SalaryCalculator from "@/components/hr/payroll/SalaryCalculator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { EmployeeFormData } from "@/components/hr/employees/AddEmployeeForm";
import { AdvanceData } from "@/components/hr/advances/AddAdvanceForm";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const PayrollPage = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("payroll-list");

  // Fetch data from Supabase
  const { data: supabaseEmployees } = useSupabaseData("employees");
  const { data: supabaseAdvances } = useSupabaseData("advances");
  const { insertRow: insertPayroll, updateRow: updatePayroll } =
    useSupabaseData("payroll");

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

  // Get the updateRow function from the employees table hook
  const { updateRow: updateEmployee } = useSupabaseData("employees");

  const handleSaveEmployee = async (updatedEmployee: EmployeeFormData) => {
    try {
      console.log("Saving employee data:", updatedEmployee);

      // Update employee in Supabase
      const result = await updateEmployee(updatedEmployee.id, {
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

      console.log("Employee update result:", result);

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      // Create payroll data from the updated employee
      const payrollData = {
        employee_id: updatedEmployee.id,
        month: currentMonth,
        year: currentYear,
        base_salary: updatedEmployee.baseSalary,
        monthly_incentives: updatedEmployee.monthlyIncentives,
        bonus: updatedEmployee.bonus,
        overtime_hours: updatedEmployee.overtimeHours,
        overtime_amount: updatedEmployee.overtimeAmount,
        purchases: updatedEmployee.purchases,
        advances: updatedEmployee.advances,
        absence_days: updatedEmployee.absenceDays,
        absence_deductions: updatedEmployee.absenceDeductions,
        penalty_days: updatedEmployee.penaltyDays,
        penalties: updatedEmployee.penalties,
        net_salary: updatedEmployee.netSalary,
        total_salary_with_incentive: updatedEmployee.totalSalaryWithIncentive,
        status: "active",
      };

      try {
        // First check if a payroll record exists for this employee in the current month/year
        const { data: existingPayroll } = await supabase
          .from("payroll")
          .select("id")
          .eq("employee_id", updatedEmployee.id)
          .eq("month", currentMonth)
          .eq("year", currentYear)
          .single();

        if (existingPayroll) {
          // Update existing record
          await updatePayroll(existingPayroll.id, payrollData);
          console.log("Updated existing payroll record");
        } else {
          // Insert new record
          await insertPayroll(payrollData);
          console.log("Created new payroll record");
        }

        toast({
          title: isRTL
            ? "تم حفظ بيانات الراتب بنجاح"
            : "Salary data saved successfully",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error managing payroll record:", error);
        toast({
          title: isRTL
            ? "حدث خطأ أثناء حفظ بيانات الراتب"
            : "Error saving payroll data",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast({
        title: isRTL
          ? "حدث خطأ أثناء تحديث بيانات الموظف"
          : "Error updating employee data",
        variant: "destructive",
        duration: 3000,
      });
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
              onViewDetails={(id) => {
                // Navigate to print page with the selected payroll ID
                window.open(`/print?id=${id}`, "_blank");
              }}
              onPrint={(id) => {
                window.open(`/print?id=${id}&print=true`, "_blank");
              }}
              onDownload={(id) => {
                // Create a PDF download or export data
                toast({
                  title: isRTL
                    ? "جاري تحميل كشف الراتب..."
                    : "Downloading payslip...",
                  duration: 3000,
                });
                window.open(`/print?id=${id}&download=true`, "_blank");
              }}
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
