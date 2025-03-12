import React from "react";
import HRLayout from "@/components/layout/HRLayout";
import PayslipPrint from "@/components/hr/print/PayslipPrint.supabase";

const PrintPage = () => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF or other downloadable format
    console.log("Download payslip");
  };

  return (
    <HRLayout activeNavItem="/print">
      <PayslipPrint onPrint={handlePrint} onDownload={handleDownload} />
    </HRLayout>
  );
};

export default PrintPage;
