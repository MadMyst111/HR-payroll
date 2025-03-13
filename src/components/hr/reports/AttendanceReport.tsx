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
import { Download, Search, Filter, Calendar } from "lucide-react";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface AttendanceReportData {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "present" | "absent" | "late" | "on_leave";
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

const AttendanceReport = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();

  // Fetch data from Supabase
  const { data: supabaseEmployees, loading: employeesLoading } =
    useSupabaseData("employees");

  const {
    data: supabaseAttendance,
    loading: attendanceLoading,
    error: attendanceError,
  } = useSupabaseData("attendance");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString().padStart(2, "0"),
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceReportData[]
  >([]);

  // Convert Supabase attendance to AttendanceReportData
  useEffect(() => {
    if (
      supabaseAttendance &&
      supabaseAttendance.length > 0 &&
      supabaseEmployees
    ) {
      const formattedAttendance = supabaseAttendance.map((att) => {
        // Find employee name
        const employee = supabaseEmployees.find(
          (emp) => emp.id === att.employee_id,
        );

        return {
          id: att.id,
          employeeId: att.employee_id || "",
          employeeName: employee?.name || "Unknown Employee",
          date: att.date,
          checkIn: att.check_in || undefined,
          checkOut: att.check_out || undefined,
          status: att.status as "present" | "absent" | "late" | "on_leave",
          notes: att.notes || undefined,
        };
      });
      setAttendanceRecords(formattedAttendance);
    }
  }, [supabaseAttendance, supabaseEmployees]);

  const labels = {
    ar: {
      title: "تقرير الحضور والغياب",
      description: "تحليل حضور وغياب الموظفين",
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
      date: "التاريخ",
      checkIn: "وقت الحضور",
      checkOut: "وقت الانصراف",
      notes: "ملاحظات",
      statusLabels: {
        present: "حاضر",
        absent: "غائب",
        late: "متأخر",
        on_leave: "في إجازة",
      },
      summary: "ملخص الحضور",
      totalDays: "إجمالي الأيام",
      presentDays: "أيام الحضور",
      absentDays: "أيام الغياب",
      lateDays: "أيام التأخير",
      leaveDays: "أيام الإجازة",
      attendanceRate: "معدل الحضور",
      loading: "جاري التحميل...",
      error: "حدث خطأ أثناء تحميل البيانات",
      noData: "لا توجد بيانات للعرض",
    },
    en: {
      title: "Attendance Report",
      description: "Analyze employee attendance and absences",
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
      date: "Date",
      checkIn: "Check In",
      checkOut: "Check Out",
      notes: "Notes",
      statusLabels: {
        present: "Present",
        absent: "Absent",
        late: "Late",
        on_leave: "On Leave",
      },
      summary: "Attendance Summary",
      totalDays: "Total Days",
      presentDays: "Present Days",
      absentDays: "Absent Days",
      lateDays: "Late Days",
      leaveDays: "Leave Days",
      attendanceRate: "Attendance Rate",
      loading: "Loading...",
      error: "Error loading data",
      noData: "No data to display",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const getStatusBadge = (status: AttendanceReportData["status"]) => {
    const variants: Record<string, string> = {
      present: "success",
      absent: "destructive",
      late: "warning",
      on_leave: "default",
    };

    return (
      <Badge variant={variants[status] as any}>{t.statusLabels[status]}</Badge>
    );
  };

  // Filter attendance records based on search term, month, year, and status
  const filteredAttendanceRecords = attendanceRecords.filter((record) => {
    // Check if the record matches the search term
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    // Check if the record matches the selected month and year
    const recordDate = new Date(record.date);
    const recordMonth = (recordDate.getMonth() + 1).toString().padStart(2, "0");
    const recordYear = recordDate.getFullYear().toString();
    const matchesDate =
      recordMonth === selectedMonth && recordYear === selectedYear;

    // Check if the record matches the selected status
    const matchesStatus =
      selectedStatus === "all" || record.status === selectedStatus;

    return matchesSearch && matchesDate && matchesStatus;
  });

  // Calculate attendance statistics
  const attendanceStats = {
    totalDays: filteredAttendanceRecords.length,
    presentDays: filteredAttendanceRecords.filter((r) => r.status === "present")
      .length,
    absentDays: filteredAttendanceRecords.filter((r) => r.status === "absent")
      .length,
    lateDays: filteredAttendanceRecords.filter((r) => r.status === "late")
      .length,
    leaveDays: filteredAttendanceRecords.filter((r) => r.status === "on_leave")
      .length,
  };

  // Calculate attendance rate
  const attendanceRate =
    attendanceStats.totalDays > 0
      ? ((attendanceStats.presentDays + attendanceStats.lateDays) /
          attendanceStats.totalDays) *
        100
      : 0;

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

  if (employeesLoading || attendanceLoading) {
    return <div className="p-8 text-center">{t.loading}</div>;
  }

  if (attendanceError) {
    return (
      <div className="p-8 text-center text-red-500">
        {t.error}: {attendanceError.message}
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
                  <SelectItem value="present">
                    {t.statusLabels.present}
                  </SelectItem>
                  <SelectItem value="absent">
                    {t.statusLabels.absent}
                  </SelectItem>
                  <SelectItem value="late">{t.statusLabels.late}</SelectItem>
                  <SelectItem value="on_leave">
                    {t.statusLabels.on_leave}
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
            <CardTitle className="text-sm">{t.totalDays}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{attendanceStats.totalDays}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.presentDays}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{attendanceStats.presentDays}</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.absentDays}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{attendanceStats.absentDays}</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.lateDays}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{attendanceStats.lateDays}</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.attendanceRate}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="print-section">
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAttendanceRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.employeeName}</TableHead>
                    <TableHead>{t.date}</TableHead>
                    <TableHead>{t.checkIn}</TableHead>
                    <TableHead>{t.checkOut}</TableHead>
                    <TableHead>{t.status}</TableHead>
                    <TableHead>{t.notes}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.employeeName}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.checkIn || "-"}</TableCell>
                      <TableCell>{record.checkOut || "-"}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{record.notes || "-"}</TableCell>
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

export default AttendanceReport;
