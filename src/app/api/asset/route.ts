import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "url required" }, { status: 400 })
  }
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "VelocityBot/1.0", Accept: "image/*,*/*" },
      redirect: "follow",
    })
    if (!res.ok) {
      return NextResponse.json({ error: "fetch failed" }, { status: 502 })
    }
    const type = res.headers.get("content-type") || "image/jpeg"
    const buf = await res.arrayBuffer()
    if (buf.byteLength > 8_000_000) {
      return NextResponse.json({ error: "too large" }, { status: 413 })
    }
    return new NextResponse(buf, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch {
    return NextResponse.json({ error: "proxy failed" }, { status: 502 })
  }
}
