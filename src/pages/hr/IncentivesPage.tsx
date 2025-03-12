import React from "react";
import HRLayout from "@/components/layout/HRLayout";
import IncentivesManagement from "@/components/hr/incentives/IncentivesManagement";

const IncentivesPage = () => {
  return (
    <HRLayout activeNavItem="/incentives">
      <IncentivesManagement />
    </HRLayout>
  );
};

export default IncentivesPage;
