"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialogContext = React.createContext({
  open: false,
  setOpen: () => {},
})

const AlertDialog = React.forwardRef(({ children, open, onOpenChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(open || false)
  
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])
  
  const handleOpenChange = React.useCallback((value) => {
    setIsOpen(value)
    onOpenChange?.(value)
  }, [onOpenChange])

  return (
    <AlertDialogContext.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>
      <div data-slot="alert-dialog" data-state={isOpen ? "open" : "closed"} ref={ref} {...props}>
        {children}
      </div>
    </AlertDialogContext.Provider>
  )
})
AlertDialog.displayName = "AlertDialog"

const AlertDialogTrigger = React.forwardRef(({ ...props }, ref) => {
  const { setOpen } = React.useContext(AlertDialogContext)
  return (
    <button 
      data-slot="alert-dialog-trigger" 
      onClick={() => setOpen(true)}
      ref={ref} 
      {...props} 
    />
  )
})
AlertDialogTrigger.displayName = "AlertDialogTrigger"

const AlertDialogPortal = React.forwardRef(({ ...props }, ref) => (
  <div data-slot="alert-dialog-portal" ref={ref} {...props} />
))
AlertDialogPortal.displayName = "AlertDialogPortal"

const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
  const { open } = React.useContext(AlertDialogContext)
  
  if (!open) return null
  
  return (
    <div
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
AlertDialogOverlay.displayName = "AlertDialogOverlay"

const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => {
  const { open } = React.useContext(AlertDialogContext)
  
  if (!open) return null
  
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <div
        data-slot="alert-dialog-content"
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
})
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    data-slot="alert-dialog-header"
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    ref={ref}
    {...props}
  />
))
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    data-slot="alert-dialog-footer"
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    ref={ref}
    {...props}
  />
))
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    data-slot="alert-dialog-title"
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    data-slot="alert-dialog-description"
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => {
  const { setOpen } = React.useContext(AlertDialogContext)
  return (
    <button
      data-slot="alert-dialog-action"
      ref={ref}
      className={cn(buttonVariants(), className)}
      onClick={(e) => {
        props.onClick?.(e)
        if (!e.defaultPrevented) {
          setOpen(false)
        }
      }}
      {...props}
    />
  )
})
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => {
  const { setOpen } = React.useContext(AlertDialogContext)
  return (
    <button
      data-slot="alert-dialog-cancel"
      ref={ref}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "mt-2 sm:mt-0",
        className
      )}
      onClick={(e) => {
        props.onClick?.(e)
        if (!e.defaultPrevented) {
          setOpen(false)
        }
      }}
      {...props}
    />
  )
})
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} 