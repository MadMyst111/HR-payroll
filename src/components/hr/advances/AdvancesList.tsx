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

interface AdvancesListProps {
  employees?: EmployeeFormData[];
  onUpdateEmployeeAdvances?: (
    employeeId: string,
    advanceAmount: number,
  ) => void;
}

const defaultAdvances: AdvanceData[] = [
  {
    id: "ADV-001",
    employeeId: "1",
    employeeName: "أحمد محمد",
    amount: 1000,
    requestDate: "2023-05-10",
    expectedPaymentDate: "2023-06-10",
    status: "approved",
    approvedBy: "المدير المالي",
    paymentDate: "2023-05-15",
    notes: "سلفة طارئة",
  },
  {
    id: "ADV-002",
    employeeId: "2",
    employeeName: "سارة أحمد",
    amount: 800,
    requestDate: "2023-05-12",
    expectedPaymentDate: "2023-06-12",
    status: "pending",
  },
  {
    id: "ADV-003",
    employeeId: "3",
    employeeName: "محمد علي",
    amount: 1500,
    requestDate: "2023-05-08",
    expectedPaymentDate: "2023-06-08",
    status: "paid",
    approvedBy: "المدير المالي",
    paymentDate: "2023-05-11",
  },
];

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

const AdvancesList = ({
  employees = defaultEmployees,
  onUpdateEmployeeAdvances = () => {},
}: AdvancesListProps) => {
  const { isRTL } = useLanguage();
  const [advances, setAdvances] = useState<AdvanceData[]>(defaultAdvances);
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
  const [localEmployees, setLocalEmployees] =
    useState<EmployeeFormData[]>(employees);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  useEffect(() => {
    setLocalEmployees(employees);
  }, [employees]);

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

  const confirmDeleteAdvance = () => {
    setAdvances(advances.filter((adv) => adv.id !== advanceToDelete));
    setIsDeleteDialogOpen(false);
  };

  const handleSaveAdvance = (advanceData: AdvanceData) => {
    if (currentAdvance) {
      // Edit existing advance
      setAdvances(
        advances.map((adv) => (adv.id === advanceData.id ? advanceData : adv)),
      );
    } else {
      // Add new advance
      setAdvances([...advances, advanceData]);
    }
    setIsAddDialogOpen(false);
  };

  const handleDeductFromSalary = (advance: AdvanceData) => {
    // Update the advance status to paid
    const updatedAdvances = advances.map((adv) => {
      if (adv.id === advance.id) {
        return {
          ...adv,
          status: "paid" as const,
          paymentDate: new Date().toISOString().split("T")[0],
        };
      }
      return adv;
    });
    setAdvances(updatedAdvances);

    // Update the employee's advances amount
    const updatedEmployees = localEmployees.map((emp) => {
      if (emp.id === advance.employeeId) {
        return {
          ...emp,
          advances: emp.advances + advance.amount,
          netSalary: emp.netSalary - advance.amount,
        };
      }
      return emp;
    });
    setLocalEmployees(updatedEmployees);

    // Notify parent component about the change
    onUpdateEmployeeAdvances(advance.employeeId, advance.amount);
  };

  const filteredAdvances = advances.filter(
    (advance) =>
      (advance.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advance.employeeName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (selectedEmployee ? advance.employeeId === selectedEmployee : true),
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
                  <TableCell>{advance.id}</TableCell>
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
                  <TableCell>{data.employeeId}</TableCell>
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
