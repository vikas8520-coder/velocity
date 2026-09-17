import type { Metadata } from "next"
import { Geist, Geist_Mono, Figtree } from "next/font/google"
import { ClerkClientProvider } from "@/components/ClerkProvider"
import { ConvexClientProvider } from "@/components/ConvexProvider"
import { ThemeProvider } from "@/lib/theme"
import "./globals.css"

const themeBoot = `(function(){try{var t=localStorage.getItem("velocity-theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark")}catch(e){}})();`

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
  title: "Velocity — Short-form on rails",
  description: "Paste your site. Swipe branded shorts. Schedule to TikTok, Instagram, YouTube, and LinkedIn.",
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
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${figtree.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body className="h-full bg-bg text-fg antialiased font-sans">
        <ThemeProvider>
          <ClerkClientProvider>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </ClerkClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}