import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"
import { CONTENT_FORMATS, PLATFORMS, type ContentFormat, type Platform, BRANDS } from "@/lib/utils"

const ContentSchema = z.object({
  title: z.string().describe("Catchy, platform-optimized title (max 100 chars)"),
  script: z.string().describe("Full video script with timing cues, hooks, and CTAs"),
  caption: z.string().describe("Platform-optimized caption with emojis and line breaks"),
  hashtags: z.array(z.string()).min(5).max(15).describe("Relevant hashtags without # symbol"),
  generationPrompt: z.string().describe("The prompt used for generation"),
})

export interface GenerationInput {
  brand: {
    id: string
    name: string
    description: string
    niches: string[]
    targetAudience: string
    tone: string
  }
  format: ContentFormat
  platform: Platform
  referenceContent?: {
    title: string
    url: string
    platform: string
    views: number
  }
  customPrompt?: string
}

export interface GeneratedContent {
  title: string
  script: string
  caption: string
  hashtags: string[]
  generationPrompt: string
}

const formatDescriptions: Record<ContentFormat, string> = {
  "hook-demo": "Hook Demo: Problem → Agitation → Solution in 15-30 seconds. Start with a visual hook, show the pain point, reveal your solution.",
  "slideshow": "Slideshow: 5-7 slides carousel style. Each slide = one key point. Text overlay friendly. Educational or listicle format.",
  "trending-adapt": "Trending Adaptation: Take a viral trend and adapt it to the brand's niche. Keep the format but change the message.",
  "storytelling": "Storytelling: Personal journey narrative. Hook → Background → Struggle → Discovery → Result → CTA.",
  "before-after": "Before/After: Split screen or sequential. Show the problem state, then the transformation with your product.",
}

const platformSpecs: Record<Platform, { maxDuration: number; aspectRatio: string; style: string }> = {
  tiktok: { maxDuration: 60, aspectRatio: "9:16", style: "Fast-paced, trend-aware, native TikTok culture, use trending sounds" },
  instagram: { maxDuration: 90, aspectRatio: "9:16", style: "Aesthetic, polished, carousel-friendly, community-focused, use Reels trends" },
  youtube: { maxDuration: 60, aspectRatio: "9:16", style: "Value-packed, searchable titles, strong hooks, educational or entertaining" },
}

