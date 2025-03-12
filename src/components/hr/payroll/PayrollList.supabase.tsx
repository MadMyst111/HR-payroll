import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Printer, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useToast } from "@/components/ui/use-toast";

interface PayrollItem {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
}

interface PayrollListProps {
  payrollItems?: PayrollItem[];
  onViewDetails?: (id: string) => void;
  onPrint?: (id: string) => void;
  onDownload?: (id: string) => void;
}

const PayrollList = ({
  payrollItems = [],
  onViewDetails = () => {},
  onPrint = () => {},
  onDownload = () => {},
}: PayrollListProps) => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();

  // Fetch data from Supabase
  const {
    data: supabasePayroll,
    loading: payrollLoading,
    error: payrollError,
  } = useSupabaseData("payroll");

  const { data: supabaseEmployees, loading: employeesLoading } =
    useSupabaseData("employees");

  const [payroll, setPayroll] = useState<PayrollItem[]>(payrollItems);

  // Convert Supabase payroll to PayrollItem
  useEffect(() => {
    if (supabasePayroll && supabasePayroll.length > 0 && supabaseEmployees) {
      const formattedPayroll = supabasePayroll.map((pay) => {
        // Find employee name
        const employee = supabaseEmployees.find(
          (emp) => emp.id === pay.employee_id,
        );

        // Calculate allowances (bonus + overtime)
        const allowances =
          Number(pay.bonus || 0) + Number(pay.overtime_amount || 0);

        // Calculate deductions (purchases + advances + absence_deductions + penalties)
        const deductions =
          Number(pay.purchases || 0) +
          Number(pay.advances || 0) +
          Number(pay.absence_deductions || 0) +
          Number(pay.penalties || 0);

        return {
          id: pay.id,
          employeeId: pay.employee_id || "",
          employeeName: employee?.name || "Unknown Employee",
          month: pay.month.toString().padStart(2, "0"),
          year: pay.year.toString(),
          baseSalary: Number(pay.base_salary),
          allowances: allowances,
          deductions: deductions,
          netSalary: Number(pay.net_salary),
        };
      });
      setPayroll(formattedPayroll);
    } else if (!payrollLoading && supabasePayroll?.length === 0) {
      // If no payroll in database and employees exist, add default ones
      if (supabaseEmployees && supabaseEmployees.length > 0) {
        addDefaultPayroll();
      }
    }
  }, [supabasePayroll, supabaseEmployees, payrollLoading]);

  const addDefaultPayroll = async () => {
    // No default payroll needed - fresh start
    return;
  };

  const labels = {
    ar: {
      title: "كشف الرواتب",
      period: "الفترة",
      employeeId: "رقم الموظف",
      employeeName: "اسم الموظف",
      baseSalary: "الراتب الأساسي",
      allowances: "البدلات",
      deductions: "الخصومات",
      netSalary: "صافي الراتب",
      actions: "الإجراءات",
      viewDetails: "عرض التفاصيل",
      print: "طباعة",
      download: "تحميل",
      loading: "جاري التحميل...",
      error: "حدث خطأ أثناء تحميل البيانات",
    },
    en: {
      title: "Payroll List",
      period: "Period",
      employeeId: "Employee ID",
      employeeName: "Employee Name",
      baseSalary: "Base Salary",
      allowances: "Allowances",
      deductions: "Deductions",
      netSalary: "Net Salary",
      actions: "Actions",
      viewDetails: "View Details",
      print: "Print",
      download: "Download",
      loading: "Loading...",
      error: "Error loading data",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  if (payrollLoading || employeesLoading) {
    return <div className="p-8 text-center">{t.loading}</div>;
  }

  if (payrollError) {
    return (
      <div className="p-8 text-center text-red-500">
        {t.error}: {payrollError.message}
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{t.title}</h2>
      </div>

      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.period}</TableHead>
              <TableHead>{t.employeeId}</TableHead>
              <TableHead>{t.employeeName}</TableHead>
              <TableHead className="text-right">{t.baseSalary}</TableHead>
              <TableHead className="text-right">{t.allowances}</TableHead>
              <TableHead className="text-right">{t.deductions}</TableHead>
              <TableHead className="text-right">{t.netSalary}</TableHead>
              <TableHead className="text-right">{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payroll.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{`${item.month}/${item.year}`}</TableCell>
                <TableCell>{item.employeeId.substring(0, 8)}</TableCell>
                <TableCell>{item.employeeName}</TableCell>
                <TableCell className="text-right">
                  {item.baseSalary} ج.م
                </TableCell>
                <TableCell className="text-right">
                  {item.allowances} ج.م
                </TableCell>
                <TableCell className="text-right">
                  {item.deductions} ج.م
                </TableCell>
                <TableCell className="text-right">
                  {item.netSalary} ج.م
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(item.id)}
                      title={t.viewDetails}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onPrint(item.id)}
                      title={t.print}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDownload(item.id)}
                      title={t.download}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PayrollList;
