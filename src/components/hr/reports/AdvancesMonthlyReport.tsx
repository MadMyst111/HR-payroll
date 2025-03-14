import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/ui/print-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search, Filter, Calendar, Printer } from "lucide-react";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  RTLAwareCard,
  RTLAwareCardContent,
  RTLAwareCardHeader,
  RTLAwareCardTitle,
} from "@/components/ui/rtl-aware-card";
import {
  RTLAwareTable,
  RTLAwareTableBody,
  RTLAwareTableCell,
  RTLAwareTableHead,
  RTLAwareTableHeader,
} from "@/components/ui/rtl-aware-table";
import { RTLAwareContainer } from "@/components/ui/rtl-container";
import { supabase } from "@/lib/supabase";

interface AdvanceReportData {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  requestDate: string;
  expectedPaymentDate: string;
  status: "pending" | "approved" | "rejected" | "paid";
  approvedBy?: string;
  paymentDate?: string;
  notes?: string;
  isDeducted?: boolean;
  deductionDate?: string;
  remainingAmount?: number;
  isNew?: boolean; // Flag to identify new advances
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

const years = ["2023", "2024", "2025"];

const AdvancesMonthlyReport = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();

  // Fetch data from Supabase
  const { data: supabaseEmployees, loading: employeesLoading } =
    useSupabaseData("employees");

  const {
    data: supabaseAdvances,
    loading: advancesLoading,
    error: advancesError,
  } = useSupabaseData("advances");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString().padStart(2, "0"),
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [advances, setAdvances] = useState<AdvanceReportData[]>([]);
  const [previousAdvances, setPreviousAdvances] = useState<AdvanceReportData[]>(
    [],
  );
  const [newAdvances, setNewAdvances] = useState<AdvanceReportData[]>([]);

  // Convert Supabase advances to AdvanceReportData and categorize them
  useEffect(() => {
    if (supabaseAdvances && supabaseAdvances.length > 0 && supabaseEmployees) {
      const formattedAdvances = supabaseAdvances.map((adv) => {
        // Find employee name
        const employee = supabaseEmployees.find(
          (emp) => emp.id === adv.employee_id,
        );

        // Calculate remaining amount - use the stored value if available, otherwise use the full amount
        const remainingAmount =
          adv.remaining_amount !== null && adv.remaining_amount !== undefined
            ? Number(adv.remaining_amount)
            : Number(adv.amount);

        // Determine if this is a new advance (created in the current month)
        const requestDate = new Date(adv.request_date);
        const requestMonth = (requestDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        const requestYear = requestDate.getFullYear().toString();
        const isCurrentMonth =
          requestMonth === selectedMonth && requestYear === selectedYear;

        // Determine if this is a previous advance (created before the current month but still has remaining amount)
        const isPreviousAdvance =
          (!isCurrentMonth &&
            adv.is_deducted === true &&
            remainingAmount > 0) ||
          adv.status === "approved" ||
          adv.status === "paid";

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
          isDeducted: adv.is_deducted || false,
          deductionDate: adv.deduction_date || undefined,
          remainingAmount: remainingAmount,
          isNew: isCurrentMonth,
        };
      });

      setAdvances(formattedAdvances);

      // Separate advances into new and previous
      const newAdvs = formattedAdvances.filter((adv) => adv.isNew);
      const prevAdvs = formattedAdvances.filter(
        (adv) =>
          !adv.isNew &&
          ((adv.isDeducted && adv.remainingAmount && adv.remainingAmount > 0) ||
            (!adv.isDeducted &&
              (adv.status === "approved" || adv.status === "paid"))),
      );

      setNewAdvances(newAdvs);
      setPreviousAdvances(prevAdvs);
    }
  }, [supabaseAdvances, supabaseEmployees, selectedMonth, selectedYear]);

