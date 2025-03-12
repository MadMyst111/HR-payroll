import React, { useState } from "react";
import HRLayout from "@/components/layout/HRLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttendanceTracker from "@/components/hr/timemanagement/AttendanceTracker";
import LeaveManagement from "@/components/hr/timemanagement/LeaveManagement";
import { useLanguage } from "@/contexts/LanguageContext";

const TimeManagementPage = () => {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("attendance");

  const labels = {
    ar: {
      title: "إدارة الوقت والإجازات",
      attendance: "الحضور والغياب",
      leave: "الإجازات",
    },
    en: {
      title: "Time & Leave Management",
      attendance: "Attendance",
      leave: "Leave",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  return (
    <HRLayout activeNavItem="/time">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t.title}</h1>

        <Tabs
          defaultValue="attendance"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="attendance">{t.attendance}</TabsTrigger>
            <TabsTrigger value="leave">{t.leave}</TabsTrigger>
          </TabsList>
          <TabsContent value="attendance" className="mt-6">
            <AttendanceTracker />
          </TabsContent>
          <TabsContent value="leave" className="mt-6">
            <LeaveManagement />
          </TabsContent>
        </Tabs>
      </div>
    </HRLayout>
  );
};

export default TimeManagementPage;
