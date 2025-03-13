import React, { useEffect, useState } from "react";
import HRLayout from "@/components/layout/HRLayout";
import PayslipPrint from "@/components/hr/print/PayslipPrint.supabase";
import { useLocation } from "react-router-dom";

const PrintPage = () => {
  const location = useLocation();
  const [shouldPrint, setShouldPrint] = useState(false);
  const [shouldDownload, setShouldDownload] = useState(false);
  const [payrollId, setPayrollId] = useState<string | null>(null);

  useEffect(() => {
    // Parse query parameters
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    const print = searchParams.get("print");
    const download = searchParams.get("download");

    if (id) {
      setPayrollId(id);
    }

    if (print === "true") {
      setShouldPrint(true);
    }

    if (download === "true") {
      setShouldDownload(true);
    }
  }, [location]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF or other downloadable format
    console.log("Download payslip");
  };

  // Trigger print or download if needed
  useEffect(() => {
    if (shouldPrint) {
      // Small delay to ensure content is loaded
      const timer = setTimeout(() => {
        handlePrint();
        setShouldPrint(false);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (shouldDownload) {
      // Small delay to ensure content is loaded
      const timer = setTimeout(() => {
        handleDownload();
        setShouldDownload(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldPrint, shouldDownload]);

  return (
    <HRLayout activeNavItem="/print">
      <PayslipPrint
        onPrint={handlePrint}
        onDownload={handleDownload}
        selectedPayrollId={payrollId}
      />
    </HRLayout>
  );
};

export default PrintPage;
