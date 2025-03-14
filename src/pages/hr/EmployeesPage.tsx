import React from "react";
import HRLayout from "@/components/layout/HRLayout";
import EmployeesList from "@/components/hr/employees/EmployeesList.optimized";

const EmployeesPage = () => {
  return (
    <HRLayout activeNavItem="/employees">
      <EmployeesList />
    </HRLayout>
  );
};

export default EmployeesPage;
