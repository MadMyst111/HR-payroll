import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { EmployeeFormData } from "../employees/AddEmployeeForm";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useToast } from "@/components/ui/use-toast";
import AttendanceForm, { AttendanceData } from "./AttendanceForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AttendanceTrackerProps {
  employees?: EmployeeFormData[];
}

const AttendanceTracker = ({ employees = [] }: AttendanceTrackerProps) => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();

  // Fetch data from Supabase
  const { data: supabaseEmployees, loading: employeesLoading } =
    useSupabaseData("employees");

  const {
    data: supabaseAttendance,
    loading: attendanceLoading,
    error: attendanceError,
    insertRow,
    updateRow,
    deleteRow,
  } = useSupabaseData("attendance");

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceData[]>(
    [],
  );
  const [localEmployees, setLocalEmployees] =
    useState<EmployeeFormData[]>(employees);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAttendance, setCurrentAttendance] =
    useState<AttendanceData | null>(null);
  const [attendanceToDelete, setAttendanceToDelete] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Convert Supabase employees to EmployeeFormData
  useEffect(() => {
    if (supabaseEmployees && supabaseEmployees.length > 0) {
      const formattedEmployees = supabaseEmployees.map((emp) => {
        return {
          id: emp.id,
          name: emp.name,
          position: emp.position,
          department: emp.department,
          joinDate: emp.join_date,
          baseSalary: Number(emp.base_salary),
          dailyRate: Number(emp.daily_rate || 0),
          dailyRateWithIncentive: Number(emp.daily_rate_with_incentive || 0),
          overtimeRate: Number(emp.overtime_rate || 0),
          overtimeHours: 0,
          monthlyIncentives: Number(emp.monthly_incentives || 0),
          bonus: 0,
          overtimeAmount: 0,
          purchases: 0,
          advances: 0,
          absenceDays: 0,
          absenceDeductions: 0,
          penaltyDays: 0,
          penalties: 0,
          netSalary: Number(emp.base_salary),
          totalSalaryWithIncentive:
            Number(emp.base_salary) + Number(emp.monthly_incentives || 0),
        };
      });
      setLocalEmployees(formattedEmployees);
    }
  }, [supabaseEmployees]);

  // Convert Supabase attendance to AttendanceData
  useEffect(() => {
    if (supabaseAttendance && supabaseAttendance.length > 0) {
      const formattedAttendance = supabaseAttendance.map((att) => {
        // Find employee name
        const employee = supabaseEmployees?.find(
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
    } else if (!attendanceLoading && supabaseAttendance?.length === 0) {
      // If no attendance records in database and employees exist, add default ones
      if (supabaseEmployees && supabaseEmployees.length > 0) {
        addDefaultAttendanceRecords();
      }
    }
  }, [supabaseAttendance, supabaseEmployees, attendanceLoading]);

  const addDefaultAttendanceRecords = async () => {
    // No default attendance records needed - fresh start
    return;
  };

  const labels = {
    ar: {
      title: "تتبع الحضور",
      addAttendance: "إضافة سجل حضور",
      id: "رقم السجل",
      employeeId: "رقم الموظف",
      employeeName: "اسم الموظف",
      date: "التاريخ",
      checkIn: "وقت الحضور",
      checkOut: "وقت الانصراف",
      status: "الحالة",
      notes: "ملاحظات",
      actions: "الإجراءات",
      statusLabels: {
        present: "حاضر",
        absent: "غائب",
        late: "متأخر",
        on_leave: "في إجازة",
      },
      search: "بحث عن سجل حضور...",
      edit: "تعديل",
      delete: "حذف",
      deleteConfirmation: "هل أنت متأكد من حذف هذا السجل؟",
      deleteDescription: "سيتم حذف بيانات سجل الحضور بشكل نهائي.",
      cancel: "إلغاء",
      confirm: "تأكيد",
      filterByDate: "تصفية حسب التاريخ",
      filterByStatus: "تصفية حسب الحالة",
      all: "الكل",
      today: "اليوم",
      loading: "جاري التحميل...",
      error: "حدث خطأ أثناء تحميل البيانات",
      attendanceAdded: "تمت إضافة سجل الحضور بنجاح",
      attendanceUpdated: "تم تحديث سجل الحضور بنجاح",
      attendanceDeleted: "تم حذف سجل الحضور بنجاح",
    },
    en: {
      title: "Attendance Tracker",
      addAttendance: "Add Attendance Record",
      id: "Record ID",
      employeeId: "Employee ID",
      employeeName: "Employee Name",
      date: "Date",
      checkIn: "Check In",
      checkOut: "Check Out",
      status: "Status",
      notes: "Notes",
      actions: "Actions",
      statusLabels: {
        present: "Present",
        absent: "Absent",
        late: "Late",
        on_leave: "On Leave",
      },
      search: "Search attendance records...",
      edit: "Edit",
      delete: "Delete",
      deleteConfirmation: "Are you sure you want to delete this record?",
      deleteDescription:
        "This will permanently delete the attendance record data.",
      cancel: "Cancel",
      confirm: "Confirm",
      filterByDate: "Filter by Date",
      filterByStatus: "Filter by Status",
      all: "All",
      today: "Today",
      loading: "Loading...",
      error: "Error loading data",
      attendanceAdded: "Attendance record added successfully",
      attendanceUpdated: "Attendance record updated successfully",
      attendanceDeleted: "Attendance record deleted successfully",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const getStatusBadge = (status: AttendanceData["status"]) => {
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

  const handleAddAttendance = () => {
    setCurrentAttendance(null);
    setIsAddDialogOpen(true);
  };

  const handleEditAttendance = (id: string) => {
    const attendance = attendanceRecords.find((record) => record.id === id);
    if (attendance) {
      setCurrentAttendance(attendance);
      setIsAddDialogOpen(true);
    }
  };

  const handleDeleteAttendance = (id: string) => {
    setAttendanceToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAttendance = async () => {
    try {
      // Delete the attendance record from Supabase
      await deleteRow(attendanceToDelete);

      // Update local state
      setAttendanceRecords(
        attendanceRecords.filter((record) => record.id !== attendanceToDelete),
      );
      setIsDeleteDialogOpen(false);

      toast({
        title: t.attendanceDeleted,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting attendance record:", error);
      toast({
        title: isRTL
          ? "حدث خطأ أثناء حذف سجل الحضور"
          : "Error deleting attendance record",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSaveAttendance = async (attendanceData: AttendanceData) => {
    try {
      if (currentAttendance) {
        // Edit existing attendance record
        await updateRow(attendanceData.id, {
          employee_id: attendanceData.employeeId,
          date: attendanceData.date,
          check_in: attendanceData.checkIn,
          check_out: attendanceData.checkOut,
          status: attendanceData.status,
          notes: attendanceData.notes,
        });

        // Update local state
        setAttendanceRecords(
          attendanceRecords.map((record) =>
            record.id === attendanceData.id ? attendanceData : record,
          ),
        );

        toast({
          title: t.attendanceUpdated,
          duration: 3000,
        });
      } else {
        // Add new attendance record
        const result = await insertRow({
          employee_id: attendanceData.employeeId,
          date: attendanceData.date,
          check_in: attendanceData.checkIn,
          check_out: attendanceData.checkOut,
          status: attendanceData.status,
          notes: attendanceData.notes,
        });

        // Add to local state with the returned ID
        if (result) {
          const newAttendance = {
            ...attendanceData,
            id: result.id,
          };
          setAttendanceRecords([...attendanceRecords, newAttendance]);
        }

        toast({
          title: t.attendanceAdded,
          duration: 3000,
        });
      }
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error saving attendance record:", error);
      toast({
        title: isRTL
          ? "حدث خطأ أثناء حفظ بيانات سجل الحضور"
          : "Error saving attendance record",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const filteredAttendanceRecords = attendanceRecords.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (dateFilter === "all" || record.date === dateFilter) &&
      (statusFilter === "all" || record.status === statusFilter),
  );

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
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{t.title}</h2>
        <Button onClick={handleAddAttendance}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t.addAttendance}
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <Input
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-[180px]"
          />
          <Button
            variant="outline"
            onClick={() => setDateFilter("all")}
            className="whitespace-nowrap"
          >
            {t.all}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setDateFilter(new Date().toISOString().split("T")[0])
            }
            className="whitespace-nowrap"
          >
            {t.today}
          </Button>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t.filterByStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="present">{t.statusLabels.present}</SelectItem>
            <SelectItem value="absent">{t.statusLabels.absent}</SelectItem>
            <SelectItem value="late">{t.statusLabels.late}</SelectItem>
            <SelectItem value="on_leave">{t.statusLabels.on_leave}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.employeeName}</TableHead>
                  <TableHead>{t.date}</TableHead>
                  <TableHead>{t.checkIn}</TableHead>
                  <TableHead>{t.checkOut}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead>{t.notes}</TableHead>
                  <TableHead className="text-right">{t.actions}</TableHead>
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
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditAttendance(record.id)}
                          title={t.edit}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAttendance(record.id)}
                          title={t.delete}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {isAddDialogOpen && (
        <AttendanceForm
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleSaveAttendance}
          initialData={currentAttendance || undefined}
          employees={localEmployees}
        />
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteConfirmation}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAttendance}>
              {t.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AttendanceTracker;
