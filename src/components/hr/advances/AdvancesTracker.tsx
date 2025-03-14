import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { Tables } from "@/types/supabase";
import { supabase } from "@/lib/supabase";

interface AdvancesTrackerProps {
  employeeId?: string;
}

interface AdvanceSummary {
  employeeId: string;
  employeeName: string;
  newAdvances: number; // السلف الجديدة
  previousAdvances: number; // السلف السابقة
  currentAdvances: number; // السلف الحالية (السابقة + الجديدة)
  remainingAdvances: number; // السلف المتبقية بعد خصمها من الراتب
  deductedAdvances: number; // السلف التي تم خصمها
}

const AdvancesTracker = ({ employeeId }: AdvancesTrackerProps) => {
  const { isRTL } = useLanguage();
  const [advanceSummaries, setAdvanceSummaries] = useState<AdvanceSummary[]>(
    [],
  );

  // Fetch data from Supabase
  const { data: employees } = useSupabaseData("employees");
  const { data: advances } = useSupabaseData("advances");
  const { data: settings } = useSupabaseData("settings");

  useEffect(() => {
    if (employees && advances && settings) {
      console.log("Recalculating advance summaries with advances:", advances);
      console.log("Advances data timestamp:", new Date().toISOString());
      console.log("Number of advances:", advances.length);

      // Log detailed information about each advance to help with debugging
      advances.forEach((adv) => {
        console.log(`Advance ${adv.id} details:`, {
          employee_id: adv.employee_id,
          amount: adv.amount,
          is_deducted: adv.is_deducted,
          remaining_amount: adv.remaining_amount,
          status: adv.status,
        });
      });

      // Calculate advance summaries for each employee
      const summaries = employees
        .filter((emp) => !employeeId || emp.id === employeeId)
        .map((employee) => {
          // Get all advances for this employee
          const employeeAdvances = advances.filter(
            (adv) => adv.employee_id === employee.id,
          );

          console.log(
            `Advances for employee ${employee.id}:`,
            employeeAdvances,
          );

          // Calculate new advances (approved but not deducted at all)
          const newAdvances = employeeAdvances
            .filter(
              (adv) =>
                (adv.status === "approved" || adv.status === "paid") &&
                adv.is_deducted === false &&
                adv.created_at &&
                new Date(adv.created_at).getTime() >
                  Date.now() - 30 * 24 * 60 * 60 * 1000, // Only advances from last 30 days
            )
            .reduce((sum, adv) => sum + Number(adv.amount), 0);

          console.log(
            `New advances for employee ${employee.id}:`,
            employeeAdvances.filter(
              (adv) =>
                (adv.status === "approved" || adv.status === "paid") &&
                adv.is_deducted === false,
            ),
          );

          // Calculate previous advances (already deducted but still have remaining amount)
          const previousAdvances = employeeAdvances
            .filter(
              (adv) =>
                adv.is_deducted === true &&
                adv.remaining_amount !== undefined &&
                adv.remaining_amount !== null &&
                Number(adv.remaining_amount) > 0,
            )
            .reduce((sum, adv) => sum + Number(adv.remaining_amount || 0), 0);

          console.log(
            `Previous advances for employee ${employee.id}:`,
            employeeAdvances.filter(
              (adv) =>
                adv.is_deducted === true &&
                adv.remaining_amount !== undefined &&
                adv.remaining_amount !== null &&
                Number(adv.remaining_amount) > 0,
            ),
          );

          // Calculate current advances (sum of new and previous)
          const currentAdvances = newAdvances + previousAdvances;

          // Calculate deducted advances (total amount that has been deducted)
          const deductedAdvances = employeeAdvances
            .filter((adv) => adv.is_deducted === true)
            .reduce((sum, adv) => {
              // Calculate how much was deducted (original amount - remaining amount)
              const originalAmount = Number(adv.amount || 0);
              const remainingAmount = Number(adv.remaining_amount || 0);
              const deductedAmount = originalAmount - remainingAmount;
              return sum + deductedAmount;
            }, 0);

          // Calculate remaining advances (after deduction from salary)
          // Only count advances that are not fully deducted (remaining amount > 0)
          const remainingAdvancesFiltered = employeeAdvances.filter(
            (adv) =>
              // Include non-deducted advances
              (adv.is_deducted === false &&
                (adv.status === "approved" || adv.status === "paid")) ||
              // Include partially deducted advances with remaining amount
              (adv.is_deducted === true &&
                adv.remaining_amount !== undefined &&
                adv.remaining_amount !== null &&
                Number(adv.remaining_amount) > 0),
          );

          console.log(
            `Remaining advances filtered for employee ${employee.id}:`,
            remainingAdvancesFiltered,
          );

          const remainingAdvances = remainingAdvancesFiltered.reduce(
            (sum, adv) => {
              // Use remaining amount for deducted advances, otherwise use full amount
              const amountToAdd =
                adv.is_deducted === true &&
                adv.remaining_amount !== undefined &&
                adv.remaining_amount !== null
                  ? Number(adv.remaining_amount || 0)
                  : Number(adv.amount || 0);
              console.log(`Adding to remaining amount for advance ${adv.id}:`, {
                is_deducted: adv.is_deducted,
                remaining_amount: adv.remaining_amount,
                amount: adv.amount,
                amountToAdd,
              });
              return sum + amountToAdd;
            },
            0,
          );

          console.log(`Summary for employee ${employee.id}:`, {
            newAdvances,
            previousAdvances,
            currentAdvances,
            remainingAdvances,
            deductedAdvances,
          });

          return {
            employeeId: employee.id,
            employeeName: employee.name,
            newAdvances,
            previousAdvances,
            currentAdvances,
            remainingAdvances,
            deductedAdvances,
          };
        });

      setAdvanceSummaries(summaries);
    }
  }, [employees, advances, settings, employeeId]);

  // Force an immediate refresh of advances data when component mounts
  useEffect(() => {
    const refreshAdvancesData = async () => {
      try {
        console.log("Forcing initial refresh of advances data");
        const { data, error } = await supabase.from("advances").select("*");
        if (error) {
          console.error("Error refreshing advances data:", error);
        } else {
          console.log(
            "Successfully refreshed advances data:",
            data?.length || 0,
            "records",
          );

          // Log detailed information about each advance
          data?.forEach((adv) => {
            console.log(`Initial load - Advance ${adv.id} details:`, {
              employee_id: adv.employee_id,
              amount: adv.amount,
              is_deducted: adv.is_deducted,
              remaining_amount: adv.remaining_amount,
              status: adv.status,
            });
          });
        }
      } catch (err) {
        console.error("Exception refreshing advances data:", err);
      }
    };

    refreshAdvancesData();

    // Set up a timer to refresh the data every few seconds
    const timer = setTimeout(() => {
      refreshAdvancesData();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Force a re-render every 3 seconds to ensure we have the latest data
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Forcing re-render of AdvancesTracker");
      // Force a refresh of advances data
      const refreshAdvancesData = async () => {
        try {
          console.log("Refreshing advances data from interval");
          const { data, error } = await supabase.from("advances").select("*");
          if (error) {
            console.error("Error refreshing advances data:", error);
          } else {
            console.log(
              "Successfully refreshed advances data:",
              data?.length || 0,
              "records",
            );

            // Process the data and update the summaries directly
            if (data && employees) {
              const formattedAdvances = data.map((adv) => {
                const employee = employees.find(
                  (emp) => emp.id === adv.employee_id,
                );

                const remainingAmount =
                  adv.remaining_amount !== null &&
                  adv.remaining_amount !== undefined
                    ? Number(adv.remaining_amount)
                    : Number(adv.amount);

                return {
                  id: adv.id,
                  employeeId: adv.employee_id || "",
                  employeeName: employee?.name || "Unknown Employee",
                  amount: Number(adv.amount),
                  requestDate: adv.request_date,
                  expectedPaymentDate: adv.expected_payment_date,
                  status: adv.status as
                    | "pending"
                    | "approved"
                    | "rejected"
                    | "paid",
                  approvedBy: adv.approved_by || undefined,
                  paymentDate: adv.payment_date || undefined,
                  notes: adv.notes || undefined,
                  isDeducted: adv.is_deducted || false,
                  deductionDate: adv.deduction_date || undefined,
                  remainingAmount: remainingAmount,
                  payrollId: adv.payroll_id || undefined,
                };
              });

              // Recalculate summaries based on the fresh data
              const summaries = employees
                .filter((emp) => !employeeId || emp.id === employeeId)
                .map((employee) => {
                  const employeeAdvances = formattedAdvances.filter(
                    (adv) => adv.employeeId === employee.id,
                  );

                  const newAdvances = employeeAdvances
                    .filter(
                      (adv) =>
                        (adv.status === "approved" || adv.status === "paid") &&
                        adv.isDeducted === false &&
                        adv.created_at &&
                        new Date(adv.created_at).getTime() >
                          Date.now() - 30 * 24 * 60 * 60 * 1000,
                    )
                    .reduce((sum, adv) => sum + Number(adv.amount), 0);

                  const previousAdvances = employeeAdvances
                    .filter(
                      (adv) =>
                        adv.isDeducted === true &&
                        adv.remainingAmount !== undefined &&
                        adv.remainingAmount !== null &&
                        Number(adv.remainingAmount) > 0,
                    )
                    .reduce(
                      (sum, adv) => sum + Number(adv.remainingAmount || 0),
                      0,
                    );

                  const currentAdvances = newAdvances + previousAdvances;

                  const deductedAdvances = employeeAdvances
                    .filter((adv) => adv.isDeducted === true)
                    .reduce((sum, adv) => {
                      const originalAmount = Number(adv.amount || 0);
                      const remainingAmount = Number(adv.remainingAmount || 0);
                      const deductedAmount = originalAmount - remainingAmount;
                      return sum + deductedAmount;
                    }, 0);

                  const remainingAdvancesFiltered = employeeAdvances.filter(
                    (adv) =>
                      (adv.isDeducted === false &&
                        (adv.status === "approved" || adv.status === "paid")) ||
                      (adv.isDeducted === true &&
                        adv.remainingAmount !== undefined &&
                        adv.remainingAmount !== null &&
                        Number(adv.remainingAmount) > 0),
                  );

                  const remainingAdvances = remainingAdvancesFiltered.reduce(
                    (sum, adv) => {
                      const amountToAdd =
                        adv.isDeducted === true &&
                        adv.remainingAmount !== undefined &&
                        adv.remainingAmount !== null
                          ? Number(adv.remainingAmount || 0)
                          : Number(adv.amount || 0);
                      return sum + amountToAdd;
                    },
                    0,
                  );

                  return {
                    employeeId: employee.id,
                    employeeName: employee.name,
                    newAdvances,
                    previousAdvances,
                    currentAdvances,
                    remainingAdvances,
                    deductedAdvances,
                  };
                });

              // Update the state with the new summaries
              setAdvanceSummaries(summaries);
            } else {
              // If no data, just force a re-render
              setAdvanceSummaries((prev) => [...prev]);
            }
          }
        } catch (err) {
          console.error("Exception refreshing advances data:", err);
        }
      };
      refreshAdvancesData();
    }, 3000); // Reduced to 3 seconds for more frequent updates

    return () => clearInterval(interval);
  }, [employees, employeeId]);

  const labels = {
    ar: {
      title: "تتبع السلف",
      employeeName: "اسم الموظف",
      newAdvances: "السلف الجديدة",
      previousAdvances: "السلف السابقة",
      currentAdvances: "السلف الحالية",
      remainingAdvances: "السلف المتبقية بعد الخصم",
      deductedAdvances: "السلف المخصومة",
      noData: "لا توجد بيانات للعرض",
    },
    en: {
      title: "Advances Tracker",
      employeeName: "Employee Name",
      newAdvances: "New Advances",
      previousAdvances: "Previous Advances",
      currentAdvances: "Current Advances",
      remainingAdvances: "Remaining Advances After Deduction",
      deductedAdvances: "Deducted Advances",
      noData: "No data to display",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t.title}</h3>

      {advanceSummaries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {advanceSummaries.map((summary) => (
            <Card key={summary.employeeId} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {summary.employeeName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      {t.newAdvances}
                    </div>
                    <div
                      className="text-xl font-bold mt-1"
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {isRTL ? (
                        <>{summary.newAdvances.toFixed(2)} ج.م</>
                      ) : (
                        <>{summary.newAdvances.toFixed(2)} ج.م</>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      {t.previousAdvances}
                    </div>
                    <div
                      className="text-xl font-bold mt-1"
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {isRTL ? (
                        <>{summary.previousAdvances.toFixed(2)} ج.م</>
                      ) : (
                        <>{summary.previousAdvances.toFixed(2)} ج.م</>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      {t.currentAdvances}
                    </div>
                    <div
                      className="text-xl font-bold mt-1"
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {isRTL ? (
                        <>{summary.currentAdvances.toFixed(2)} ج.م</>
                      ) : (
                        <>{summary.currentAdvances.toFixed(2)} ج.م</>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      {t.deductedAdvances}
                    </div>
                    <div
                      className="text-xl font-bold mt-1"
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {isRTL ? (
                        <>{summary.deductedAdvances.toFixed(2)} ج.م</>
                      ) : (
                        <>{summary.deductedAdvances.toFixed(2)} ج.م</>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg col-span-2">
                    <div className="text-sm text-muted-foreground">
                      {t.remainingAdvances}
                    </div>
                    <div
                      className="text-xl font-bold mt-1"
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {isRTL ? (
                        <>{summary.remainingAdvances.toFixed(2)} ج.م</>
                      ) : (
                        <>{summary.remainingAdvances.toFixed(2)} ج.م</>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            {t.noData}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancesTracker;
