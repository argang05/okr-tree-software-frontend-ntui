"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  variant = "destructive"
}) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } catch (error) {
      console.error("Confirmation error:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };
  
  const handleOpenChange = (open) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className={variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 