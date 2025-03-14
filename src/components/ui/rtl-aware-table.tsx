import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RTLAwareTableProps {
  children: React.ReactNode;
  className?: string;
}

export function RTLAwareTable({
  children,
  className = "",
}: RTLAwareTableProps) {
  const { isRTL } = useLanguage();

  return (
    <div
      className={`rtl-aware-table-container ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Table className={className}>{children}</Table>
    </div>
  );
}

export function RTLAwareTableHeader({
  children,
  className = "",
}: RTLAwareTableProps) {
  return (
    <TableHeader className={`rtl-aware-table-header ${className}`}>
      {children}
    </TableHeader>
  );
}

export function RTLAwareTableBody({
  children,
  className = "",
}: RTLAwareTableProps) {
  return (
    <TableBody className={`rtl-aware-table-body ${className}`}>
      {children}
    </TableBody>
  );
}

interface RTLAwareTableCellProps extends RTLAwareTableProps {
  align?: "left" | "right" | "center";
}

export function RTLAwareTableCell({
  children,
  className = "",
  align = "left",
}: RTLAwareTableCellProps) {
  const { isRTL } = useLanguage();

  // Flip alignment for RTL
  let textAlign = align;
  if (isRTL && align === "left") textAlign = "right";
  else if (isRTL && align === "right") textAlign = "left";

  return (
    <TableCell
      className={`rtl-aware-table-cell text-${textAlign} ${className}`}
    >
      {children}
    </TableCell>
  );
}

export function RTLAwareTableHead({
  children,
  className = "",
  align = "left",
}: RTLAwareTableCellProps) {
  const { isRTL } = useLanguage();

  // Flip alignment for RTL
  let textAlign = align;
  if (isRTL && align === "left") textAlign = "right";
  else if (isRTL && align === "right") textAlign = "left";

  return (
    <TableHead
      className={`rtl-aware-table-head text-${textAlign} ${className}`}
    >
      {children}
    </TableHead>
  );
}
