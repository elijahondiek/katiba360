"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Camera, Edit, CheckCircle2, BookOpen, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/AuthContext"
import { format, parseISO } from "date-fns"

export function ProfileHeader() {
  const { authState } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("Passionate about constitutional rights and civic education.")
  const [joinDate, setJoinDate] = useState<string>("")
  const [totalContentRead, setTotalContentRead] = useState(0)
  const [totalReadingTime, setTotalReadingTime] = useState(0)
  const [achievementPoints, setAchievementPoints] = useState(0)
  const [userLevel, setUserLevel] = useState("Beginner")

  // Load user data from auth state
  useEffect(() => {
    if (authState.user) {
      setName(authState.user.display_name || "User")
      
      // Format join date from created_at
      if (authState.user.created_at) {
        try {
          const date = parseISO(authState.user.created_at)
          setJoinDate(format(date, 'MMMM yyyy'))
        } catch (error) {
          console.error('Error parsing date:', error)
          setJoinDate('Recent member')
        }
      }
    }
    
    // Load additional user stats from localStorage if available
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedData = JSON.parse(userData)
        setTotalContentRead(parsedData.total_content_read || 0)
        setTotalReadingTime(parsedData.total_reading_time_minutes || 0)
        setAchievementPoints(parsedData.achievement_points || 0)
        
        // Determine user level based on achievement points
        if (parsedData.achievement_points >= 100) {
          setUserLevel("Expert Citizen")
        } else if (parsedData.achievement_points >= 50) {
          setUserLevel("Active Citizen")
        } else if (parsedData.achievement_points >= 20) {
          setUserLevel("Engaged Citizen")
        } else {
          setUserLevel("Beginner")
        }
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error)
    }
  }, [authState.user])

  const handleSave = () => {
    setIsEditing(false)
    // In a real app, save changes to the server
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-[#1EB53A]/10 border-4 border-white ring-2 ring-[#1EB53A]/20">
            {authState.user?.avatar_url ? (
              <Image 
                src={authState.user.avatar_url} 
                alt="Profile" 
                width={96} 
                height={96} 
                className="object-cover" 
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-[#1EB53A]/20 text-[#0A7B24] text-2xl font-bold">
                {name.charAt(0)}
              </div>
            )}
          </div>
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3">
                <div className="flex items-center text-sm text-[#6B7280]">
                  <CheckCircle2 className="h-4 w-4 text-[#1EB53A] mr-1" />
                  <span>Member since {joinDate}</span>
                </div>
                <div className="flex items-center text-sm text-[#6B7280]">
                  <span className="bg-[#1EB53A]/10 text-[#0A7B24] px-2 py-0.5 rounded-full text-xs font-medium">
                    Level {achievementPoints >= 100 ? '4' : achievementPoints >= 50 ? '3' : achievementPoints >= 20 ? '2' : '1'}: {userLevel}
                  </span>
                </div>
              </div>
              
              {/* User Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 bg-[#F9FAFB] p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-[#1EB53A]/10">
                    <BookOpen className="h-4 w-4 text-[#0A7B24]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Content Read</p>
                    <p className="font-medium text-[#374151]">{totalContentRead} items</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-[#1EB53A]/10">
                    <Clock className="h-4 w-4 text-[#0A7B24]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Reading Time</p>
                    <p className="font-medium text-[#374151]">{totalReadingTime} mins</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <div className="p-2 rounded-full bg-[#1EB53A]/10">
                    <CheckCircle2 className="h-4 w-4 text-[#0A7B24]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Achievement Points</p>
                    <p className="font-medium text-[#374151]">{achievementPoints} points</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
