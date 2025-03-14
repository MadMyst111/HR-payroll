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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { EmployeeFormData } from "../employees/AddEmployeeForm";

export interface AdvanceData {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  requestDate: string;
  expectedPaymentDate: string;
  status: "pending" | "approved" | "rejected" | "paid";
  approvedBy?: string;
  paymentDate?: string;
  notes?: string;
  isDeducted?: boolean;
  deductionDate?: string;
  remainingAmount?: number;
  payrollId?: string;
}

interface AddAdvanceFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (advance: AdvanceData) => void;
  initialData?: Partial<AdvanceData>;
  employees: EmployeeFormData[];
}

const AddAdvanceForm = ({
  open,
  onClose,
  onSave,
  initialData,
  employees,
}: AddAdvanceFormProps) => {
  const { isRTL } = useLanguage();
  const [formData, setFormData] = useState<AdvanceData>({
    id: initialData?.id || `ADV-${new Date().getTime().toString().slice(-6)}`,
    employeeId: initialData?.employeeId || "",
    employeeName: initialData?.employeeName || "",
    amount: initialData?.amount || 0,
    requestDate:
      initialData?.requestDate || new Date().toISOString().split("T")[0],
    expectedPaymentDate:
      initialData?.expectedPaymentDate ||
      new Date().toISOString().split("T")[0],
    status: initialData?.status || "pending",
    approvedBy: initialData?.approvedBy || "",
    paymentDate: initialData?.paymentDate || "",
    notes: initialData?.notes || "",
    isDeducted: initialData?.isDeducted || false,
    deductionDate: initialData?.deductionDate || "",
    remainingAmount: initialData?.remainingAmount || initialData?.amount || 0,
    payrollId: initialData?.payrollId || "",
  });

  const labels = {
    ar: {
      title: initialData?.id ? "تعديل سلفة" : "إضافة سلفة جديدة",
      advanceId: "رقم السلفة",
      employee: "الموظف",
      amount: "المبلغ",
      requestDate: "تاريخ الطلب",
      expectedPaymentDate: "تاريخ السداد",
      status: "الحالة",
      approvedBy: "تمت الموافقة من قبل",
      paymentDate: "تاريخ الدفع",
      notes: "ملاحظات",
      save: "حفظ",
      cancel: "إلغاء",
      selectEmployee: "اختر موظف",
      statusOptions: {
        pending: "قيد الانتظار",
        approved: "تمت الموافقة",
        rejected: "مرفوض",
        paid: "تم الدفع",
      },
      isDeducted: "تم الخصم",
      deductionDate: "تاريخ الخصم",
      remainingAmount: "المبلغ المتبقي",
      payrollId: "رقم كشف الراتب",
      yes: "نعم",
      no: "لا",
    },
    en: {
      title: initialData?.id ? "Edit Advance" : "Add New Advance",
      advanceId: "Advance ID",
      employee: "Employee",
      amount: "Amount",
      requestDate: "Request Date",
      expectedPaymentDate: "Payment Date",
      status: "Status",
      approvedBy: "Approved By",
      paymentDate: "Payment Date",
      notes: "Notes",
      save: "Save",
      cancel: "Cancel",
      selectEmployee: "Select Employee",
      statusOptions: {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        paid: "Paid",
      },
      isDeducted: "Deducted",
      deductionDate: "Deduction Date",
      remainingAmount: "Remaining Amount",
      payrollId: "Payroll ID",
      yes: "Yes",
      no: "No",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number | boolean = value;

    // Convert numeric fields to numbers
    if (name === "amount" || name === "remainingAmount") {
      newValue = parseFloat(value) || 0;

      // If changing amount and it's a new advance, also update remainingAmount
      if (name === "amount" && !initialData?.id) {
        setFormData((prev) => ({
          ...prev,
          remainingAmount: parseFloat(value) || 0,
        }));
      }
    }

    // Handle checkbox for isDeducted
    if (name === "isDeducted") {
      newValue = (e.target as HTMLInputElement).checked;
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

    // Check if employee has remaining advance limit
    const employee = employees.find((emp) => emp.id === formData.employeeId);
    if (employee) {
      // Calculate max advance limit (3 months of base salary)
      const maxAdvanceLimit = employee.baseSalary * 3;

      // Calculate current total advances for this employee
      const currentAdvances = employee.advances;

      // Check if this advance would exceed the limit
      if (currentAdvances + formData.amount > maxAdvanceLimit) {
        // You could show an alert here, but for simplicity we'll just adjust the amount
        const remainingLimit = maxAdvanceLimit - currentAdvances;
        if (remainingLimit > 0) {
          // Adjust the amount to the remaining limit
          const adjustedFormData = {
            ...formData,
            amount: remainingLimit,
            remainingAmount: remainingLimit,
          };
          onSave(adjustedFormData);
        } else {
          // No remaining limit, show an alert or handle as needed
          alert(
            isRTL
              ? "لا يمكن إضافة سلفة جديدة. تم تجاوز الحد الأقصى للسلف."
              : "Cannot add new advance. Maximum advance limit exceeded.",
          );
        }
      } else {
        // Within limits, proceed normally
        onSave(formData);
      }
    } else {
      // Employee not found, proceed normally
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="space-y-2">
            <Label
              htmlFor="id"
              className={isRTL ? "text-right block w-full" : ""}
            >
              {t.advanceId}
            </Label>
            <Input
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              readOnly
              className={`bg-gray-100 ${isRTL ? "text-right" : ""}`}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="employeeId"
              className={isRTL ? "text-right block w-full" : ""}
            >
              {t.employee}
            </Label>
            <Select
              value={formData.employeeId}
              onValueChange={(value) => handleSelectChange("employeeId", value)}
            >
              <SelectTrigger className={isRTL ? "text-right" : ""}>
                <SelectValue placeholder={t.selectEmployee} />
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
            <Label htmlFor="amount">{t.amount}</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          {initialData?.id && (
            <div className="space-y-2">
              <Label htmlFor="remainingAmount">{t.remainingAmount}</Label>
              <Input
                id="remainingAmount"
                name="remainingAmount"
                type="number"
                value={formData.remainingAmount}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="requestDate">{t.requestDate}</Label>
            <Input
              id="requestDate"
              name="requestDate"
              type="date"
              value={formData.requestDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Expected payment date field removed as requested */}

          <div className="space-y-2">
            <Label htmlFor="status">{t.status}</Label>
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
                <SelectItem value="pending">
                  {t.statusOptions.pending}
                </SelectItem>
                <SelectItem value="approved">
                  {t.statusOptions.approved}
                </SelectItem>
                <SelectItem value="rejected">
                  {t.statusOptions.rejected}
                </SelectItem>
                <SelectItem value="paid">{t.statusOptions.paid}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.status === "approved" || formData.status === "paid") && (
            <div className="space-y-2">
              <Label htmlFor="approvedBy">{t.approvedBy}</Label>
              <Input
                id="approvedBy"
                name="approvedBy"
                value={formData.approvedBy}
                onChange={handleChange}
              />
            </div>
          )}

          {formData.status === "paid" && (
            <div className="space-y-2">
              <Label htmlFor="paymentDate">{t.paymentDate}</Label>
              <Input
                id="paymentDate"
                name="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={handleChange}
              />
            </div>
          )}

          {initialData?.id && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="isDeducted" className="flex-grow">
                {t.isDeducted}
              </Label>
              <input
                id="isDeducted"
                name="isDeducted"
                type="checkbox"
                checked={formData.isDeducted}
                onChange={handleChange}
                className="h-4 w-4"
              />
            </div>
          )}

          {formData.isDeducted && (
            <div className="space-y-2">
              <Label htmlFor="deductionDate">{t.deductionDate}</Label>
              <Input
                id="deductionDate"
                name="deductionDate"
                type="date"
                value={formData.deductionDate}
                onChange={handleChange}
              />
            </div>
          )}

          {formData.isDeducted && (
            <div className="space-y-2">
              <Label htmlFor="payrollId">{t.payrollId}</Label>
              <Input
                id="payrollId"
                name="payrollId"
                value={formData.payrollId}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">{t.notes}</Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
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

export default AddAdvanceForm;
