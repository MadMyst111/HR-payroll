import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmployeeFormData } from "../employees/AddEmployeeForm";

export interface LeaveRequestData {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  notes?: string;
}

interface LeaveRequestFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: LeaveRequestData) => void;
  initialData?: LeaveRequestData;
  employees: EmployeeFormData[];
}

const LeaveRequestForm = ({
  open,
  onClose,
  onSave,
  initialData,
  employees,
}: LeaveRequestFormProps) => {
  const { isRTL } = useLanguage();
  const [formData, setFormData] = React.useState<LeaveRequestData>(
    initialData || {
      id: "",
      employeeId: "",
      employeeName: "",
      leaveType: "annual",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      totalDays: 1,
      reason: "",
      status: "pending",
    },
  );

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: "",
        employeeId: employees.length > 0 ? employees[0].id : "",
        employeeName: employees.length > 0 ? employees[0].name : "",
        leaveType: "annual",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        totalDays: 1,
        reason: "",
        status: "pending",
      });
    }
  }, [initialData, employees]);

  const labels = {
    ar: {
      title: initialData ? "تعديل طلب إجازة" : "إضافة طلب إجازة",
      description: initialData
        ? "تعديل بيانات طلب الإجازة"
        : "إضافة طلب إجازة جديد",
      employeeName: "اسم الموظف",
      leaveType: "نوع الإجازة",
      annual: "سنوية",
      sick: "مرضية",
      personal: "شخصية",
      unpaid: "بدون راتب",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      totalDays: "عدد الأيام",
      reason: "سبب الإجازة",
      status: "الحالة",
      pending: "قيد الانتظار",
      approved: "تمت الموافقة",
      rejected: "مرفوض",
      approvedBy: "تمت الموافقة من قبل",
      notes: "ملاحظات",
      save: "حفظ",
      cancel: "إلغاء",
    },
    en: {
      title: initialData ? "Edit Leave Request" : "Add Leave Request",
      description: initialData
        ? "Edit leave request details"
        : "Add a new leave request",
      employeeName: "Employee Name",
      leaveType: "Leave Type",
      annual: "Annual",
      sick: "Sick",
      personal: "Personal",
      unpaid: "Unpaid",
      startDate: "Start Date",
      endDate: "End Date",
      totalDays: "Total Days",
      reason: "Reason",
      status: "Status",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      approvedBy: "Approved By",
      notes: "Notes",
      save: "Save",
      cancel: "Cancel",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "employeeId") {
      const employee = employees.find((emp) => emp.id === value);
      setFormData({
        ...formData,
        employeeId: value,
        employeeName: employee ? employee.name : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateTotalDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      setFormData({ ...formData, totalDays: diffDays });
    }
  };

  React.useEffect(() => {
    calculateTotalDays();
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeId" className="text-right">
                {t.employeeName}
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) =>
                    handleSelectChange("employeeId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.employeeName} />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="leaveType" className="text-right">
                {t.leaveType}
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.leaveType}
                  onValueChange={(value) =>
                    handleSelectChange("leaveType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.leaveType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">{t.annual}</SelectItem>
                    <SelectItem value="sick">{t.sick}</SelectItem>
                    <SelectItem value="personal">{t.personal}</SelectItem>
                    <SelectItem value="unpaid">{t.unpaid}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                {t.startDate}
              </Label>
              <div className="col-span-3">
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                {t.endDate}
              </Label>
              <div className="col-span-3">
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalDays" className="text-right">
                {t.totalDays}
              </Label>
              <div className="col-span-3">
                <Input
                  id="totalDays"
                  name="totalDays"
                  type="number"
                  value={formData.totalDays}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                {t.reason}
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>

            {initialData && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  {t.status}
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{t.pending}</SelectItem>
                      <SelectItem value="approved">{t.approved}</SelectItem>
                      <SelectItem value="rejected">{t.rejected}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {initialData && formData.status === "approved" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="approvedBy" className="text-right">
                  {t.approvedBy}
                </Label>
                <div className="col-span-3">
                  <Input
                    id="approvedBy"
                    name="approvedBy"
                    value={formData.approvedBy || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {initialData && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  {t.notes}
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes || ""}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>
              </div>
            )}
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

export default LeaveRequestForm;
