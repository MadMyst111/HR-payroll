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
import { PlusCircle, Edit, Trash2, FileText, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import AddEmployeeForm, { EmployeeFormData } from "./AddEmployeeForm";
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
import { Input } from "@/components/ui/input";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { Tables } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";

interface EmployeesListProps {}

const EmployeesList = ({}: EmployeesListProps) => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const {
    data: supabaseEmployees,
    loading,
    error,
    insertRow,
    updateRow,
    deleteRow,
  } = useSupabaseData("employees");
  const [employees, setEmployees] = useState<EmployeeFormData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] =
    useState<EmployeeFormData | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Convert Supabase employees to EmployeeFormData
  useEffect(() => {
    if (supabaseEmployees && supabaseEmployees.length > 0) {
      const formattedEmployees = supabaseEmployees.map((emp) => {
        // Get payroll data for this employee (in a real app, you'd fetch this)
        // For now, we'll use default values
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
      setEmployees(formattedEmployees);
    } else if (!loading && supabaseEmployees?.length === 0) {
      // If no employees in database, add default ones
      addDefaultEmployees();
    }
  }, [supabaseEmployees, loading]);

  const addDefaultEmployees = async () => {
    // No default employees needed - fresh start
    return;
  };

  const labels = {
    ar: {
      title: "قائمة الموظفين",
      addEmployee: "إضافة موظف",
      id: "كود الموظف",
      name: "اسم الموظف",
      position: "الوظيفة",
      department: "القسم",
      joinDate: "تاريخ التعيين",
      baseSalary: "الراتب الأساسي",
      monthlyIncentives: "الحوافز الشهرية",
      netSalary: "صافي الراتب",
      actions: "الإجراءات",
      edit: "تعديل",
      delete: "حذف",
      deleteConfirmation: "هل أنت متأكد من حذف هذا الموظف؟",
      deleteDescription: "سيتم حذف جميع بيانات الموظف بشكل نهائي.",
      cancel: "إلغاء",
      confirm: "تأكيد",
      search: "بحث عن موظف...",
      attendance: "الحضور والغياب",
      viewDetails: "عرض التفاصيل",
      loading: "جاري التحميل...",
      error: "حدث خطأ أثناء تحميل البيانات",
      employeeAdded: "تمت إضافة الموظف بنجاح",
      employeeUpdated: "تم تحديث بيانات الموظف بنجاح",
      employeeDeleted: "تم حذف الموظف بنجاح",
    },
    en: {
      title: "Employees List",
      addEmployee: "Add Employee",
      id: "Employee ID",
      name: "Employee Name",
      position: "Position",
      department: "Department",
      joinDate: "Join Date",
      baseSalary: "Base Salary",
      monthlyIncentives: "Monthly Incentives",
      netSalary: "Net Salary",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      deleteConfirmation: "Are you sure you want to delete this employee?",
      deleteDescription: "This will permanently delete the employee's data.",
      cancel: "Cancel",
      confirm: "Confirm",
      search: "Search for employee...",
      attendance: "Attendance",
      viewDetails: "View Details",
      loading: "Loading...",
      error: "Error loading data",
      employeeAdded: "Employee added successfully",
      employeeUpdated: "Employee updated successfully",
      employeeDeleted: "Employee deleted successfully",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setIsAddDialogOpen(true);
  };

  const handleEditEmployee = (id: string) => {
    const employee = employees.find((emp) => emp.id === id);
    if (employee) {
      setCurrentEmployee(employee);
      setIsAddDialogOpen(true);
    }
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployeeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteEmployee = async () => {
    try {
      await deleteRow(employeeToDelete);
      toast({
        title: t.employeeDeleted,
        duration: 3000,
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast({
        title: isRTL ? "حدث خطأ أثناء حذف الموظف" : "Error deleting employee",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSaveEmployee = async (employeeData: EmployeeFormData) => {
    try {
      if (currentEmployee) {
        // Edit existing employee
        await updateRow(employeeData.id, {
          name: employeeData.name,
          position: employeeData.position,
          department: employeeData.department,
          join_date: employeeData.joinDate,
          base_salary: employeeData.baseSalary,
          monthly_incentives: employeeData.monthlyIncentives,
          daily_rate: employeeData.dailyRate,
          daily_rate_with_incentive: employeeData.dailyRateWithIncentive,
          overtime_rate: employeeData.overtimeRate,
        });
        toast({
          title: t.employeeUpdated,
          duration: 3000,
        });
      } else {
        // Add new employee
        await insertRow({
          name: employeeData.name,
          position: employeeData.position,
          department: employeeData.department,
          join_date: employeeData.joinDate,
          base_salary: employeeData.baseSalary,
          monthly_incentives: employeeData.monthlyIncentives,
          daily_rate: employeeData.dailyRate,
          daily_rate_with_incentive: employeeData.dailyRateWithIncentive,
          overtime_rate: employeeData.overtimeRate,
        });
        toast({
          title: t.employeeAdded,
          duration: 3000,
        });
      }
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error saving employee:", error);
      toast({
        title: isRTL
          ? "حدث خطأ أثناء حفظ بيانات الموظف"
          : "Error saving employee",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return <div className="p-8 text-center">{t.loading}</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {t.error}: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{t.title}</h2>
        <Button onClick={handleAddEmployee}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t.addEmployee}
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{t.id}</TableHead>
              <TableHead>{t.name}</TableHead>
              <TableHead>{t.position}</TableHead>
              <TableHead>{t.baseSalary}</TableHead>
              <TableHead>{t.monthlyIncentives}</TableHead>
              <TableHead className="text-right">{t.netSalary}</TableHead>
              <TableHead className="text-right">{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.id.toString().substring(0, 8)}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.baseSalary} ج.م</TableCell>
                <TableCell>{employee.monthlyIncentives} ج.م</TableCell>
                <TableCell className="text-right font-medium">
                  {employee.netSalary} ج.م
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditEmployee(employee.id)}
                      title={t.edit}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEmployee(employee.id)}
                      title={t.delete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title={t.attendance}>
                      <Clock className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title={t.viewDetails}>
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isAddDialogOpen && (
        <AddEmployeeForm
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleSaveEmployee}
          initialData={currentEmployee || undefined}
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
            <AlertDialogAction onClick={confirmDeleteEmployee}>
              {t.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployeesList;
