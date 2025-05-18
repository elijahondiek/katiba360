"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Globe, Eye, Download, BookOpen, Bell, Lock, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const [readingLevel, setReadingLevel] = useState("simplified")
  const [fontSize, setFontSize] = useState(16)
  const [highContrast, setHighContrast] = useState(false)
  const [autoDownload, setAutoDownload] = useState(false)
  const [notifications, setNotifications] = useState({
    newContent: true,
    updates: true,
    achievements: true,
    reminders: false,
  })

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
              <Link href="/about" className="text-[#374151] hover:text-[#0A7B24] font-medium">
                {t("nav.about")}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link href="/profile" className="inline-flex items-center text-[#6B7280] hover:text-[#0A7B24]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-[#0A7B24]">Account Settings</h1>
              <p className="text-[#4B5563]">Manage your preferences and personalize your experience.</p>
            </div>

            <Tabs defaultValue="language" className="p-6">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="language">Language</TabsTrigger>
                <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              {/* Language Settings */}
              <TabsContent value="language" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-[#1EB53A]" />
                    <h2 className="text-lg font-medium">Language Preferences</h2>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
                    <h3 className="font-medium text-[#374151] mb-3">Interface Language</h3>
                    <p className="text-sm text-[#4B5563] mb-4">Select the language for the Katiba360 interface.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries({
                        en: { name: "English", flag: "kenya.svg", nativeName: "English" },
                        sw: { name: "Kiswahili", flag: "kenya.svg", nativeName: "Kiswahili" },
                        kik: { name: "Kikuyu", flag: "kenya.svg", nativeName: "Gĩkũyũ" },
                        luo: { name: "Luo", flag: "kenya.svg", nativeName: "Dholuo" },
                        kal: { name: "Kalenjin", flag: "kenya.svg", nativeName: "Kalenjin" },
                        kam: { name: "Kamba", flag: "kenya.svg", nativeName: "Kikamba" },
                      }).map(([code, { name, flag, nativeName }]) => (
                        <div
                          key={code}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            language === code
                              ? "border-[#1EB53A] bg-[#1EB53A]/5"
                              : "border-gray-200 hover:border-[#1EB53A]/50"
                          }`}
                          onClick={() => setLanguage(code as any)}
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image src={`/flags/${flag}`} alt={`${name} Flag`} width={32} height={32} />
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium text-[#374151]">{nativeName}</p>
                            <p className="text-xs text-[#6B7280]">{name}</p>
                          </div>
                          {language === code && <Check className="h-5 w-5 text-[#1EB53A]" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
                    <h3 className="font-medium text-[#374151] mb-3">Content Language</h3>
                    <p className="text-sm text-[#4B5563] mb-4">
                      Choose your preferred language for constitutional content.
                    </p>

                    <RadioGroup defaultValue="original" className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="original" id="original" />
                        <Label htmlFor="original" className="font-medium">
                          Original (English)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="translated" id="translated" />
                        <Label htmlFor="translated">Translated (Same as interface language)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dual" id="dual" />
                        <Label htmlFor="dual">Dual Language (Side by side)</Label>
                      </div>
                    </RadioGroup>

                    <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                      <p className="text-sm text-[#374151] font-medium mb-1">Preview:</p>
                      <p className="text-sm text-[#4B5563]">
                        "All sovereign power belongs to the people of Kenya and shall be exercised only in accordance
                        with this Constitution."
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Accessibility Settings */}
              <TabsContent value="accessibility" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-[#1EB53A]" />
                    <h2 className="text-lg font-medium">Accessibility Settings</h2>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
                    <h3 className="font-medium text-[#374151] mb-3">Reading Level</h3>
                    <p className="text-sm text-[#4B5563] mb-4">
                      Choose the complexity level of constitutional content.
                    </p>

                    <RadioGroup value={readingLevel} onValueChange={setReadingLevel} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="simplified" id="simplified" />
                        <Label htmlFor="simplified" className="font-medium">
                          Simplified
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced" />
                        <Label htmlFor="advanced">Advanced (Legal Terminology)</Label>
                      </div>
                    </RadioGroup>

                    <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                      <p className="text-sm text-[#374151] font-medium mb-1">Preview:</p>
                      <p className="text-sm text-[#4B5563]">
                        {readingLevel === "simplified" &&
                          "All power in Kenya belongs to the people. This power can only be used as described in the Constitution."}
                        {readingLevel === "standard" &&
                          "All sovereign power belongs to the people of Kenya and shall be exercised only in accordance with this Constitution."}
                        {readingLevel === "advanced" &&
                          "All sovereign power is vested in the citizenry of the Republic of Kenya and shall be exercised solely in accordance with the provisions set forth in this Constitution."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
                    <h3 className="font-medium text-[#374151] mb-3">Text Size</h3>
                    <p className="text-sm text-[#4B5563] mb-4">Adjust the size of text throughout the application.</p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">A</span>
                        <Slider
                          value={[fontSize]}
                          min={12}
                          max={24}
                          step={1}
                          onValueChange={(value) => setFontSize(value[0])}
                          className="w-[80%] mx-auto"
                        />
                        <span className="text-lg font-bold">A</span>
                      </div>

                      <div
                        className="p-3 bg-white rounded border border-gray-200"
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        <p className="text-[#374151] font-medium mb-1">Preview:</p>
                        <p className="text-[#4B5563]">
                          This is how text will appear throughout the Katiba360 platform.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-[#374151]">High Contrast Mode</h3>
                        <p className="text-sm text-[#4B5563]">Increase contrast for better readability.</p>
                      </div>
                      <Switch
                        checked={highContrast}
                        onCheckedChange={setHighContrast}
                        className="data-[state=checked]:bg-[#1EB53A]"
                      />
                    </div>

                    <div
                      className={`mt-4 p-3 rounded border ${
                        highContrast ? "bg-black text-white border-white" : "bg-white border-gray-200"
                      }`}
                    >
                      <p className={`${highContrast ? "text-white" : "text-[#374151]"} font-medium mb-1`}>Preview:</p>
                      <p className={highContrast ? "text-white" : "text-[#4B5563]"}>
                        This is how content will appear with {highContrast ? "high" : "standard"} contrast mode.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-[#374151]">Screen Reader Support</h3>
                        <p className="text-sm text-[#4B5563]">Optimize content for screen readers.</p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-[#1EB53A]" />
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-[#374151]">Reduce Animations</h3>
                        <p className="text-sm text-[#4B5563]">Minimize motion for a more comfortable experience.</p>
                      </div>
                      <Switch className="data-[state=checked]:bg-[#1EB53A]" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Content Settings */}
              <TabsContent value="content" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-[#1EB53A]" />
                    <h2 className="text-lg font-medium">Content Preferences</h2>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
                    <h3 className="font-medium text-[#374151] mb-3">Reading Experience</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#374151]">Show Key Term Definitions</p>
                          <p className="text-sm text-[#6B7280]">Highlight and define important legal terms.</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-[#1EB53A]" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#374151]">Show Progress Indicators</p>
                          <p className="text-sm text-[#6B7280]">Display your reading progress in chapters.</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-[#1EB53A]" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#374151]">Enable Audio Narration</p>
                          <p className="text-sm text-[#6B7280]">Allow text-to-speech for constitutional content.</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-[#1EB53A]" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
                    <h3 className="font-medium text-[#374151] mb-3">Offline Content</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#374151]">Auto-Download New Content</p>
                          <p className="text-sm text-[#6B7280]">Automatically download new content when on Wi-Fi.</p>
                        </div>
                        <Switch
                          checked={autoDownload}
                          onCheckedChange={setAutoDownload}
                          className="data-[state=checked]:bg-[#1EB53A]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#374151]">Storage Limit</p>
                          <p className="text-sm text-[#6B7280]">Maximum storage for offline content.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#6B7280]">100 MB</span>
                          <Button variant="outline" size="sm">
                            Change
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Button variant="outline" className="text-[#1EB53A] border-[#1EB53A] hover:bg-[#1EB53A]/10">
                          <Download className="h-4 w-4 mr-2" />
                          Manage Offline Content
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
                    <h3 className="font-medium text-[#374151] mb-3">Content Interests</h3>
                    <p className="text-sm text-[#4B5563] mb-4">
                      Select topics you're most interested in for personalized recommendations.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Bill of Rights",
                        "Devolution",
                        "Governance",
                        "Judiciary",
                        "Land Rights",
                        "Public Finance",
                        "National Security",
                        "Citizenship",
                      ].map((topic, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 border border-gray-200 rounded-md hover:border-[#1EB53A] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            id={`topic-${index}`}
                            className="rounded border-gray-300 text-[#1EB53A] focus:ring-[#1EB53A]"
                            defaultChecked={index < 3}
                          />
                          <label htmlFor={`topic-${index}`} className="text-sm text-[#374151] cursor-pointer">
                            {topic}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-[#1EB53A]" />
                    <h2 className="text-lg font-medium">Notification Preferences</h2>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
                    <h3 className="font-medium text-[#374151] mb-3">Email Notifications</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#374151]">New Content Alerts</p>
                          <p className="text-sm text-[#6B7280]">Notify when new constitutional content is added.</p>
                        </div>
                        <Switch
                          checked={notifications.newContent}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, newContent: checked })}
                          className="data-[state=checked]:bg-[#1EB53A]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#374151]">Platform Updates</p>
                          <p className="text-sm text-[#6B7280]">Notify about new features and improvements.</p>
                        </div>
                        <Switch
                          checked={notifications.updates}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                          className="data-[state=checked]:bg-[#1EB53A]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#374151]">Achievement Notifications</p>
                          <p className="text-sm text-[#6B7280]">Notify when you earn new achievements.</p>
                        </div>
                        <Switch
                          checked={notifications.achievements}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, achievements: checked })}
                          className="data-[state=checked]:bg-[#1EB53A]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#374151]">Reading Reminders</p>
                          <p className="text-sm text-[#6B7280]">Send reminders to continue your learning.</p>
                        </div>
                        <Switch
                          checked={notifications.reminders}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, reminders: checked })}
                          className="data-[state=checked]:bg-[#1EB53A]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
                    <h3 className="font-medium text-[#374151] mb-3">Notification Frequency</h3>

                    <RadioGroup defaultValue="weekly" className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily" />
                        <Label htmlFor="daily">Daily</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly">Weekly Digest</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly Summary</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="p-6 border-t border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-[#374151]">Account Security</h3>
                <p className="text-sm text-[#6B7280]">Manage your password and security settings.</p>
              </div>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => {}}>
                <Lock className="h-4 w-4" />
                Security Settings
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
