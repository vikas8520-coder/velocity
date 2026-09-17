import { NextResponse } from "next/server"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""
const clerkOn =
  clerkKey.startsWith("pk_") &&
  !/placeholder|changeme|your[-_]?key/i.test(clerkKey) &&
  clerkKey.length > 20

const isProtected = createRouteMatcher(["/app(.*)"])

export default clerkOn
  ? clerkMiddleware(async (auth, req) => {
      if (isProtected(req)) await auth.protect()
    })
  : function middleware() {
      return NextResponse.next()
    }

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
