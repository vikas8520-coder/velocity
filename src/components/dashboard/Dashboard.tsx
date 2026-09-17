"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { SwipeDeck, SwipeDeckProps } from "@/components/swipe/SwipeDeck"
import { GenerationPanel } from "@/components/dashboard/GenerationPanel"
import { TrendingPanel } from "@/components/dashboard/TrendingPanel"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Badge } from "@/components/ui/Badge"
import { cn, CONTENT_FORMATS, PLATFORMS, ContentItem } from "@/lib/utils"
import { Sparkles, CheckCircle2, X, Calendar, Clock, Share2, Plus, Settings, Music, Camera, Play, Mic, MicOff, Waves, Bot } from "lucide-react"

interface DashboardContent extends ContentItem {
  status: "pending_review" | "approved" | "rejected" | "scheduled" | "published"
  scheduledAt?: number
  publishedAt?: number
  audioUrl?: string
}

export function Dashboard() {
  const [generatedContents, setGeneratedContents] = useState<DashboardContent[]>([])
  const [pendingReview, setPendingReview] = useState<DashboardContent[]>([])
  const [approvedContents, setApprovedContents] = useState<DashboardContent[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedReference, setSelectedReference] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<string>("review")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingContentId, setRecordingContentId] = useState<string | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const fluidVoiceRef = useRef<{ start: () => void; stop: () => void } | null>(null)

  // Check for FluidVoice availability
  useEffect(() => {
    // In a real app, this would connect to FluidVoice's local API
    // For demo, we'll simulate it
    fluidVoiceRef.current = {
      start: () => {
        console.log("FluidVoice: Starting recording...")
        startRecording()
      },
      stop: () => {
        console.log("FluidVoice: Stopping recording...")
        stopRecording()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)
        if (recordingContentId) {
          setPendingReview(prev => prev.map(c => 
            c.id === recordingContentId ? { ...c, audioUrl } : c
          ))
        }
        setRecordingContentId(null)
      }
      
      mediaRecorderRef.current.start(100)
      setIsRecording(true)
      setRecordingContentId(recordingContentId)
      
      // Simulate audio level
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
      
      return () => clearInterval(interval)
    } catch (error) {
      console.error("Failed to start recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
    setAudioLevel(0)
  }

  const handleAudioRecord = useCallback((contentId: string) => {
    if (isRecording && recordingContentId === contentId) {
      stopRecording()
    } else {
      setRecordingContentId(contentId)
      startRecording()
    }
  }, [isRecording, recordingContentId])

  const handleGenerate = useCallback(async (config: any) => {
    setIsGenerating(true)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      const data = await res.json()
      if (data.contents) {
        const newContents = data.contents.map((c: any) => ({
          ...c,
          status: "pending_review" as const,
        }))
        setGeneratedContents(prev => [...newContents, ...prev])
        setPendingReview(prev => [...newContents, ...prev])
      }
    } catch (error) {
      console.error("Generation failed:", error)
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const handleApprove = useCallback((id: string) => {
    const content = pendingReview.find(c => c.id === id)
    if (content) {
      const approved = { ...content, status: "approved" as const }
      setPendingReview(prev => prev.filter(c => c.id !== id))
      setApprovedContents(prev => [approved, ...prev])
    }
  }, [pendingReview])

  const handleReject = useCallback((id: string) => {
    setPendingReview(prev => prev.filter(c => c.id !== id))
  }, [])

  const handleRegenerate = useCallback((id: string) => {
    const content = pendingReview.find(c => c.id === id)
    if (content) {
      handleGenerate({
        brandId: content.brandId,
        format: content.format,
        platform: content.platform,
        customPrompt: "Create a completely different angle/approach",
        count: 1,
      })
    }
  }, [pendingReview, handleGenerate])

  const handleSelectReference = useCallback((item: any) => {
    setSelectedReference(item)
    if (pendingReview.length > 0) {
      setPendingReview(prev => prev.map((c, i) => 
        i === 0 ? { ...c, referenceContent: item } : c
      ))
    }
  }, [pendingReview])

  // Mock data for demo
  if (pendingReview.length === 0 && generatedContents.length === 0) {
    setPendingReview([
      {
        id: "demo_1",
        title: "3 AI Tools That Replaced My $500/mo Stack",
        script: "[0-3s] HOOK: \"I was wasting $500/month on tools that do the same thing...\"\n\n[3-8s] PROBLEM: Show cluttered desktop with 10+ subscriptions\n\n[8-15s] SOLUTION: Reveal 3 tools that do it all\n- Tool 1: Does X, Y, Z\n- Tool 2: Handles A, B, C\n- Tool 3: Automates D, E, F\n\n[15-25s] DEMO: Quick screen recording of each\n\n[25-30s] CTA: \"Link in bio for my full stack\"",
        caption: "Stop overpaying for tools 🛑\n\nThese 3 AI tools replaced my entire $500/month subscription stack:\n\n1️⃣ Tool One - Does everything\n2️⃣ Tool Two - Handles automation\n3️⃣ Tool Three - The game changer\n\nFull breakdown in bio 🔗\n\n#AI #tools #productivity #automation #saas #techstack #indiehacker #buildinpublic",
        hashtags: ["AI", "tools", "productivity", "automation", "saas", "techstack", "indiehacker", "buildinpublic"],
        format: "hook-demo",
        platform: "tiktok",
        mediaType: "video",
        metadata: {
          generationPrompt: "Generate hook-demo for AI tools",
          modelUsed: "claude-3-5-sonnet",
          duration: 30,
          aspectRatio: "9:16",
        },
        brandId: "aiarsenal",
        status: "pending_review",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: "demo_2",
        title: "My Morning Routine for 10x Output ☀️",
        script: "[0-2s] HOOK: Time-lapse of waking up at 5am\n\n[2-10s] ROUTINE: \n- 5:00 - Water + supplements\n- 5:15 - 20 min deep work (no phone)\n- 5:35 - Movement/stretch\n- 5:45 - Review daily 3 priorities\n\n[10-20s] THE SECRET: \"The 3-task rule changed everything\"\n\n[20-30s] CTA: \"Save this for tomorrow morning\"",
        caption: "Your morning determines your day ☀️\n\nMy 5am routine for 10x output:\n\n💧 Hydrate first\n🧠 20 min deep work (phone in other room)\n🧘 Movement\n📝 Top 3 priorities only\n\nThe 3-task rule = focus\n\nTry it tomorrow? Save this! 💾\n\n#morningroutine #productivity #deeppwork #habits #success #routine #motivation #entrepreneur",
        hashtags: ["morningroutine", "productivity", "deeppwork", "habits", "success", "routine", "motivation", "entrepreneur"],
        format: "slideshow",
        platform: "instagram",
        mediaType: "image",
        metadata: {
          generationPrompt: "Generate slideshow for morning routine",
          modelUsed: "gpt-4o",
          duration: 30,
          aspectRatio: "9:16",
        },
        brandId: "saga-os",
        status: "pending_review",
        createdAt: Date.now() - 1000,
        updatedAt: Date.now(),
      },
      {
        id: "demo_3",
        title: "Laundry Hack: Never Sort Again 🧺",
        script: "[0-3s] HOOK: Dumping mixed laundry in machine\n\n[3-10s] MYTH BUSTING: \"Sorting is a marketing scam\"\n- Cold water + modern detergent = safe for all colors\n- Mesh bags for delicates\n- That's it.\n\n[10-20s] DEMO: Throw everything in, add 1 pod, start\n\n[20-30s] RESULT: Clean clothes, zero sorting time\n\nCTA: \"3 hours saved per month\"",
        caption: "Laundry sorting is a MYTH 🧺❌\n\nModern cold-water detergents clean everything together:\n\n✅ Colors + whites = fine\n✅ Delicates in mesh bag\n✅ 1 pod, cold, done\n\nSaves 3 hours/month. You're welcome. 😉\n\n#laundryhack #lifehack #timesaver #laundry #cleaning #homehacks #productivity #adulting",
        hashtags: ["laundryhack", "lifehack", "timesaver", "laundry", "cleaning", "homehacks", "productivity", "adulting"],
        format: "before-after",
        platform: "youtube",
        mediaType: "video",
        metadata: {
          generationPrompt: "Generate before-after for laundry",
          modelUsed: "gpt-4o",
          duration: 30,
          aspectRatio: "9:16",
        },
        brandId: "laundryapp",
        status: "pending_review",
        createdAt: Date.now() - 2000,
        updatedAt: Date.now(),
      },
    ])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Velocity</h1>
              <p className="text-xs text-muted-foreground">AI Content Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* FluidVoice Recording Indicator */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-red-500"
                />
                <span className="text-xs font-medium text-red-500">Recording</span>
                <div className="w-20 h-1.5 bg-red-500/20 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${audioLevel}%` }}
                    className="h-full bg-red-500 transition-all duration-100"
                  />
                </div>
                <span className="text-xs text-red-500/70">{recordingContentId?.slice(0, 8)}</span>
              </motion.div>
            )}
            
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {approvedContents.length} Approved
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              {pendingReview.length} Pending
            </Badge>
            <Button variant="ghost" size="sm" className="gap-1">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Generation & Trending */}
          <div className="lg:col-span-1 space-y-6">
            <GenerationPanel 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              generatedCount={generatedContents.length}
            />
            
            <TrendingPanel 
              onSelectReference={handleSelectReference}
              selectedNiche={pendingReview[0]?.brandId === "aiarsenal" ? "AI" : 
                             pendingReview[0]?.brandId === "laundryapp" ? "laundry" : "productivity"}
            />
          </div>

          {/* Right Panel - Swipe Deck */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="review">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    Review ({pendingReview.length})
                  </span>
                </TabsTrigger>
                <TabsTrigger value="approved">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Approved ({approvedContents.length})
                  </span>
                </TabsTrigger>
                <TabsTrigger value="scheduled">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Scheduled
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="review" className="mt-4">
                {pendingReview.length > 0 ? (
                  <SwipeDeck
                    contents={pendingReview}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRegenerate={handleRegenerate}
                    onAudioRecord={handleAudioRecord}
                    onEmpty={() => setActiveTab("approved")}
                  />
                ) : (
                  <Card className="max-w-2xl mx-auto">
                    <CardContent className="py-16 px-8 text-center">
                      <Sparkles className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                      <p className="text-muted-foreground mb-6">
                        No content pending review. Generate new ideas to continue.
                      </p>
                      <Button size="lg" onClick={() => {}} className="w-full max-w-xs">
                        Generate More Content
                        <Plus className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="approved" className="mt-4">
                {approvedContents.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {approvedContents.map((content) => (
                      <Card key={content.id} className="overflow-hidden">
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          {content.mediaUrl ? (
                            content.mediaType === "video" ? (
                              <video src={content.mediaUrl} className="w-full h-full object-cover" muted />
                            ) : (
                              <img src={content.mediaUrl} alt="" className="w-full h-full object-cover" />
                            )
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <span className="text-6xl">📹</span>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge variant="success" className="gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Approved
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4 space-y-3">
                          <h4 className="font-semibold line-clamp-1">{content.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline">{CONTENT_FORMATS.find(f => f.id === content.format)?.name}</Badge>
                            <Badge variant="outline" style={{ borderColor: PLATFORMS.find(p => p.id === content.platform)?.color }}>
                              {content.platform}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{content.caption}</p>
                          <div className="flex items-center gap-2 pt-2 border-t">
                            <Button variant="ghost" size="sm" className="flex-1 gap-1">
                              <Share2 className="w-3 h-3" />
                              Schedule
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1 gap-1">
                              <Calendar className="w-3 h-3" />
                              Later
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="max-w-2xl mx-auto">
                    <CardContent className="py-16 px-8 text-center">
                      <CheckCircle2 className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Nothing Approved Yet</h3>
                      <p className="text-muted-foreground">
                        Swipe right on content you like to move it here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="scheduled" className="mt-4">
                <Card>
                  <CardContent className="py-8 text-center">
                    <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Scheduling Coming Soon</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect your TikTok, Instagram, and YouTube accounts to auto-publish approved content
                    </p>
                    <Button variant="outline" className="max-w-xs mx-auto">
                      Connect Accounts
                      <Share2 className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Selected Reference Modal */}
      {selectedReference && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedReference(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-card rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="aspect-video relative">
              <img src={selectedReference.thumbnailUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <Badge variant="default" className="mb-2" style={{ backgroundColor: PLATFORMS.find(p => p.id === selectedReference.platform)?.color }}>
                  {selectedReference.platform}
                </Badge>
                <h3 className="text-xl font-bold">{selectedReference.title}</h3>
                <p className="text-sm opacity-80">@{selectedReference.authorHandle} • {selectedReference.views.toLocaleString()} views • {(selectedReference.engagementRate * 100).toFixed(1)}% engagement</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setSelectedReference(null)}>
                  Close
                </Button>
                <Button onClick={() => { setSelectedReference(null); window.open(selectedReference.url, "_blank") }}>
                  <Share2 className="w-4 h-4 mr-2" />
                  View Original
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}