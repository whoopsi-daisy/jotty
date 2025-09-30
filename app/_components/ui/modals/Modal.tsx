"use client";

import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../elements/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleIcon?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  titleIcon,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex lg:items-center lg:justify-center items-end z-50">
      <div
        ref={modalRef}
        className={`
          bg-background border border-border w-full lg:max-w-md shadow-xl
          lg:rounded-xl rounded-t-xl p-6
          translate-y-0 lg:translate-y-0
          transition-all duration-200
          ${className}
        `}
      >
        <div className="flex items-center justify-between mb-6">
          {/* Mobile drag indicator */}
          <div className="lg:hidden absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-muted-foreground/20" />

          <div className="text-xl font-bold text-foreground flex items-center">
            {titleIcon && (
              <div className="mr-2 p-2 bg-primary/10 rounded-lg">
                {titleIcon}
              </div>
            )}
            {title}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
