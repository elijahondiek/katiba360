"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Download,
  HardDrive,
  RefreshCw,
  Trash2,
  Check,
  Clock,
  AlertTriangle,
  Wifi,
  WifiOff,
  Search,
  Battery,
  FileText,
} from "lucide-react"
import { useOffline } from "@/contexts/offline-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { LanguageSelector } from "@/components/language-selector"

// Helper function to format file size
function formatFileSize(sizeInKB: number): string {
  if (sizeInKB < 1024) {
    return `${sizeInKB} KB`
  } else {
    return `${(sizeInKB / 1024).toFixed(2)} MB`
  }
}

export default function OfflinePage() {
  const { t } = useLanguage()
  const { isOffline, chapters, stats, downloadChapter, removeChapter, syncContent, isDownloading, downloadQueue } =
    useOffline()

  const [activeTab, setActiveTab] = useState("manage")
  const [autoSync, setAutoSync] = useState(true)
  const [batteryOptimization, setBatteryOptimization] = useState(true)

  // Calculate storage usage percentage
  const storageUsagePercent = (stats.totalDownloaded / (stats.totalDownloaded + stats.availableStorage)) * 100

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Katiba360 Logo" width={40} height={40} className="h-10 w-auto" />
                <span className="text-xl font-bold text-[#0A7B24]">{t("app.title")}</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6">
              <Link href="/chapters" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.chapters")}
              </Link>
              <Link href="/rights" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.rights")}
              </Link>
              <Link href="/learn" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.learn")}
              </Link>
              <Link href="/community" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                Community
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Badge
              variant="outline"
              className={`${
                isOffline
                  ? "bg-[#CE1126]/10 text-[#CE1126] border-[#CE1126]/20"
                  : "bg-[#1EB53A]/10 text-[#1EB53A] border-[#1EB53A]/20"
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="h-3 w-3 mr-1" /> Offline
                </>
              ) : (
                <>
                  <Wifi className="h-3 w-3 mr-1" /> Online
                </>
              )}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-[#6B7280] hover:text-[#0A7B24]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0A7B24]">Offline Mode</h1>
            <p className="text-[#4B5563]">
              Download content to access the constitution even without an internet connection.
            </p>
          </div>

          {/* Storage Usage Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#0A7B24] flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Storage Usage
                  </h2>
                  <p className="text-sm text-[#6B7280]">
                    {formatFileSize(stats.totalDownloaded)} used of{" "}
                    {formatFileSize(stats.totalDownloaded + stats.availableStorage)} available
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => syncContent()}
                    disabled={isOffline}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Sync Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-[#CE1126]"
                    onClick={() => {
                      // In a real app, this would clear all downloaded content
                      chapters.forEach((chapter) => {
                        if (chapter.isDownloaded) {
                          removeChapter(chapter.id)
                        }
                      })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </div>

              <Progress value={storageUsagePercent} className="h-2 mb-2" />

              <div className="flex justify-between text-xs text-[#6B7280]">
                <span>
                  {stats.lastSynced ? `Last synced: ${new Date(stats.lastSynced).toLocaleString()}` : "Never synced"}
                </span>
                <span className={storageUsagePercent > 80 ? "text-[#CE1126]" : ""}>
                  {storageUsagePercent.toFixed(1)}% used
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Offline Settings Tabs */}
          <Tabs defaultValue="manage" onValueChange={setActiveTab} value={activeTab} className="space-y-6">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="manage" className="text-sm">
                <Download className="h-4 w-4 mr-2" />
                Manage Downloads
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-sm">
                <HardDrive className="h-4 w-4 mr-2" />
                Offline Settings
              </TabsTrigger>
              <TabsTrigger value="search" className="text-sm">
                <Search className="h-4 w-4 mr-2" />
                Offline Search
              </TabsTrigger>
            </TabsList>

            {/* Manage Downloads Tab */}
            <TabsContent value="manage" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#0A7B24]">Constitutional Chapters</h2>
                <Button
                  className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white"
                  onClick={() => {
                    // Download all chapters that aren't already downloaded or in queue
                    chapters.forEach((chapter) => {
                      if (!chapter.isDownloaded && !downloadQueue.includes(chapter.id)) {
                        downloadChapter(chapter.id)
                      }
                    })
                  }}
                  disabled={isOffline}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>

              <div className="space-y-4">
                {chapters.map((chapter) => (
                  <Card key={chapter.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-[#1EB53A]" />
                            <h3 className="font-medium text-[#0A7B24]">{chapter.title}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-[#6B7280] mt-1">
                            <span>{formatFileSize(chapter.size)}</span>
                            <span>Updated: {chapter.lastUpdated}</span>
                          </div>
                        </div>

                        <div>
                          {chapter.isDownloaded ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 text-[#CE1126]"
                              onClick={() => removeChapter(chapter.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </Button>
                          ) : downloadQueue.includes(chapter.id) || chapter.downloadProgress !== undefined ? (
                            <div className="space-y-1 w-32">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#6B7280]">Downloading...</span>
                                <span className="text-[#1EB53A]">{chapter.downloadProgress || 0}%</span>
                              </div>
                              <Progress value={chapter.downloadProgress || 0} className="h-1.5" />
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                              onClick={() => downloadChapter(chapter.id)}
                              disabled={isOffline}
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>

                      {chapter.isDownloaded && (
                        <div className="bg-[#F3F4F6] px-4 py-2 border-t border-gray-200 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-[#1EB53A]">
                            <Check className="h-4 w-4" />
                            <span>Available offline</span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-[#6B7280]" asChild>
                            <Link href={`/chapters/${chapter.id}`}>View Chapter</Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Offline Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-[#1EB53A]" />
                    Sync Settings
                  </CardTitle>
                  <CardDescription>Configure how and when content is synchronized</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-sync-toggle" className="font-medium">
                        Auto-Sync When Online
                      </Label>
                      <p className="text-sm text-[#6B7280]">
                        Automatically sync content when connected to the internet
                      </p>
                    </div>
                    <Switch id="auto-sync-toggle" checked={autoSync} onCheckedChange={setAutoSync} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="wifi-only-toggle" className="font-medium">
                        Sync on Wi-Fi Only
                      </Label>
                      <p className="text-sm text-[#6B7280]">Only download content when connected to Wi-Fi</p>
                    </div>
                    <Switch id="wifi-only-toggle" defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="background-sync-toggle" className="font-medium">
                        Background Sync
                      </Label>
                      <p className="text-sm text-[#6B7280]">Allow syncing when the app is in the background</p>
                    </div>
                    <Switch id="background-sync-toggle" defaultChecked={false} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Battery className="h-5 w-5 text-[#1EB53A]" />
                    Battery & Storage
                  </CardTitle>
                  <CardDescription>Optimize offline usage for battery life and storage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="battery-toggle" className="font-medium">
                        Battery Optimization
                      </Label>
                      <p className="text-sm text-[#6B7280]">Reduce background activity to save battery</p>
                    </div>
                    <Switch
                      id="battery-toggle"
                      checked={batteryOptimization}
                      onCheckedChange={setBatteryOptimization}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="image-quality-toggle" className="font-medium">
                        Reduce Image Quality
                      </Label>
                      <p className="text-sm text-[#6B7280]">Use lower quality images to save storage space</p>
                    </div>
                    <Switch id="image-quality-toggle" defaultChecked={false} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-cleanup-toggle" className="font-medium">
                        Auto-Cleanup Old Content
                      </Label>
                      <p className="text-sm text-[#6B7280]">
                        Automatically remove content that hasn't been accessed in 30 days
                      </p>
                    </div>
                    <Switch id="auto-cleanup-toggle" defaultChecked={false} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-[#1EB53A]" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Configure offline mode notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="offline-notification-toggle" className="font-medium">
                        Offline Mode Notifications
                      </Label>
                      <p className="text-sm text-[#6B7280]">Show notification when switching to offline mode</p>
                    </div>
                    <Switch id="offline-notification-toggle" defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="update-notification-toggle" className="font-medium">
                        Content Update Notifications
                      </Label>
                      <p className="text-sm text-[#6B7280]">Notify when downloaded content has updates available</p>
                    </div>
                    <Switch id="update-notification-toggle" defaultChecked={true} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Offline Search Tab */}
            <TabsContent value="search" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-[#1EB53A]" />
                    Offline Search
                  </CardTitle>
                  <CardDescription>Search through downloaded content without an internet connection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search the constitution..."
                      className="w-full p-2 pl-10 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1EB53A]"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                    <Badge
                      variant="outline"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#F3F4F6] text-[#6B7280] border-[#D1D5DB]"
                    >
                      Offline
                    </Badge>
                  </div>

                  <div className="p-4 border border-dashed rounded-md bg-[#F9FAFB] text-center">
                    <p className="text-[#6B7280]">Enter a search term to find content in your downloaded chapters</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-[#374151]">Search Options</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="fuzzy-search-toggle" className="font-medium">
                          Fuzzy Search
                        </Label>
                        <p className="text-xs text-[#6B7280]">Find results even with slight spelling errors</p>
                      </div>
                      <Switch id="fuzzy-search-toggle" defaultChecked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="search-index-toggle" className="font-medium">
                          Keep Search Index Updated
                        </Label>
                        <p className="text-xs text-[#6B7280]">Automatically update search index when content changes</p>
                      </div>
                      <Switch id="search-index-toggle" defaultChecked={true} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-[#F3F4F6] border-t p-4 flex justify-between items-center">
                  <div className="text-sm text-[#6B7280]">
                    <span className="font-medium">{chapters.filter((c) => c.isDownloaded).length}</span> chapters
                    available for offline search
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2" disabled={isOffline}>
                    <RefreshCw className="h-4 w-4" />
                    Rebuild Search Index
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#1EB53A]" />
                    Recent Offline Searches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["human rights", "devolution", "chapter 4", "article 43"].map((term, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-[#F3F4F6] rounded-md">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#6B7280]" />
                          <span>{term}</span>
                        </div>
                        <Badge variant="outline" className="bg-[#F3F4F6] text-[#6B7280] border-[#D1D5DB]">
                          Offline
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button variant="ghost" size="sm" className="text-[#6B7280]">
                    Clear Search History
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A7B24] text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>
              &copy; {new Date().getFullYear()} Katiba360. {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
