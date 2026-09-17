function present(value: string | undefined, prefix?: string) {
  if (!value) return false
  const v = value.trim()
  if (!v || /placeholder|changeme|your[-_]?key|xxx/i.test(v)) return false
  if (prefix && !v.startsWith(prefix)) return false
  return v.length > 12
}

export function isClerkConfigured() {
  return present(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, "pk_")
}

export function isOpenAIConfigured() {
  return present(process.env.OPENAI_API_KEY, "sk-")
}

export function isAnthropicConfigured() {
  return present(process.env.ANTHROPIC_API_KEY, "sk-ant-")
}

export function isFalConfigured() {
  const key = process.env.FAL_KEY || process.env.FILE_AI_API_KEY || process.env.FAL_API_KEY
  return present(key)
}

export function falKey() {
  return process.env.FAL_KEY || process.env.FILE_AI_API_KEY || process.env.FAL_API_KEY || ""
}

export function isConvexConfigured() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL
  return !!url && /^https?:\/\//.test(url)
}
