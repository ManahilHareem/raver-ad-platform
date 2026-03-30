"use client";

import React from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-red-200",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-200",
    info: "bg-linear-to-r from-[#01012A] to-[#2E2C66] hover:opacity-90 text-white shadow-[#01012A]/20",
  };

  const iconColors = {
    danger: "text-red-500 bg-red-50",
    warning: "text-yellow-500 bg-yellow-50",
    info: "text-blue-500 bg-blue-50",
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-[400px] rounded-[24px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col p-[24px] gap-[20px] relative border-[0.35px] border-[#0000001A]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className={cn("w-[60px] h-[60px] rounded-full flex items-center justify-center mb-2", iconColors[variant])}>
            {variant === "danger" && <Icons.Trash className="w-7 h-7" />}
            {variant === "warning" && <Icons.Bell className="w-7 h-7" />}
            {variant === "info" && <Icons.Shield className="w-7 h-7" />}
          </div>
          
          <div className="flex flex-col gap-2">
            <h2 className="text-[22px] font-bold text-[#121212] leading-tight">{title}</h2>
            <p className="text-[14px] text-[#64748B] font-medium leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-[48px] bg-[#F1F5F9] text-[#121212] rounded-[12px] text-[16px] font-bold hover:bg-[#E2E8F0] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 h-[48px] rounded-[12px] text-[16px] font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50",
              variantStyles[variant]
            )}
          >
            {isLoading ? (
              <Icons.Loader className="w-5 h-5 animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