  const labels = {
    ar: {
      title: "تقرير السلف الشهري",
      description: "تفاصيل السلف المصروفة والمستحقة",
      search: "بحث عن موظف...",
      month: "الشهر",
      year: "السنة",
      status: "الحالة",
      allStatuses: "جميع الحالات",
      filter: "تصفية",
      print: "طباعة",
      export: "تصدير",
      employeeId: "كود الموظف",
      employeeName: "اسم الموظف",
      amount: "المبلغ",
      requestDate: "تاريخ الطلب",
      expectedPaymentDate: "تاريخ السداد المتوقع",
      paymentDate: "تاريخ الدفع",
      approvedBy: "تمت الموافقة من قبل",
      notes: "ملاحظات",
      statusLabels: {
        pending: "قيد الانتظار",
        approved: "تمت الموافقة",
        rejected: "مرفوض",
        paid: "تم الدفع",
      },
      summary: "ملخص السلف",
      totalAdvances: "إجمالي السلف",
      totalAmount: "إجمالي المبلغ",
      approvedAdvances: "السلف المعتمدة",
      approvedAmount: "مبلغ السلف المعتمدة",
      paidAdvances: "السلف المدفوعة",
      paidAmount: "مبلغ السلف المدفوعة",
      pendingAdvances: "السلف المعلقة",
      pendingAmount: "مبلغ السلف المعلقة",
      loading: "جاري التحميل...",
      error: "حدث خطأ أثناء تحميل البيانات",
      noData: "لا توجد بيانات للعرض",
      newAdvances: "السلف الجديدة",
      previousAdvances: "السلف السابقة",
      remainingAmount: "المبلغ المتبقي",
      isDeducted: "تم الخصم",
      deductionDate: "تاريخ الخصم",
      yes: "نعم",
      no: "لا",
      companyName: "شركة الموارد البشرية",
      reportDate: "تاريخ التقرير",
      signature: "التوقيع",
      hrManager: "مدير الموارد البشرية",
      page: "صفحة",
      of: "من",
    },
    en: {
      title: "Monthly Advances Report",
      description: "Details of disbursed and due advances",
      search: "Search for employee...",
      month: "Month",
      year: "Year",
      status: "Status",
      allStatuses: "All Statuses",
      filter: "Filter",
      print: "Print",
      export: "Export",
      employeeId: "Employee ID",
      employeeName: "Employee Name",
      amount: "Amount",
      requestDate: "Request Date",
      expectedPaymentDate: "Expected Payment Date",
      paymentDate: "Payment Date",
      approvedBy: "Approved By",
      notes: "Notes",
      statusLabels: {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        paid: "Paid",
      },
      summary: "Advances Summary",
      totalAdvances: "Total Advances",
      totalAmount: "Total Amount",
      approvedAdvances: "Approved Advances",
      approvedAmount: "Approved Amount",
      paidAdvances: "Paid Advances",
      paidAmount: "Paid Amount",
      pendingAdvances: "Pending Advances",
      pendingAmount: "Pending Amount",
      loading: "Loading...",
      error: "Error loading data",
      noData: "No data to display",
      newAdvances: "New Advances",
      previousAdvances: "Previous Advances",
      remainingAmount: "Remaining Amount",
      isDeducted: "Deducted",
      deductionDate: "Deduction Date",
      yes: "Yes",
      no: "No",
      companyName: "HR Company",
      reportDate: "Report Date",
      signature: "Signature",
      hrManager: "HR Manager",
      page: "Page",
      of: "of",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const getStatusBadge = (status: AdvanceReportData["status"]) => {
    const variants = {
      pending: "warning",
      approved: "success",
      rejected: "destructive",
      paid: "default",
    };

    return (
      <Badge variant={variants[status] as any}>{t.statusLabels[status]}</Badge>
    );
  };

  // Filter advances based on search term, month, year, and status
  const filteredAdvances = advances.filter((advance) => {
    // Check if the advance matches the search term
    const matchesSearch =
      advance.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advance.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    // Check if the advance matches the selected status
    const matchesStatus =
      selectedStatus === "all" || advance.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate advance statistics
  const advanceStats = {
    totalAdvances: filteredAdvances.length,
    totalAmount: filteredAdvances.reduce((total, adv) => total + adv.amount, 0),
    approvedAdvances: filteredAdvances.filter(
      (adv) => adv.status === "approved",
    ).length,
    approvedAmount: filteredAdvances
      .filter((adv) => adv.status === "approved")
      .reduce((total, adv) => total + adv.amount, 0),
    paidAdvances: filteredAdvances.filter((adv) => adv.status === "paid")
      .length,
    paidAmount: filteredAdvances
      .filter((adv) => adv.status === "paid")
      .reduce((total, adv) => total + adv.amount, 0),
    pendingAdvances: filteredAdvances.filter((adv) => adv.status === "pending")
      .length,
    pendingAmount: filteredAdvances
      .filter((adv) => adv.status === "pending")
      .reduce((total, adv) => total + adv.amount, 0),
    newAdvancesCount: newAdvances.length,
    newAdvancesAmount: newAdvances.reduce(
      (total, adv) => total + adv.amount,
      0,
    ),
    previousAdvancesCount: previousAdvances.length,
    previousAdvancesAmount: previousAdvances.reduce((total, adv) => {
      // For previous advances, use remaining amount if available
      const amount =
        adv.remainingAmount !== undefined ? adv.remainingAmount : adv.amount;
      return total + amount;
    }, 0),
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Get the current date for the report
    const currentDate = new Date().toLocaleDateString(
      isRTL ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    // Generate HTML for new advances
    const generateNewAdvancesRows = () => {
      return newAdvances
        .filter((advance) => {
          const matchesSearch =
            !searchTerm ||
            advance.employeeName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            advance.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus =
            selectedStatus === "all" || advance.status === selectedStatus;
          return matchesSearch && matchesStatus;
        })
        .map(
          (advance) => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 6px;">${advance.employeeName}</td>
            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${advance.amount.toFixed(2)} ج.م</td>
            <td style="border: 1px solid #ddd; padding: 6px;">${advance.requestDate}</td>
            <td style="border: 1px solid #ddd; padding: 6px;">${advance.expectedPaymentDate}</td>
            <td style="border: 1px solid #ddd; padding: 6px;">${t.statusLabels[advance.status]}</td>
            <td style="border: 1px solid #ddd; padding: 6px;">${advance.isDeducted ? t.yes : t.no}</td>
          </tr>
        `,
        )
        .join("");
    };

    // Generate HTML for previous advances
    const generatePreviousAdvancesRows = () => {
      return previousAdvances
        .filter((advance) => {
          const matchesSearch =
            !searchTerm ||
            advance.employeeName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            advance.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus =
            selectedStatus === "all" || advance.status === selectedStatus;
          return matchesSearch && matchesStatus;
        })
        .map(
          (advance) => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 6px;">${advance.employeeName}</td>
            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${advance.amount.toFixed(2)} ج.م</td>
            <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${advance.remainingAmount !== undefined ? advance.remainingAmount.toFixed(2) : advance.amount.toFixed(2)} ج.م</td>
            <td style="border: 1px solid #ddd; padding: 6px;">${advance.requestDate}</td>
            <td style="border: 1px solid #ddd; padding: 6px;">${t.statusLabels[advance.status]}</td>
            <td style="border: 1px solid #ddd; padding: 6px;">${advance.isDeducted ? t.yes : t.no}</td>
            <td style="border: 1px solid #ddd; padding: 6px;">${advance.deductionDate || "-"}</td>
          </tr>
        `,
        )
        .join("");
    };

    // Generate compact summary rows for print
    const generateCompactSummaryRows = () => {
      return Array.from(new Set(filteredAdvances.map((adv) => adv.employeeId)))
        .map((employeeId) => {
          const employeeAdvances = filteredAdvances.filter(
            (adv) => adv.employeeId === employeeId,
          );
          const employeeName = employeeAdvances[0]?.employeeName || "Unknown";

          // Calculate previous advances total
          const prevAdvances = employeeAdvances
            .filter((adv) => !adv.isNew)
            .reduce((sum, adv) => {
              const amount =
                adv.remainingAmount !== undefined
                  ? adv.remainingAmount
                  : adv.amount;
              return sum + amount;
            }, 0);

          // Calculate new advances total
          const newAdvs = employeeAdvances
            .filter((adv) => adv.isNew)
            .reduce((sum, adv) => sum + adv.amount, 0);

          // Calculate total
          const total = prevAdvances + newAdvs;

          // Determine status
          const statuses = employeeAdvances.map((adv) => adv.status);
          let status = "paid";
          if (statuses.includes("pending")) status = "pending";
          else if (statuses.includes("approved")) status = "approved";
          else if (statuses.includes("rejected")) status = "rejected";

          return `
            <tr>
              <td style="border: 1px solid #ddd; padding: 6px;">${employeeName}</td>
              <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${prevAdvances.toFixed(2)} ج.م</td>
              <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${newAdvs.toFixed(2)} ج.م</td>
              <td style="border: 1px solid #ddd; padding: 6px; text-align: right; font-weight: bold;">${total.toFixed(2)} ج.م</td>
              <td style="border: 1px solid #ddd; padding: 6px;">${t.statusLabels[status as keyof typeof t.statusLabels] || status}</td>
            </tr>
          `;
        })
        .join("");
    };

    // Write to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${isRTL ? "ar" : "en"}" dir="${isRTL ? "rtl" : "ltr"}">
      <head>
        <meta charset="UTF-8">
        <title>${t.title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          @page { size: portrait; margin: 1cm; }
          body { font-family: 'Cairo', sans-serif; margin: 0; padding: 20px; }
          .report-header { text-align: center; margin-bottom: 20px; }
          .report-header h1 { font-size: 24px; margin: 0 0 5px 0; }
          .report-header h2 { font-size: 18px; font-weight: normal; margin: 0; color: #666; }
          .report-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .report-date { font-size: 14px; }
          table { border-collapse: collapse; width: 100%; font-size: 12px; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 6px; }
          th { background-color: #f0f0f0; font-weight: bold; }
          .text-right { text-align: right; }
          .section-title { font-size: 18px; font-weight: bold; margin: 20px 0 10px 0; }
          .summary-section { margin-top: 30px; }
          .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
          .summary-card { border: 1px solid #ddd; border-radius: 5px; padding: 10px; }
          .summary-card-title { font-size: 14px; font-weight: bold; margin-bottom: 5px; }
          .summary-card-value { font-size: 18px; font-weight: bold; }
          .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
          .signature-box { width: 200px; text-align: center; }
          .signature-line { border-top: 1px solid #000; margin-top: 50px; }
          .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; }
          .company-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .company-name { font-weight: bold; font-size: 16px; }
          tfoot td { font-weight: bold; background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="company-header">
          <div class="company-name">${t.companyName}</div>
          <div class="report-date">${t.reportDate}: ${currentDate}</div>
        </div>

        <div class="report-header">
          <h1>${t.title}</h1>
          <h2>${months.find((m) => m.value === selectedMonth)?.labelAr || selectedMonth} / ${selectedYear}</h2>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>${t.employeeName}</th>
              <th style="text-align: right;">${t.previousAdvances}</th>
              <th style="text-align: right;">${t.newAdvances}</th>
              <th style="text-align: right;">${t.totalAdvances}</th>
              <th>${t.status}</th>
            </tr>
          </thead>
          <tbody>
            ${generateCompactSummaryRows() || `<tr><td colspan="5" style="text-align: center;">${t.noData}</td></tr>`}
          </tbody>
          <tfoot>
            <tr>
              <td style="text-align: ${isRTL ? "right" : "left"}; font-weight: bold;">
                ${t.totalAdvances}
              </td>
              <td style="text-align: right; font-weight: bold;">${advanceStats.previousAdvancesAmount.toFixed(2)} ج.م</td>
              <td style="text-align: right; font-weight: bold;">${advanceStats.newAdvancesAmount.toFixed(2)} ج.م</td>
              <td style="text-align: right; font-weight: bold;">${advanceStats.totalAmount.toFixed(2)} ج.م</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <div class="summary-section">
          <div class="section-title">${t.summary}</div>
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-card-title">${t.newAdvances}</div>
              <div class="summary-card-value">${advanceStats.newAdvancesCount} (${advanceStats.newAdvancesAmount.toFixed(2)} ج.م)</div>
            </div>
            <div class="summary-card">
              <div class="summary-card-title">${t.previousAdvances}</div>
              <div class="summary-card-value">${advanceStats.previousAdvancesCount} (${advanceStats.previousAdvancesAmount.toFixed(2)} ج.م)</div>
            </div>
            <div class="summary-card">
              <div class="summary-card-title">${t.totalAdvances}</div>
              <div class="summary-card-value">${advanceStats.totalAdvances} (${advanceStats.totalAmount.toFixed(2)} ج.م)</div>
            </div>
            <div class="summary-card">
              <div class="summary-card-title">${t.approvedAdvances}</div>
              <div class="summary-card-value">${advanceStats.approvedAdvances} (${advanceStats.approvedAmount.toFixed(2)} ج.م)</div>
            </div>
          </div>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <div>${t.hrManager}</div>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div>${t.signature}</div>
          </div>
        </div>

        <div class="footer">
          ${t.page} 1 ${t.of} 1
        </div>
      </body>
      </html>
    `);

    // Wait for resources to load then print
    printWindow.document.close();
    printWindow.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
  };

  const handleExport = () => {
    toast({
      title: isRTL ? "جاري تصدير التقرير..." : "Exporting report...",
      duration: 3000,
    });
    // In a real app, this would export to CSV or Excel
  };

  if (employeesLoading || advancesLoading) {
    return <div className="p-8 text-center">{t.loading}</div>;
  }

  if (advancesError) {
    return (
      <div className="p-8 text-center text-red-500">
        {t.error}: {advancesError.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center no-print">
        <div>
          <h2 className="text-2xl font-semibold">{t.title}</h2>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            {t.print}
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            {t.export}
          </Button>
        </div>
      </div>

      <Card className="bg-card no-print">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="search">{t.search}</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">{t.month}</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {isRTL ? month.labelAr : month.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">{t.year}</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t.status}</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allStatuses}</SelectItem>
                  <SelectItem value="pending">
                    {t.statusLabels.pending}
                  </SelectItem>
                  <SelectItem value="approved">
                    {t.statusLabels.approved}
                  </SelectItem>
                  <SelectItem value="rejected">
                    {t.statusLabels.rejected}
                  </SelectItem>
                  <SelectItem value="paid">{t.statusLabels.paid}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 print-section">
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.totalAdvances}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{advanceStats.totalAdvances}</p>
            <p className="text-sm text-muted-foreground">
              {advanceStats.totalAmount.toFixed(2)} ج.م
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.newAdvances}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {advanceStats.newAdvancesCount}
            </p>
            <p className="text-sm text-muted-foreground">
              {advanceStats.newAdvancesAmount.toFixed(2)} ج.م
            </p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.previousAdvances}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {advanceStats.previousAdvancesCount}
            </p>
            <p className="text-sm text-muted-foreground">
              {advanceStats.previousAdvancesAmount.toFixed(2)} ج.م
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.approvedAdvances}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {advanceStats.approvedAdvances}
            </p>
            <p className="text-sm text-muted-foreground">
              {advanceStats.approvedAmount.toFixed(2)} ج.م
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compact Advances Summary Section */}
      <RTLAwareCard className="print-section mb-6">
        <RTLAwareCardHeader>
          <RTLAwareCardTitle>{t.title}</RTLAwareCardTitle>
        </RTLAwareCardHeader>
        <RTLAwareCardContent>
          <div className="overflow-x-auto">
            <RTLAwareTable>
              <RTLAwareTableHeader>
                <TableRow>
                  <RTLAwareTableHead>{t.employeeName}</RTLAwareTableHead>
                  <RTLAwareTableHead align="right">
                    {t.previousAdvances}
                  </RTLAwareTableHead>
                  <RTLAwareTableHead align="right">
                    {t.newAdvances}
                  </RTLAwareTableHead>
                  <RTLAwareTableHead align="right">
                    {t.totalAdvances}
                  </RTLAwareTableHead>
                  <RTLAwareTableHead>{t.status}</RTLAwareTableHead>
                </TableRow>
              </RTLAwareTableHeader>
              <RTLAwareTableBody>
                {/* Group advances by employee */}
                {Array.from(
                  new Set(filteredAdvances.map((adv) => adv.employeeId)),
                )
                  .map((employeeId) => {
                    const employeeAdvances = filteredAdvances.filter(
                      (adv) => adv.employeeId === employeeId,
                    );
                    const employeeName =
                      employeeAdvances[0]?.employeeName || "Unknown";

                    // Calculate previous advances total
                    const prevAdvances = employeeAdvances
                      .filter((adv) => !adv.isNew)
                      .reduce((sum, adv) => {
                        const amount =
                          adv.remainingAmount !== undefined
                            ? adv.remainingAmount
                            : adv.amount;
                        return sum + amount;
                      }, 0);

                    // Calculate new advances total
                    const newAdvs = employeeAdvances
                      .filter((adv) => adv.isNew)
                      .reduce((sum, adv) => sum + adv.amount, 0);

                    // Calculate total
                    const total = prevAdvances + newAdvs;

                    // Determine status (use the most critical status)
                    const statuses = employeeAdvances.map((adv) => adv.status);
                    let status = "paid";
                    if (statuses.includes("pending")) status = "pending";
                    else if (statuses.includes("approved")) status = "approved";
                    else if (statuses.includes("rejected")) status = "rejected";

                    return {
                      employeeId,
                      employeeName,
                      previousAdvances: prevAdvances,
                      newAdvances: newAdvs,
                      totalAdvances: total,
                      status,
                    };
                  })
                  .map((summary) => (
                    <TableRow key={summary.employeeId}>
                      <RTLAwareTableCell>
                        {summary.employeeName}
                      </RTLAwareTableCell>
                      <RTLAwareTableCell align="right">
                        {summary.previousAdvances.toFixed(2)} ج.م
                      </RTLAwareTableCell>
                      <RTLAwareTableCell align="right">
                        {summary.newAdvances.toFixed(2)} ج.م
                      </RTLAwareTableCell>
                      <RTLAwareTableCell align="right" className="font-bold">
                        {summary.totalAdvances.toFixed(2)} ج.م
                      </RTLAwareTableCell>
                      <RTLAwareTableCell>
                        {getStatusBadge(summary.status as any)}
                      </RTLAwareTableCell>
                    </TableRow>
                  ))}
              </RTLAwareTableBody>
              <TableFooter>
                <TableRow>
                  <RTLAwareTableCell className="font-bold">
                    {t.totalAdvances}
                  </RTLAwareTableCell>
                  <RTLAwareTableCell align="right" className="font-bold">
                    {advanceStats.previousAdvancesAmount.toFixed(2)} ج.م
                  </RTLAwareTableCell>
                  <RTLAwareTableCell align="right" className="font-bold">
                    {advanceStats.newAdvancesAmount.toFixed(2)} ج.م
                  </RTLAwareTableCell>
                  <RTLAwareTableCell align="right" className="font-bold">
                    {advanceStats.totalAmount.toFixed(2)} ج.م
                  </RTLAwareTableCell>
                  <RTLAwareTableCell></RTLAwareTableCell>
                </TableRow>
              </TableFooter>
            </RTLAwareTable>
          </div>
        </RTLAwareCardContent>
      </RTLAwareCard>
    </div>
  );
};

export default AdvancesMonthlyReport;
