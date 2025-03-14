import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { exportToCSV, exportToExcel, exportToPDF } from "@/utils/exportUtils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Download, Save } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface ReportField {
  key: string;
  label: string;
  include: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  fields: ReportField[];
  filters: Record<string, any>;
}

interface ReportGeneratorProps<T> {
  data: T[];
  fields: ReportField[];
  title: string;
  description?: string;
  isRTL?: boolean;
  onGenerate?: (report: any) => void;
}

export function ReportGenerator<T>({
  data,
  fields: initialFields,
  title,
  description,
  isRTL = false,
  onGenerate,
}: ReportGeneratorProps<T>) {
  const [fields, setFields] = useState<ReportField[]>(initialFields);
  const [reportName, setReportName] = useState("");
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">(
    "excel",
  );
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState<
    "daily" | "weekly" | "monthly"
  >("monthly");

  // Load saved templates from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("reportTemplates");
    if (saved) {
      try {
        setTemplates(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading report templates:", e);
      }
    }
  }, []);

  // Toggle field inclusion
  const toggleField = (key: string) => {
    setFields(
      fields.map((field) =>
        field.key === key ? { ...field, include: !field.include } : field,
      ),
    );
  };

  // Save current report as template
  const saveTemplate = () => {
    if (!reportName.trim()) return;

    const newTemplate: ReportTemplate = {
      id: Date.now().toString(),
      name: reportName,
      fields: [...fields],
      filters: { dateRange },
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem("reportTemplates", JSON.stringify(updatedTemplates));

    // Reset form
    setReportName("");
  };

  // Load a template
  const loadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setFields(template.fields);
      setDateRange(
        template.filters.dateRange || { from: undefined, to: undefined },
      );
      setReportName(template.name);
    }
  };

  // Generate the report
  const generateReport = () => {
    // Filter data based on date range if specified
    let filteredData = [...data];

    // Only include selected fields
    const includedFields = fields.filter((f) => f.include).map((f) => f.key);

    // Map data to only include selected fields
    const reportData = filteredData.map((item) => {
      const result: Record<string, any> = {};
      includedFields.forEach((field) => {
        result[field] = (item as any)[field];
      });
      return result;
    });

    // Export based on selected format
    const filename = reportName || title;
    if (exportFormat === "csv") {
      exportToCSV(reportData, filename);
    } else if (exportFormat === "excel") {
      exportToExcel(reportData, filename);
    } else if (exportFormat === "pdf") {
      exportToPDF(reportData, filename);
    }

    // Call onGenerate callback if provided
    if (onGenerate) {
      onGenerate({
        name: reportName,
        data: reportData,
        fields: includedFields,
        dateRange,
        format: exportFormat,
      });
    }
  };

  const labels = {
    ar: {
      reportGenerator: "منشئ التقارير",
      selectFields: "اختر الحقول",
      reportName: "اسم التقرير",
      dateRange: "نطاق التاريخ",
      from: "من",
      to: "إلى",
      exportFormat: "تنسيق التصدير",
      templates: "القوالب المحفوظة",
      selectTemplate: "اختر قالب",
      saveAsTemplate: "حفظ كقالب",
      generate: "إنشاء التقرير",
      scheduleReport: "جدولة التقرير",
      frequency: "التكرار",
      daily: "يومي",
      weekly: "أسبوعي",
      monthly: "شهري",
      pickDate: "اختر تاريخ",
    },
    en: {
      reportGenerator: "Report Generator",
      selectFields: "Select Fields",
      reportName: "Report Name",
      dateRange: "Date Range",
      from: "From",
      to: "To",
      exportFormat: "Export Format",
      templates: "Saved Templates",
      selectTemplate: "Select Template",
      saveAsTemplate: "Save as Template",
      generate: "Generate Report",
      scheduleReport: "Schedule Report",
      frequency: "Frequency",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      pickDate: "Pick a date",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Name */}
        <div className="space-y-2">
          <Label htmlFor="reportName">{t.reportName}</Label>
          <Input
            id="reportName"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder={isRTL ? "أدخل اسم التقرير" : "Enter report name"}
          />
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>{t.dateRange}</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateFrom" className="text-xs">
                {t.from}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      format(dateRange.from, "PPP", {
                        locale: isRTL ? ar : undefined,
                      })
                    ) : (
                      <span>{t.pickDate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) =>
                      setDateRange({ ...dateRange, from: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="dateTo" className="text-xs">
                {t.to}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? (
                      format(dateRange.to, "PPP", {
                        locale: isRTL ? ar : undefined,
                      })
                    ) : (
                      <span>{t.pickDate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) =>
                      setDateRange({ ...dateRange, to: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Export Format */}
        <div className="space-y-2">
          <Label htmlFor="exportFormat">{t.exportFormat}</Label>
          <Select
            value={exportFormat}
            onValueChange={(value: any) => setExportFormat(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Field Selection */}
        <div className="space-y-2">
          <Label>{t.selectFields}</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((field) => (
              <div key={field.key} className="flex items-center space-x-2">
                <Checkbox
                  id={`field-${field.key}`}
                  checked={field.include}
                  onCheckedChange={() => toggleField(field.key)}
                />
                <Label htmlFor={`field-${field.key}`}>{field.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        {templates.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="template">{t.templates}</Label>
            <Select
              value={selectedTemplate}
              onValueChange={(value) => {
                setSelectedTemplate(value);
                loadTemplate(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.selectTemplate} />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Schedule Report */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="schedule"
              checked={isScheduled}
              onCheckedChange={(checked) => setIsScheduled(checked === true)}
            />
            <Label htmlFor="schedule">{t.scheduleReport}</Label>
          </div>

          {isScheduled && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="frequency">{t.frequency}</Label>
              <Select
                value={scheduleFrequency}
                onValueChange={(value: any) => setScheduleFrequency(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t.daily}</SelectItem>
                  <SelectItem value="weekly">{t.weekly}</SelectItem>
                  <SelectItem value="monthly">{t.monthly}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={saveTemplate}>
          <Save className="mr-2 h-4 w-4" />
          {t.saveAsTemplate}
        </Button>
        <Button onClick={generateReport}>
          <Download className="mr-2 h-4 w-4" />
          {t.generate}
        </Button>
      </CardFooter>
    </Card>
  );
}
