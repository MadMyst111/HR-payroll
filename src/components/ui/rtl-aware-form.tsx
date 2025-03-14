import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RTLAwareFormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export function RTLAwareForm({
  children,
  className = "",
  onSubmit,
}: RTLAwareFormProps) {
  const { isRTL } = useLanguage();

  return (
    <form
      className={`rtl-aware-form ${isRTL ? "rtl" : "ltr"} ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}

interface RTLAwareFormFieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}

export function RTLAwareFormField({
  label,
  htmlFor,
  children,
  className = "",
}: RTLAwareFormFieldProps) {
  const { isRTL } = useLanguage();

  return (
    <div className={`rtl-aware-form-field space-y-2 ${className}`}>
      <Label
        htmlFor={htmlFor}
        className={isRTL ? "text-right block w-full" : "text-left block w-full"}
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

interface RTLAwareInputProps {
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  readOnly?: boolean;
}

export function RTLAwareInput({
  id,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
  required = false,
  readOnly = false,
}: RTLAwareInputProps) {
  const { isRTL } = useLanguage();

  return (
    <Input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`rtl-aware-input ${isRTL ? "text-right" : "text-left"} ${className}`}
      required={required}
      readOnly={readOnly}
    />
  );
}

interface RTLAwareTextareaProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  rows?: number;
}

export function RTLAwareTextarea({
  id,
  name,
  value,
  onChange,
  placeholder,
  className = "",
  required = false,
  rows = 3,
}: RTLAwareTextareaProps) {
  const { isRTL } = useLanguage();

  return (
    <Textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`rtl-aware-textarea ${isRTL ? "text-right" : "text-left"} ${className}`}
      required={required}
      rows={rows}
    />
  );
}

interface RTLAwareSelectProps {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  children: React.ReactNode;
}

export function RTLAwareSelect({
  id,
  value,
  onValueChange,
  placeholder,
  className = "",
  children,
}: RTLAwareSelectProps) {
  const { isRTL } = useLanguage();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        id={id}
        className={`rtl-aware-select ${isRTL ? "text-right" : "text-left"} ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}
