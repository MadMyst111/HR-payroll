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
import { Download, Search, Filter } from "lucide-react";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

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

const AdvancesReport = () => {
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

  // Convert Supabase advances to AdvanceReportData
  useEffect(() => {
    if (supabaseAdvances && supabaseAdvances.length > 0 && supabaseEmployees) {
      const formattedAdvances = supabaseAdvances.map((adv) => {
        // Find employee name
        const employee = supabaseEmployees.find(
          (emp) => emp.id === adv.employee_id,
        );

        return {
          id: adv.id,
          employeeId: adv.employee_id || "",
          employeeName: employee?.name || "Unknown Employee",
          amount: Number(adv.amount) || 0,
          requestDate: adv.request_date,
          expectedPaymentDate: adv.expected_payment_date,
          status: adv.status as "pending" | "approved" | "rejected" | "paid",
          approvedBy: adv.approved_by || undefined,
          paymentDate: adv.payment_date || undefined,
          notes: adv.notes || undefined,
        };
      });
      setAdvances(formattedAdvances);
    }
  }, [supabaseAdvances, supabaseEmployees]);

  const labels = {
    ar: {
      title: "تقرير السلف",
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
    },
    en: {
      title: "Advances Report",
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

    // Check if the advance matches the selected month and year
    const requestDate = new Date(advance.requestDate);
    const requestMonth = (requestDate.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const requestYear = requestDate.getFullYear().toString();
    const matchesDate =
      requestMonth === selectedMonth && requestYear === selectedYear;

    // Check if the advance matches the selected status
    const matchesStatus =
      selectedStatus === "all" || advance.status === selectedStatus;

    return matchesSearch && matchesDate && matchesStatus;
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
  };

  const handlePrint = () => {
    window.print();
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
          <PrintButton onClick={handlePrint} label={t.print} />
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

        <Card className="bg-gray-50 dark:bg-gray-950/20 border-gray-100 dark:border-gray-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.paidAdvances}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{advanceStats.paidAdvances}</p>
            <p className="text-sm text-muted-foreground">
              {advanceStats.paidAmount.toFixed(2)} ج.م
            </p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.pendingAdvances}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{advanceStats.pendingAdvances}</p>
            <p className="text-sm text-muted-foreground">
              {advanceStats.pendingAmount.toFixed(2)} ج.م
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="print-section">
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAdvances.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.employeeName}</TableHead>
                    <TableHead className="text-right">{t.amount}</TableHead>
                    <TableHead>{t.requestDate}</TableHead>
                    <TableHead>{t.expectedPaymentDate}</TableHead>
                    <TableHead>{t.status}</TableHead>
                    <TableHead>{t.paymentDate}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdvances.map((advance) => (
                    <TableRow key={advance.id}>
                      <TableCell>{advance.employeeName}</TableCell>
                      <TableCell className="text-right">
                        {advance.amount.toFixed(2)} ج.م
                      </TableCell>
                      <TableCell>{advance.requestDate}</TableCell>
                      <TableCell>{advance.expectedPaymentDate}</TableCell>
                      <TableCell>{getStatusBadge(advance.status)}</TableCell>
                      <TableCell>{advance.paymentDate || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t.noData}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancesReport;
