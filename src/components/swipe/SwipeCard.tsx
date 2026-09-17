"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { VideoPlayer } from "@/components/ui/VideoPlayer"
import { 
  Heart, X, RotateCcw, Copy, Download, 
  Clock, Eye, MessageSquare, Share2, 
  Music, Camera, Play, Zap, Sparkles,
  Mic, MicOff, Volume2, VolumeX
} from "lucide-react"
import { CONTENT_FORMATS, PLATFORMS, type ContentItem } from "@/lib/utils"

interface SwipeCardProps {
  content: ContentItem
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onRegenerate: (id: string) => void
  index: number
  total: number
  onAudioRecord?: (contentId: string) => void
}

export function SwipeCard({ 
  content, 
  onApprove, 
  onReject, 
  onRegenerate,
  onAudioRecord,
  index,
  total
}: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showReference, setShowReference] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  
  const dragX = useMotionValue(0)
  const springX = useSpring(dragX, { stiffness: 300, damping: 30 })
  const springRotate = useSpring(dragX, { stiffness: 300, damping: 30 })
  
  const rotate = useTransform(springRotate, [-200, 0, 200], [-15, 0, 15])
  const opacity = useTransform(springX, [-200, 0, 200], [0.7, 1, 0.7])
  
  const threshold = 120
  const maxDrag = 200
  
  const handleDragEnd = () => {
    setIsDragging(false)
    if (Math.abs(dragX.get()) > threshold) {
      if (dragX.get() > 0) onApprove(content.id)
      else onReject(content.id)
    }
    dragX.set(0)
  }

  const formatInfo = CONTENT_FORMATS.find(f => f.id === content.format)
  const platformInfo = PLATFORMS.find(p => p.id === content.platform)

  // Simulate audio level for demo
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isRecording])

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -maxDrag, right: maxDrag }}
      dragElastic={0.2}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      style={{ 
        x: springX, 
        rotate,
        opacity,
      }}
      className="relative w-full max-w-2xl mx-auto"
    >
      {/* Approve/Reject Indicators */}
      <AnimatePresence mode="wait">
        {dragX.get() > 50 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: Math.min(dragX.get() / 100, 1), scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-6 left-6 z-10 transform rotate-[-15deg] text-green-500"
            style={{ pointerEvents: "none" }}
          >
            <div className="border-4 border-green-500 rounded-xl p-3 bg-green-500/10 backdrop-blur-sm">
              <Heart className="w-8 h-8" />
            </div>
          </motion.div>
        )}
        {dragX.get() < -50 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: Math.min(Math.abs(dragX.get()) / 100, 1), scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-6 right-6 z-10 transform rotate-[15deg] text-red-500"
            style={{ pointerEvents: "none" }}
          >
            <div className="border-4 border-red-500 rounded-xl p-3 bg-red-500/10 backdrop-blur-sm">
              <X className="w-8 h-8" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Card - Video First Design */}
      <Card className="overflow-hidden h-[70vh] max-h-[600px] flex flex-col">
        {/* Top Bar - Format & Platform */}
        <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-primary/5 to-secondary/5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="gap-1 px-2 py-1">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs">{formatInfo?.name}</span>
            </Badge>
            <Badge variant="secondary" className="gap-1 px-2 py-1" style={{ borderColor: platformInfo?.color }}>
              {platformInfo?.icon === "music" && <Music className="w-3 h-3" />}
              {platformInfo?.icon === "camera" && <Camera className="w-3 h-3" />}
              {platformInfo?.icon === "play" && <Play className="w-3 h-3" />}
              <span className="text-xs">{platformInfo?.name.split(" ")[0]}</span>
            </Badge>
          </div>
          <Badge variant="outline" className="gap-1 px-2 py-1">
            <span className="text-xs">{index + 1} / {total}</span>
          </Badge>
        </div>

        {/* Video Preview - Main Focus */}
        <div className="relative flex-1 min-h-0 bg-black">
          {content.mediaUrl ? (
            <VideoPlayer
              src={content.mediaUrl}
              poster={content.mediaType === "image" ? content.mediaUrl : undefined}
              autoPlay={true}
              loop={true}
              muted={true}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/50 gap-4">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                {content.mediaType === "video" ? (
                  <Play className="w-10 h-10 ml-1" />
                ) : (
                  <Camera className="w-10 h-10" />
                )}
              </div>
              <p className="text-lg font-medium">Video will appear here</p>
              <p className="text-sm">Generate content to see preview</p>
            </div>
          )}

          {/* Recording Indicator Overlay */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 z-10"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/90 backdrop-blur-sm text-white">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-white"
                />
                <span className="text-sm font-medium">Recording</span>
                <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden ml-2">
                  <motion.div
                    animate={{ width: `${audioLevel}%` }}
                    className="h-full bg-white transition-all duration-100"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Bottom Overlay - Quick Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 gap-1"
                onClick={() => navigator.clipboard.writeText(content.caption)}
              >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy Caption</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 gap-1"
                onClick={() => navigator.clipboard.writeText(content.hashtags.map(t => `#${t}`).join(" "))}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Copy Tags</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isRecording ? "destructive" : "ghost"}
                size="sm"
                className={cn("text-white gap-1", isRecording ? "bg-red-500" : "hover:bg-white/20")}
                onClick={() => {
                  setIsRecording(!isRecording)
                  if (!isRecording && onAudioRecord) {
                    onAudioRecord(content.id)
                  }
                }}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="hidden sm:inline">{isRecording ? "Stop" : "Record"}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Expandable Details Panel */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t bg-card flex-shrink-0"
            >
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Content Details</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Title
                    </Label>
                    <p className="font-medium">{content.title}</p>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Script / Voiceover
                    </Label>
                    <div className="bg-muted/50 rounded-lg p-3 max-h-40 overflow-y-auto text-sm">
                      <p className="whitespace-pre-wrap leading-relaxed">{content.script}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(content.script)}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Script
                    </Button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        Caption
                      </Label>
                      <div className="bg-muted/50 rounded-lg p-3 max-h-24 overflow-y-auto text-sm">
                        <p className="whitespace-pre-wrap">{content.caption}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        Hashtags
                      </Label>
                      <div className="bg-muted/50 rounded-lg p-3 max-h-24 overflow-y-auto">
                        <div className="flex flex-wrap gap-1">
                          {content.hashtags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => navigator.clipboard.writeText(tag)}>
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reference Content */}
                  {content.referenceContent && (
                    <div className="border-t pt-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
                          {platformInfo?.icon === "music" && <Music className="w-5 h-5" style={{ color: platformInfo.color }} />}
                          {platformInfo?.icon === "camera" && <Camera className="w-5 h-5" style={{ color: platformInfo.color }} />}
                          {platformInfo?.icon === "play" && <Play className="w-5 h-5" style={{ color: platformInfo.color }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{content.referenceContent.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{content.referenceContent.angle}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{content.referenceContent.platform}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons - Bottom */}
        <div className="flex items-center justify-between p-3 border-t bg-muted/30 flex-shrink-0">
          <Button 
            variant="outline" 
            size="lg"
            className="flex-1 mr-1"
            onClick={() => onReject(content.id)}
            disabled={isDragging}
          >
            <X className="w-5 h-5 mx-auto" />
            <span className="hidden sm:inline">Reject</span>
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            className="flex-1 mx-1"
            onClick={() => onRegenerate(content.id)}
            disabled={isDragging}
          >
            <RotateCcw className="w-5 h-5 mx-auto" />
            <span className="hidden sm:inline">Regenerate</span>
          </Button>
          <Button 
            variant="primary" 
            size="lg"
            className="flex-1 ml-1"
            onClick={() => onApprove(content.id)}
            disabled={isDragging}
          >
            <Heart className="w-5 h-5 mx-auto" />
            <span className="hidden sm:inline">Approve</span>
          </Button>
        </div>
      </Card>

      {/* Drag Instructions */}
      {!isDragging && index === 0 && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-2"
        >
          Swipe right → Approve  |  Swipe left → Reject
        </motion.p>
      )}
    </motion.div>
  )
}