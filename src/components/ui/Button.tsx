"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "outline" | "outline-gold" | "ghost" | "ghost-sm" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "xl" | "icon" | "xs"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
    
    const variants = {
      primary: "btn-primary bg-primary text-white hover:bg-primary-hover active:bg-primary-hover shadow-[0_4px_14px_0_rgba(190,24,93,0.25)] hover:shadow-[0_8px_24px_0_rgba(190,24,93,0.35)] hover:-translate-y-0.5 active:translate-y-0",
      secondary: "btn-secondary bg-fg text-bg hover:opacity-90 shadow-md h-11 px-6 rounded-xl text-sm font-semibold",
      gold: "btn-gold bg-gradient-to-r from-amber-700 to-amber-600 text-white hover:from-amber-800 hover:to-amber-700 shadow-[0_4px_14px_0_rgba(184,134,11,0.25),0_2px_4px_-2px_rgba(184,134,11,0.15)] hover:shadow-[0_8px_24px_0_rgba(184,134,11,0.35),0_4px_8px_-2px_rgba(184,134,11,0.2)] hover:-translate-y-0.5 active:translate-y-0",
      outline: "btn-outline bg-bg-elevated text-fg border-2 border-border hover:border-primary hover:bg-primary-light hover:text-primary h-11 px-6 rounded-xl text-sm font-semibold",
      "outline-gold": "btn-outline-gold bg-bg-elevated text-fg border-2 border-secondary/40 hover:border-secondary hover:bg-secondary-light hover:text-secondary h-11 px-6 rounded-xl text-sm font-semibold",
      ghost: "btn-ghost bg-transparent text-fg hover:bg-bg-muted hover:text-fg h-11 px-5 rounded-xl text-sm font-medium",
      "ghost-sm": "btn-ghost-sm bg-transparent text-fg hover:bg-bg-muted hover:text-fg h-9 px-4 rounded-lg text-sm font-medium",
      destructive: "btn-destructive bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg active:shadow-sm h-11 px-6 rounded-xl text-sm font-semibold",
      link: "btn-link text-rose-700 hover:text-rose-800 underline underline-offset-2 decoration-rose-300 hover:decoration-rose-500 transition-all duration-200",
    }
    
    const sizes = {
      default: "h-11 px-6 rounded-xl text-sm",
      sm: "h-9 rounded-lg px-4 text-sm",
      lg: "h-12 px-8 rounded-2xl text-base",
      xl: "h-14 px-10 rounded-2xl text-lg",
      icon: "h-11 w-11 rounded-xl",
      xs: "h-8 px-3 rounded-lg text-xs",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"