"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Type, Eye, Volume2, Mic, Keyboard, RefreshCw, Sun, ZoomIn, ZoomOut, Palette } from "lucide-react"
import { useAccessibility } from "@/contexts/accessibility-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { LanguageSelector } from "@/components/language-selector"

export default function AccessibilityPage() {
  const { t } = useLanguage()
  const { settings, updateSettings, resetSettings } = useAccessibility()
  const [activeTab, setActiveTab] = useState("text")

  // Sample text for previewing text size and complexity
  const sampleTextMap = {
    simple: {
      title: "What is the Constitution?",
      content:
        "The Constitution is Kenya's most important law. It protects your rights. It says how the government should work. Everyone must follow the Constitution.",
    },
    standard: {
      title: "Understanding the Constitution",
      content:
        "The Constitution of Kenya is the supreme law that establishes the structure of the Kenyan government and defines the relationship between the government and the citizens. It outlines fundamental rights and freedoms.",
    },
    technical: {
      title: "Constitutional Framework and Jurisprudence",
      content:
        "The Constitution establishes a normative framework for governance, delineating the separation of powers among the three branches of government while enshrining justiciable rights subject to reasonable limitation clauses as interpreted through constitutional jurisprudence.",
    },
  }

  // Get sample text based on current language complexity setting
  const sampleText = sampleTextMap[settings.languageComplexity]

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
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
            <h1 className="text-2xl font-bold text-[#0A7B24]">Accessibility Settings</h1>
            <p className="text-[#4B5563]">
              Customize Katiba360 to meet your needs. These settings help make the constitution more accessible to
              everyone.
            </p>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end mb-6">
            <Button variant="outline" onClick={resetSettings} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="text" onValueChange={setActiveTab} value={activeTab} className="space-y-6">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="text" className="text-sm">
                <Type className="h-4 w-4 mr-2" />
                Text & Reading
              </TabsTrigger>
              <TabsTrigger value="visual" className="text-sm">
                <Eye className="h-4 w-4 mr-2" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="audio" className="text-sm">
                <Volume2 className="h-4 w-4 mr-2" />
                Audio & Media
              </TabsTrigger>
              <TabsTrigger value="navigation" className="text-sm">
                <Keyboard className="h-4 w-4 mr-2" />
                Navigation
              </TabsTrigger>
            </TabsList>

            {/* Text & Reading Settings */}
            <TabsContent value="text" className="space-y-6">
              {/* Text Size */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ZoomIn className="h-5 w-5 text-[#1EB53A]" />
                    Text Size
                  </CardTitle>
                  <CardDescription>Adjust the size of text throughout the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <ZoomOut className="h-5 w-5 text-[#6B7280]" />
                    <Slider
                      className="mx-4 flex-1"
                      value={[
                        settings.textSize === "small"
                          ? 0
                          : settings.textSize === "medium"
                            ? 33
                            : settings.textSize === "large"
                              ? 66
                              : 100,
                      ]}
                      min={0}
                      max={100}
                      step={33}
                      onValueChange={(value) => {
                        const size =
                          value[0] <= 0 ? "small" : value[0] <= 33 ? "medium" : value[0] <= 66 ? "large" : "x-large"
                        updateSettings({ textSize: size as any })
                      }}
                    />
                    <ZoomIn className="h-5 w-5 text-[#6B7280]" />
                  </div>
                  <div className="flex justify-between text-sm text-[#6B7280]">
                    <span className={settings.textSize === "small" ? "font-bold text-[#1EB53A]" : ""}>Small</span>
                    <span className={settings.textSize === "medium" ? "font-bold text-[#1EB53A]" : ""}>Medium</span>
                    <span className={settings.textSize === "large" ? "font-bold text-[#1EB53A]" : ""}>Large</span>
                    <span className={settings.textSize === "x-large" ? "font-bold text-[#1EB53A]" : ""}>X-Large</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-[#F9FAFB] border-t p-4 rounded-b-lg">
                  <div className="w-full">
                    <h3 className="font-medium mb-2">Preview:</h3>
                    <div
                      className={`p-4 border rounded-lg bg-white`}
                      style={{
                        fontSize:
                          settings.textSize === "small"
                            ? "0.875rem"
                            : settings.textSize === "medium"
                              ? "1rem"
                              : settings.textSize === "large"
                                ? "1.125rem"
                                : "1.25rem",
                      }}
                    >
                      <h4 className="font-bold mb-2">{sampleText.title}</h4>
                      <p>{sampleText.content}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>

              {/* Language Complexity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-[#1EB53A]" />
                    Language Complexity
                  </CardTitle>
                  <CardDescription>Choose how technical or simplified the language should be</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={settings.languageComplexity}
                    onValueChange={(value) => updateSettings({ languageComplexity: value as any })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="simple" id="simple" />
                      <Label htmlFor="simple" className="font-medium">
                        Simple Language
                      </Label>
                      <span className="text-sm text-[#6B7280] ml-2">Easy to understand, basic vocabulary</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="font-medium">
                        Standard Language
                      </Label>
                      <span className="text-sm text-[#6B7280] ml-2">Balanced complexity for most readers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="technical" id="technical" />
                      <Label htmlFor="technical" className="font-medium">
                        Technical Language
                      </Label>
                      <span className="text-sm text-[#6B7280] ml-2">Legal terminology and precise language</span>
                    </div>
                  </RadioGroup>
                </CardContent>
                <CardFooter className="bg-[#F9FAFB] border-t p-4 rounded-b-lg">
                  <div className="w-full">
                    <h3 className="font-medium mb-2">Preview:</h3>
                    <div className="p-4 border rounded-lg bg-white">
                      <h4 className="font-bold mb-2">{sampleText.title}</h4>
                      <p>{sampleText.content}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>

              {/* Screen Reader Optimization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-[#1EB53A]" />
                    Screen Reader Optimization
                  </CardTitle>
                  <CardDescription>Enhance the experience for screen reader users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="screen-reader-toggle" className="font-medium">
                        Screen Reader Optimized Mode
                      </Label>
                      <p className="text-sm text-[#6B7280]">
                        Improves compatibility with screen readers and provides additional context
                      </p>
                    </div>
                    <Switch
                      id="screen-reader-toggle"
                      checked={settings.screenReaderOptimized}
                      onCheckedChange={(checked) => updateSettings({ screenReaderOptimized: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Visual Settings */}
            <TabsContent value="visual" className="space-y-6">
              {/* High Contrast Mode */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-[#1EB53A]" />
                    High Contrast Mode
                  </CardTitle>
                  <CardDescription>Increase contrast for better readability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="high-contrast-toggle" className="font-medium">
                        Enable High Contrast
                      </Label>
                      <p className="text-sm text-[#6B7280]">Makes text and interface elements more distinct</p>
                    </div>
                    <Switch
                      id="high-contrast-toggle"
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-[#F9FAFB] border-t p-4 rounded-b-lg">
                  <div className="w-full">
                    <h3 className="font-medium mb-2">Preview:</h3>
                    <div
                      className={`p-4 border rounded-lg ${settings.highContrast ? "bg-black text-white" : "bg-white text-black"}`}
                    >
                      <div className="flex flex-col gap-2">
                        <div
                          className={`p-2 rounded ${settings.highContrast ? "bg-white text-black" : "bg-[#F3F4F6] text-[#374151]"}`}
                        >
                          High contrast example text
                        </div>
                        <div
                          className={`p-2 rounded ${settings.highContrast ? "bg-[#1EB53A] text-white" : "bg-[#1EB53A]/10 text-[#0A7B24]"}`}
                        >
                          Button example
                        </div>
                        <div
                          className={`p-2 rounded ${settings.highContrast ? "border-2 border-white" : "border border-[#D1D5DB]"}`}
                        >
                          Border example
                        </div>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>

              {/* Reduced Motion */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-[#1EB53A]" />
                    Reduced Motion
                  </CardTitle>
                  <CardDescription>Minimize animations and transitions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reduced-motion-toggle" className="font-medium">
                        Enable Reduced Motion
                      </Label>
                      <p className="text-sm text-[#6B7280]">Reduces or eliminates animations and motion effects</p>
                    </div>
                    <Switch
                      id="reduced-motion-toggle"
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Color Blindness Accommodations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-[#1EB53A]" />
                    Color Blindness Accommodations
                  </CardTitle>
                  <CardDescription>Adjust colors for different types of color vision deficiency</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={settings.colorBlindMode}
                    onValueChange={(value) => updateSettings({ colorBlindMode: value as any })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none" className="font-medium">
                        No Adjustment
                      </Label>
                      <span className="text-sm text-[#6B7280] ml-2">Standard colors</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="protanopia" id="protanopia" />
                      <Label htmlFor="protanopia" className="font-medium">
                        Protanopia
                      </Label>
                      <span className="text-sm text-[#6B7280] ml-2">Red-blind</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="deuteranopia" id="deuteranopia" />
                      <Label htmlFor="deuteranopia" className="font-medium">
                        Deuteranopia
                      </Label>
                      <span className="text-sm text-[#6B7280] ml-2">Green-blind</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tritanopia" id="tritanopia" />
                      <Label htmlFor="tritanopia" className="font-medium">
                        Tritanopia
                      </Label>
                      <span className="text-sm text-[#6B7280] ml-2">Blue-blind</span>
                    </div>
                  </RadioGroup>
                </CardContent>
                <CardFooter className="bg-[#F9FAFB] border-t p-4 rounded-b-lg">
                  <div className="w-full">
                    <h3 className="font-medium mb-2">Preview:</h3>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="p-2 rounded bg-red-500 text-white text-center">Red</div>
                      <div className="p-2 rounded bg-green-500 text-white text-center">Green</div>
                      <div className="p-2 rounded bg-blue-500 text-white text-center">Blue</div>
                      <div className="p-2 rounded bg-yellow-500 text-white text-center">Yellow</div>
                    </div>
                    <p className="text-sm text-[#6B7280] mt-2">
                      Color adjustments will be applied throughout the application
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Audio & Media Settings */}
            <TabsContent value="audio" className="space-y-6">
              {/* Audio Playback Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-[#1EB53A]" />
                    Audio Playback
                  </CardTitle>
                  <CardDescription>Configure how audio content is played</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="playback-speed" className="font-medium">
                      Playback Speed
                    </Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7280]">0.5x</span>
                      <Slider
                        id="playback-speed"
                        className="mx-4 flex-1"
                        defaultValue={[1]}
                        min={0.5}
                        max={2}
                        step={0.25}
                      />
                      <span className="text-sm text-[#6B7280]">2x</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volume" className="font-medium">
                      Volume
                    </Label>
                    <div className="flex items-center justify-between">
                      <Volume2 className="h-4 w-4 text-[#6B7280]" />
                      <Slider id="volume" className="mx-4 flex-1" defaultValue={[80]} min={0} max={100} />
                      <span className="text-sm text-[#6B7280]">80%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <Label htmlFor="auto-play-toggle" className="font-medium">
                        Auto-play Audio
                      </Label>
                      <p className="text-sm text-[#6B7280]">Automatically play audio content when available</p>
                    </div>
                    <Switch id="auto-play-toggle" defaultChecked={false} />
                  </div>
                </CardContent>
              </Card>

              {/* Text-to-Speech */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-[#1EB53A]" />
                    Text-to-Speech
                  </CardTitle>
                  <CardDescription>Configure text-to-speech settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="voice-selector" className="font-medium">
                      Voice
                    </Label>
                    <select
                      id="voice-selector"
                      className="w-full p-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1EB53A]"
                    >
                      <option value="female-en">English - Female</option>
                      <option value="male-en">English - Male</option>
                      <option value="female-sw">Kiswahili - Female</option>
                      <option value="male-sw">Kiswahili - Male</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="speech-rate" className="font-medium">
                      Speech Rate
                    </Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7280]">Slow</span>
                      <Slider
                        id="speech-rate"
                        className="mx-4 flex-1"
                        defaultValue={[1]}
                        min={0.5}
                        max={2}
                        step={0.1}
                      />
                      <span className="text-sm text-[#6B7280]">Fast</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <Label htmlFor="highlight-toggle" className="font-medium">
                        Highlight Text While Reading
                      </Label>
                      <p className="text-sm text-[#6B7280]">Visually highlight text as it's being read</p>
                    </div>
                    <Switch id="highlight-toggle" defaultChecked={true} />
                  </div>
                </CardContent>
                <CardFooter className="bg-[#F9FAFB] border-t p-4 rounded-b-lg">
                  <Button className="bg-[#1EB53A] hover:bg-[#0A7B24] text-white w-full">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Test Text-to-Speech
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Navigation Settings */}
            <TabsContent value="navigation" className="space-y-6">
              {/* Keyboard Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Keyboard className="h-5 w-5 text-[#1EB53A]" />
                    Keyboard Navigation
                  </CardTitle>
                  <CardDescription>Enhance keyboard navigation throughout the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="keyboard-focus-toggle" className="font-medium">
                        Enhanced Focus Indicators
                      </Label>
                      <p className="text-sm text-[#6B7280]">
                        Make keyboard focus more visible throughout the application
                      </p>
                    </div>
                    <Switch id="keyboard-focus-toggle" defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="keyboard-shortcuts-toggle" className="font-medium">
                        Enable Keyboard Shortcuts
                      </Label>
                      <p className="text-sm text-[#6B7280]">Use keyboard shortcuts for common actions</p>
                    </div>
                    <Switch id="keyboard-shortcuts-toggle" defaultChecked={true} />
                  </div>
                </CardContent>
                <CardFooter className="bg-[#F9FAFB] border-t p-4 rounded-b-lg">
                  <div className="w-full space-y-2">
                    <h3 className="font-medium">Common Shortcuts:</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Search</span>
                        <kbd className="px-2 py-1 bg-[#F3F4F6] rounded border border-[#D1D5DB]">Ctrl + K</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Home</span>
                        <kbd className="px-2 py-1 bg-[#F3F4F6] rounded border border-[#D1D5DB]">Alt + H</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Next Chapter</span>
                        <kbd className="px-2 py-1 bg-[#F3F4F6] rounded border border-[#D1D5DB]">Alt + →</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Previous Chapter</span>
                        <kbd className="px-2 py-1 bg-[#F3F4F6] rounded border border-[#D1D5DB]">Alt + ←</kbd>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>

              {/* Simplified Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-[#1EB53A]" />
                    Simplified Navigation
                  </CardTitle>
                  <CardDescription>Enable a simpler navigation experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="simplified-nav-toggle" className="font-medium">
                        Use Simplified Navigation
                      </Label>
                      <p className="text-sm text-[#6B7280]">
                        Provides a more straightforward navigation with larger buttons and fewer options
                      </p>
                    </div>
                    <Switch
                      id="simplified-nav-toggle"
                      checked={settings.useSimplifiedNavigation}
                      onCheckedChange={(checked) => updateSettings({ useSimplifiedNavigation: checked })}
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-[#F9FAFB] border-t p-4 rounded-b-lg">
                  <div className="w-full">
                    <h3 className="font-medium mb-2">Preview:</h3>
                    <div className="p-4 border rounded-lg bg-white">
                      <div className={`flex ${settings.useSimplifiedNavigation ? "flex-col gap-2" : "flex-row gap-4"}`}>
                        <Button
                          className={`bg-[#1EB53A] text-white ${settings.useSimplifiedNavigation ? "py-6 text-lg w-full" : ""}`}
                        >
                          Home
                        </Button>
                        <Button
                          className={`bg-[#1EB53A] text-white ${settings.useSimplifiedNavigation ? "py-6 text-lg w-full" : ""}`}
                        >
                          Chapters
                        </Button>
                        <Button
                          className={`bg-[#1EB53A] text-white ${settings.useSimplifiedNavigation ? "py-6 text-lg w-full" : ""}`}
                        >
                          Search
                        </Button>
                      </div>
                    </div>
                  </div>
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
