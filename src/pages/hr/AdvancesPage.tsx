import React, { useState } from "react";
import HRLayout from "@/components/layout/HRLayout";
import AdvancesList from "@/components/hr/advances/AdvancesList.supabase";
import AdvancesTracker from "@/components/hr/advances/AdvancesTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

const AdvancesPage = () => {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("advances-list");

  const labels = {
    ar: {
      advancesList: "قائمة السلف",
      advancesTracker: "تتبع السلف",
    },
    en: {
      advancesList: "Advances List",
      advancesTracker: "Advances Tracker",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  return (
    <HRLayout activeNavItem="/advances">
      <Tabs
        defaultValue="advances-list"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="advances-list">{t.advancesList}</TabsTrigger>
          <TabsTrigger value="advances-tracker">
            {t.advancesTracker}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="advances-list" className="mt-6">
          <AdvancesList />
        </TabsContent>

        <TabsContent value="advances-tracker" className="mt-6">
          <AdvancesTracker />
        </TabsContent>
      </Tabs>
    </HRLayout>
  );
};

export default AdvancesPage;