// Mock content generator for demo mode when AI keys are not available
function generateMockContent(input: GenerationInput, variation: number): GeneratedContent {
  const { brand, format, platform } = input
  const formatDesc = formatDescriptions[format]
  const platformSpec = platformSpecs[platform]
  
  const mockTemplates: Record<ContentFormat, { titles: string[]; scripts: string[]; captions: string[]; hashtags: string[][] }> = {
    "hook-demo": {
      titles: [
        `3 ${brand.name} Tools That Replaced My $500/Month Stack`,
        `Stop Wasting Time on Manual ${brand.name} Work`,
        `The ${brand.name} Hack That Saved Me 10 Hours/Week`,
      ],
      scripts: [
        `[0-3s] HOOK: "I was wasting $500/month on tools that do the same thing..."

[3-8s] PROBLEM: Show cluttered desktop with 10+ subscriptions

[8-15s] SOLUTION: Reveal 3 tools that do it all
- Tool 1: Does X, Y, Z
- Tool 2: Handles A, B, C
- Tool 3: Automates D, E, F

[15-25s] DEMO: Quick screen recording of each

[25-30s] CTA: "Link in bio for my full stack"`,
        `[0-2s] HOOK: "What if I told you 80% of your ${brand.name} workflow is unnecessary?"

[2-8s] PROBLEM: Manual repetitive tasks eating your day

[8-18s] SOLUTION: The 3-step automation framework
- Step 1: Identify the pattern
- Step 2: Build the template
- Step 3: Set it and forget it

[18-30s] CTA: "Comment 'AUTO' for my free template"`,
      ],
      captions: [
        `Stop overpaying for tools 🛑

These 3 ${brand.name} tools replaced my entire $500/month subscription stack:

1️⃣ Tool One - Does everything
2️⃣ Tool Two - Handles automation
3️⃣ Tool Three - The game changer

Full breakdown in bio 🔗

#${brand.name.toLowerCase().replace(/\s+/g, '')} #productivity #automation #saas #techstack #indiehacker #buildinpublic`,
        `Your ${brand.name} workflow is 80% waste ♻️

The 3-step framework that changed everything:
1️⃣ Identify the pattern
2️⃣ Build the template  
3️⃣ Set & forget

Saved me 10 hrs/week. You're welcome. 😉

#${brand.name.toLowerCase().replace(/\s+/g, '')} #automation #productivity #workflow #efficiency #lifehack`,
      ],
      hashtags: [
        ["productivity", "automation", "saas", "techstack", "indiehacker", "buildinpublic", "tools", "workflow"],
        ["workflow", "automation", "productivity", "efficiency", "lifehack", "timesaver", "template", "framework"],
      ],
    },
    "slideshow": {
      titles: [
        `My ${brand.name} Routine for 10x Output`,
        `5 ${brand.name} Habits That Changed My Life`,
        `The ${brand.name} Morning Routine Top 1% Use`,
      ],
      scripts: [
        `[0-2s] HOOK: Time-lapse of starting ${brand.name} routine

[2-10s] ROUTINE: 
- Step 1: Setup & prep
- Step 2: Deep work block (no distractions)
- Step 3: Quick review & adjust
- Step 4: Batch similar tasks
- Step 5: End of day shutdown

[10-20s] THE SECRET: "The 3-task rule changed everything"

[20-30s] CTA: "Save this for tomorrow!"`,
        `[0-3s] HOOK: "These 5 habits 10x'd my ${brand.name} results"

[3-12s] HABITS:
1. Morning planning (5 min)
2. Deep work blocks (90 min)
3. Distraction audit (weekly)
4. Progress tracking (daily)
5. Evening reflection (10 min)

[12-25s] PROOF: Show before/after metrics

[25-30s] CTA: "Which habit will you try first?"]`,
      ],
      captions: [
        `Your ${brand.name} routine determines your results 📈

My 5-step system for 10x output:
1️⃣ Plan the night before
2️⃣ 90-min deep work blocks
3️⃣ Weekly distraction audit
4️⃣ Daily progress tracking
5️⃣ Evening reflection

The 3-task rule = laser focus 🎯

Save for tomorrow! 💾

#${brand.name.toLowerCase().replace(/\s+/g, '')} #productivity #routine #habits #success #deeppwork #entrepreneur`,
        `5 ${brand.name} habits that changed everything 🔥

1. Morning planning (5 min)
2. Deep work blocks (90 min)
3. Weekly distraction audit
4. Daily progress tracking
5. Evening reflection (10 min)

Consistency > Intensity. Always.

Which one starts tomorrow? 👇

#${brand.name.toLowerCase().replace(/\s+/g, '')} #habits #routine #productivity #success #growth #mindset`,
      ],
      hashtags: [
        ["morningroutine", "productivity", "deeppwork", "habits", "success", "routine", "motivation", "entrepreneur"],
        ["habits", "routine", "productivity", "success", "growth", "mindset", "consistency", "discipline"],
      ],
    },
    "trending-adapt": {
      titles: [
        `This ${brand.name} Trend Is Everywhere Right Now`,
        `Viral ${brand.name} Format Adapted for You`,
        `The ${brand.name} Trend Everyone's Copying`,
      ],
      scripts: [
        `[0-3s] HOOK: Show trending format in ${brand.name} niche

[3-10s] THE TREND: "Everyone's doing this [specific format]"

[10-20s] MY TAKE: Adapt it to ${brand.description}
- Keep the engaging structure
- Swap the message for ${brand.niches[0]}
- Add your unique angle

[20-30s] CTA: "Try this format and tag me!"]`,
        `[0-2s] HOOK: Side-by-side: viral original vs my adaptation

[2-12s] BREAKDOWN: Why this works
- Hook: [specific technique]
- Pacing: [timing secret]
- Visual: [style choice]

[12-25s] YOUR VERSION: Step-by-step recreation

[25-30s] CTA: "Steal this format for your niche"]`,
      ],
      captions: [
        `This ${brand.name} trend is taking over 📈

Viral format adapted for ${brand.niches[0]}:
✅ Same engaging structure
✅ Your niche's language
✅ Your unique perspective

Try it and tag me! 👇

#${brand.name.toLowerCase().replace(/\s+/g, '')} #trending #viralformat #adaptation #${brand.niches[0]} #contentcreation`,
        `Steal this viral format for your ${brand.niches[0]} content 🎬

The secret sauce:
🎯 Hook: [technique]
⏱️ Pacing: [secret]
🎨 Visual: [style]

Step-by-step breakdown in video!

#${brand.name.toLowerCase().replace(/\s+/g, '')} #contentcreation #viralformat #trending #${brand.niches[0]} #creator`,
      ],
      hashtags: [
        ["trending", "viralformat", "adaptation", "contentcreation", "creator", "socialmedia", "growth", "strategy"],
        ["contentcreation", "viralformat", "trending", "creator", "socialmedia", "growth", "strategy", "format"],
      ],
    },
    "storytelling": {
      titles: [
        `How I Built ${brand.name} From $0 to $10K/Month`,
        `My ${brand.name} Journey: From Failure to Success`,
        `The ${brand.name} Mistake That Cost Me $50K`,
      ],
      scripts: [
        `[0-3s] HOOK: "I lost $50K on my first ${brand.name} attempt..."

[3-10s] BACKGROUND: Where I started, what I knew

[10-20s] STRUGGLE: The mistakes, the failures, the almost-quitting

[20-25s] DISCOVERY: The insight that changed everything

[25-30s] RESULT: Where I am now + CTA`,
        `[0-2s] HOOK: Timeline: $0 → $1K → $10K/month with ${brand.name}

[2-15s] JOURNEY: The phases, the pivots, the lessons

[15-25s] KEY INSIGHT: The one thing that mattered most

[25-30s] CTA: "Full story in my newsletter - link in bio"]`,
      ],
      captions: [
        `From $0 to $10K/month with ${brand.name} 📈

The journey wasn't linear:
📉 Failed first attempt (-$50K)
🔄 Pivoted 3 times
💡 Found the winning insight
🚀 Now helping others avoid my mistakes

Full story in bio 🔗

#${brand.name.toLowerCase().replace(/\s+/g, '')} #entrepreneur #journey #buildinpublic #success #failure #lessons`,
        `Timeline: $0 → $1K → $10K/month with ${brand.name}

The 3 phases:
1️⃣ Learning (months 1-3)
2️⃣ Building (months 4-8)
3️⃣ Scaling (months 9+)

The ONE insight that changed everything: [insight]

Newsletter in bio for full breakdown 📬

#${brand.name.toLowerCase().replace(/\s+/g, '')} #entrepreneur #buildinpublic #growth #journey #success`,
      ],
      hashtags: [
        ["entrepreneur", "journey", "buildinpublic", "success", "failure", "lessons", "growth", "startup"],
        ["entrepreneur", "buildinpublic", "growth", "journey", "success", "startup", "founder", "story"],
      ],
    },
    "before-after": {
      titles: [
        `${brand.name} Transformation: Before vs After`,
        `What 30 Days of ${brand.name} Did For Me`,
        `The ${brand.name} Change You Need to See`,
      ],
      scripts: [
        `[0-3s] HOOK: Split screen - chaotic before / organized after

[3-10s] BEFORE: The pain points, the mess, the frustration

[10-20s] THE CHANGE: Implementing ${brand.name} step by step

[20-28s] AFTER: The results, the metrics, the feeling

[28-30s] CTA: "Link in bio to start your transformation"]`,
        `[0-2s] HOOK: "30 days ago my ${brand.niches[0]} was a disaster"

[2-12s] BEFORE: Show the chaos

[12-22s] PROCESS: Daily ${brand.name} implementation

[22-28s] AFTER: The transformation

[28-30s] CTA: "Your turn - link in bio"]`,
      ],
      captions: [
        `${brand.name} transformation: 30 days later 📸

BEFORE: Chaos, overwhelm, zero system
AFTER: Organized, automated, peaceful

The change: ${brand.name} + consistency

Your transformation starts here 👇

#${brand.name.toLowerCase().replace(/\s+/g, '')} #transformation #beforeafter #results #30days #progress #${brand.niches[0]}`,
        `30 days of ${brand.name} changed everything 🔄

Before: Manual, scattered, stressful
After: Systemized, automated, calm

The framework:
1️⃣ Audit current state
2️⃣ Implement ${brand.name}
3️⃣ Automate & optimize
4️⃣ Maintain & scale

Start your 30-day challenge 👇

#${brand.name.toLowerCase().replace(/\s+/g, '')} #30daychallenge #transformation #progress #systems #automation`,
      ],
      hashtags: [
        ["transformation", "beforeafter", "results", "30days", "progress", "growth", "change", "improvement"],
        ["30daychallenge", "transformation", "progress", "systems", "automation", "habits", "consistency", "results"],
      ],
    },
  }

  const templates = mockTemplates[format]
  const idx = variation % templates.titles.length
  
  return {
    title: templates.titles[idx],
    script: templates.scripts[idx],
    caption: templates.captions[idx],
    hashtags: templates.hashtags[idx % templates.hashtags.length],
    generationPrompt: `Mock generation for ${brand.name} - ${format} on ${platform} (variation ${variation + 1})`,
  }
}

