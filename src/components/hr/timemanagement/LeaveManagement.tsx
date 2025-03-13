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
import { PlusCircle, Edit, Trash2, Check, X } from "lucide-react";
import { EmployeeFormData } from "../employees/AddEmployeeForm";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useToast } from "@/components/ui/use-toast";
import LeaveRequestForm, { LeaveRequestData } from "./LeaveRequestForm";
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

interface LeaveManagementProps {
  employees?: EmployeeFormData[];
}

const LeaveManagement = ({ employees = [] }: LeaveManagementProps) => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();

  // Fetch data from Supabase
  const { data: supabaseEmployees, loading: employeesLoading } =
    useSupabaseData("employees");

  const {
    data: supabaseLeaveRequests,
    loading: leaveRequestsLoading,
    error: leaveRequestsError,
    insertRow,
    updateRow,
    deleteRow,
  } = useSupabaseData("leave_requests");

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestData[]>([]);
  const [localEmployees, setLocalEmployees] =
    useState<EmployeeFormData[]>(employees);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLeaveRequest, setCurrentLeaveRequest] =
    useState<LeaveRequestData | null>(null);
  const [leaveRequestToDelete, setLeaveRequestToDelete] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
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

  // Convert Supabase leave requests to LeaveRequestData
  useEffect(() => {
    if (supabaseLeaveRequests && supabaseLeaveRequests.length > 0) {
      const formattedLeaveRequests = supabaseLeaveRequests.map((leave) => {
        // Find employee name
        const employee = supabaseEmployees?.find(
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
    } else if (!leaveRequestsLoading && supabaseLeaveRequests?.length === 0) {
      // If no leave requests in database and employees exist, add default ones
      if (supabaseEmployees && supabaseEmployees.length > 0) {
        addDefaultLeaveRequests();
      }
    }
  }, [supabaseLeaveRequests, supabaseEmployees, leaveRequestsLoading]);

  const addDefaultLeaveRequests = async () => {
    // No default leave requests needed - fresh start
    return;
  };

  const labels = {
    ar: {
      title: "إدارة الإجازات",
      addLeaveRequest: "إضافة طلب إجازة",
      id: "رقم الطلب",
      employeeId: "رقم الموظف",
      employeeName: "اسم الموظف",
      leaveType: "نوع الإجازة",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      totalDays: "عدد الأيام",
      reason: "السبب",
      status: "الحالة",
      approvedBy: "تمت الموافقة من قبل",
      actions: "الإجراءات",
      statusLabels: {
        pending: "قيد الانتظار",
        approved: "تمت الموافقة",
        rejected: "مرفوض",
      },
      leaveTypeLabels: {
        annual: "سنوية",
        sick: "مرضية",
        personal: "شخصية",
        unpaid: "بدون راتب",
      },
      search: "بحث عن طلب إجازة...",
      edit: "تعديل",
      delete: "حذف",
      approve: "موافقة",
      reject: "رفض",
      deleteConfirmation: "هل أنت متأكد من حذف هذا الطلب؟",
      deleteDescription: "سيتم حذف بيانات طلب الإجازة بشكل نهائي.",
      cancel: "إلغاء",
      confirm: "تأكيد",
      filterByStatus: "تصفية حسب الحالة",
      all: "الكل",
      loading: "جاري التحميل...",
      error: "حدث خطأ أثناء تحميل البيانات",
      leaveRequestAdded: "تمت إضافة طلب الإجازة بنجاح",
      leaveRequestUpdated: "تم تحديث طلب الإجازة بنجاح",
      leaveRequestDeleted: "تم حذف طلب الإجازة بنجاح",
      leaveRequestApproved: "تمت الموافقة على طلب الإجازة بنجاح",
      leaveRequestRejected: "تم رفض طلب الإجازة بنجاح",
    },
    en: {
      title: "Leave Management",
      addLeaveRequest: "Add Leave Request",
      id: "Request ID",
      employeeId: "Employee ID",
      employeeName: "Employee Name",
      leaveType: "Leave Type",
      startDate: "Start Date",
      endDate: "End Date",
      totalDays: "Total Days",
      reason: "Reason",
      status: "Status",
      approvedBy: "Approved By",
      actions: "Actions",
      statusLabels: {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
      },
      leaveTypeLabels: {
        annual: "Annual",
        sick: "Sick",
        personal: "Personal",
        unpaid: "Unpaid",
      },
      search: "Search leave requests...",
      edit: "Edit",
      delete: "Delete",
      approve: "Approve",
      reject: "Reject",
      deleteConfirmation: "Are you sure you want to delete this request?",
      deleteDescription: "This will permanently delete the leave request data.",
      cancel: "Cancel",
      confirm: "Confirm",
      filterByStatus: "Filter by Status",
      all: "All",
      loading: "Loading...",
      error: "Error loading data",
      leaveRequestAdded: "Leave request added successfully",
      leaveRequestUpdated: "Leave request updated successfully",
      leaveRequestDeleted: "Leave request deleted successfully",
      leaveRequestApproved: "Leave request approved successfully",
      leaveRequestRejected: "Leave request rejected successfully",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const getStatusBadge = (status: LeaveRequestData["status"]) => {
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

  const handleAddLeaveRequest = () => {
    setCurrentLeaveRequest(null);
    setIsAddDialogOpen(true);
  };

  const handleEditLeaveRequest = (id: string) => {
    const leaveRequest = leaveRequests.find((req) => req.id === id);
    if (leaveRequest) {
      setCurrentLeaveRequest(leaveRequest);
      setIsAddDialogOpen(true);
    }
  };

  const handleDeleteLeaveRequest = (id: string) => {
    setLeaveRequestToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteLeaveRequest = async () => {
    try {
      // Delete the leave request from Supabase
      await deleteRow(leaveRequestToDelete);

      // Update local state
      setLeaveRequests(
        leaveRequests.filter((leave) => leave.id !== leaveRequestToDelete),
      );
      setIsDeleteDialogOpen(false);

      toast({
        title: t.leaveRequestDeleted,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting leave request:", error);
      toast({
        title: isRTL
          ? "حدث خطأ أثناء حذف طلب الإجازة"
          : "Error deleting leave request",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSaveLeaveRequest = async (leaveRequestData: LeaveRequestData) => {
    try {
      // Ensure we have valid data
      const cleanData = {
        employee_id: leaveRequestData.employeeId,
        leave_type: leaveRequestData.leaveType,
        start_date: leaveRequestData.startDate,
        end_date: leaveRequestData.endDate,
        total_days: leaveRequestData.totalDays,
        reason: leaveRequestData.reason || null,
      };

      if (currentLeaveRequest) {
        // Edit existing leave request - add optional fields
        const updateData = {
          ...cleanData,
          status: leaveRequestData.status,
          approved_by: leaveRequestData.approvedBy || null,
          notes: leaveRequestData.notes || null,
        };

        await updateRow(leaveRequestData.id, updateData);

        // Update local state
        setLeaveRequests(
          leaveRequests.map((leave) =>
            leave.id === leaveRequestData.id ? leaveRequestData : leave,
          ),
        );

        toast({
          title: t.leaveRequestUpdated,
          duration: 3000,
        });
      } else {
        // Add new leave request - always pending status
        const insertData = {
          ...cleanData,
          status: "pending", // New requests are always pending
        };

        console.log("Inserting leave request with data:", insertData);
        const result = await insertRow(insertData);

        // Add to local state with the returned ID
        if (result) {
          const newLeaveRequest = {
            ...leaveRequestData,
            id: result.id,
            status: "pending",
          };
          setLeaveRequests([...leaveRequests, newLeaveRequest]);
        }

        toast({
          title: t.leaveRequestAdded,
          duration: 3000,
        });
      }
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error saving leave request:", error);
      toast({
        title: isRTL
          ? "حدث خطأ أثناء حفظ بيانات طلب الإجازة"
          : "Error saving leave request",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleApproveLeaveRequest = async (id: string) => {
    try {
      await updateRow(id, {
        status: "approved",
        approved_by: "HR Manager", // In a real app, this would be the current user
      });

      // Update local state
      setLeaveRequests(
        leaveRequests.map((leave) =>
          leave.id === id
            ? { ...leave, status: "approved", approvedBy: "HR Manager" }
            : leave,
        ),
      );

      toast({
        title: t.leaveRequestApproved,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error approving leave request:", error);
      toast({
        title: isRTL
          ? "حدث خطأ أثناء الموافقة على طلب الإجازة"
          : "Error approving leave request",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleRejectLeaveRequest = async (id: string) => {
    try {
      await updateRow(id, {
        status: "rejected",
      });

      // Update local state
      setLeaveRequests(
        leaveRequests.map((leave) =>
          leave.id === id ? { ...leave, status: "rejected" } : leave,
        ),
      );

      toast({
        title: t.leaveRequestRejected,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error rejecting leave request:", error);
      toast({
        title: isRTL
          ? "حدث خطأ أثناء رفض طلب الإجازة"
          : "Error rejecting leave request",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const filteredLeaveRequests = leaveRequests.filter(
    (request) =>
      (request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || request.status === statusFilter),
  );

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
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{t.title}</h2>
        <Button onClick={handleAddLeaveRequest}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t.addLeaveRequest}
        </Button>
      </div>

      <div className="mb-4 flex gap-4">
        <Input
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t.filterByStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="pending">{t.statusLabels.pending}</SelectItem>
            <SelectItem value="approved">{t.statusLabels.approved}</SelectItem>
            <SelectItem value="rejected">{t.statusLabels.rejected}</SelectItem>
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
                  <TableHead>{t.leaveType}</TableHead>
                  <TableHead>{t.startDate}</TableHead>
                  <TableHead>{t.endDate}</TableHead>
                  <TableHead className="text-center">{t.totalDays}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead className="text-right">{t.actions}</TableHead>
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
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditLeaveRequest(request.id)}
                          title={t.edit}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLeaveRequest(request.id)}
                          title={t.delete}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleApproveLeaveRequest(request.id)
                              }
                              title={t.approve}
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRejectLeaveRequest(request.id)
                              }
                              title={t.reject}
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
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
        <LeaveRequestForm
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleSaveLeaveRequest}
          initialData={currentLeaveRequest || undefined}
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
            <AlertDialogAction onClick={confirmDeleteLeaveRequest}>
              {t.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeaveManagement;
