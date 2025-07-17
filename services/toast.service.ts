"use client"

import { toast } from "@/hooks/use-toast"

export class ToastService {
  // Success toasts
  static success(message: string, title?: string) {
    return toast({
      title: title || "Success",
      description: message,
      variant: "success",
    })
  }

  // Error toasts
  static error(message: string, title?: string) {
    return toast({
      title: title || "Error",
      description: message,
      variant: "destructive",
    })
  }

  // Warning toasts
  static warning(message: string, title?: string) {
    return toast({
      title: title || "Warning",
      description: message,
      variant: "warning",
    })
  }

  // Info toasts
  static info(message: string, title?: string) {
    return toast({
      title: title || "Info",
      description: message,
      variant: "info",
    })
  }

  // Authentication related toasts
  static authRequired(message?: string) {
    return toast({
      title: "Authentication Required",
      description: message || "You must be logged in to perform this action.",
      variant: "destructive",
    })
  }

  static authSuccess(message?: string) {
    return toast({
      title: "Authentication Successful",
      description: message || "You have been successfully logged in.",
      variant: "success",
    })
  }

  // Bookmark related toasts
  static bookmarkSaved(itemName: string) {
    return toast({
      title: "Bookmark Saved",
      description: `${itemName} has been added to your bookmarks.`,
      variant: "success",
    })
  }

  static bookmarkRemoved(itemName: string) {
    return toast({
      title: "Bookmark Removed",
      description: `${itemName} has been removed from your bookmarks.`,
      variant: "info",
    })
  }

  static bookmarkError(action: "save" | "remove") {
    return toast({
      title: "Bookmark Error",
      description: `Failed to ${action} bookmark. Please try again.`,
      variant: "destructive",
    })
  }

  // Offline content related toasts
  static offlineContentSaved(itemName: string) {
    return toast({
      title: "Content Saved",
      description: `${itemName} is now available offline.`,
      variant: "success",
    })
  }

  static offlineContentRemoved(itemName: string) {
    return toast({
      title: "Content Removed",
      description: `${itemName} removed from offline storage.`,
      variant: "info",
    })
  }

  static offlineContentError(action: "save" | "remove") {
    return toast({
      title: `${action === "save" ? "Save" : "Remove"} Failed`,
      description: `Failed to ${action} content ${action === "save" ? "for offline access" : "from offline storage"}.`,
      variant: "destructive",
    })
  }

  // Network related toasts
  static networkError(message?: string) {
    return toast({
      title: "Network Error",
      description: message || "Please check your internet connection and try again.",
      variant: "destructive",
    })
  }

  // Generic operation toasts
  static operationSuccess(operation: string) {
    return toast({
      title: "Operation Successful",
      description: `${operation} completed successfully.`,
      variant: "success",
    })
  }

  static operationError(operation: string) {
    return toast({
      title: "Operation Failed",
      description: `Failed to ${operation.toLowerCase()}. Please try again.`,
      variant: "destructive",
    })
  }

  // Loading/Progress toasts
  static loading(message: string) {
    return toast({
      title: "Loading",
      description: message,
      variant: "info",
    })
  }
}

// Export individual functions for convenience
export const {
  success,
  error,
  warning,
  info,
  authRequired,
  authSuccess,
  bookmarkSaved,
  bookmarkRemoved,
  bookmarkError,
  offlineContentSaved,
  offlineContentRemoved,
  offlineContentError,
  networkError,
  operationSuccess,
  operationError,
  loading,
} = ToastService