export async function generateContent(input: GenerationInput): Promise<GeneratedContent> {
  const { brand, format, platform, referenceContent, customPrompt } = input
  const formatDesc = formatDescriptions[format]
  const platformSpec = platformSpecs[platform]
  
  const referenceSection = referenceContent ? `
REFERENCE CONTENT TO ADAPT:
- Title: "${referenceContent.title}"
- Platform: ${referenceContent.platform}
- Views: ${referenceContent.views.toLocaleString()}
- URL: ${referenceContent.url}

Adapt this viral format to ${brand.name}'s niche (${brand.niches.join(", ")}). Keep the engaging structure but make it about ${brand.description}.
` : ""

  const prompt = `
You are an expert short-form content strategist for ${brand.name}.

BRAND CONTEXT:
- Name: ${brand.name}
- Description: ${brand.description}
- Niches: ${brand.niches.join(", ")}
- Target Audience: ${brand.targetAudience}
- Tone: ${brand.tone}

CONTENT REQUIREMENTS:
- Format: ${format} - ${formatDesc}
- Platform: ${platform} (${platformSpec.style})
- Max Duration: ${platformSpec.maxDuration}s
- Aspect Ratio: ${platformSpec.aspectRatio}
${referenceSection}

${customPrompt ? `ADDITIONAL INSTRUCTIONS: ${customPrompt}` : ""}

Generate a complete content package including:
1. A scroll-stopping title (platform-optimized)
2. A detailed script with visual cues, timing, and hooks
3. An engaging caption with emojis and line breaks
4. 8-12 relevant hashtags (without # symbol)

The content should feel native to ${platform}, match ${brand.name}'s voice, and drive engagement.
`

  // Check if AI keys are available
  const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-") && !process.env.OPENAI_API_KEY.includes("placeholder")
  const hasAnthropic = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.startsWith("sk-ant-") && !process.env.ANTHROPIC_API_KEY.includes("placeholder")
  
  if (!hasOpenAI && !hasAnthropic) {
    // Demo mode - return mock content with variation 0 (will be overridden by generateMultipleContents)
    return generateMockContent(input, 0)
  }

  const model = platform === "tiktok" && hasAnthropic ? anthropic("claude-3-5-sonnet-20241022") : (hasOpenAI ? openai("gpt-4o") : anthropic("claude-3-5-sonnet-20241022"))

  try {
    const { object } = await generateObject({
      model,
      schema: ContentSchema,
      prompt,
      temperature: 0.8,
    })

    return {
      ...object,
      generationPrompt: prompt.slice(0, 500),
    }
  } catch (error) {
    console.error("AI generation failed, falling back to mock:", error)
    return generateMockContent(input, 0)
  }
}

