"use client"

import { useState } from "react"
import Image from "next/image"
import { Camera, Edit, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function ProfileHeader() {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("Jane Wanjiku")
  const [bio, setBio] = useState("Passionate about constitutional rights and civic education.")

  const handleSave = () => {
    setIsEditing(false)
    // In a real app, save changes to the server
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-[#1EB53A]/10 border-4 border-white ring-2 ring-[#1EB53A]/20">
            <Image src="/smiling-african-professional.png" alt="Profile" width={96} height={96} className="object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 bg-[#1EB53A] text-white p-1.5 rounded-full hover:bg-[#0A7B24] transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-grow">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full font-bold text-xl text-[#0A7B24] bg-[#F3F4F6] border border-[#D1D5DB] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1EB53A] focus:border-transparent"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full text-[#4B5563] bg-[#F3F4F6] border border-[#D1D5DB] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1EB53A] focus:border-transparent resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl text-[#0A7B24]">{name}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-[#6B7280] hover:text-[#0A7B24]"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              </div>
              <p className="text-[#4B5563] mt-1">{bio}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center text-sm text-[#6B7280]">
                  <CheckCircle2 className="h-4 w-4 text-[#1EB53A] mr-1" />
                  <span>Member since May 2023</span>
                </div>
                <div className="flex items-center text-sm text-[#6B7280]">
                  <span className="bg-[#1EB53A]/10 text-[#0A7B24] px-2 py-0.5 rounded-full text-xs font-medium">
                    Level 3: Engaged Citizen
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[#374151]">Profile Completion</span>
          <span className="text-sm text-[#6B7280]">75%</span>
        </div>
        <Progress value={75} className="h-2" />
        <p className="text-xs text-[#6B7280] mt-2">
          Complete your profile to unlock more features and personalized content.
        </p>
      </div>
    </div>
  )
}
