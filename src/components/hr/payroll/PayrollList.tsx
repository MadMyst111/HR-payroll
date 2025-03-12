import React from "react";
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

const defaultPayrollItems: PayrollItem[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "أحمد محمد",
    month: "05",
    year: "2023",
    baseSalary: 5000,
    allowances: 500,
    deductions: 200,
    netSalary: 5300,
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "سارة أحمد",
    month: "05",
    year: "2023",
    baseSalary: 4500,
    allowances: 400,
    deductions: 150,
    netSalary: 4750,
  },
  {
    id: "3",
    employeeId: "3",
    employeeName: "محمد علي",
    month: "05",
    year: "2023",
    baseSalary: 7000,
    allowances: 700,
    deductions: 300,
    netSalary: 7400,
  },
];

const PayrollList = ({
  payrollItems = defaultPayrollItems,
  onViewDetails = () => {},
  onPrint = () => {},
  onDownload = () => {},
}: PayrollListProps) => {
  const { isRTL } = useLanguage();

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
    },
  };

  const t = isRTL ? labels.ar : labels.en;

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
            {payrollItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{`${item.month}/${item.year}`}</TableCell>
                <TableCell>{item.employeeId}</TableCell>
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
