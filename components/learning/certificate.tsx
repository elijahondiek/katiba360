"use client"

import { useRef } from "react"
import { Award, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { LearningPath } from "@/contexts/learning-context"
import html2canvas from "html2canvas"

interface CertificateProps {
  path: LearningPath
  userName: string
}

export function Certificate({ path, userName }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!certificateRef.current) return

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: null,
      })

      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `${path.title.replace(/\s+/g, "-")}-Certificate.png`
      link.click()
    } catch (error) {
      console.error("Error generating certificate image:", error)
    }
  }

  const handleShare = async () => {
    if (!certificateRef.current) return

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: null,
      })

      const image = canvas.toDataURL("image/png")

      // Convert base64 to blob
      const byteString = atob(image.split(",")[1])
      const mimeString = image.split(",")[0].split(":")[1].split(";")[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: mimeString })
      const file = new File([blob], `${path.title}-Certificate.png`, { type: "image/png" })

      if (navigator.share) {
        await navigator.share({
          title: `My ${path.title} Certificate`,
          text: `I completed the ${path.title} learning path on Katiba360!`,
          files: [file],
        })
      } else {
        // Fallback for browsers that don't support Web Share API
        handleDownload()
      }
    } catch (error) {
      console.error("Error sharing certificate:", error)
    }
  }

  if (!path.certificate) {
    return (
      <div className="text-center p-8">
        <p className="text-[#6B7280]">No certificate available. Complete the learning path to earn a certificate.</p>
      </div>
    )
  }

  const issueDate = new Date(path.certificate.issued)
  const formattedDate = issueDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex flex-col items-center">
      <div ref={certificateRef} className="w-full max-w-3xl bg-white border-8 border-[#1EB53A]/20 rounded-lg p-8 mb-6">
        <div className="text-center border-4 border-[#0A7B24]/10 rounded-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-[#1EB53A]/10 p-3 rounded-full">
              <Award className="h-16 w-16 text-[#0A7B24]" />
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#0A7B24] mb-2">Certificate of Completion</h1>
            <p className="text-[#6B7280]">This certifies that</p>
            <p className="text-2xl font-bold text-[#374151] my-4">{userName}</p>
            <p className="text-[#6B7280]">has successfully completed the</p>
            <p className="text-xl font-bold text-[#0A7B24] my-4">{path.title}</p>
            <p className="text-[#6B7280]">learning path on Katiba360</p>
          </div>

          <div className="flex justify-between items-center mt-8 pt-8 border-t border-[#E5E7EB]">
            <div className="text-left">
              <p className="text-sm text-[#6B7280]">Issue Date</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#6B7280]">Certificate ID</p>
              <p className="font-medium">{path.certificate.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" className="flex items-center gap-2" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white flex items-center gap-2" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      <div className="mt-6 text-center text-sm text-[#6B7280]">
        <p>
          This certificate can be verified at{" "}
          <span className="font-medium">katiba360.org/verify/{path.certificate.id}</span>
        </p>
      </div>
    </div>
  )
}
