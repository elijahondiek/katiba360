"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:top-0 sm:right-0 sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full",
  {
    variants: {
      variant: {
        default: "border bg-white text-foreground border-gray-200 shadow-md",
        destructive: "border-red-500/20 bg-gradient-to-r from-red-50 to-white text-red-600 shadow-md",
        success: "border-[#0A7B24]/20 bg-gradient-to-r from-[#F0FFF4] to-white text-[#0A7B24] shadow-md",
        warning: "border-amber-500/20 bg-gradient-to-r from-amber-50 to-white text-amber-600 shadow-md",
        info: "border-blue-500/20 bg-gradient-to-r from-blue-50 to-white text-blue-600 shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

// Toast icon mapping
const ToastIcon = ({ variant }: { variant: string | null | undefined }) => {
  switch (variant) {
    case "destructive":
      return <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
    case "success":
      return <CheckCircle className="h-5 w-5 text-[#0A7B24] mr-3 flex-shrink-0" />
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
    case "info":
      return <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
    default:
      return null
  }
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root 
      ref={ref} 
      className={cn(toastVariants({ variant }), className)}
      data-variant={variant} // Add data attribute for variant
      {...props} 
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-md border bg-transparent px-4 text-sm font-medium transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "group-[.destructive]:border-red-500/30 group-[.destructive]:hover:border-red-500/30 group-[.destructive]:hover:bg-red-500/10",
      "group-[.success]:border-[#0A7B24]/30 group-[.success]:hover:border-[#0A7B24]/30 group-[.success]:hover:bg-[#0A7B24]/10",
      "group-[.warning]:border-amber-500/30 group-[.warning]:hover:border-amber-500/30 group-[.warning]:hover:bg-amber-500/10",
      "group-[.info]:border-blue-500/30 group-[.info]:hover:border-blue-500/30 group-[.info]:hover:bg-blue-500/10",
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-100 transition-opacity hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2",
      "group-[.destructive]:text-red-500/70 group-[.destructive]:hover:text-red-500 group-[.destructive]:focus:ring-red-500",
      "group-[.success]:text-[#0A7B24]/70 group-[.success]:hover:text-[#0A7B24] group-[.success]:focus:ring-[#0A7B24]",
      "group-[.warning]:text-amber-500/70 group-[.warning]:hover:text-amber-500 group-[.warning]:focus:ring-amber-500",
      "group-[.info]:text-blue-500/70 group-[.info]:hover:text-blue-500 group-[.info]:focus:ring-blue-500",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  // Find the closest toast element to get its variant
  const getVariantFromClosestToast = () => {
    // This is a client-side only check
    if (typeof document === 'undefined') return variant;
    
    // Try to find the closest toast element with a variant class
    const variantClasses = ['success', 'destructive', 'warning', 'info'];
    const element = document.activeElement;
    if (!element) return variant;
    
    const toast = element.closest('[data-variant]');
    if (!toast) return variant;
    
    const dataVariant = toast.getAttribute('data-variant');
    return dataVariant || variant;
  };
  
  // Use the provided variant or try to get it from the parent toast
  const effectiveVariant = variant || getVariantFromClosestToast();
  
  return (
    <div className="flex items-center gap-2">
      <ToastIcon variant={effectiveVariant} />
      <ToastPrimitives.Title 
        ref={ref} 
        className={cn("text-sm font-semibold", className)} 
        {...props} 
      />
    </div>
  );
});
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 ml-7", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

// Toast progress bar component
const ToastProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    duration?: number
    variant?: string
  }
>(({ duration = 5000, variant, ...props }, ref) => {
  const [width, setWidth] = React.useState(100)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(0)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const getProgressColor = () => {
    switch (variant) {
      case "destructive":
        return "bg-red-500"
      case "success":
        return "bg-[#0A7B24]"
      case "warning":
        return "bg-amber-500"
      case "info":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 overflow-hidden">
      <div
        ref={ref}
        className={cn("h-full transition-all", getProgressColor())}
        style={{
          width: `${width}%`,
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: "linear",
        }}
        {...props}
      />
    </div>
  )
})
ToastProgress.displayName = "ToastProgress"

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast> & {
  duration?: number
}

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastProgress,
}
