"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/app/_utils/global-utils";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  titleClassName?: string;
}

export const Accordion = ({
  title,
  children,
  defaultOpen = false,
  className = "",
  titleClassName = "",
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("border border-border rounded-lg bg-card", className)}>
      <button
        className={cn(
          "flex items-center justify-between w-full p-6 text-lg font-semibold",
          "text-foreground hover:bg-muted/50 transition-colors",
          isOpen && "border-b border-border/70",
          titleClassName
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? (
          <ChevronDown className="h-5 w-5 transition-transform duration-200" />
        ) : (
          <ChevronRight className="h-5 w-5 transition-transform duration-200" />
        )}
      </button>
      {isOpen && <div className="p-6 pt-4">{children}</div>}
    </div>
  );
};
