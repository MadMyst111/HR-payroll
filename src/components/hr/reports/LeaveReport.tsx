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

interface LeaveReportData {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
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

const LeaveReport = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();

  // Fetch data from Supabase
  const { data: supabaseEmployees, loading: employeesLoading } =
    useSupabaseData("employees");

  const {
    data: supabaseLeaveRequests,
    loading: leaveRequestsLoading,
    error: leaveRequestsError,
  } = useSupabaseData("leave_requests");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString().padStart(2, "0"),
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [selectedLeaveType, setSelectedLeaveType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [leaveRequests, setLeaveRequests] = useState<LeaveReportData[]>([]);

  // Convert Supabase leave requests to LeaveReportData
  useEffect(() => {
    if (
      supabaseLeaveRequests &&
      supabaseLeaveRequests.length > 0 &&
      supabaseEmployees
    ) {
      const formattedLeaveRequests = supabaseLeaveRequests.map((leave) => {
        // Find employee name
        const employee = supabaseEmployees.find(
          (emp) => emp.id === leave.employee_id,
        );

        return {
          id: leave.id,
          employeeId: leave.employee_id || "",
          employeeName: employee?.name || "Unknown Employee",
          leaveType: leave.leave_type,
          startDate: leave.start_date,
          endDate: leave.end_date,
          totalDays: leave.total_days,
          reason: leave.reason || "",
          status: leave.status as "pending" | "approved" | "rejected",
          approvedBy: leave.approved_by || undefined,
          notes: leave.notes || undefined,
        };
      });
      setLeaveRequests(formattedLeaveRequests);
    }
  }, [supabaseLeaveRequests, supabaseEmployees]);

  const labels = {
    ar: {
      title: "تقرير الإجازات",
      description: "تحليل الإجازات المستخدمة والمتبقية",
      search: "بحث عن موظف...",
      month: "الشهر",
      year: "السنة",
      leaveType: "نوع الإجازة",
      status: "الحالة",
      allLeaveTypes: "جميع أنواع الإجازات",
      allStatuses: "جميع الحالات",
      filter: "تصفية",
      print: "طباعة",
      export: "تصدير",
      employeeId: "كود الموظف",
      employeeName: "اسم الموظف",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      totalDays: "عدد الأيام",
      reason: "السبب",
      approvedBy: "تمت الموافقة من قبل",
      notes: "ملاحظات",
      leaveTypeLabels: {
        annual: "سنوية",
        sick: "مرضية",
        personal: "شخصية",
        unpaid: "بدون راتب",
      },
      statusLabels: {
        pending: "قيد الانتظار",
        approved: "تمت الموافقة",
        rejected: "مرفوض",
      },
      summary: "ملخص الإجازات",
      totalLeaves: "إجمالي الإجازات",
      approvedLeaves: "الإجازات المعتمدة",
      pendingLeaves: "الإجازات المعلقة",
      rejectedLeaves: "الإجازات المرفوضة",
      totalLeaveDays: "إجمالي أيام الإجازات",
      loading: "جاري التحميل...",
      error: "حدث خطأ أثناء تحميل البيانات",
      noData: "لا توجد بيانات للعرض",
    },
    en: {
      title: "Leave Report",
      description: "Analysis of used and remaining leaves",
      search: "Search for employee...",
      month: "Month",
      year: "Year",
      leaveType: "Leave Type",
      status: "Status",
      allLeaveTypes: "All Leave Types",
      allStatuses: "All Statuses",
      filter: "Filter",
      print: "Print",
      export: "Export",
      employeeId: "Employee ID",
      employeeName: "Employee Name",
      startDate: "Start Date",
      endDate: "End Date",
      totalDays: "Total Days",
      reason: "Reason",
      approvedBy: "Approved By",
      notes: "Notes",
      leaveTypeLabels: {
        annual: "Annual",
        sick: "Sick",
        personal: "Personal",
        unpaid: "Unpaid",
      },
      statusLabels: {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
      },
      summary: "Leave Summary",
      totalLeaves: "Total Leaves",
      approvedLeaves: "Approved Leaves",
      pendingLeaves: "Pending Leaves",
      rejectedLeaves: "Rejected Leaves",
      totalLeaveDays: "Total Leave Days",
      loading: "Loading...",
      error: "Error loading data",
      noData: "No data to display",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const getStatusBadge = (status: LeaveReportData["status"]) => {
    const variants = {
      pending: "warning",
      approved: "success",
      rejected: "destructive",
    };

    return (
      <Badge variant={variants[status] as any}>{t.statusLabels[status]}</Badge>
    );
  };

  const getLeaveTypeLabel = (type: string) => {
    const leaveTypes: Record<string, string> = {
      annual: t.leaveTypeLabels.annual,
      sick: t.leaveTypeLabels.sick,
      personal: t.leaveTypeLabels.personal,
      unpaid: t.leaveTypeLabels.unpaid,
    };

    return leaveTypes[type] || type;
  };

  // Filter leave requests based on search term, month, year, leave type, and status
  const filteredLeaveRequests = leaveRequests.filter((request) => {
    // Check if the request matches the search term
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    // Check if the request matches the selected month and year
    const startDate = new Date(request.startDate);
    const startMonth = (startDate.getMonth() + 1).toString().padStart(2, "0");
    const startYear = startDate.getFullYear().toString();
    const matchesDate =
      startMonth === selectedMonth && startYear === selectedYear;

    // Check if the request matches the selected leave type
    const matchesLeaveType =
      selectedLeaveType === "all" || request.leaveType === selectedLeaveType;

    // Check if the request matches the selected status
    const matchesStatus =
      selectedStatus === "all" || request.status === selectedStatus;

    return matchesSearch && matchesDate && matchesLeaveType && matchesStatus;
  });

  // Calculate leave statistics
  const leaveStats = {
    totalLeaves: filteredLeaveRequests.length,
    approvedLeaves: filteredLeaveRequests.filter((r) => r.status === "approved")
      .length,
    pendingLeaves: filteredLeaveRequests.filter((r) => r.status === "pending")
      .length,
    rejectedLeaves: filteredLeaveRequests.filter((r) => r.status === "rejected")
      .length,
    totalLeaveDays: filteredLeaveRequests.reduce(
      (total, r) => total + r.totalDays,
      0,
    ),
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

  if (employeesLoading || leaveRequestsLoading) {
    return <div className="p-8 text-center">{t.loading}</div>;
  }

  if (leaveRequestsError) {
    return (
      <div className="p-8 text-center text-red-500">
        {t.error}: {leaveRequestsError.message}
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
              <Label htmlFor="leaveType">{t.leaveType}</Label>
              <Select
                value={selectedLeaveType}
                onValueChange={setSelectedLeaveType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allLeaveTypes}</SelectItem>
                  <SelectItem value="annual">
                    {t.leaveTypeLabels.annual}
                  </SelectItem>
                  <SelectItem value="sick">{t.leaveTypeLabels.sick}</SelectItem>
                  <SelectItem value="personal">
                    {t.leaveTypeLabels.personal}
                  </SelectItem>
                  <SelectItem value="unpaid">
                    {t.leaveTypeLabels.unpaid}
                  </SelectItem>
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
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 print-section">
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.totalLeaves}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{leaveStats.totalLeaves}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.approvedLeaves}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{leaveStats.approvedLeaves}</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.pendingLeaves}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{leaveStats.pendingLeaves}</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.rejectedLeaves}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{leaveStats.rejectedLeaves}</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.totalLeaveDays}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{leaveStats.totalLeaveDays}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="print-section">
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLeaveRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.employeeName}</TableHead>
                    <TableHead>{t.leaveType}</TableHead>
                    <TableHead>{t.startDate}</TableHead>
                    <TableHead>{t.endDate}</TableHead>
                    <TableHead className="text-center">{t.totalDays}</TableHead>
                    <TableHead>{t.status}</TableHead>
                    <TableHead>{t.reason}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.employeeName}</TableCell>
                      <TableCell>
                        {getLeaveTypeLabel(request.leaveType)}
                      </TableCell>
                      <TableCell>{request.startDate}</TableCell>
                      <TableCell>{request.endDate}</TableCell>
                      <TableCell className="text-center">
                        {request.totalDays}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{request.reason || "-"}</TableCell>
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

export default LeaveReport;
