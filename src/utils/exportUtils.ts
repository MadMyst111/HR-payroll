/**
 * Utility functions for exporting data to various formats
 */

/**
 * Convert data to CSV format and trigger download
 * @param data Array of objects to export
 * @param filename Filename for the downloaded file
 * @param headers Optional custom headers (uses object keys if not provided)
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: string[],
) {
  if (!data || !data.length) {
    console.warn("No data to export");
    return;
  }

  // Use provided headers or extract from first data item
  const columnHeaders = headers || Object.keys(data[0]);

  // Create CSV header row
  let csvContent = columnHeaders.join(",") + "\n";

  // Add data rows
  data.forEach((item) => {
    const row = columnHeaders
      .map((header) => {
        // Get the field value, handle nested properties
        const fieldPath = header.split(".");
        let value = item;
        for (const path of fieldPath) {
          value = value?.[path];
          if (value === undefined || value === null) break;
        }

        // Format the value for CSV
        const cellValue =
          value === undefined || value === null ? "" : String(value);

        // Escape quotes and wrap in quotes if contains comma, newline or quote
        if (
          cellValue.includes(",") ||
          cellValue.includes("\n") ||
          cellValue.includes('"')
        ) {
          return `"${cellValue.replace(/"/g, '""')}"`;
        }
        return cellValue;
      })
      .join(",");

    csvContent += row + "\n";
  });

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Convert data to Excel format and trigger download
 * Requires SheetJS or similar library for full Excel support
 * This is a simplified version that creates an XLSX-compatible CSV
 * @param data Array of objects to export
 * @param filename Filename for the downloaded file
 * @param sheetName Name of the Excel sheet
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  sheetName = "Sheet1",
) {
  // For now, we'll use CSV as a fallback
  // In a production app, you would integrate with SheetJS or similar
  exportToCSV(data, filename);

  // TODO: Implement proper Excel export with a library like SheetJS
  console.info(
    "For full Excel export functionality, integrate with SheetJS or similar library",
  );
}

/**
 * Generate a PDF report from data
 * This is a placeholder - actual implementation would use a PDF library
 * @param data Data to include in the PDF
 * @param filename Filename for the downloaded file
 * @param template Optional template configuration
 */
export function exportToPDF<T>(data: T[], filename: string, template?: any) {
  console.info(
    "PDF export requires a PDF generation library like jsPDF or pdfmake",
  );

  // TODO: Implement with a PDF library
  alert("PDF export would be implemented with a library like jsPDF or pdfmake");
}

/**
 * Format date for export
 * @param date Date to format
 * @param format Format string
 */
export function formatDateForExport(
  date: Date | string,
  format = "YYYY-MM-DD",
) {
  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return "";
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return format
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day);
}
