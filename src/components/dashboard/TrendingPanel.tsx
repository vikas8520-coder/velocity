"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { cn, formatNumber, PLATFORMS, type Platform } from "@/lib/utils"
import { 
  Music, Camera, Play, Eye, Zap, Share2, 
  ChevronLeft, ChevronRight, Sparkles, Filter
} from "lucide-react"

interface TrendingItem {
  id: string
  platform: Platform
  niche: string
  title: string
  url: string
  thumbnailUrl: string
  views: number
  likes: number
  comments: number
  shares: number
  engagementRate: number
  postedAt: number
  authorHandle: string
  authorFollowers: number
  tags: string[]
}

interface TrendingPanelProps {
  onSelectReference: (item: TrendingItem) => void
  selectedNiche?: string
  selectedPlatform?: Platform
}

export function TrendingPanel({ onSelectReference, selectedNiche, selectedPlatform }: TrendingPanelProps) {
  const [trending, setTrending] = useState<TrendingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentNiche, setCurrentNiche] = useState(selectedNiche || "productivity")
  const [currentPlatform, setCurrentPlatform] = useState<Platform | "all">(selectedPlatform || "all")

  const niches = ["productivity", "AI", "laundry", "business", "tech", "lifestyle"]
  const platforms: ("all" | Platform)[] = ["all", "tiktok", "instagram", "youtube"]

  useEffect(() => {
    fetchTrending()
  }, [currentNiche, currentPlatform])

  const fetchTrending = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (currentNiche) params.set("niche", currentNiche)
      if (currentPlatform !== "all") params.set("platform", currentPlatform)
      params.set("limit", "10")
      
      const res = await fetch(`/api/trending?${params}`)
      const data = await res.json()
      setTrending(data.trending || [])
    } catch (error) {
      console.error("Failed to fetch trending:", error)
    } finally {
      setLoading(false)
    }
  }

  const platformInfo = PLATFORMS.find(p => p.id === currentPlatform)
  const allPlatformsInfo = PLATFORMS

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Trending Reference</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-xs">
            <Filter className="w-3 h-3" />
            {currentNiche}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 pt-0 space-y-3">
        {/* Niche Filter */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {niches.map(niche => (
            <Button
              key={niche}
              variant={currentNiche === niche ? "primary" : "outline"}
              size="sm"
              className="whitespace-nowrap shrink-0"
              onClick={() => setCurrentNiche(niche)}
            >
              {niche.charAt(0).toUpperCase() + niche.slice(1)}
            </Button>
          ))}
        </div>

        {/* Platform Filter */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {platforms.map(platform => (
            <Button
              key={platform}
              variant={currentPlatform === platform ? "primary" : "outline"}
              size="sm"
              className="whitespace-nowrap shrink-0 gap-1"
              onClick={() => setCurrentPlatform(platform)}
              style={{ borderColor: platform !== "all" ? platformInfo?.color : undefined }}
            >
              {platform !== "all" && (
                <>
                  {platform === "tiktok" && <Music className="w-3 h-3" />}
                  {platform === "instagram" && <Camera className="w-3 h-3" />}
                  {platform === "youtube" && <Play className="w-3 h-3" />}
                </>
              )}
              {platform === "all" ? "All" : platform.charAt(0).toUpperCase() + platform.slice(1)}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : trending.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No trending content found</p>
            <p className="text-sm">Try a different niche or platform</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {trending.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="group relative"
              >
                <div 
                  className="relative aspect-video rounded-xl overflow-hidden bg-muted cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/10"
                  onClick={() => onSelectReference(item)}
                >
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Platform Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge variant="default" className="gap-1 px-2 py-1" style={{ backgroundColor: PLATFORMS.find(p => p.id === item.platform)?.color }}>
                      {item.platform === "tiktok" && <Music className="w-3 h-3" />}
                      {item.platform === "instagram" && <Camera className="w-3 h-3" />}
                      {item.platform === "youtube" && <Play className="w-3 h-3" />}
                    </Badge>
                  </div>

                  {/* Engagement Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex items-center gap-4 text-white text-sm">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatNumber(item.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {(item.engagementRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-white font-medium mt-2 line-clamp-2">{item.title}</p>
                    <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                      <Share2 className="w-3 h-3" />
                      Use as reference
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    @{item.authorHandle}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {(item.engagementRate * 100).toFixed(1)}% engagement
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  )
}