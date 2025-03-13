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
import { PlusCircle, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { useToast } from "@/components/ui/use-toast";
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

interface AdvancesListProps {}

const AdvancesList = ({}: AdvancesListProps) => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const {
    data: supabaseAdvances,
    loading,
    error,
    insertRow,
    updateRow,
    deleteRow,
  } = useSupabaseData("advances");
  const { data: supabaseEmployees } = useSupabaseData("employees");

  const [advances, setAdvances] = useState<AdvanceData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAdvance, setCurrentAdvance] = useState<AdvanceData | null>(
    null,
  );
  const [advanceToDelete, setAdvanceToDelete] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Convert Supabase advances to AdvanceData
  useEffect(() => {
    if (supabaseAdvances && supabaseEmployees) {
      console.log(
        "Converting Supabase advances to AdvanceData:",
        supabaseAdvances,
      );
      const formattedAdvances = supabaseAdvances.map((adv) => {
        // Find employee name
        const employee = supabaseEmployees.find(
          (emp) => emp.id === adv.employee_id,
        );

        // Calculate remaining amount - use the stored value if available, otherwise use the full amount
        const remainingAmount =
          adv.remaining_amount !== null && adv.remaining_amount !== undefined
            ? Number(adv.remaining_amount)
            : Number(adv.amount);

        console.log(`Advance ${adv.id} remaining amount calculation:`, {
          stored_remaining_amount: adv.remaining_amount,
          amount: adv.amount,
          calculated_remaining: remainingAmount,
          is_deducted: adv.is_deducted,
        });

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
          isDeducted: adv.is_deducted || false,
          deductionDate: adv.deduction_date || undefined,
          remainingAmount: remainingAmount,
          payrollId: adv.payroll_id || undefined,
        };
      });
      setAdvances(formattedAdvances);
    }
  }, [supabaseAdvances, supabaseEmployees]);

  const labels = {
    ar: {
      title: "إدارة السلف",
      addAdvance: "إضافة سلفة",
      id: "رقم السلفة",
      employeeId: "رقم الموظف",
      employeeName: "اسم الموظف",
      amount: "المبلغ",
      requestDate: "تاريخ الطلب",
      expectedPaymentDate: "تاريخ السداد",
      status: "الحالة",
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
      approve: "موافقة",
      reject: "رفض",
      markAsPaid: "تم الدفع",
      deleteConfirmation: "هل أنت متأكد من حذف هذه السلفة؟",
      deleteDescription: "سيتم حذف بيانات السلفة بشكل نهائي.",
      cancel: "إلغاء",
      confirm: "تأكيد",
      loading: "جاري التحميل...",
      error: "حدث خطأ أثناء تحميل البيانات",
      advanceAdded: "تمت إضافة السلفة بنجاح",
      advanceUpdated: "تم تحديث بيانات السلفة بنجاح",
      advanceDeleted: "تم حذف السلفة بنجاح",
      statusUpdated: "تم تحديث حالة السلفة بنجاح",
      remainingAmount: "المبلغ المتبقي",
      isDeducted: "تم الخصم",
      deductionDate: "تاريخ الخصم",
      yes: "نعم",
      no: "لا",
    },
    en: {
      title: "Advances Management",
      addAdvance: "Add Advance",
      id: "Advance ID",
      employeeId: "Employee ID",
      employeeName: "Employee Name",
      amount: "Amount",
      requestDate: "Request Date",
      expectedPaymentDate: "Payment Date",
      status: "Status",
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
      approve: "Approve",
      reject: "Reject",
      markAsPaid: "Mark as Paid",
      deleteConfirmation: "Are you sure you want to delete this advance?",
      deleteDescription: "This will permanently delete the advance data.",
      cancel: "Cancel",
      confirm: "Confirm",
      loading: "Loading...",
      error: "Error loading data",
      advanceAdded: "Advance added successfully",
      advanceUpdated: "Advance updated successfully",
      advanceDeleted: "Advance deleted successfully",
      statusUpdated: "Advance status updated successfully",
      remainingAmount: "Remaining Amount",
      isDeducted: "Deducted",
      deductionDate: "Deduction Date",
      yes: "Yes",
      no: "No",
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
      await deleteRow(advanceToDelete);
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
          approved_by: advanceData.approvedBy || null,
          payment_date: advanceData.paymentDate || null,
          notes: advanceData.notes || null,
          is_deducted: advanceData.isDeducted || false,
          deduction_date: advanceData.deductionDate || null,
          remaining_amount: advanceData.remainingAmount || advanceData.amount,
          payroll_id: advanceData.payrollId || null,
        });
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
          status: "pending", // New advances are always pending
        });
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

  const handleUpdateStatus = async (
    id: string,
    status: AdvanceData["status"],
  ) => {
    try {
      const updates: any = { status };

      // If approving, set approved_by
      if (status === "approved") {
        updates.approved_by = "HR Manager"; // In a real app, this would be the current user
      }

      // If marking as paid, set payment_date
      if (status === "paid") {
        updates.payment_date = new Date().toISOString().split("T")[0];
      }

      await updateRow(id, updates);

      toast({
        title: t.statusUpdated,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating advance status:", error);
      toast({
        title: isRTL
          ? "حدث خطأ أثناء تحديث حالة السلفة"
          : "Error updating advance status",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const filteredAdvances = advances.filter(
    (advance) =>
      advance.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advance.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      advance.amount.toString().includes(searchTerm),
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
        <Button onClick={handleAddAdvance}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t.addAdvance}
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
              <TableHead>{t.employeeName}</TableHead>
              <TableHead className="text-right">{t.amount}</TableHead>
              <TableHead className="text-right">{t.remainingAmount}</TableHead>
              <TableHead>{t.requestDate}</TableHead>
              {/* Expected payment date column removed */}
              <TableHead>{t.status}</TableHead>
              <TableHead>{t.isDeducted}</TableHead>
              <TableHead className="text-right">{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdvances.map((advance) => (
              <TableRow key={advance.id}>
                <TableCell>{advance.id.toString().substring(0, 8)}</TableCell>
                <TableCell>{advance.employeeName}</TableCell>
                <TableCell className="text-right">
                  {advance.amount} ج.م
                </TableCell>
                <TableCell className="text-right">
                  {advance.remainingAmount !== undefined &&
                  advance.remainingAmount !== null
                    ? advance.remainingAmount
                    : advance.amount}{" "}
                  ج.م
                </TableCell>
                <TableCell>{advance.requestDate}</TableCell>
                {/* Expected payment date cell removed */}
                <TableCell>{getStatusBadge(advance.status)}</TableCell>
                <TableCell>{advance.isDeducted ? t.yes : t.no}</TableCell>
                <TableCell className="text-right">
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

                    {advance.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleUpdateStatus(advance.id, "approved")
                          }
                          title={t.approve}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleUpdateStatus(advance.id, "rejected")
                          }
                          title={t.reject}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}

                    {advance.status === "approved" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUpdateStatus(advance.id, "paid")}
                        title={t.markAsPaid}
                      >
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isAddDialogOpen && (
        <AddAdvanceForm
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleSaveAdvance}
          initialData={currentAdvance || undefined}
          employees={supabaseEmployees || []}
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
