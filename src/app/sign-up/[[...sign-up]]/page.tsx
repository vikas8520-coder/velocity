import { SignUp } from "@clerk/nextjs"
import { isClerkConfigured } from "@/lib/config"
import Link from "next/link"

export default function SignUpPage() {
  if (!isClerkConfigured()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-2xl font-bold">Auth is in demo mode</h1>
        <p className="max-w-md text-fg-muted">
          Add real Clerk keys to `.env.local` to enable sign-up. You can still run Blitz without an account.
        </p>
        <Link className="text-primary font-semibold" href="/onboarding">
          Continue to onboarding
        </Link>
      </div>
    )
  }
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <SignUp />
    </div>
  )
}
