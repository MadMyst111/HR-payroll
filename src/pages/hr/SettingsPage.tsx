import React, { useState, useEffect } from "react";
import HRLayout from "@/components/layout/HRLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupabase } from "@/contexts/SupabaseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Save, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FormulaSettings {
  dailyRateFormula: string;
  dailyRateWithIncentiveFormula: string;
  overtimeRateFormula: string;
  absenceDeductionsFormula: string;
  penaltiesFormula: string;
  netSalaryFormula: string;
  totalSalaryWithIncentiveFormula: string;
  maxAdvanceLimitFormula: string;
}

interface GeneralSettings {
  companyName: string;
  companyLogo: string;
  currency: string;
  workingDaysPerMonth: number;
  workingHoursPerDay: number;
  enableRTL: boolean;
  defaultLanguage: "ar" | "en";
}

const SettingsPage = () => {
  const { isRTL, language, toggleLanguage } = useLanguage();
  const { toast } = useToast();
  const {
    settings: dbSettings,
    loading: settingsLoading,
    updateSettings,
  } = useSupabase();
  const [activeTab, setActiveTab] = useState("general");

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    companyName: "",
    companyLogo: "",
    currency: "ج.م",
    workingDaysPerMonth: 26,
    workingHoursPerDay: 8,
    enableRTL: isRTL,
    defaultLanguage: isRTL ? "ar" : "en",
  });

  const [formulaSettings, setFormulaSettings] = useState<FormulaSettings>({
    dailyRateFormula: "baseSalary / workingDaysPerMonth",
    dailyRateWithIncentiveFormula:
      "(baseSalary + monthlyIncentives) / workingDaysPerMonth",
    overtimeRateFormula:
      "(baseSalary / (workingDaysPerMonth * workingHoursPerDay)) * 1.5",
    absenceDeductionsFormula: "absenceDays * dailyRate",
    penaltiesFormula: "penaltyDays * dailyRate",
    netSalaryFormula:
      "baseSalary + bonus + overtimeAmount - (purchases + advances + absenceDeductions + penalties)",
    totalSalaryWithIncentiveFormula: "baseSalary + monthlyIncentives",
    maxAdvanceLimitFormula: "baseSalary * 3",
  });

  // Load settings from Supabase on component mount
  useEffect(() => {
    if (dbSettings && !settingsLoading) {
      setGeneralSettings({
        companyName: dbSettings.company_name || "",
        companyLogo: dbSettings.company_logo || "",
        currency: dbSettings.currency || "ج.م",
        workingDaysPerMonth: dbSettings.working_days_per_month || 26,
        workingHoursPerDay: dbSettings.working_hours_per_day || 8,
        enableRTL:
          dbSettings.enable_rtl !== undefined ? dbSettings.enable_rtl : isRTL,
        defaultLanguage:
          (dbSettings.default_language as "ar" | "en") || (isRTL ? "ar" : "en"),
      });

      setFormulaSettings({
        dailyRateFormula:
          dbSettings.daily_rate_formula || "baseSalary / workingDaysPerMonth",
        dailyRateWithIncentiveFormula:
          dbSettings.daily_rate_with_incentive_formula ||
          "(baseSalary + monthlyIncentives) / workingDaysPerMonth",
        overtimeRateFormula:
          dbSettings.overtime_rate_formula ||
          "(baseSalary / (workingDaysPerMonth * workingHoursPerDay)) * 1.5",
        absenceDeductionsFormula:
          dbSettings.absence_deductions_formula || "absenceDays * dailyRate",
        penaltiesFormula:
          dbSettings.penalties_formula || "penaltyDays * dailyRate",
        netSalaryFormula:
          dbSettings.net_salary_formula ||
          "baseSalary + bonus + overtimeAmount - (purchases + advances + absenceDeductions + penalties)",
        totalSalaryWithIncentiveFormula:
          dbSettings.total_salary_with_incentive_formula ||
          "baseSalary + monthlyIncentives",
        maxAdvanceLimitFormula:
          dbSettings.max_advance_limit_formula || "baseSalary * 3",
      });
    }
  }, [dbSettings, settingsLoading]);

  const labels = {
    ar: {
      title: "الإعدادات",
      general: "إعدادات عامة",
      formulas: "الصيغ الحسابية",
      appearance: "المظهر",
      save: "حفظ التغييرات",
      reset: "إعادة تعيين",
      companyName: "اسم الشركة",
      companyLogo: "شعار الشركة",
      currency: "العملة",
      workingDaysPerMonth: "أيام العمل في الشهر",
      workingHoursPerDay: "ساعات العمل في اليوم",
      enableRTL: "تمكين الاتجاه من اليمين إلى اليسار",
      defaultLanguage: "اللغة الافتراضية",
      arabic: "العربية",
      english: "الإنجليزية",
      dailyRateFormula: "صيغة معدل اليوم",
      dailyRateWithIncentiveFormula: "صيغة معدل اليوم مع الحوافز",
      overtimeRateFormula: "صيغة معدل العمل الإضافي",
      absenceDeductionsFormula: "صيغة خصومات الغياب",
      penaltiesFormula: "صيغة الجزاءات",
      netSalaryFormula: "صيغة صافي الراتب",
      totalSalaryWithIncentiveFormula: "صيغة إجمالي الراتب مع الحوافز",
      maxAdvanceLimitFormula: "صيغة الحد الأقصى للسلف",
      formulaVariables: "المتغيرات المتاحة",
      formulaVariablesDescription:
        "يمكنك استخدام المتغيرات التالية في الصيغ الحسابية:",
      savedSuccessfully: "تم حفظ الإعدادات بنجاح",
      resetSuccessfully: "تم إعادة تعيين الإعدادات بنجاح",
      themeSettings: "إعدادات السمة",
      darkMode: "الوضع الداكن",
      lightMode: "الوضع الفاتح",
      systemMode: "وضع النظام",
      primaryColor: "اللون الأساسي",
      secondaryColor: "اللون الثانوي",
      accentColor: "لون التمييز",
      savingError: "حدث خطأ أثناء حفظ الإعدادات",
    },
    en: {
      title: "Settings",
      general: "General Settings",
      formulas: "Calculation Formulas",
      appearance: "Appearance",
      save: "Save Changes",
      reset: "Reset",
      companyName: "Company Name",
      companyLogo: "Company Logo",
      currency: "Currency",
      workingDaysPerMonth: "Working Days Per Month",
      workingHoursPerDay: "Working Hours Per Day",
      enableRTL: "Enable Right-to-Left",
      defaultLanguage: "Default Language",
      arabic: "Arabic",
      english: "English",
      dailyRateFormula: "Daily Rate Formula",
      dailyRateWithIncentiveFormula: "Daily Rate with Incentive Formula",
      overtimeRateFormula: "Overtime Rate Formula",
      absenceDeductionsFormula: "Absence Deductions Formula",
      penaltiesFormula: "Penalties Formula",
      netSalaryFormula: "Net Salary Formula",
      totalSalaryWithIncentiveFormula: "Total Salary with Incentive Formula",
      maxAdvanceLimitFormula: "Max Advance Limit Formula",
      formulaVariables: "Available Variables",
      formulaVariablesDescription:
        "You can use the following variables in your formulas:",
      savedSuccessfully: "Settings saved successfully",
      resetSuccessfully: "Settings reset successfully",
      themeSettings: "Theme Settings",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      systemMode: "System Mode",
      primaryColor: "Primary Color",
      secondaryColor: "Secondary Color",
      accentColor: "Accent Color",
      savingError: "Error saving settings",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  const handleGeneralSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value, type } = e.target;
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleFormulaSettingsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormulaSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleRTL = () => {
    setGeneralSettings((prev) => ({
      ...prev,
      enableRTL: !prev.enableRTL,
      defaultLanguage: !prev.enableRTL ? "ar" : "en",
    }));
    toggleLanguage();
  };

  const handleSaveSettings = async () => {
    try {
      // Save settings to Supabase
      await updateSettings({
        company_name: generalSettings.companyName,
        company_logo: generalSettings.companyLogo,
        currency: generalSettings.currency,
        working_days_per_month: generalSettings.workingDaysPerMonth,
        working_hours_per_day: generalSettings.workingHoursPerDay,
        enable_rtl: generalSettings.enableRTL,
        default_language: generalSettings.defaultLanguage,
        daily_rate_formula: formulaSettings.dailyRateFormula,
        daily_rate_with_incentive_formula:
          formulaSettings.dailyRateWithIncentiveFormula,
        overtime_rate_formula: formulaSettings.overtimeRateFormula,
        absence_deductions_formula: formulaSettings.absenceDeductionsFormula,
        penalties_formula: formulaSettings.penaltiesFormula,
        net_salary_formula: formulaSettings.netSalaryFormula,
        total_salary_with_incentive_formula:
          formulaSettings.totalSalaryWithIncentiveFormula,
        max_advance_limit_formula: formulaSettings.maxAdvanceLimitFormula,
      });

      // Apply RTL setting immediately
      if (generalSettings.enableRTL !== isRTL) {
        toggleLanguage();
      }

      toast({
        title: t.savedSuccessfully,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: t.savingError,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleResetSettings = () => {
    setGeneralSettings({
      companyName: "",
      companyLogo: "",
      currency: "ج.م",
      workingDaysPerMonth: 26,
      workingHoursPerDay: 8,
      enableRTL: isRTL,
      defaultLanguage: isRTL ? "ar" : "en",
    });

    setFormulaSettings({
      dailyRateFormula: "baseSalary / workingDaysPerMonth",
      dailyRateWithIncentiveFormula:
        "(baseSalary + monthlyIncentives) / workingDaysPerMonth",
      overtimeRateFormula:
        "(baseSalary / (workingDaysPerMonth * workingHoursPerDay)) * 1.5",
      absenceDeductionsFormula: "absenceDays * dailyRate",
      penaltiesFormula: "penaltyDays * dailyRate",
      netSalaryFormula:
        "baseSalary + bonus + overtimeAmount - (purchases + advances + absenceDeductions + penalties)",
      totalSalaryWithIncentiveFormula: "baseSalary + monthlyIncentives",
      maxAdvanceLimitFormula: "baseSalary * 3",
    });

    toast({
      title: t.resetSuccessfully,
      duration: 3000,
    });
  };

  return (
    <HRLayout activeNavItem="/settings">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">{t.title}</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetSettings}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t.reset}
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              {t.save}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="general">{t.general}</TabsTrigger>
            <TabsTrigger value="formulas">{t.formulas}</TabsTrigger>
            <TabsTrigger value="appearance">{t.appearance}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.general}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">{t.companyName}</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={generalSettings.companyName}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyLogo">{t.companyLogo}</Label>
                    <Input
                      id="companyLogo"
                      name="companyLogo"
                      type="file"
                      accept="image/*"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">{t.currency}</Label>
                    <Input
                      id="currency"
                      name="currency"
                      value={generalSettings.currency}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingDaysPerMonth">
                      {t.workingDaysPerMonth}
                    </Label>
                    <Input
                      id="workingDaysPerMonth"
                      name="workingDaysPerMonth"
                      type="number"
                      value={generalSettings.workingDaysPerMonth}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingHoursPerDay">
                      {t.workingHoursPerDay}
                    </Label>
                    <Input
                      id="workingHoursPerDay"
                      name="workingHoursPerDay"
                      type="number"
                      value={generalSettings.workingHoursPerDay}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableRTL">{t.enableRTL}</Label>
                    <Switch
                      id="enableRTL"
                      checked={generalSettings.enableRTL}
                      onCheckedChange={handleToggleRTL}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="defaultLanguage">{t.defaultLanguage}</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={
                          generalSettings.defaultLanguage === "ar"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setGeneralSettings((prev) => ({
                            ...prev,
                            defaultLanguage: "ar",
                          }))
                        }
                      >
                        {t.arabic}
                      </Button>
                      <Button
                        variant={
                          generalSettings.defaultLanguage === "en"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setGeneralSettings((prev) => ({
                            ...prev,
                            defaultLanguage: "en",
                          }))
                        }
                      >
                        {t.english}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.formulas}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">{t.formulaVariables}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t.formulaVariablesDescription}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div>baseSalary</div>
                    <div>monthlyIncentives</div>
                    <div>bonus</div>
                    <div>overtimeAmount</div>
                    <div>overtimeRate</div>
                    <div>overtimeHours</div>
                    <div>purchases</div>
                    <div>advances</div>
                    <div>absenceDays</div>
                    <div>absenceDeductions</div>
                    <div>penaltyDays</div>
                    <div>penalties</div>
                    <div>dailyRate</div>
                    <div>dailyRateWithIncentive</div>
                    <div>workingDaysPerMonth</div>
                    <div>workingHoursPerDay</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyRateFormula">
                      {t.dailyRateFormula}
                    </Label>
                    <Textarea
                      id="dailyRateFormula"
                      name="dailyRateFormula"
                      value={formulaSettings.dailyRateFormula}
                      onChange={handleFormulaSettingsChange}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dailyRateWithIncentiveFormula">
                      {t.dailyRateWithIncentiveFormula}
                    </Label>
                    <Textarea
                      id="dailyRateWithIncentiveFormula"
                      name="dailyRateWithIncentiveFormula"
                      value={formulaSettings.dailyRateWithIncentiveFormula}
                      onChange={handleFormulaSettingsChange}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overtimeRateFormula">
                      {t.overtimeRateFormula}
                    </Label>
                    <Textarea
                      id="overtimeRateFormula"
                      name="overtimeRateFormula"
                      value={formulaSettings.overtimeRateFormula}
                      onChange={handleFormulaSettingsChange}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="absenceDeductionsFormula">
                      {t.absenceDeductionsFormula}
                    </Label>
                    <Textarea
                      id="absenceDeductionsFormula"
                      name="absenceDeductionsFormula"
                      value={formulaSettings.absenceDeductionsFormula}
                      onChange={handleFormulaSettingsChange}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="penaltiesFormula">
                      {t.penaltiesFormula}
                    </Label>
                    <Textarea
                      id="penaltiesFormula"
                      name="penaltiesFormula"
                      value={formulaSettings.penaltiesFormula}
                      onChange={handleFormulaSettingsChange}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="netSalaryFormula">
                      {t.netSalaryFormula}
                    </Label>
                    <Textarea
                      id="netSalaryFormula"
                      name="netSalaryFormula"
                      value={formulaSettings.netSalaryFormula}
                      onChange={handleFormulaSettingsChange}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalSalaryWithIncentiveFormula">
                      {t.totalSalaryWithIncentiveFormula}
                    </Label>
                    <Textarea
                      id="totalSalaryWithIncentiveFormula"
                      name="totalSalaryWithIncentiveFormula"
                      value={formulaSettings.totalSalaryWithIncentiveFormula}
                      onChange={handleFormulaSettingsChange}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxAdvanceLimitFormula">
                      {t.maxAdvanceLimitFormula}
                    </Label>
                    <Textarea
                      id="maxAdvanceLimitFormula"
                      name="maxAdvanceLimitFormula"
                      value={formulaSettings.maxAdvanceLimitFormula}
                      onChange={handleFormulaSettingsChange}
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.themeSettings}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">{t.primaryColor}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        name="primaryColor"
                        type="color"
                        value="#1e40af"
                        className="w-12 h-10 p-1"
                      />
                      <Input value="#1e40af" className="flex-1" readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">{t.secondaryColor}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        name="secondaryColor"
                        type="color"
                        value="#64748b"
                        className="w-12 h-10 p-1"
                      />
                      <Input value="#64748b" className="flex-1" readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accentColor">{t.accentColor}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        name="accentColor"
                        type="color"
                        value="#0ea5e9"
                        className="w-12 h-10 p-1"
                      />
                      <Input value="#0ea5e9" className="flex-1" readOnly />
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>{t.darkMode}</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        {t.lightMode}
                      </Button>
                      <Button variant="outline" size="sm">
                        {t.darkMode}
                      </Button>
                      <Button variant="default" size="sm">
                        {t.systemMode}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HRLayout>
  );
};

export default SettingsPage;
