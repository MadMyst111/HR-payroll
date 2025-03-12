import React, { useState, useEffect } from "react";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import HRLayout from "@/components/layout/HRLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Printer,
  Clock,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HRDashboard = () => {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  const labels = {
    ar: {
      title: "لوحة التحكم",
      welcome: "مرحباً بك في نظام الموارد البشرية",
      quickAccess: "الوصول السريع",
      employees: "الموظفين",
      payroll: "الرواتب",
      advances: "السلف",
      timeManagement: "إدارة الوقت والإجازات",
      reports: "التقارير",
      print: "طباعة",
      viewAll: "عرض الكل",
      employeeCount: "عدد الموظفين",
      totalSalaries: "إجمالي الرواتب",
      pendingAdvances: "السلف المعلقة",
      overview: "نظرة عامة",
      attendance: "الحضور",
      recentActivity: "النشاطات الأخيرة",
      upcomingLeaves: "الإجازات القادمة",
      pendingRequests: "الطلبات المعلقة",
      attendanceRate: "معدل الحضور",
      present: "حاضر",
      absent: "غائب",
      late: "متأخر",
      onLeave: "في إجازة",
      todayAttendance: "حضور اليوم",
      monthlyStats: "إحصائيات الشهر",
      salaryDistribution: "توزيع الرواتب",
      departmentDistribution: "توزيع الأقسام",
      recentAdvances: "السلف الأخيرة",
      recentPayroll: "الرواتب الأخيرة",
      viewMore: "عرض المزيد",
      today: "اليوم",
      thisMonth: "هذا الشهر",
      approved: "تمت الموافقة",
      pending: "قيد الانتظار",
      rejected: "مرفوض",
      department: "القسم",
      it: "تكنولوجيا المعلومات",
      finance: "المالية",
      operations: "العمليات",
      hr: "الموارد البشرية",
      marketing: "التسويق",
      sales: "المبيعات",
    },
    en: {
      title: "Dashboard",
      welcome: "Welcome to HR System",
      quickAccess: "Quick Access",
      employees: "Employees",
      payroll: "Payroll",
      advances: "Advances",
      timeManagement: "Time & Leave",
      reports: "Reports",
      print: "Print",
      viewAll: "View All",
      employeeCount: "Employee Count",
      totalSalaries: "Total Salaries",
      pendingAdvances: "Pending Advances",
      overview: "Overview",
      attendance: "Attendance",
      recentActivity: "Recent Activity",
      upcomingLeaves: "Upcoming Leaves",
      pendingRequests: "Pending Requests",
      attendanceRate: "Attendance Rate",
      present: "Present",
      absent: "Absent",
      late: "Late",
      onLeave: "On Leave",
      todayAttendance: "Today's Attendance",
      monthlyStats: "Monthly Stats",
      salaryDistribution: "Salary Distribution",
      departmentDistribution: "Department Distribution",
      recentAdvances: "Recent Advances",
      recentPayroll: "Recent Payroll",
      viewMore: "View More",
      today: "Today",
      thisMonth: "This Month",
      approved: "Approved",
      pending: "Pending",
      rejected: "Rejected",
      department: "Department",
      it: "IT",
      finance: "Finance",
      operations: "Operations",
      hr: "HR",
      marketing: "Marketing",
      sales: "Sales",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const quickAccessItems = [
    { icon: <Users size={24} />, label: t.employees, href: "/employees" },
    { icon: <FileText size={24} />, label: t.payroll, href: "/payroll" },
    { icon: <DollarSign size={24} />, label: t.advances, href: "/advances" },
    { icon: <Clock size={24} />, label: t.timeManagement, href: "/time" },
    { icon: <BarChart3 size={24} />, label: t.reports, href: "/reports" },
    { icon: <Printer size={24} />, label: t.print, href: "/print" },
  ];

  // Fetch employees from Supabase
  const { data: supabaseEmployees, loading: employeesLoading } =
    useSupabaseData("employees");

  // Generate recent activities based on Supabase data
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Update activities when employees data is loaded
  useEffect(() => {
    // Empty activities for fresh start
    setRecentActivities([]);
  }, [supabaseEmployees]);

  // Generate upcoming leaves based on Supabase data
  const [upcomingLeaves, setUpcomingLeaves] = useState<any[]>([]);

  // Update leaves when employees data is loaded
  useEffect(() => {
    // Empty leaves for fresh start
    setUpcomingLeaves([]);
  }, [supabaseEmployees]);

  // Fetch advances from Supabase
  const { data: supabaseAdvances, loading: advancesLoading } =
    useSupabaseData("advances");

  // Generate pending requests based on Supabase data
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  // Update requests when employees and advances data is loaded
  useEffect(() => {
    // Empty pending requests for fresh start
    setPendingRequests([]);
  }, [supabaseEmployees, supabaseAdvances]);

  // Calculate attendance stats based on employees count
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0,
    total: 0,
  });

  // Add a state for loading indicator
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Fetch attendance data from Supabase
  const { data: supabaseAttendance, loading: attendanceLoading } =
    useSupabaseData("attendance");

  // Update attendance stats when employees and attendance data is loaded
  useEffect(() => {
    if (supabaseEmployees && supabaseEmployees.length > 0) {
      const total = supabaseEmployees.length;

      // If we have attendance data, use it
      if (supabaseAttendance && supabaseAttendance.length > 0) {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];

        // Count attendance for today
        const todayAttendance = supabaseAttendance.filter(
          (att) => att.date === today,
        );
        const presentCount = todayAttendance.filter(
          (att) => att.status === "present",
        ).length;
        const absentCount = todayAttendance.filter(
          (att) => att.status === "absent",
        ).length;
        const lateCount = todayAttendance.filter(
          (att) => att.status === "late",
        ).length;
        const onLeaveCount = todayAttendance.filter(
          (att) => att.status === "on_leave",
        ).length;

        // If we have attendance records for today, use them
        if (todayAttendance.length > 0) {
          setAttendanceStats({
            present: presentCount,
            absent: absentCount,
            late: lateCount,
            onLeave: onLeaveCount,
            total: total,
          });
          return;
        }
      }

      // If no attendance data, use default percentages based on employee count
      setAttendanceStats({
        present: Math.floor(total * 0.75), // 75% present
        absent: Math.floor(total * 0.1), // 10% absent
        late: Math.floor(total * 0.1), // 10% late
        onLeave:
          total -
          Math.floor(total * 0.75) -
          Math.floor(total * 0.1) -
          Math.floor(total * 0.1),
        total: total,
      });
    } else {
      // Reset stats if no employees
      setAttendanceStats({
        present: 0,
        absent: 0,
        late: 0,
        onLeave: 0,
        total: 0,
      });
    }
  }, [supabaseEmployees, supabaseAttendance]);

  // Calculate department stats based on actual employees
  const [departmentStats, setDepartmentStats] = useState<any[]>([]);

  // Update department stats when employees data is loaded
  useEffect(() => {
    if (supabaseEmployees && supabaseEmployees.length > 0) {
      // Count employees by department
      const departmentCounts: Record<string, number> = {};
      supabaseEmployees.forEach((emp) => {
        if (emp.department) {
          departmentCounts[emp.department] =
            (departmentCounts[emp.department] || 0) + 1;
        }
      });

      // Map department counts to stats with colors
      const colors = {
        [t.it]: "bg-blue-500",
        [t.finance]: "bg-green-500",
        [t.operations]: "bg-purple-500",
        [t.hr]: "bg-yellow-500",
        [t.marketing]: "bg-pink-500",
        [t.sales]: "bg-indigo-500",
      };

      const stats = Object.entries(departmentCounts).map(([dept, count]) => ({
        name: dept,
        count,
        color: colors[dept as keyof typeof colors] || "bg-gray-500",
      }));

      setDepartmentStats(stats);
    }
  }, [
    supabaseEmployees,
    t.it,
    t.finance,
    t.operations,
    t.hr,
    t.marketing,
    t.sales,
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">{t.approved}</Badge>;
      case "pending":
        return <Badge variant="warning">{t.pending}</Badge>;
      case "rejected":
        return <Badge variant="destructive">{t.rejected}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Set loading state based on all data fetching
  useEffect(() => {
    if (!employeesLoading && !advancesLoading && !attendanceLoading) {
      setDashboardLoading(false);
    }
  }, [employeesLoading, advancesLoading, attendanceLoading]);

  // Show loading state
  if (dashboardLoading) {
    return (
      <HRLayout activeNavItem="/hr">
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">
              {isRTL ? "جاري تحميل البيانات..." : "Loading data..."}
            </p>
          </div>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout activeNavItem="/hr">
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">{t.title}</h2>
            <p className="text-muted-foreground">{t.welcome}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="overview">{t.overview}</TabsTrigger>
                <TabsTrigger value="attendance">{t.attendance}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {activeTab === "overview" && (
          <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.employeeCount}
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {supabaseEmployees?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {supabaseEmployees?.length
                      ? `${supabaseEmployees.length} ${t.thisMonth}`
                      : ""}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.totalSalaries}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {supabaseEmployees
                      ? supabaseEmployees.reduce(
                          (sum, emp) => sum + Number(emp.base_salary || 0),
                          0,
                        )
                      : 0}{" "}
                    ج.م
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {supabaseEmployees
                      ? supabaseEmployees.reduce(
                          (sum, emp) =>
                            sum + Number(emp.monthly_incentives || 0),
                          0,
                        )
                      : 0}{" "}
                    ج.م {t.thisMonth}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.pendingAdvances}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {supabaseAdvances
                      ? supabaseAdvances.filter(
                          (adv) => adv.status === "pending",
                        ).length
                      : 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {supabaseAdvances
                      ? supabaseAdvances.filter(
                          (adv) => adv.status === "approved",
                        ).length
                      : 0}{" "}
                    {t.approved}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.attendanceRate}
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {attendanceStats.total > 0
                      ? Math.round(
                          (attendanceStats.present / attendanceStats.total) *
                            100,
                        )
                      : 0}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {attendanceStats.present} {t.present} /{" "}
                    {attendanceStats.total} {t.total}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.recentActivity}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center">
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarImage
                            src={activity.avatar}
                            alt={activity.user}
                          />
                          <AvatarFallback>{activity.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {activity.user}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.action}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          <p>{activity.time}</p>
                          <p>{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.upcomingLeaves}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingLeaves.map((leave) => (
                      <div key={leave.id} className="flex items-center">
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarImage src={leave.avatar} alt={leave.user} />
                          <AvatarFallback>{leave.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {leave.user}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {leave.type}
                          </p>
                          <p className="text-xs">
                            {leave.startDate} - {leave.endDate}
                          </p>
                        </div>
                        <div>{getStatusBadge(leave.status)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.pendingRequests}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="flex items-center">
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarImage
                            src={request.avatar}
                            alt={request.user}
                          />
                          <AvatarFallback>{request.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {request.user}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.type}
                          </p>
                          <p className="text-xs">
                            {request.amount ? `${request.amount}` : ""}
                            {request.duration ? `${request.duration}` : ""}
                            {` • ${request.date}`}
                          </p>
                        </div>
                        <div>
                          <Badge variant="outline">{t.pending}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.quickAccess}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {quickAccessItems.map((item, index) => (
                      <Link to={item.href} key={index}>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <div className="mr-2">{item.icon}</div>
                          <span>{item.label}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.present}
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {attendanceStats.present}
                  </div>
                  <Progress
                    value={
                      (attendanceStats.present / attendanceStats.total) * 100
                    }
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.absent}
                  </CardTitle>
                  <UserX className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {attendanceStats.absent}
                  </div>
                  <Progress
                    value={
                      (attendanceStats.absent / attendanceStats.total) * 100
                    }
                    className="h-2 mt-2 bg-muted"
                    indicatorClassName="bg-red-500"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.late}
                  </CardTitle>
                  <Clock className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {attendanceStats.late}
                  </div>
                  <Progress
                    value={(attendanceStats.late / attendanceStats.total) * 100}
                    className="h-2 mt-2 bg-muted"
                    indicatorClassName="bg-amber-500"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.onLeave}
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {attendanceStats.onLeave}
                  </div>
                  <Progress
                    value={
                      (attendanceStats.onLeave / attendanceStats.total) * 100
                    }
                    className="h-2 mt-2 bg-muted"
                    indicatorClassName="bg-blue-500"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.todayAttendance}</CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center">
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarImage
                            src={activity.avatar}
                            alt={activity.user}
                          />
                          <AvatarFallback>{activity.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {activity.user}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.action}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          {activity.time}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2">
                      {t.viewMore}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.upcomingLeaves}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingLeaves.map((leave) => (
                      <div key={leave.id} className="flex items-center">
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarImage src={leave.avatar} alt={leave.user} />
                          <AvatarFallback>{leave.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {leave.user}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {leave.type}
                          </p>
                          <p className="text-xs">
                            {leave.startDate} - {leave.endDate}
                          </p>
                        </div>
                        <div>{getStatusBadge(leave.status)}</div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2">
                      {t.viewMore}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </HRLayout>
  );
};

export default HRDashboard;
