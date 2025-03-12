import React, { useState } from "react";
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

interface EmployeesListProps {}

const defaultEmployees: EmployeeFormData[] = [
  {
    id: "1",
    name: "أحمد محمد",
    position: "مطور برمجيات",
    department: "تكنولوجيا المعلومات",
    joinDate: "2022-01-15",
    baseSalary: 5000,
    dailyRate: 250,
    dailyRateWithIncentive: 300,
    overtimeRate: 50,
    overtimeHours: 10,
    monthlyIncentives: 1000,
    bonus: 500,
    overtimeAmount: 500,
    purchases: 200,
    advances: 500,
    absenceDays: 1,
    absenceDeductions: 250,
    penaltyDays: 0,
    penalties: 0,
    netSalary: 6050,
    totalSalaryWithIncentive: 6000,
  },
  {
    id: "2",
    name: "سارة أحمد",
    position: "محاسب",
    department: "المالية",
    joinDate: "2021-05-10",
    baseSalary: 4500,
    dailyRate: 225,
    dailyRateWithIncentive: 270,
    overtimeRate: 45,
    overtimeHours: 5,
    monthlyIncentives: 900,
    bonus: 300,
    overtimeAmount: 225,
    purchases: 150,
    advances: 300,
    absenceDays: 0,
    absenceDeductions: 0,
    penaltyDays: 0,
    penalties: 0,
    netSalary: 5475,
    totalSalaryWithIncentive: 5400,
  },
  {
    id: "3",
    name: "محمد علي",
    position: "مدير مشروع",
    department: "العمليات",
    joinDate: "2020-11-20",
    baseSalary: 7000,
    dailyRate: 350,
    dailyRateWithIncentive: 420,
    overtimeRate: 70,
    overtimeHours: 8,
    monthlyIncentives: 1400,
    bonus: 700,
    overtimeAmount: 560,
    purchases: 300,
    advances: 1000,
    absenceDays: 0,
    absenceDeductions: 0,
    penaltyDays: 1,
    penalties: 350,
    netSalary: 8010,
    totalSalaryWithIncentive: 8400,
  },
];

const EmployeesList = ({}: EmployeesListProps) => {
  const { isRTL } = useLanguage();
  const [employees, setEmployees] =
    useState<EmployeeFormData[]>(defaultEmployees);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] =
    useState<EmployeeFormData | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

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

  const confirmDeleteEmployee = () => {
    setEmployees(employees.filter((emp) => emp.id !== employeeToDelete));
    setIsDeleteDialogOpen(false);
  };

  const handleSaveEmployee = (employeeData: EmployeeFormData) => {
    if (currentEmployee) {
      // Edit existing employee
      setEmployees(
        employees.map((emp) =>
          emp.id === employeeData.id ? employeeData : emp,
        ),
      );
    } else {
      // Add new employee
      setEmployees([...employees, employeeData]);
    }
    setIsAddDialogOpen(false);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
                <TableCell>{employee.id}</TableCell>
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
