"use client"

import React, { useState, useEffect } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Facebook, Twitter, Share2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { sharingService } from "@/services/sharing.service"

// Custom WhatsApp icon component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={cn("h-5 w-5", className)}
  >
    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.301-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.269-.467-2.416-1.483-.893-.795-1.494-1.78-1.67-2.079-.173-.3-.018-.462.13-.61.134-.133.3-.347.45-.52.149-.174.199-.3.299-.498.1-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.206-.242-.579-.487-.5-.672-.51-.172-.008-.371-.01-.571-.01-.2 0-.522.074-.796.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.2 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
  </svg>
)

interface ShareDialogProps {
  title?: string
  url?: string
  description?: string
  triggerButton?: React.ReactNode
  onShare?: (platform: string) => void
  contentType?: string
  contentId?: string
}

export function ShareDialog({
  title = "Share this content",
  url = typeof window !== 'undefined' ? window.location.href : '',
  description = "Check out this content on Katiba360",
  triggerButton,
  onShare,
  contentType = "content",
  contentId = "unknown"
}: ShareDialogProps) {
  const { t } = useLanguage()
  const [shareUrl, setShareUrl] = useState(url)
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Update the share URL if the URL prop changes
  useEffect(() => {
    setShareUrl(url)
  }, [url])

  // Reset copied state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false)
    }
  }, [isOpen])

  const handleCopyLink = async () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    
    // Track sharing event
    try {
      await sharingService.trackShare(contentType, contentId, 'copy-link', shareUrl)
    } catch (error) {
      console.error("Failed to track share event for copy-link:", error)
    }
  }

  const handleSharePlatform = async (platform: string) => {
    let shareLink = ''
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(title)
    const encodedDesc = encodeURIComponent(description)

    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedDesc}`
        break
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedDesc}%20${encodedUrl}`
        break
      default:
        break
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer')
      
      // Track sharing event
      await sharingService.trackShare(
        contentType, 
        contentId, 
        platform as 'facebook' | 'twitter' | 'whatsapp', 
        shareUrl
      )
    }

    if (onShare) {
      onShare(platform)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6]">
            <Share2 className="h-4 w-4 mr-2" />
            {t("common.share") || "Share"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-[#374151]">
            {t("share.title") || "Share this content"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-[#6B7280] mt-2">
            {t("share.description") || "Choose how you'd like to share this content"}
          </DialogDescription>
        </DialogHeader>
        
        {/* Social Media Sharing Options */}
        <div className="flex justify-center space-x-4 py-4">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-[#E5E7EB] hover:border-[#1EB53A] hover:bg-[#1EB53A]/10 text-[#4B5563] hover:text-[#1EB53A] transition-colors"
            onClick={() => handleSharePlatform('facebook')}
            aria-label={t("share.facebook") || "Share on Facebook"}
          >
            <Facebook className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-[#E5E7EB] hover:border-[#1EB53A] hover:bg-[#1EB53A]/10 text-[#4B5563] hover:text-[#1EB53A] transition-colors"
            onClick={() => handleSharePlatform('twitter')}
            aria-label={t("share.twitter") || "Share on Twitter"}
          >
            <Twitter className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-[#E5E7EB] hover:border-[#1EB53A] hover:bg-[#1EB53A]/10 text-[#4B5563] hover:text-[#1EB53A] transition-colors"
            onClick={() => handleSharePlatform('whatsapp')}
            aria-label={t("share.whatsapp") || "Share on WhatsApp"}
          >
            <WhatsAppIcon />
          </Button>
        </div>

        {/* Copy Link Section */}
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <label htmlFor="link" className="sr-only">
              {t("share.link") || "Link"}
            </label>
            <Input
              id="link"
              readOnly
              value={shareUrl}
              className="h-10 border-[#D1D5DB] focus:border-[#1EB53A] focus:ring-[#1EB53A]"
            />
          </div>
          <Button 
            type="button" 
            size="sm" 
            className={cn(
              "px-3 transition-all duration-200",
              copied 
                ? "bg-[#1EB53A] hover:bg-[#0A7B24]" 
                : "bg-[#1EB53A] hover:bg-[#0A7B24]"
            )}
            onClick={handleCopyLink}
            aria-label={copied ? (t("share.copied") || "Copied") : (t("share.copy") || "Copy")}
          >
            {copied ? (
              t("share.copied") || "Copied!"
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                {t("share.copy") || "Copy Link"}
              </>
            )}
          </Button>
        </div>

        <DialogFooter className="sm:justify-center mt-4">
          <p className="text-sm text-[#6B7280]">
            {t("share.privacy") || "Your privacy is important to us"}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
