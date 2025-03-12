import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { EmployeeFormData } from "../employees/AddEmployeeForm";
import AddAdvanceForm, { AdvanceData } from "./AddAdvanceForm";
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
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useToast } from "@/components/ui/use-toast";
import { Tables } from "@/types/supabase";

interface AdvancesListProps {
  employees?: EmployeeFormData[];
  onUpdateEmployeeAdvances?: (
    employeeId: string,
    advanceAmount: number,
  ) => void;
}

const AdvancesList = ({
  employees = [],
  onUpdateEmployeeAdvances = () => {},
}: AdvancesListProps) => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();

  // Fetch data from Supabase
  const { data: supabaseEmployees, loading: employeesLoading } =
    useSupabaseData("employees");

  const {
    data: supabaseAdvances,
    loading: advancesLoading,
    error: advancesError,
    insertRow,
    updateRow,
    deleteRow,
  } = useSupabaseData("advances");

  const [advances, setAdvances] = useState<AdvanceData[]>([]);
  const [localEmployees, setLocalEmployees] =
    useState<EmployeeFormData[]>(employees);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAdvance, setCurrentAdvance] = useState<AdvanceData | null>(
    null,
  );
  const [advanceToDelete, setAdvanceToDelete] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"advances" | "employees">(
    "advances",
  );
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");

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

  // Convert Supabase advances to AdvanceData
  useEffect(() => {
    if (supabaseAdvances && supabaseAdvances.length > 0) {
      const formattedAdvances = supabaseAdvances.map((adv) => {
        // Find employee name
        const employee = supabaseEmployees?.find(
          (emp) => emp.id === adv.employee_id,
        );

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
        };
      });
      // Only update state if there are actual changes to prevent unnecessary re-renders
      // and to avoid overwriting local state changes like deletions
      if (JSON.stringify(formattedAdvances) !== JSON.stringify(advances)) {
        setAdvances(formattedAdvances);
      }
    } else if (!advancesLoading && supabaseAdvances?.length === 0) {
      // If no advances in database and employees exist, add default ones
      if (supabaseEmployees && supabaseEmployees.length > 0) {
        addDefaultAdvances();
      }
    }
  }, [supabaseAdvances, supabaseEmployees, advancesLoading]);

  const addDefaultAdvances = async () => {
    // No default advances needed - fresh start
    return;
  };

  const labels = {
    ar: {
      title: "إدارة السلف",
      addAdvance: "إضافة سلفة",
      id: "رقم السلفة",
      employeeId: "رقم الموظف",
      employeeName: "اسم الموظف",
      amount: "المبلغ",
      requestDate: "تاريخ الطلب",
      expectedPaymentDate: "تاريخ السداد المتوقع",
      status: "الحالة",
      approvedBy: "تمت الموافقة من قبل",
      paymentDate: "تاريخ الدفع",
      actions: "الإجراءات",
      statusLabels: {
        pending: "قيد الانتظار",
        approved: "تمت الموافقة",
        rejected: "مرفوض",
        paid: "تم الدفع",
      },
      search: "بحث عن سلفة...",
      edit: "تعديل",
      delete: "حذف",
      deductFromSalary: "خصم من الراتب",
      deleteConfirmation: "هل أنت متأكد من حذف هذه السلفة؟",
      deleteDescription: "سيتم حذف بيانات السلفة بشكل نهائي.",
      cancel: "إلغاء",
      confirm: "تأكيد",
      deductConfirmation: "هل تريد خصم هذه السلفة من راتب الموظف؟",
      deductDescription:
        "سيتم خصم قيمة السلفة من راتب الموظف وتحديث حالة السلفة إلى 'تم الدفع'.",
      employeeAdvances: "سلف الموظفين",
      currentAdvances: "السلف الحالية",
      previousAdvances: "السلف السابقة",
      totalAdvances: "إجمالي السلف",
      remainingAdvances: "إجمالي السلف المتبقية",
      viewEmployeeAdvances: "عرض سلف الموظف",
      allDepartments: "جميع الموظفين",
      loading: "جاري التحميل...",
      error: "حدث خطأ أثناء تحميل البيانات",
      advanceAdded: "تمت إضافة السلفة بنجاح",
      advanceUpdated: "تم تحديث بيانات السلفة بنجاح",
      advanceDeleted: "تم حذف السلفة بنجاح",
      advanceDeducted: "تم خصم السلفة من راتب الموظف بنجاح",
    },
    en: {
      title: "Advances Management",
      addAdvance: "Add Advance",
      id: "Advance ID",
      employeeId: "Employee ID",
      employeeName: "Employee Name",
      amount: "Amount",
      requestDate: "Request Date",
      expectedPaymentDate: "Expected Payment Date",
      status: "Status",
      approvedBy: "Approved By",
      paymentDate: "Payment Date",
      actions: "Actions",
      statusLabels: {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        paid: "Paid",
      },
      search: "Search advances...",
      edit: "Edit",
      delete: "Delete",
      deductFromSalary: "Deduct from Salary",
      deleteConfirmation: "Are you sure you want to delete this advance?",
      deleteDescription: "This will permanently delete the advance data.",
      cancel: "Cancel",
      confirm: "Confirm",
      deductConfirmation:
        "Do you want to deduct this advance from the employee's salary?",
      deductDescription:
        "The advance amount will be deducted from the employee's salary and the status will be updated to 'Paid'.",
      employeeAdvances: "Employee Advances",
      currentAdvances: "Current Advances",
      previousAdvances: "Previous Advances",
      totalAdvances: "Total Advances",
      remainingAdvances: "Total Remaining Advances",
      viewEmployeeAdvances: "View Employee Advances",
      allDepartments: "All Employees",
      loading: "Loading...",
      error: "Error loading data",
      advanceAdded: "Advance added successfully",
      advanceUpdated: "Advance updated successfully",
      advanceDeleted: "Advance deleted successfully",
      advanceDeducted: "Advance deducted from employee's salary successfully",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const getStatusBadge = (status: AdvanceData["status"]) => {
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

  const handleAddAdvance = () => {
    setCurrentAdvance(null);
    setIsAddDialogOpen(true);
  };

  const handleEditAdvance = (id: string) => {
    const advance = advances.find((adv) => adv.id === id);
    if (advance) {
      setCurrentAdvance(advance);
      setIsAddDialogOpen(true);
    }
  };

  const handleDeleteAdvance = (id: string) => {
    setAdvanceToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAdvance = async () => {
    try {
      // Delete the advance from Supabase
      await deleteRow(advanceToDelete);

      // Update local state manually to ensure deletion persists
      setAdvances(advances.filter((advance) => advance.id !== advanceToDelete));

      toast({
        title: t.advanceDeleted,
        duration: 3000,
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting advance:", error);
      toast({
        title: isRTL ? "حدث خطأ أثناء حذف السلفة" : "Error deleting advance",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSaveAdvance = async (advanceData: AdvanceData) => {
    try {
      if (currentAdvance) {
        // Edit existing advance
        await updateRow(advanceData.id, {
          employee_id: advanceData.employeeId,
          amount: advanceData.amount,
          request_date: advanceData.requestDate,
          expected_payment_date: advanceData.expectedPaymentDate,
          status: advanceData.status,
          approved_by: advanceData.approvedBy,
          payment_date: advanceData.paymentDate,
          notes: advanceData.notes,
        });

        // No need to manually update local state as the realtime subscription will handle it
        toast({
          title: t.advanceUpdated,
          duration: 3000,
        });
      } else {
        // Add new advance
        await insertRow({
          employee_id: advanceData.employeeId,
          amount: advanceData.amount,
          request_date: advanceData.requestDate,
          expected_payment_date: advanceData.expectedPaymentDate,
          status: advanceData.status,
          approved_by: advanceData.approvedBy,
          payment_date: advanceData.paymentDate,
          notes: advanceData.notes,
        });

        // No need to manually update local state as the realtime subscription will handle it
        toast({
          title: t.advanceAdded,
          duration: 3000,
        });
      }
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error saving advance:", error);
      toast({
        title: isRTL
          ? "حدث خطأ أثناء حفظ بيانات السلفة"
          : "Error saving advance",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleDeductFromSalary = async (advance: AdvanceData) => {
    try {
      // Update the advance status to paid
      await updateRow(advance.id, {
        status: "paid",
        payment_date: new Date().toISOString().split("T")[0],
      });

      // No need to manually update local state as the realtime subscription will handle it

      // Update the employee's advances amount in payroll record
      onUpdateEmployeeAdvances(advance.employeeId, advance.amount);

      toast({
        title: t.advanceDeducted,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deducting advance:", error);
      toast({
        title: isRTL ? "حدث خطأ أثناء خصم السلفة" : "Error deducting advance",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const filteredAdvances = advances.filter(
    (advance) =>
      (advance.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advance.employeeName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (selectedEmployee === "all" || advance.employeeId === selectedEmployee),
  );

  // Get current and previous advances for each employee
  const employeeAdvancesData = React.useMemo(() => {
    const data: Record<
      string,
      {
        employeeId: string;
        employeeName: string;
        currentAdvances: number;
        previousAdvances: number;
        totalAdvances: number;
        remainingAdvances: number;
        maxAdvanceLimit: number;
      }
    > = {};

    // Initialize with all employees
    localEmployees.forEach((emp) => {
      // Set max advance limit to 3 months of base salary
      const maxAdvanceLimit = emp.baseSalary * 3;

      // Calculate total advances (both approved and paid)
      let totalTakenAdvances = emp.advances; // Previously deducted advances
      let currentPendingAdvances = 0;

      // Count all advances for this employee
      advances.forEach((advance) => {
        if (advance.employeeId === emp.id) {
          if (advance.status === "approved") {
            currentPendingAdvances += advance.amount;
            totalTakenAdvances += advance.amount;
          }
        }
      });

      data[emp.id] = {
        employeeId: emp.id,
        employeeName: emp.name,
        currentAdvances: currentPendingAdvances,
        previousAdvances: emp.advances,
        totalAdvances: totalTakenAdvances,
        remainingAdvances: totalTakenAdvances, // This is the total of advances taken
        maxAdvanceLimit: maxAdvanceLimit,
      };
    });

    return Object.values(data);
  }, [advances, localEmployees]);

  const filteredEmployeeAdvances = employeeAdvancesData.filter(
    (data) =>
      data.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{t.title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setActiveTab(activeTab === "advances" ? "employees" : "advances")
            }
          >
            {activeTab === "advances" ? t.employeeAdvances : t.title}
          </Button>
          <Button onClick={handleAddAdvance}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t.addAdvance}
          </Button>
        </div>
      </div>

      <div className="mb-4 flex gap-4">
        <Input
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {activeTab === "advances" && (
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t.employeeName} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allDepartments}</SelectItem>
              {localEmployees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {activeTab === "advances" ? (
        <div className="overflow-x-auto table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.id}</TableHead>
                <TableHead>{t.employeeName}</TableHead>
                <TableHead className="text-right">{t.amount}</TableHead>
                <TableHead>{t.requestDate}</TableHead>
                <TableHead>{t.expectedPaymentDate}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead>{t.paymentDate}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdvances.map((advance) => (
                <TableRow key={advance.id}>
                  <TableCell>{advance.id.substring(0, 8)}</TableCell>
                  <TableCell>{advance.employeeName}</TableCell>
                  <TableCell className="text-right font-medium">
                    {advance.amount} ج.م
                  </TableCell>
                  <TableCell>{advance.requestDate}</TableCell>
                  <TableCell>{advance.expectedPaymentDate}</TableCell>
                  <TableCell>{getStatusBadge(advance.status)}</TableCell>
                  <TableCell>{advance.paymentDate || "-"}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditAdvance(advance.id)}
                        title={t.edit}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAdvance(advance.id)}
                        title={t.delete}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {advance.status === "approved" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeductFromSalary(advance)}
                          title={t.deductFromSalary}
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="overflow-x-auto table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.employeeId}</TableHead>
                <TableHead>{t.employeeName}</TableHead>
                <TableHead className="text-right">
                  {t.currentAdvances}
                </TableHead>
                <TableHead className="text-right">
                  {t.previousAdvances}
                </TableHead>
                <TableHead className="text-right">{t.totalAdvances}</TableHead>
                <TableHead className="text-right">
                  {t.remainingAdvances}
                </TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployeeAdvances.map((data) => (
                <TableRow key={data.employeeId}>
                  <TableCell>{data.employeeId.substring(0, 8)}</TableCell>
                  <TableCell>{data.employeeName}</TableCell>
                  <TableCell className="text-right font-medium">
                    {data.currentAdvances} ج.م
                  </TableCell>
                  <TableCell className="text-right">
                    {data.previousAdvances} ج.م
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {data.totalAdvances} ج.م
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {data.remainingAdvances} ج.م
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEmployee(data.employeeId);
                          setActiveTab("advances");
                        }}
                      >
                        {t.viewEmployeeAdvances}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {isAddDialogOpen && (
        <AddAdvanceForm
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleSaveAdvance}
          initialData={currentAdvance || undefined}
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
            <AlertDialogAction onClick={confirmDeleteAdvance}>
              {t.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdvancesList;
