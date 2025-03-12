import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

export interface EmployeeFormData {
  id: string;
  name: string;
  position: string;
  department: string;
  joinDate: string;
  baseSalary: number;
  monthlyIncentives: number;
  dailyRate: number;
  dailyRateWithIncentive: number;
  overtimeRate: number;
  overtimeHours: number;
  bonus: number;
  overtimeAmount: number;
  purchases: number;
  advances: number;
  absenceDays: number;
  absenceDeductions: number;
  penaltyDays: number;
  penalties: number;
  netSalary: number;
  totalSalaryWithIncentive: number;
}

interface AddEmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (employee: EmployeeFormData) => void;
  initialData?: Partial<EmployeeFormData>;
}

const AddEmployeeForm = ({
  open,
  onClose,
  onSave,
  initialData,
}: AddEmployeeFormProps) => {
  const { isRTL } = useLanguage();
  const [formData, setFormData] = useState<EmployeeFormData>({
    id: initialData?.id || "",
    name: initialData?.name || "",
    position: initialData?.position || "",
    department: initialData?.department || "",
    joinDate: initialData?.joinDate || new Date().toISOString().split("T")[0],
    baseSalary: initialData?.baseSalary || 0,
    monthlyIncentives: initialData?.monthlyIncentives || 0,
    // Default values for other fields that will be used in salary calculations
    dailyRate: initialData?.dailyRate || 0,
    dailyRateWithIncentive: initialData?.dailyRateWithIncentive || 0,
    overtimeRate: initialData?.overtimeRate || 0,
    overtimeHours: initialData?.overtimeHours || 0,
    bonus: initialData?.bonus || 0,
    overtimeAmount: initialData?.overtimeAmount || 0,
    purchases: initialData?.purchases || 0,
    advances: initialData?.advances || 0,
    absenceDays: initialData?.absenceDays || 0,
    absenceDeductions: initialData?.absenceDeductions || 0,
    penaltyDays: initialData?.penaltyDays || 0,
    penalties: initialData?.penalties || 0,
    netSalary: initialData?.netSalary || 0,
    totalSalaryWithIncentive: initialData?.totalSalaryWithIncentive || 0,
  });

  const labels = {
    ar: {
      title: initialData?.id ? "تعديل موظف" : "إضافة موظف جديد",
      employeeId: "كود الموظف",
      name: "اسم الموظف",
      position: "الوظيفة",
      department: "القسم",
      joinDate: "تاريخ التعيين",
      baseSalary: "الراتب الأساسي",
      monthlyIncentives: "الحوافز الشهرية",
      save: "حفظ",
      cancel: "إلغاء",
      basicInfo: "المعلومات الأساسية",
    },
    en: {
      title: initialData?.id ? "Edit Employee" : "Add New Employee",
      employeeId: "Employee ID",
      name: "Employee Name",
      position: "Position",
      department: "Department",
      joinDate: "Join Date",
      baseSalary: "Base Salary",
      monthlyIncentives: "Monthly Incentives",
      save: "Save",
      cancel: "Cancel",
      basicInfo: "Basic Information",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number = value;

    // Convert numeric fields to numbers
    if (["baseSalary", "monthlyIncentives"].includes(name)) {
      newValue = parseFloat(value) || 0;
    }

    setFormData((prev) => {
      const updatedData = { ...prev, [name]: newValue };

      // Calculate totalSalaryWithIncentive when baseSalary or monthlyIncentives change
      if (["baseSalary", "monthlyIncentives"].includes(name)) {
        updatedData.totalSalaryWithIncentive =
          updatedData.baseSalary + updatedData.monthlyIncentives;
      }

      return updatedData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">{t.employeeId}</Label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{t.name}</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">{t.position}</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseSalary">{t.baseSalary}</Label>
                <Input
                  id="baseSalary"
                  name="baseSalary"
                  type="number"
                  value={formData.baseSalary}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyIncentives">{t.monthlyIncentives}</Label>
                <Input
                  id="monthlyIncentives"
                  name="monthlyIncentives"
                  type="number"
                  value={formData.monthlyIncentives}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">{t.joinDate}</Label>
                <Input
                  id="joinDate"
                  name="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button type="submit">{t.save}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeForm;
