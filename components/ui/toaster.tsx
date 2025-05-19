"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

// Helper component to display icons based on variant
const ToastIcon = ({ variant }: { variant?: string }) => {
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

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="grid gap-1">
              {title && (
                <div className="flex items-center">
                  <ToastIcon variant={variant} />
                  <ToastTitle>{title}</ToastTitle>
                </div>
              )}
              {description && (
                <ToastDescription className="ml-7">  
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
