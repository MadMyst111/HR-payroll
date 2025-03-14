import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface RTLAwareSearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

/**
 * A search input component that automatically adjusts for RTL layout
 */
export function RTLAwareSearch({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: RTLAwareSearchProps) {
  const { isRTL, getLocalizedText } = useLanguage();

  return (
    <div className="relative">
      <Search
        className={`absolute ${isRTL ? "right-2" : "left-2"} top-2.5 h-4 w-4 text-muted-foreground search-icon`}
      />
      <Input
        placeholder={getLocalizedText(placeholder, placeholder)}
        value={value}
        onChange={onChange}
        className={`rtl-aware-search ${isRTL ? "pr-8 text-right" : "pl-8 text-left"} ${className}`}
      />
    </div>
  );
}