export async function generateMultipleContents(
  input: GenerationInput,
  count: number = 5
): Promise<GeneratedContent[]> {
  const results: GeneratedContent[] = []
  
  const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-") && !process.env.OPENAI_API_KEY.includes("placeholder")
  const hasAnthropic = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.startsWith("sk-ant-") && !process.env.ANTHROPIC_API_KEY.includes("placeholder")
  const isMockMode = !hasOpenAI && !hasAnthropic
  
  for (let i = 0; i < count; i++) {
    try {
      if (isMockMode) {
        results.push(generateMockContent(input, i))
      } else {
        const content = await generateContent({
          ...input,
          customPrompt: `${input.customPrompt || ""} Variation ${i + 1}: Make this distinctly different from previous variations.`,
        })
        results.push(content)
      }
    } catch (error) {
      console.error(`Failed to generate content ${i + 1}:`, error)
      results.push(generateMockContent(input, i))
    }
  }
  
  return results
}

export async function regenerateContent(
  previousContent: GeneratedContent,
  input: GenerationInput,
  feedback?: string
): Promise<GeneratedContent> {
  const prompt = `
PREVIOUS VERSION (USER REJECTED):
Title: ${previousContent.title}
Script: ${previousContent.script.slice(0, 200)}...
Caption: ${previousContent.caption.slice(0, 200)}...

USER FEEDBACK: ${feedback || "Create a completely different angle/approach"}

Generate a NEW version that addresses this feedback while keeping the same brand, format, and platform requirements.
`

  const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-") && !process.env.OPENAI_API_KEY.includes("placeholder")
  const hasAnthropic = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.startsWith("sk-ant-") && !process.env.ANTHROPIC_API_KEY.includes("placeholder")
  
  if (!hasOpenAI && !hasAnthropic) {
    return generateMockContent(input, Date.now() % 10)
  }

  const model = input.platform === "tiktok" && hasAnthropic ? anthropic("claude-3-5-sonnet-20241022") : (hasOpenAI ? openai("gpt-4o") : anthropic("claude-3-5-sonnet-20241022"))

  try {
    const { object } = await generateObject({
      model,
      schema: ContentSchema,
      prompt: prompt + "\n\n" + input.customPrompt || "",
      temperature: 0.9,
    })

    return {
      ...object,
      generationPrompt: prompt.slice(0, 500),
    }
  } catch (error) {
    console.error("Regeneration failed, falling back to mock:", error)
    return generateMockContent(input, Date.now() % 10)
  }
}