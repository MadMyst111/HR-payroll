import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Clock } from "lucide-react";
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
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useDataCache } from "@/hooks/useDataCache";
import { useAdvancedSearch } from "@/hooks/useAdvancedSearch";
import { supabase } from "@/lib/supabase";

interface EmployeesListProps {}

const EmployeesList = ({}: EmployeesListProps) => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();

  // Use data cache for better performance
  const {
    data: cachedEmployees,
    loading: employeesLoading,
    error: employeesError,
    invalidateCache,
  } = useDataCache(
    async () => {
      const { data } = await supabase.from("employees").select("*");
      return data || [];
    },
    [],
    { cacheKey: "employees", expirationTime: 5 * 60 * 1000 }, // 5 minutes cache
  );

  const [employees, setEmployees] = useState<EmployeeFormData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] =
    useState<EmployeeFormData | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<string>("");

  // Convert cached employees to EmployeeFormData
  useEffect(() => {
    if (cachedEmployees && cachedEmployees.length > 0) {
      const formattedEmployees = cachedEmployees.map((emp) => {
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
    }
  }, [cachedEmployees]);

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
      await supabase.from("employees").delete().eq("id", employeeToDelete);

      // Update local state
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete));

      // Invalidate cache to ensure fresh data on next load
      invalidateCache();

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
        await supabase
          .from("employees")
          .update({
            name: employeeData.name,
            position: employeeData.position,
            department: employeeData.department,
            join_date: employeeData.joinDate,
            base_salary: employeeData.baseSalary,
            monthly_incentives: employeeData.monthlyIncentives,
            daily_rate: employeeData.dailyRate,
            daily_rate_with_incentive: employeeData.dailyRateWithIncentive,
            overtime_rate: employeeData.overtimeRate,
          })
          .eq("id", employeeData.id);

        // Update local state
        setEmployees(
          employees.map((emp) =>
            emp.id === employeeData.id ? employeeData : emp,
          ),
        );

        toast({
          title: t.employeeUpdated,
          duration: 3000,
        });
      } else {
        // Add new employee
        const { data } = await supabase
          .from("employees")
          .insert({
            name: employeeData.name,
            position: employeeData.position,
            department: employeeData.department,
            join_date: employeeData.joinDate,
            base_salary: employeeData.baseSalary,
            monthly_incentives: employeeData.monthlyIncentives,
            daily_rate: employeeData.dailyRate,
            daily_rate_with_incentive: employeeData.dailyRateWithIncentive,
            overtime_rate: employeeData.overtimeRate,
          })
          .select();

        if (data && data[0]) {
          // Add to local state with the returned ID
          const newEmployee = {
            ...employeeData,
            id: data[0].id,
          };
          setEmployees([...employees, newEmployee]);
        }

        toast({
          title: t.employeeAdded,
          duration: 3000,
        });
      }

      // Invalidate cache to ensure fresh data on next load
      invalidateCache();

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

  // Define columns for DataTable
  const columns = [
    {
      header: t.id,
      accessorKey: "id" as keyof EmployeeFormData,
      cell: (employee: EmployeeFormData) =>
        employee.id.toString().substring(0, 8),
    },
    {
      header: t.name,
      accessorKey: "name" as keyof EmployeeFormData,
      sortable: true,
    },
    {
      header: t.position,
      accessorKey: "position" as keyof EmployeeFormData,
      sortable: true,
    },
    {
      header: t.department,
      accessorKey: "department" as keyof EmployeeFormData,
      sortable: true,
    },
    {
      header: t.baseSalary,
      accessorKey: "baseSalary" as keyof EmployeeFormData,
      cell: (employee: EmployeeFormData) => `${employee.baseSalary} ج.م`,
      sortable: true,
    },
    {
      header: t.monthlyIncentives,
      accessorKey: "monthlyIncentives" as keyof EmployeeFormData,
      cell: (employee: EmployeeFormData) => `${employee.monthlyIncentives} ج.م`,
    },
    {
      header: t.netSalary,
      accessorKey: "netSalary" as keyof EmployeeFormData,
      cell: (employee: EmployeeFormData) => `${employee.netSalary} ج.م`,
      sortable: true,
    },
    {
      header: t.actions,
      accessorKey: "id" as keyof EmployeeFormData,
      cell: (employee: EmployeeFormData) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditEmployee(employee.id)}
          >
            {t.edit}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteEmployee(employee.id)}
          >
            {t.delete}
          </Button>
          <Button variant="ghost" size="sm" title={t.attendance}>
            <Clock className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title={t.viewDetails}>
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (employeesLoading) {
    return <div className="p-8 text-center">{t.loading}</div>;
  }

  if (employeesError) {
    return (
      <div className="p-8 text-center text-red-500">
        {t.error}: {employeesError.message}
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

      <DataTable
        data={employees}
        columns={columns}
        searchPlaceholder={t.search}
        searchFields={["name", "position", "department"]}
        exportFilename="employees_report"
        isRTL={isRTL}
        pageSize={10}
      />

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
