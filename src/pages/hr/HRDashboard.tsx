import React, { useState, useEffect } from "react";
import HRLayout from "@/components/layout/HRLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  DollarSign,
  Clock,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const HRDashboard = () => {
  const { isRTL } = useLanguage();
  const [activityItems, setActivityItems] = useState<any[]>([]);

  // Fetch data from Supabase
  const { data: employees, loading: employeesLoading } =
    useSupabaseData("employees");
  const { data: payroll, loading: payrollLoading } = useSupabaseData("payroll");
  const { data: attendance, loading: attendanceLoading } =
    useSupabaseData("attendance");
  const { data: leaveRequests, loading: leaveRequestsLoading } =
    useSupabaseData("leave_requests");
  const { data: advances, loading: advancesLoading } =
    useSupabaseData("advances");

  // Calculate statistics
  const employeeCount = employees?.length || 0;

  // Calculate payroll statistics
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const processedPayroll =
    payroll?.filter(
      (p) => p.month === currentMonth && p.year === currentYear,
    ) || [];
  const payrollProcessedPercentage =
    employeeCount > 0
      ? Math.round((processedPayroll.length / employeeCount) * 100)
      : 0;

  // Calculate attendance statistics
  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance?.filter((a) => a.date === today) || [];
  const presentCount = todayAttendance.filter(
    (a) => a.status === "present" || a.status === "late",
  ).length;
  const attendanceRate =
    employeeCount > 0 ? Math.round((presentCount / employeeCount) * 100) : 0;

  // Calculate reports count
  const reportsCount = 4; // Fixed number of report types

  // Generate activity items
  useEffect(() => {
    const items = [];

    // Add recent leave requests
    const recentLeaveRequests = leaveRequests?.slice(0, 3) || [];
    for (const request of recentLeaveRequests) {
      const employee = employees?.find((e) => e.id === request.employee_id);
      items.push({
        type: "leave",
        date: new Date(request.created_at || Date.now()).toLocaleDateString(),
        title: isRTL ? `طلب إجازة جديد` : `New leave request`,
        description: isRTL
          ? `قام ${employee?.name || "موظف"} بطلب إجازة من ${request.start_date} إلى ${request.end_date}`
          : `${employee?.name || "Employee"} requested leave from ${request.start_date} to ${request.end_date}`,
        status: request.status,
        icon: <Calendar className="h-8 w-8 text-blue-500" />,
      });
    }

    // Add recent advances
    const recentAdvances = advances?.slice(0, 3) || [];
    for (const advance of recentAdvances) {
      const employee = employees?.find((e) => e.id === advance.employee_id);
      items.push({
        type: "advance",
        date: new Date(advance.created_at || Date.now()).toLocaleDateString(),
        title: isRTL ? `طلب سلفة جديد` : `New advance request`,
        description: isRTL
          ? `طلب ${employee?.name || "موظف"} سلفة بقيمة ${advance.amount} ج.م`
          : `${employee?.name || "Employee"} requested an advance of ${advance.amount} EGP`,
        status: advance.status,
        icon: <DollarSign className="h-8 w-8 text-green-500" />,
      });
    }

    // Add recent attendance
    const recentAttendance = attendance?.slice(0, 3) || [];
    for (const record of recentAttendance) {
      const employee = employees?.find((e) => e.id === record.employee_id);
      items.push({
        type: "attendance",
        date: record.date,
        title: isRTL ? `تسجيل حضور` : `Attendance record`,
        description: isRTL
          ? `${employee?.name || "موظف"} ${record.status === "present" ? "حضر" : record.status === "absent" ? "غائب" : record.status === "late" ? "متأخر" : "في إجازة"}`
          : `${employee?.name || "Employee"} was ${record.status === "present" ? "present" : record.status === "absent" ? "absent" : record.status === "late" ? "late" : "on leave"}`,
        status: record.status,
        icon: <Clock className="h-8 w-8 text-yellow-500" />,
      });
    }

    // Sort by date (newest first) and limit to 5 items
    items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    setActivityItems(items.slice(0, 5));
  }, [employees, leaveRequests, advances, attendance, isRTL]);

  const labels = {
    ar: {
      title: "لوحة التحكم",
      employeesCard: "الموظفين",
      employeesCount: "إجمالي الموظفين",
      payrollCard: "الرواتب",
      payrollProcessed: "تم معالجة الرواتب",
      attendanceCard: "الحضور",
      attendanceRate: "معدل الحضور اليوم",
      reportsCard: "التقارير",
      reportsGenerated: "أنواع التقارير المتاحة",
      viewAll: "عرض الكل",
      recentActivity: "النشاط الأخير",
      quickActions: "إجراءات سريعة",
      addEmployee: "إضافة موظف",
      processSalary: "معالجة الرواتب",
      viewReports: "عرض التقارير",
      manageAdvances: "إدارة السلف",
      manageAttendance: "إدارة الحضور",
      noActivity: "لا يوجد نشاط حديث للعرض",
      statusLabels: {
        pending: "قيد الانتظار",
        approved: "تمت الموافقة",
        rejected: "مرفوض",
        paid: "تم الدفع",
        present: "حاضر",
        absent: "غائب",
        late: "متأخر",
        on_leave: "في إجازة",
      },
      loading: "جاري التحميل...",
    },
    en: {
      title: "Dashboard",
      employeesCard: "Employees",
      employeesCount: "Total Employees",
      payrollCard: "Payroll",
      payrollProcessed: "Payroll Processed",
      attendanceCard: "Attendance",
      attendanceRate: "Today's Attendance Rate",
      reportsCard: "Reports",
      reportsGenerated: "Available Report Types",
      viewAll: "View All",
      recentActivity: "Recent Activity",
      quickActions: "Quick Actions",
      addEmployee: "Add Employee",
      processSalary: "Process Salaries",
      viewReports: "View Reports",
      manageAdvances: "Manage Advances",
      manageAttendance: "Manage Attendance",
      noActivity: "No recent activity to display",
      statusLabels: {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        paid: "Paid",
        present: "Present",
        absent: "Absent",
        late: "Late",
        on_leave: "On Leave",
      },
      loading: "Loading...",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "warning",
      approved: "success",
      rejected: "destructive",
      paid: "default",
      present: "success",
      absent: "destructive",
      late: "warning",
      on_leave: "default",
    };

    return (
      <Badge variant={variants[status] as any}>
        {t.statusLabels[status as keyof typeof t.statusLabels] || status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "present":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "rejected":
      case "absent":
        return <Ban className="h-4 w-4 text-red-500" />;
      case "pending":
      case "late":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const dashboardCards = [
    {
      title: t.employeesCard,
      value: employeeCount.toString(),
      subtitle: t.employeesCount,
      icon: <Users className="h-8 w-8 text-blue-500" />,
      progress: 100,
      link: "/employees",
      color: "bg-blue-500/10 border-blue-500/20 dark:bg-blue-500/5",
    },
    {
      title: t.payrollCard,
      value: `${payrollProcessedPercentage}%`,
      subtitle: t.payrollProcessed,
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
      progress: payrollProcessedPercentage,
      link: "/payroll",
      color: "bg-green-500/10 border-green-500/20 dark:bg-green-500/5",
    },
    {
      title: t.attendanceCard,
      value: `${attendanceRate}%`,
      subtitle: t.attendanceRate,
      icon: <Clock className="h-8 w-8 text-yellow-500" />,
      progress: attendanceRate,
      link: "/time",
      color: "bg-yellow-500/10 border-yellow-500/20 dark:bg-yellow-500/5",
    },
    {
      title: t.reportsCard,
      value: reportsCount.toString(),
      subtitle: t.reportsGenerated,
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      progress: 100,
      link: "/reports",
      color: "bg-purple-500/10 border-purple-500/20 dark:bg-purple-500/5",
    },
  ];

  const quickActions = [
    {
      title: t.addEmployee,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      link: "/employees",
    },
    {
      title: t.processSalary,
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      link: "/payroll",
    },
    {
      title: t.manageAttendance,
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      link: "/time",
    },
    {
      title: t.viewReports,
      icon: <BarChart3 className="h-5 w-5 text-purple-500" />,
      link: "/reports",
    },
    {
      title: t.manageAdvances,
      icon: <DollarSign className="h-5 w-5 text-indigo-500" />,
      link: "/advances",
    },
  ];

  if (
    employeesLoading ||
    payrollLoading ||
    attendanceLoading ||
    leaveRequestsLoading ||
    advancesLoading
  ) {
    return (
      <HRLayout activeNavItem="/hr">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-xl text-muted-foreground">{t.loading}</div>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout activeNavItem="/hr">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <div className="text-sm text-muted-foreground mt-2 md:mt-0">
            {new Date().toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => (
            <Link to={card.link} key={index} className="block">
              <Card
                className={`${card.color} hover:shadow-md transition-shadow h-full`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    {card.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{card.value}</div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {card.subtitle}
                  </div>
                  <Progress value={card.progress} className="h-1" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 h-full">
            <CardHeader>
              <CardTitle>{t.recentActivity}</CardTitle>
              <CardDescription>
                {isRTL ? "آخر الأنشطة في النظام" : "Latest system activities"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityItems.length > 0 ? (
                  activityItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-3 rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-shrink-0 mt-1">{item.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{item.title}</h4>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            {getStatusBadge(item.status)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.date}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    {t.noActivity}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t.quickActions}</CardTitle>
              <CardDescription>
                {isRTL
                  ? "وصول سريع للوظائف الرئيسية"
                  : "Quick access to main functions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {quickActions.map((action, index) => (
                  <React.Fragment key={index}>
                    <Link
                      to={action.link}
                      className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div
                        className={`${isRTL ? "ml-3" : "mr-3"} p-2 rounded-full bg-primary/10`}
                      >
                        {action.icon}
                      </div>
                      <span>{action.title}</span>
                    </Link>
                    {index < quickActions.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </HRLayout>
  );
};

export default HRDashboard;
