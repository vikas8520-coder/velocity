import { falKey, isFalConfigured } from "@/lib/config"

type QueueSubmit = {
  request_id: string
  status_url: string
  response_url: string
}

async function falFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Key ${falKey()}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Fal ${res.status}: ${text.slice(0, 200)}`)
  }
  return res.json()
}

async function queue(model: string, input: Record<string, unknown>, timeoutMs = 25000) {
  const submitted = (await falFetch(`https://queue.fal.run/${model}`, {
    method: "POST",
    body: JSON.stringify(input),
  })) as QueueSubmit

  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const status = await falFetch(submitted.status_url)
    if (status.status === "COMPLETED") {
      return await falFetch(submitted.response_url)
    }
    if (status.status === "FAILED") {
      throw new Error(status.error || "Fal generation failed")
    }
    await new Promise((r) => setTimeout(r, 1200))
  }
  throw new Error("Fal timed out")
}

export async function generatePoster(prompt: string): Promise<string | null> {
  if (!isFalConfigured()) return null
  try {
    const result = await queue("fal-ai/flux/schnell", {
      prompt,
      image_size: { width: 768, height: 1344 },
      num_images: 1,
    })
    return result?.images?.[0]?.url ?? null
  } catch (error) {
    console.error("Fal poster failed", error)
    return null
  }
}

export async function generateClip(prompt: string): Promise<string | null> {
  if (!isFalConfigured()) return null
  try {
    const result = await queue(
      "fal-ai/kling-video/v2.1/standard/text-to-video",
      {
        prompt,
        duration: "5",
        aspect_ratio: "9:16",
      },
      55000
    )
    return result?.video?.url ?? null
  } catch (error) {
    console.error("Fal video failed", error)
    return null
  }
}
