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

export interface AttendanceData {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "present" | "absent" | "late" | "on_leave";
  notes?: string;
}

interface AttendanceFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AttendanceData) => void;
  initialData?: AttendanceData;
  employees: EmployeeFormData[];
}

const AttendanceForm = ({
  open,
  onClose,
  onSave,
  initialData,
  employees,
}: AttendanceFormProps) => {
  const { isRTL } = useLanguage();
  const [formData, setFormData] = React.useState<AttendanceData>(
    initialData || {
      id: "",
      employeeId: "",
      employeeName: "",
      date: new Date().toISOString().split("T")[0],
      checkIn: "",
      checkOut: "",
      status: "present",
      notes: "",
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
        date: new Date().toISOString().split("T")[0],
        checkIn: "",
        checkOut: "",
        status: "present",
        notes: "",
      });
    }
  }, [initialData, employees]);

  const labels = {
    ar: {
      title: initialData ? "تعديل سجل الحضور" : "إضافة سجل حضور",
      description: initialData
        ? "تعديل بيانات سجل الحضور"
        : "إضافة سجل حضور جديد",
      employeeName: "اسم الموظف",
      date: "التاريخ",
      checkIn: "وقت الحضور",
      checkOut: "وقت الانصراف",
      status: "الحالة",
      present: "حاضر",
      absent: "غائب",
      late: "متأخر",
      onLeave: "في إجازة",
      notes: "ملاحظات",
      save: "حفظ",
      cancel: "إلغاء",
    },
    en: {
      title: initialData ? "Edit Attendance Record" : "Add Attendance Record",
      description: initialData
        ? "Edit attendance record details"
        : "Add a new attendance record",
      employeeName: "Employee Name",
      date: "Date",
      checkIn: "Check In Time",
      checkOut: "Check Out Time",
      status: "Status",
      present: "Present",
      absent: "Absent",
      late: "Late",
      onLeave: "On Leave",
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
              <Label htmlFor="date" className="text-right">
                {t.date}
              </Label>
              <div className="col-span-3">
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                {t.status}
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleSelectChange("status", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">{t.present}</SelectItem>
                    <SelectItem value="absent">{t.absent}</SelectItem>
                    <SelectItem value="late">{t.late}</SelectItem>
                    <SelectItem value="on_leave">{t.onLeave}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(formData.status === "present" || formData.status === "late") && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="checkIn" className="text-right">
                    {t.checkIn}
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="checkIn"
                      name="checkIn"
                      type="time"
                      value={formData.checkIn || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="checkOut" className="text-right">
                    {t.checkOut}
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="checkOut"
                      name="checkOut"
                      type="time"
                      value={formData.checkOut || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

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
                  rows={3}
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

export default AttendanceForm;
