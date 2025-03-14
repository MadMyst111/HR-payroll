import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RTLAwareDialogProps {
  children: React.ReactNode;
  className?: string;
}

interface RTLAwareDialogRootProps extends RTLAwareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RTLAwareDialog({
  children,
  open,
  onOpenChange,
  className = "",
}: RTLAwareDialogRootProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}

export function RTLAwareDialogContent({
  children,
  className = "",
}: RTLAwareDialogProps) {
  const { isRTL } = useLanguage();

  return (
    <DialogContent
      className={`rtl-aware-dialog-content ${isRTL ? "rtl" : "ltr"} ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {children}
    </DialogContent>
  );
}

export function RTLAwareDialogHeader({
  children,
  className = "",
}: RTLAwareDialogProps) {
  const { isRTL } = useLanguage();

  return (
    <DialogHeader
      className={`rtl-aware-dialog-header ${isRTL ? "text-right" : "text-left"} ${className}`}
    >
      {children}
    </DialogHeader>
  );
}

export function RTLAwareDialogFooter({
  children,
  className = "",
}: RTLAwareDialogProps) {
  const { isRTL } = useLanguage();

  return (
    <DialogFooter
      className={`rtl-aware-dialog-footer ${isRTL ? "flex-row-reverse" : "flex-row"} ${className}`}
    >
      {children}
    </DialogFooter>
  );
}

export function RTLAwareDialogTitle({
  children,
  className = "",
}: RTLAwareDialogProps) {
  return (
    <DialogTitle className={`rtl-aware-dialog-title ${className}`}>
      {children}
    </DialogTitle>
  );
}

export function RTLAwareDialogDescription({
  children,
  className = "",
}: RTLAwareDialogProps) {
  return (
    <DialogDescription className={`rtl-aware-dialog-description ${className}`}>
      {children}
    </DialogDescription>
  );
}
