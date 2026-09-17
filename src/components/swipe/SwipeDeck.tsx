"use client"

import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SwipeCard } from "./SwipeCard"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Heart, X, RotateCcw, CheckCircle2, Sparkles } from "lucide-react"
import { cn, ContentItem, type ContentFormat, type Platform } from "@/lib/utils"

interface SwipeDeckProps {
  contents: ContentItem[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onRegenerate: (id: string) => void
  onAudioRecord?: (contentId: string) => void
  onEmpty?: () => void
}

export type { SwipeDeckProps }

export function SwipeDeck({ contents, onApprove, onReject, onRegenerate, onAudioRecord, onEmpty }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [approvedCount, setApprovedCount] = useState(0)
  const [rejectedCount, setRejectedCount] = useState(0)

  const currentContent = contents[currentIndex]
  const remaining = contents.length - currentIndex

  const handleApprove = useCallback((id: string) => {
    onApprove(id)
    setApprovedCount(c => c + 1)
    if (currentIndex < contents.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      onEmpty?.()
    }
  }, [onApprove, currentIndex, contents.length, onEmpty])

  const handleReject = useCallback((id: string) => {
    onReject(id)
    setRejectedCount(c => c + 1)
    if (currentIndex < contents.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      onEmpty?.()
    }
  }, [onReject, currentIndex, contents.length, onEmpty])

  const handleRegenerate = useCallback((id: string) => {
    onRegenerate(id)
  }, [onRegenerate])

  if (contents.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-16 px-8 text-center">
          <Sparkles className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Content to Review</h3>
          <p className="text-muted-foreground mb-6">
            Generate new content ideas to start swiping
          </p>
          <Button size="lg" onClick={() => {}} className="w-full max-w-xs">
            Generate Content
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Review Progress</span>
          <span>{currentIndex + 1} / {contents.length}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex) / contents.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Badge variant="success" className="flex-1 justify-center gap-2 px-4 py-3 text-base">
          <CheckCircle2 className="w-4 h-4" />
          Approved: {approvedCount}
        </Badge>
        <Badge variant="destructive" className="flex-1 justify-center gap-2 px-4 py-3 text-base">
          <X className="w-4 h-4" />
          Rejected: {rejectedCount}
        </Badge>
        <Badge variant="outline" className="flex-1 justify-center gap-2 px-4 py-3 text-base">
          <RotateCcw className="w-4 h-4" />
          Remaining: {remaining}
        </Badge>
      </div>

      {/* Swipe Cards Stack */}
      <AnimatePresence mode="popLayout">
        {currentContent && (
          <SwipeCard
            key={currentContent.id}
            content={currentContent}
            onApprove={handleApprove}
            onReject={handleReject}
            onRegenerate={handleRegenerate}
            onAudioRecord={onAudioRecord}
            index={currentIndex}
            total={contents.length}
          />
        )}
      </AnimatePresence>

      {/* Quick Actions for Keyboard Users */}
      <div className="flex items-center justify-center gap-4 mt-6 p-4 border-t">
        <Button 
          variant="destructive" 
          size="lg"
          className="flex-1 max-w-xs"
          onClick={() => currentContent && handleReject(currentContent.id)}
          disabled={!currentContent}
        >
          <X className="w-5 h-5 mr-2" />
          Reject
        </Button>
        <Button 
          variant="secondary" 
          size="lg"
          className="flex-1 max-w-xs"
          onClick={() => currentContent && handleRegenerate(currentContent.id)}
          disabled={!currentContent}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Regenerate
        </Button>
        <Button 
          variant="primary" 
          size="lg"
          className="flex-1 max-w-xs"
          onClick={() => currentContent && handleApprove(currentContent.id)}
          disabled={!currentContent}
        >
          <Heart className="w-5 h-5 mr-2" />
          Approve
        </Button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        Keyboard: ← Reject &nbsp;|&nbsp; → Approve &nbsp;|&nbsp; ↑ Regenerate
      </p>
    </div>
  )
}