import type { Metadata } from "next"
import { Geist, Geist_Mono, Figtree } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Velocity - AI Content Studio",
  description: "Turn trending videos into content for your brand. Create, schedule, and publish across TikTok, Instagram Reels, YouTube Shorts, and LinkedIn.",
  openGraph: {
    title: "Velocity - AI Content Studio",
    description: "Turn trending videos into content for your brand",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${figtree.variable} h-full`}>
      <body className="h-full antialiased font-sans">
        {children}
      </body>
    </html>
  )
}