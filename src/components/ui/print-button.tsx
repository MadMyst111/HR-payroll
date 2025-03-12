import React from "react";
import { Button } from "./button";
import { Printer } from "lucide-react";

interface PrintButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
  landscape?: boolean;
}

const PrintButton = ({
  onClick,
  label = "Print",
  className = "",
  landscape = false,
}: PrintButtonProps) => {
  const handlePrint = () => {
    // Add print-specific styles
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page {
          size: ${landscape ? "landscape" : "portrait"};
          margin: 1cm;
        }
      }
    `;
    document.head.appendChild(style);

    // Call custom onClick handler or use default print behavior
    if (onClick) {
      onClick();
    } else {
      window.print();
    }

    // Remove the style after printing
    setTimeout(() => document.head.removeChild(style), 1000);
  };

  return (
    <Button
      variant="outline"
      onClick={handlePrint}
      className={`print-button ${className}`}
    >
      <Printer className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
};

export { PrintButton };
