import React from "react";
import HRLayout from "@/components/layout/HRLayout";
import AdvancesList from "@/components/hr/advances/AdvancesList.supabase";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const AdvancesPage = () => {
  // Use Supabase data hook to update payroll records when advances are deducted
  const { updateRow } = useSupabaseData("payroll");
  const { toast } = useToast();

  const handleUpdateEmployeeAdvances = async (
    employeeId: string,
    advanceAmount: number,
  ) => {
    try {
      // Get current month and year for payroll record
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      // Find the payroll record for this employee in the current month/year
      const { data: payrollRecords, error: fetchError } = await supabase
        .from("payroll")
        .select("*")
        .eq("employee_id", employeeId)
        .eq("month", currentMonth)
        .eq("year", currentYear);

      if (fetchError) throw fetchError;

      if (payrollRecords && payrollRecords.length > 0) {
        // Update existing payroll record
        const payroll = payrollRecords[0];
        const currentAdvances = Number(payroll.advances || 0);
        const newAdvancesTotal = currentAdvances + advanceAmount;

        // Calculate new net salary
        const newNetSalary = Number(payroll.net_salary) - advanceAmount;

        // Update the payroll record
        const { error: updateError } = await supabase
          .from("payroll")
          .update({
            advances: newAdvancesTotal,
            net_salary: newNetSalary,
            updated_at: new Date().toISOString(),
          })
          .eq("id", payroll.id);

        if (updateError) throw updateError;

        console.log(
          `Updated employee ${employeeId} advances from ${currentAdvances} to ${newAdvancesTotal}`,
        );
      } else {
        // Find employee data to create a new payroll record if needed
        const { data: employeeData, error: employeeError } = await supabase
          .from("employees")
          .select("*")
          .eq("id", employeeId)
          .single();

        if (employeeError) throw employeeError;

        if (employeeData) {
          // Create a new payroll record with the advance
          const baseSalary = Number(employeeData.base_salary);
          const monthlyIncentives = Number(
            employeeData.monthly_incentives || 0,
          );
          const netSalary = baseSalary - advanceAmount;

          const { error: insertError } = await supabase.from("payroll").insert({
            employee_id: employeeId,
            month: currentMonth,
            year: currentYear,
            base_salary: baseSalary,
            monthly_incentives: monthlyIncentives,
            advances: advanceAmount,
            net_salary: netSalary,
            total_salary_with_incentive: baseSalary + monthlyIncentives,
            status: "active",
          });

          if (insertError) throw insertError;

          console.log(
            `Created new payroll record for employee ${employeeId} with advances ${advanceAmount}`,
          );
        }
      }
    } catch (error) {
      console.error("Error updating employee advances:", error);
    }
  };

  return (
    <HRLayout activeNavItem="/advances">
      <AdvancesList onUpdateEmployeeAdvances={handleUpdateEmployeeAdvances} />
    </HRLayout>
  );
};

export default AdvancesPage;
