"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Camera, Edit, CheckCircle2, BookOpen, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/AuthContext"
import { format, parseISO } from "date-fns"
import { getUserReadingProgress, getUserProfile, updateUserProfile } from "@/lib/api"

export function ProfileHeader() {
  const { authState } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [joinDate, setJoinDate] = useState<string>("")
  const [totalContentRead, setTotalContentRead] = useState(0)
  const [totalReadingTime, setTotalReadingTime] = useState(0)
  const [achievementPoints, setAchievementPoints] = useState(0)
  const [userLevel, setUserLevel] = useState("Mwananchi")
  const [loading, setLoading] = useState(true)

  // Helper function to get user level and level number
  const getUserLevelInfo = (points: number) => {
    if (points >= 500) return { level: 7, name: "Mfalme wa Kiraia", translation: "Civic Champion" }
    if (points >= 300) return { level: 6, name: "Mzalendo", translation: "Patriot" }
    if (points >= 200) return { level: 5, name: "Mwongozi", translation: "Leader" }
    if (points >= 100) return { level: 4, name: "Mzungumzaji", translation: "Spokesperson" }
    if (points >= 50) return { level: 3, name: "Mshirikiano", translation: "Collaborator" }
    if (points >= 20) return { level: 2, name: "Mjuzi", translation: "Knowledgeable" }
    return { level: 1, name: "Mwananchi", translation: "Citizen" }
  }

  // Load user data from auth state and backend
  useEffect(() => {
    async function loadUserData() {
      if (!authState?.user?.id) {
        setLoading(false)
        return
      }

      try {
        // Set basic user info from auth state
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

        // Fetch user profile for bio and other details
        try {
          const profileResponse = await getUserProfile()
          if (profileResponse?.body) {
            setBio(profileResponse.body.bio || "Passionate about constitutional rights and civic education.")
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
          setBio("Passionate about constitutional rights and civic education.")
        }

        // Fetch reading progress for stats
        try {
          const progressResponse = await getUserReadingProgress(authState.user.id)
          if (progressResponse?.body?.progress) {
            const progress = progressResponse.body.progress
            
            // Calculate total content read (chapters + articles)
            const chaptersRead = progress.completed_chapters?.length || 0
            const articlesRead = progress.completed_articles?.length || 0
            setTotalContentRead(chaptersRead + articlesRead)
            
            // Convert reading time from minutes to display format
            const totalMinutes = progress.total_read_time_minutes || 0
            setTotalReadingTime(Math.round(totalMinutes))
            
            // Calculate achievement points (simple formula for now)
            const points = (chaptersRead * 10) + (articlesRead * 5) + Math.floor(totalMinutes / 10)
            setAchievementPoints(points)
            
            // Determine user level based on achievement points - Kenyan-themed ranking system
            const levelInfo = getUserLevelInfo(points)
            setUserLevel(levelInfo.name)
          }
        } catch (error) {
          console.error('Error fetching reading progress:', error)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [authState?.user?.id])

  const handleSave = async () => {
    try {
      // Save name and bio to backend
      const response = await updateUserProfile({ 
        display_name: name, 
        bio: bio 
      })
      
      console.log('Profile update response:', response)
      
      // Update auth state with new display name if successful
      if (response?.body && authState.user) {
        // Update the user in auth state
        authState.user.display_name = name
        // Also update localStorage if it exists
        try {
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            const userData = JSON.parse(storedUser)
            userData.display_name = name
            localStorage.setItem('user', JSON.stringify(userData))
          }
        } catch (e) {
          console.error('Error updating localStorage:', e)
        }
      }
      
      setIsEditing(false)
      console.log('Profile updated successfully')
    } catch (error) {
      console.error('Error saving profile:', error)
      // You could show a toast notification here
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex-grow space-y-3">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
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
                  <span 
                    className="bg-[#1EB53A]/10 text-[#0A7B24] px-2 py-0.5 rounded-full text-xs font-medium cursor-help"
                    title={`${getUserLevelInfo(achievementPoints).translation} - ${achievementPoints} Mzalendo Points`}
                  >
                    Level {getUserLevelInfo(achievementPoints).level}: {userLevel}
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
                    <p className="text-xs text-[#6B7280]">Mzalendo Points</p>
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
