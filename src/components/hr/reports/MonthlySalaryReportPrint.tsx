import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EmployeeFormData } from "../employees/AddEmployeeForm";

interface MonthlySalaryReportPrintProps {
  employees: EmployeeFormData[];
  month: string;
  year: string;
  totalBaseSalary: number;
  totalIncentives: number;
  totalNetSalary: number;
}

const months = [
  { value: "01", labelAr: "يناير", labelEn: "January" },
  { value: "02", labelAr: "فبراير", labelEn: "February" },
  { value: "03", labelAr: "مارس", labelEn: "March" },
  { value: "04", labelAr: "أبريل", labelEn: "April" },
  { value: "05", labelAr: "مايو", labelEn: "May" },
  { value: "06", labelAr: "يونيو", labelEn: "June" },
  { value: "07", labelAr: "يوليو", labelEn: "July" },
  { value: "08", labelAr: "أغسطس", labelEn: "August" },
  { value: "09", labelAr: "سبتمبر", labelEn: "September" },
  { value: "10", labelAr: "أكتوبر", labelEn: "October" },
  { value: "11", labelAr: "نوفمبر", labelEn: "November" },
  { value: "12", labelAr: "ديسمبر", labelEn: "December" },
];

const MonthlySalaryReportPrint = ({
  employees,
  month,
  year,
  totalBaseSalary,
  totalIncentives,
  totalNetSalary,
}: MonthlySalaryReportPrintProps) => {
  const { isRTL } = useLanguage();

  const labels = {
    ar: {
      title: "تقرير الرواتب الشهري",
      employeeId: "كود الموظف",
      employeeName: "اسم الموظف",
      department: "القسم",
      baseSalary: "الراتب الأساسي",
      monthlyIncentives: "الحوافز الشهرية",
      absenceDays: "أيام الغيابات",
      bonus: "مكافأة",
      overtimeAmount: "قيمة الأوفر تايم",
      totalDeductions: "إجمالي الخصومات",
      netSalary: "صافي الراتب",
      totalEmployees: "إجمالي الموظفين",
      totalNetSalaries: "إجمالي صافي الرواتب",
      totalBaseSalaries: "إجمالي الرواتب الأساسية",
      totalIncentives: "إجمالي الحوافز",
    },
    en: {
      title: "Monthly Salary Report",
      employeeId: "Employee ID",
      employeeName: "Employee Name",
      department: "Department",
      baseSalary: "Base Salary",
      monthlyIncentives: "Monthly Incentives",
      absenceDays: "Absence Days",
      bonus: "Bonus",
      overtimeAmount: "Overtime Amount",
      totalDeductions: "Total Deductions",
      netSalary: "Net Salary",
      totalEmployees: "Total Employees",
      totalNetSalaries: "Total Net Salaries",
      totalBaseSalaries: "Total Base Salaries",
      totalIncentives: "Total Incentives",
    },
  };

  const t = isRTL ? labels.ar : labels.en;
  const monthLabel = months.find((m) => m.value === month)?.labelAr || month;

  return (
    <div className="print-report" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <div className="report-header">
        <h1>{t.title}</h1>
        <h2>
          {monthLabel} / {year}
        </h2>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>{t.employeeId}</th>
            <th>{t.employeeName}</th>
            <th>{t.department}</th>
            <th>{t.baseSalary}</th>
            <th>{t.monthlyIncentives}</th>
            <th>{t.absenceDays}</th>
            <th>{t.bonus}</th>
            <th>{t.overtimeAmount}</th>
            <th>{t.totalDeductions}</th>
            <th>{t.netSalary}</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
            const totalDeductions =
              employee.purchases +
              employee.advances +
              employee.absenceDeductions +
              employee.penalties;

            return (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td className="number">{employee.baseSalary}</td>
                <td className="number">{employee.monthlyIncentives}</td>
                <td className="number">{employee.absenceDays}</td>
                <td className="number">{employee.bonus}</td>
                <td className="number">{employee.overtimeAmount}</td>
                <td className="number">{totalDeductions}</td>
                <td className="number">{employee.netSalary}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="summary-label">
              {t.totalEmployees}: {employees.length}
            </td>
            <td className="number">{totalBaseSalary}</td>
            <td className="number">{totalIncentives}</td>
            <td colSpan={4}></td>
            <td className="number">{totalNetSalary}</td>
          </tr>
        </tfoot>
      </table>

      <style jsx>{`
        .print-report {
          font-family: "Cairo", sans-serif;
          padding: 10px;
          max-width: 100%;
          margin: 0 auto;
        }

        .report-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .report-header h1 {
          font-size: 24px;
          margin: 0 0 5px 0;
        }

        .report-header h2 {
          font-size: 18px;
          font-weight: normal;
          margin: 0;
          color: #666;
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }

        .report-table th,
        .report-table td {
          border: 1px solid #ddd;
          padding: 6px;
        }

        .report-table th {
          background-color: #f0f0f0;
          font-weight: bold;
        }

        .report-table .number {
          text-align: right;
        }

        .report-table tfoot tr {
          font-weight: bold;
          background-color: #f9f9f9;
        }

        .summary-label {
          text-align: ${isRTL ? "right" : "left"};
        }

        @media print {
          @page {
            size: landscape;
            margin: 0.5cm;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .print-report {
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default MonthlySalaryReportPrint;
