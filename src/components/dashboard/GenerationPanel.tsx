"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { cn, BRANDS, CONTENT_FORMATS, PLATFORMS, type BrandId, type ContentFormat, type Platform } from "@/lib/utils"
import { Sparkles, Zap, Loader2, ArrowRight, Settings, Music, Camera, Play } from "lucide-react"

interface GenerationPanelProps {
  onGenerate: (config: GenerationConfig) => void
  isGenerating: boolean
  generatedCount: number
}

interface GenerationConfig {
  brandId: BrandId
  format: ContentFormat
  platform: Platform
  referenceContentId?: string
  count: number
  customPrompt?: string
}

export function GenerationPanel({ onGenerate, isGenerating, generatedCount }: GenerationPanelProps) {
  const [config, setConfig] = useState<GenerationConfig>({
    brandId: "saga-os",
    format: "hook-demo",
    platform: "tiktok",
    count: 5,
    customPrompt: "",
  })

  const brand = BRANDS.find(b => b.id === config.brandId)
  const format = CONTENT_FORMATS.find(f => f.id === config.format)
  const platform = PLATFORMS.find(p => p.id === config.platform)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Generate Content</CardTitle>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="w-3 h-3" />
            {generatedCount} generated
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 pt-0 space-y-4">
        {/* Brand Selector */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Brand</Label>
          <select
            value={config.brandId}
            onChange={(e) => setConfig(prev => ({ ...prev, brandId: e.target.value as BrandId }))}
            className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {BRANDS.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          
          {brand && (
            <p className="text-xs text-muted-foreground mt-1">{brand.description}</p>
          )}
        </div>

        {/* Format Selector */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Content Format</Label>
          <select
            value={config.format}
            onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as ContentFormat }))}
            className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {CONTENT_FORMATS.map(f => (
              <option key={f.id} value={f.id}>{f.name} - {f.description}</option>
            ))}
          </select>
        </div>

        {/* Platform Selector */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Target Platform</Label>
          <div className="grid grid-cols-3 gap-2">
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                onClick={() => setConfig(prev => ({ ...prev, platform: p.id }))}
                className={cn(
                  "relative p-3 rounded-lg border-2 transition-all text-left",
                  config.platform === p.id
                    ? `border-${p.id === "tiktok" ? "neutral" : p.id === "instagram" ? "pink" : "red"}-500 bg-${p.id === "tiktok" ? "neutral" : p.id === "instagram" ? "pink" : "red"}-50`
                    : "border-gray-200 hover:border-primary/50 dark:border-gray-700"
                )}
                style={{ borderColor: config.platform === p.id ? p.color : undefined }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {p.id === "tiktok" && <Music className="w-4 h-4" style={{ color: p.color }} />}
                  {p.id === "instagram" && <Camera className="w-4 h-4" style={{ color: p.color }} />}
                  {p.id === "youtube" && <Play className="w-4 h-4" style={{ color: p.color }} />}
                  <span className="font-medium text-sm">{p.name.split(" ")[0]}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {p.id === "tiktok" && "60s max"}
                  {p.id === "instagram" && "90s max"}
                  {p.id === "youtube" && "60s max"}
                </p>
                {config.platform === p.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Zap className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Variations to Generate <span className="text-muted-foreground font-normal">({config.count})</span>
          </Label>
          <input
            type="range"
            min="1"
            max="10"
            value={config.count}
            onChange={(e) => setConfig(prev => ({ ...prev, count: parseInt(e.target.value) }))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Custom Prompt */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Custom Instructions (Optional)</Label>
          <textarea
            value={config.customPrompt}
            onChange={(e) => setConfig(prev => ({ ...prev, customPrompt: e.target.value }))}
            placeholder="e.g., Focus on beginner tips, use humor, mention specific feature..."
            className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Guide the AI on angle, tone, or specific points to cover
          </p>
        </div>

        {/* Current Selection Summary */}
        <div className="p-3 bg-muted/50 rounded-lg border space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ready to Generate</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default" style={{ backgroundColor: brand?.color }}>
              {brand?.name}
            </Badge>
            <Badge variant="outline">{format?.name}</Badge>
            <Badge variant="outline" style={{ borderColor: platform?.color }}>
              {platform?.icon === "music" && <Music className="w-3 h-3 mr-1" />}
              {platform?.icon === "camera" && <Camera className="w-3 h-3 mr-1" />}
              {platform?.icon === "play" && <Play className="w-3 h-3 mr-1" />}
              {platform?.name}
            </Badge>
            <Badge variant="secondary">{config.count} variations</Badge>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          size="lg"
          className="w-full"
          onClick={() => onGenerate(config)}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating {config.count} variations...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Content
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {/* Tips */}
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 text-sm">
          <p className="font-medium text-primary mb-2 flex items-center gap-1">
            <Settings className="w-3 h-3" />
            Pro Tips
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Hook-Demo works best for product launches</li>
            <li>• Slideshow format gets high saves on Instagram</li>
            <li>• Trending Adaptation = fastest viral potential</li>
            <li>• TikTok favors raw/authentic, Instagram favors polished</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}