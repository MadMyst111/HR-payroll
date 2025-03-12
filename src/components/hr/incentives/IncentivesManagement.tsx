import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { EmployeeFormData } from "../employees/AddEmployeeForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useToast } from "@/components/ui/use-toast";
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

interface IncentiveData {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "daily" | "monthly" | "yearly";
  amount: number;
  reason: string;
  date: string;
  status: "active" | "inactive";
  soldItems?: number; // For daily incentives
  distributionDate?: string; // For monthly incentives (10th or 20th)
  yearlyDays?: number; // For yearly incentives (default 21)
}

interface IncentivesManagementProps {
  employees?: EmployeeFormData[];
}

const IncentivesManagement = ({
  employees = [],
}: IncentivesManagementProps) => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("daily");

  // Fetch data from Supabase
  const { data: supabaseEmployees, loading: employeesLoading } =
    useSupabaseData("employees");

  const {
    data: supabaseIncentives,
    loading: incentivesLoading,
    error: incentivesError,
    insertRow,
    updateRow,
    deleteRow,
  } = useSupabaseData("incentives");

  const [incentives, setIncentives] = useState<IncentiveData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentIncentive, setCurrentIncentive] =
    useState<IncentiveData | null>(null);
  const [incentiveToDelete, setIncentiveToDelete] = useState<string>("");
  const [dailySoldItems, setDailySoldItems] = useState<number>(0);
  const [dailyDate, setDailyDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  // Convert Supabase employees to local format
  const [localEmployees, setLocalEmployees] =
    useState<EmployeeFormData[]>(employees);

  useEffect(() => {
    if (supabaseEmployees && supabaseEmployees.length > 0) {
      const formattedEmployees = supabaseEmployees.map((emp) => ({
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
      }));
      setLocalEmployees(formattedEmployees);
    }
  }, [supabaseEmployees]);

  // Convert Supabase incentives to component format
  useEffect(() => {
    if (supabaseIncentives && supabaseEmployees) {
      const formattedIncentives = supabaseIncentives.map((inc) => {
        // Find employee name
        const employee = supabaseEmployees.find(
          (emp) => emp.id === inc.employee_id,
        );

        return {
          id: inc.id,
          employeeId: inc.employee_id || "",
          employeeName: employee?.name || "Unknown Employee",
          type: inc.type as "daily" | "monthly" | "yearly",
          amount: Number(inc.amount),
          reason: inc.reason || "",
          date: inc.date,
          status: inc.status as "active" | "inactive",
          soldItems: inc.sold_items,
          distributionDate: inc.distribution_date,
          yearlyDays: inc.yearly_days,
        };
      });
      setIncentives(formattedIncentives);
    } else if (
      !incentivesLoading &&
      supabaseIncentives?.length === 0 &&
      supabaseEmployees?.length > 0
    ) {
      // If no incentives in database and employees exist, add default ones
      addDefaultIncentives();
    }
  }, [supabaseIncentives, supabaseEmployees, incentivesLoading]);

  // Add default incentives if none exist
  const addDefaultIncentives = async () => {
    // No default incentives needed - fresh start
    return;
  };

  const labels = {
    ar: {
      title: "إدارة الحوافز",
      daily: "حوافز يومية",
      monthly: "حوافز شهرية",
      yearly: "حوافز سنوية",
      addIncentive: "إضافة حافز",
      editIncentive: "تعديل حافز",
      employeeId: "رقم الموظف",
      employeeName: "اسم الموظف",
      type: "النوع",
      amount: "المبلغ",
      reason: "السبب",
      date: "التاريخ",
      status: "الحالة",
      active: "نشط",
      inactive: "غير نشط",
      actions: "الإجراءات",
      save: "حفظ",
      cancel: "إلغاء",
      selectEmployee: "اختر موظف",
      selectType: "اختر النوع",
      dailyIncentive: "حافز يومي",
      monthlyIncentive: "حافز شهري",
      yearlyIncentive: "حافز سنوي",
      edit: "تعديل",
      delete: "حذف",
      soldItems: "عدد القطع المباعة",
      calculateDaily: "حساب الحافز اليومي",
      distributionDate: "تاريخ التوزيع",
      day10: "يوم 10",
      day20: "يوم 20",
      yearlyDays: "عدد أيام الحافز السنوي",
      dailyIncentiveDescription:
        "يتم حساب الحافز اليومي: عدد القطع المباعة × 0.50 ÷ عدد الموظفين",
      monthlyIncentiveDescription:
        "يتم توزيع الحافز الشهري على يومي 10 و 20 من كل شهر",
      yearlyIncentiveDescription:
        "يحصل الموظف على 21 يوم من صافي الراتب بعد مرور عام في شهر 3",
      addAllEmployees: "إضافة جميع الموظفين",
      calculateForAll: "حساب للجميع",
      deleteConfirmation: "هل أنت متأكد من حذف هذا الحافز؟",
      deleteDescription: "سيتم حذف بيانات الحافز بشكل نهائي.",
      confirm: "تأكيد",
      incentiveAdded: "تمت إضافة الحافز بنجاح",
      incentiveUpdated: "تم تحديث بيانات الحافز بنجاح",
      incentiveDeleted: "تم حذف الحافز بنجاح",
      loading: "جاري التحميل...",
      error: "حدث خطأ أثناء تحميل البيانات",
    },
    en: {
      title: "Incentives Management",
      daily: "Daily Incentives",
      monthly: "Monthly Incentives",
      yearly: "Yearly Incentives",
      addIncentive: "Add Incentive",
      editIncentive: "Edit Incentive",
      employeeId: "Employee ID",
      employeeName: "Employee Name",
      type: "Type",
      amount: "Amount",
      reason: "Reason",
      date: "Date",
      status: "Status",
      active: "Active",
      inactive: "Inactive",
      actions: "Actions",
      save: "Save",
      cancel: "Cancel",
      selectEmployee: "Select Employee",
      selectType: "Select Type",
      dailyIncentive: "Daily Incentive",
      monthlyIncentive: "Monthly Incentive",
      yearlyIncentive: "Yearly Incentive",
      edit: "Edit",
      delete: "Delete",
      soldItems: "Sold Items",
      calculateDaily: "Calculate Daily Incentive",
      distributionDate: "Distribution Date",
      day10: "Day 10",
      day20: "Day 20",
      yearlyDays: "Yearly Incentive Days",
      dailyIncentiveDescription:
        "Daily incentive calculation: Sold items × 0.50 ÷ Number of employees",
      monthlyIncentiveDescription:
        "Monthly incentives are distributed on the 10th and 20th of each month",
      yearlyIncentiveDescription:
        "Employees receive 21 days of net salary after completing one year in March",
      addAllEmployees: "Add All Employees",
      calculateForAll: "Calculate For All",
      deleteConfirmation: "Are you sure you want to delete this incentive?",
      deleteDescription: "This will permanently delete the incentive data.",
      confirm: "Confirm",
      incentiveAdded: "Incentive added successfully",
      incentiveUpdated: "Incentive updated successfully",
      incentiveDeleted: "Incentive deleted successfully",
      loading: "Loading...",
      error: "Error loading data",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const handleAddIncentive = () => {
    setCurrentIncentive(null);
    setIsAddDialogOpen(true);
  };

  const handleAddAllEmployees = () => {
    // Create incentives for all employees based on the active tab
    if (activeTab === "daily") {
      calculateDailyIncentives();
    } else if (activeTab === "monthly") {
      // For monthly incentives, we'd need to implement the distribution logic
      // This would be handled in the form for individual employees
    } else if (activeTab === "yearly") {
      // For yearly incentives, calculate 21 days of net salary for each employee
      calculateYearlyIncentives();
    }
  };

  const handleEditIncentive = (id: string) => {
    const incentive = incentives.find((inc) => inc.id === id);
    if (incentive) {
      setCurrentIncentive(incentive);
      setIsAddDialogOpen(true);
    }
  };

  const handleDeleteIncentive = (id: string) => {
    setIncentiveToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteIncentive = async () => {
    try {
      // Delete from Supabase
      await deleteRow(incentiveToDelete);

      // Update local state
      setIncentives(incentives.filter((inc) => inc.id !== incentiveToDelete));
      setIsDeleteDialogOpen(false);

      toast({
        title: t.incentiveDeleted,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting incentive:", error);
      toast({
        title: isRTL ? "حدث خطأ أثناء حذف الحافز" : "Error deleting incentive",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSaveIncentive = async (incentiveData: IncentiveData) => {
    try {
      if (currentIncentive) {
        // Edit existing incentive
        await updateRow(incentiveData.id, {
          employee_id: incentiveData.employeeId,
          type: incentiveData.type,
          amount: incentiveData.amount,
          date: incentiveData.date,
          distribution_date: incentiveData.distributionDate,
          status: incentiveData.status,
          reason: incentiveData.reason,
          sold_items: incentiveData.soldItems,
          yearly_days: incentiveData.yearlyDays,
        });

        // Update local state
        setIncentives(
          incentives.map((inc) =>
            inc.id === incentiveData.id ? incentiveData : inc,
          ),
        );

        toast({
          title: t.incentiveUpdated,
          duration: 3000,
        });
      } else {
        // Add new incentive
        const result = await insertRow({
          employee_id: incentiveData.employeeId,
          type: incentiveData.type,
          amount: incentiveData.amount,
          date: incentiveData.date,
          distribution_date: incentiveData.distributionDate,
          status: incentiveData.status,
          reason: incentiveData.reason,
          sold_items: incentiveData.soldItems,
          yearly_days: incentiveData.yearlyDays,
        });

        // Add to local state with the returned ID
        if (result) {
          const newIncentive = {
            ...incentiveData,
            id: result.id,
          };
          setIncentives([...incentives, newIncentive]);
        }

        toast({
          title: t.incentiveAdded,
          duration: 3000,
        });
      }
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error saving incentive:", error);
      toast({
        title: isRTL ? "حدث خطأ أثناء حفظ الحافز" : "Error saving incentive",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Calculate daily incentives for all employees
  const calculateDailyIncentives = async () => {
    if (dailySoldItems <= 0) return;

    // Calculate total incentive amount
    const totalIncentiveAmount = dailySoldItems * 0.5;

    // Calculate per employee amount
    const perEmployeeAmount = totalIncentiveAmount / localEmployees.length;

    // Create incentives for all employees
    for (const employee of localEmployees) {
      try {
        const result = await insertRow({
          employee_id: employee.id,
          type: "daily",
          amount: perEmployeeAmount,
          reason: `حافز مبيعات يومي - ${dailySoldItems} قطعة`,
          date: dailyDate,
          status: "active",
          sold_items: dailySoldItems,
        });

        if (result) {
          const newIncentive = {
            id: result.id,
            employeeId: employee.id,
            employeeName: employee.name,
            type: "daily" as const,
            amount: perEmployeeAmount,
            reason: `حافز مبيعات يومي - ${dailySoldItems} قطعة`,
            date: dailyDate,
            status: "active" as const,
            soldItems: dailySoldItems,
          };
          setIncentives((prev) => [...prev, newIncentive]);
        }
      } catch (error) {
        console.error(
          `Error adding daily incentive for employee ${employee.id}:`,
          error,
        );
      }
    }

    toast({
      title: isRTL
        ? "تم إضافة الحوافز اليومية بنجاح"
        : "Daily incentives added successfully",
      duration: 3000,
    });
  };

  // Calculate yearly incentives for all employees
  const calculateYearlyIncentives = async () => {
    for (const employee of localEmployees) {
      try {
        const yearlyAmount = (employee.netSalary / 30) * 21; // 21 days of net salary
        const result = await insertRow({
          employee_id: employee.id,
          type: "yearly",
          amount: yearlyAmount,
          reason: `حافز سنوي - ${new Date().getFullYear()}`,
          date: `${new Date().getFullYear()}-03-15`, // March 15th of current year
          status: "active",
          yearly_days: 21,
        });

        if (result) {
          const newIncentive = {
            id: result.id,
            employeeId: employee.id,
            employeeName: employee.name,
            type: "yearly" as const,
            amount: yearlyAmount,
            reason: `حافز سنوي - ${new Date().getFullYear()}`,
            date: `${new Date().getFullYear()}-03-15`,
            status: "active" as const,
            yearlyDays: 21,
          };
          setIncentives((prev) => [...prev, newIncentive]);
        }
      } catch (error) {
        console.error(
          `Error adding yearly incentive for employee ${employee.id}:`,
          error,
        );
      }
    }

    toast({
      title: isRTL
        ? "تم إضافة الحوافز السنوية بنجاح"
        : "Yearly incentives added successfully",
      duration: 3000,
    });
  };

  const filteredIncentives = incentives.filter(
    (incentive) => incentive.type === activeTab,
  );

  if (employeesLoading || incentivesLoading) {
    return <div className="p-8 text-center">{t.loading}</div>;
  }

  if (incentivesError) {
    return (
      <div className="p-8 text-center text-red-500">
        {t.error}: {incentivesError.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t.title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddAllEmployees}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t.addAllEmployees}
          </Button>
          <Button onClick={handleAddIncentive}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t.addIncentive}
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="daily"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="daily">{t.daily}</TabsTrigger>
          <TabsTrigger value="monthly">{t.monthly}</TabsTrigger>
          <TabsTrigger value="yearly">{t.yearly}</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6">
          <Card className="mb-4">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                {t.dailyIncentiveDescription}
              </p>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="soldItems">{t.soldItems}</Label>
                  <Input
                    id="soldItems"
                    type="number"
                    placeholder="0"
                    value={dailySoldItems}
                    onChange={(e) =>
                      setDailySoldItems(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="dailyDate">{t.date}</Label>
                  <Input
                    id="dailyDate"
                    type="date"
                    value={dailyDate}
                    onChange={(e) => setDailyDate(e.target.value)}
                  />
                </div>
                <Button onClick={calculateDailyIncentives}>
                  {t.calculateForAll}
                </Button>
              </div>
            </CardContent>
          </Card>
          <IncentivesTable
            incentives={filteredIncentives}
            onEdit={handleEditIncentive}
            onDelete={handleDeleteIncentive}
            labels={t}
          />
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <Card className="mb-4">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                {t.monthlyIncentiveDescription}
              </p>
            </CardContent>
          </Card>
          <IncentivesTable
            incentives={filteredIncentives}
            onEdit={handleEditIncentive}
            onDelete={handleDeleteIncentive}
            labels={t}
          />
        </TabsContent>

        <TabsContent value="yearly" className="mt-6">
          <Card className="mb-4">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                {t.yearlyIncentiveDescription}
              </p>
            </CardContent>
          </Card>
          <IncentivesTable
            incentives={filteredIncentives}
            onEdit={handleEditIncentive}
            onDelete={handleDeleteIncentive}
            labels={t}
          />
        </TabsContent>
      </Tabs>

      {isAddDialogOpen && (
        <AddIncentiveForm
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleSaveIncentive}
          initialData={currentIncentive || undefined}
          employees={localEmployees}
          labels={t}
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
            <AlertDialogAction onClick={confirmDeleteIncentive}>
              {t.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface IncentivesTableProps {
  incentives: IncentiveData[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  labels: any;
}

const IncentivesTable = ({
  incentives,
  onEdit,
  onDelete,
  labels,
}: IncentivesTableProps) => {
  // Add additional columns based on incentive type
  const getAdditionalColumns = (incentive: IncentiveData) => {
    if (incentive.type === "daily" && incentive.soldItems) {
      return (
        <TableCell className="text-right">{incentive.soldItems}</TableCell>
      );
    } else if (incentive.type === "monthly" && incentive.distributionDate) {
      return (
        <TableCell>
          {incentive.distributionDate === "10" ? labels.day10 : labels.day20}
        </TableCell>
      );
    } else if (incentive.type === "yearly" && incentive.yearlyDays) {
      return (
        <TableCell className="text-right">{incentive.yearlyDays}</TableCell>
      );
    }
    return <TableCell></TableCell>;
  };

  // Get additional header based on incentive type
  const getAdditionalHeader = (type: string) => {
    if (type === "daily") {
      return <TableHead className="text-right">{labels.soldItems}</TableHead>;
    } else if (type === "monthly") {
      return <TableHead>{labels.distributionDate}</TableHead>;
    } else if (type === "yearly") {
      return <TableHead className="text-right">{labels.yearlyDays}</TableHead>;
    }
    return <TableHead></TableHead>;
  };

  return (
    <Card>
      <CardContent className="p-6">
        {incentives.length > 0 ? (
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{labels.employeeName}</TableHead>
                  <TableHead className="text-right">{labels.amount}</TableHead>
                  <TableHead>{labels.reason}</TableHead>
                  <TableHead>{labels.date}</TableHead>
                  {incentives.length > 0 &&
                    getAdditionalHeader(incentives[0].type)}
                  <TableHead>{labels.status}</TableHead>
                  <TableHead className="text-right">{labels.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incentives.map((incentive) => (
                  <TableRow key={incentive.id}>
                    <TableCell>{incentive.employeeName}</TableCell>
                    <TableCell className="text-right">
                      {incentive.amount.toFixed(2)} ج.م
                    </TableCell>
                    <TableCell>{incentive.reason}</TableCell>
                    <TableCell>{incentive.date}</TableCell>
                    {getAdditionalColumns(incentive)}
                    <TableCell>
                      {incentive.status === "active"
                        ? labels.active
                        : labels.inactive}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(incentive.id)}
                          title={labels.edit}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(incentive.id)}
                          title={labels.delete}
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
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No incentives found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface AddIncentiveFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (incentive: IncentiveData) => void;
  initialData?: Partial<IncentiveData>;
  employees: EmployeeFormData[];
  labels: any;
}

const AddIncentiveForm = ({
  open,
  onClose,
  onSave,
  initialData,
  employees,
  labels,
}: AddIncentiveFormProps) => {
  const [formData, setFormData] = useState<IncentiveData>({
    id: initialData?.id || "",
    employeeId: initialData?.employeeId || "",
    employeeName: initialData?.employeeName || "",
    type: initialData?.type || "daily",
    amount: initialData?.amount || 0,
    reason: initialData?.reason || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    status: initialData?.status || "active",
    soldItems: initialData?.soldItems || 0,
    distributionDate: initialData?.distributionDate || "10",
    yearlyDays: initialData?.yearlyDays || 21,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number = value;

    if (name === "amount") {
      newValue = parseFloat(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "employeeId") {
      const selectedEmployee = employees.find((emp) => emp.id === value);
      setFormData((prev) => ({
        ...prev,
        employeeId: value,
        employeeName: selectedEmployee ? selectedEmployee.name : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? labels.editIncentive : labels.addIncentive}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">{labels.employeeId}</Label>
            <Select
              value={formData.employeeId}
              onValueChange={(value) => handleSelectChange("employeeId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={labels.selectEmployee} />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} ({employee.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">{labels.type}</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                handleSelectChange("type", value as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={labels.selectType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{labels.dailyIncentive}</SelectItem>
                <SelectItem value="monthly">
                  {labels.monthlyIncentive}
                </SelectItem>
                <SelectItem value="yearly">{labels.yearlyIncentive}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === "daily" ? (
            <div className="space-y-2">
              <Label htmlFor="soldItems">{labels.soldItems}</Label>
              <Input
                id="soldItems"
                name="soldItems"
                type="number"
                value={formData.soldItems}
                onChange={(e) => {
                  const soldItems = parseInt(e.target.value) || 0;
                  // Calculate amount based on sold items
                  const amount = (soldItems * 0.5) / employees.length;
                  setFormData((prev) => ({
                    ...prev,
                    soldItems,
                    amount,
                  }));
                }}
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="amount">{labels.amount}</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {formData.type === "monthly" && (
            <div className="space-y-2">
              <Label htmlFor="distributionDate">
                {labels.distributionDate}
              </Label>
              <Select
                value={formData.distributionDate}
                onValueChange={(value) =>
                  handleSelectChange("distributionDate", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">{labels.day10}</SelectItem>
                  <SelectItem value="20">{labels.day20}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.type === "yearly" && (
            <div className="space-y-2">
              <Label htmlFor="yearlyDays">{labels.yearlyDays}</Label>
              <Input
                id="yearlyDays"
                name="yearlyDays"
                type="number"
                value={formData.yearlyDays}
                onChange={(e) => {
                  const yearlyDays = parseInt(e.target.value) || 21;
                  setFormData((prev) => ({
                    ...prev,
                    yearlyDays,
                  }));
                }}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">{labels.reason}</Label>
            <Input
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">{labels.date}</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{labels.status}</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                handleSelectChange("status", value as any)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{labels.active}</SelectItem>
                <SelectItem value="inactive">{labels.inactive}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {labels.cancel}
            </Button>
            <Button type="submit">{labels.save}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IncentivesManagement;
