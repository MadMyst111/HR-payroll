import React from "react";
import HRLayout from "@/components/layout/HRLayout";
import AdvancesList from "@/components/hr/advances/AdvancesList.supabase";
import { useSupabaseData } from "@/hooks/useSupabaseData";

const AdvancesPage = () => {
  // Use Supabase data hook to update payroll records when advances are deducted
  const { updateRow } = useSupabaseData("payroll");

  const handleUpdateEmployeeAdvances = async (
    employeeId: string,
    advanceAmount: number,
  ) => {
    try {
      // Get current month and year for payroll record
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      // In a real app, you would find the payroll record for this employee and update it
      // For now, we'll just log the action
      console.log(
        `Updated employee ${employeeId} advances by ${advanceAmount}`,
      );
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
