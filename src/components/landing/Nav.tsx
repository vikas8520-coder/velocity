"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { Sparkles, Menu, X, Music, ArrowRight, Zap, Film, Users, Target, CheckCircle2, Link2, GitBranch, Calendar } from "lucide-react"

const navLinks = [
  { label: "How it works", href: "#how" },
  { label: "Examples", href: "#examples" },
  { label: "Pricing", href: "#pricing" },
]

interface NavProps {
  className?: string
  transparent?: boolean
}

export function Nav({ className, transparent = false }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isSolid = !transparent || scrolled

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isSolid
          ? "bg-bg/80 backdrop-blur-xl border-b border-card-border shadow-sm"
          : "bg-transparent",
        className
      )}
    >
      <nav className="container-main" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-xl font-display font-bold z-10"
            aria-label="Velocity Home"
          >
            <Sparkles className="w-6 h-6 text-primary" />
            <span>Velocity</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ul className="flex items-center gap-6">
                {navLinks.map((link, i) => (
                  <motion.li key={link.label} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                    <a
                      href={link.href}
                      className="text-sm font-medium text-fg-muted hover:text-primary transition-colors relative"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 ml-4"
            >
              <ThemeToggle />
              <a href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </a>
              <a href="/onboarding">
                <Button variant="primary" size="sm">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:hidden p-2 rounded-lg text-fg-muted hover:bg-muted hover:text-fg transition-colors z-10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden border-t border-card-border bg-bg/95 backdrop-blur-xl"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    className="block px-4 py-3 rounded-xl text-fg-muted hover:text-primary hover:bg-muted transition-colors font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4 border-t border-card-border space-y-3"
                >
                  <ThemeToggle />
                  <a href="/sign-in" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      Sign In
                    </Button>
                  </a>
                  <a href="/onboarding" onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" className="w-full justify-start">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

/* Alternative: Nav with dropdown menus */
export function NavWithDropdowns({ className, transparent = false }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isSolid = !transparent || scrolled

  const dropdowns = {
    tools: [
      { label: "AI UGC Video Generator", href: "/tools/ai-ugc-video-generator", icon: Film },
      { label: "AI Influencer Generator", href: "/tools/ai-influencer-generator", icon: Users },
      { label: "TikTok Scheduler", href: "/tools/tiktok-scheduler", icon: Calendar },
      { label: "AI Meme Generator", href: "/tools/ai-meme-generator", icon: Zap },
      { label: "Hook Generator", href: "/tools/hook-generator", icon: Target },
      { label: "All Tools", href: "/tools", icon: CheckCircle2 },
    ],
    compare: [
      { label: "vs Arcads", href: "/compare/velocity-vs-arcads" },
      { label: "vs Creatify", href: "/compare/velocity-vs-creatify" },
      { label: "vs MakeUGC", href: "/compare/velocity-vs-makeugc" },
      { label: "vs Buffer", href: "/compare/velocity-vs-buffer" },
      { label: "All Comparisons", href: "/compare" },
    ],
    alternatives: [
      { label: "ReelFarm Alternatives", href: "/alternatives/reelfarm-alternatives" },
      { label: "Genviral Alternatives", href: "/alternatives/genviral-alternatives" },
      { label: "All Alternatives", href: "/alternatives" },
    ],
    industries: [
      { label: "Mobile Apps", href: "/for/mobile-apps" },
      { label: "Shopify & E-commerce", href: "/for/shopify-ecommerce" },
      { label: "SaaS", href: "/for/saas" },
      { label: "Dropshipping", href: "/for/dropshipping" },
      { label: "AI UGC Ads", href: "/for/ai-ugc-ads" },
      { label: "All Industries", href: "/for" },
    ],
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isSolid
          ? "bg-bg/80 backdrop-blur-xl border-b border-card-border shadow-sm"
          : "bg-transparent",
        className
      )}
    >
      <nav className="container-main" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <motion.a
            href="/"
            className="flex items-center gap-2 text-xl font-display font-bold z-10"
            aria-label="Velocity Home"
          >
            <Sparkles className="w-6 h-6 text-primary" />
            <span>Velocity</span>
          </motion.a>

          <div className="hidden lg:flex items-center gap-2">
            {Object.entries(dropdowns).map(([key, items]) => (
              <DropdownMenu key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} items={items} />
            ))}
            
            <div className="flex items-center gap-3 ml-4">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button variant="primary" size="sm">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <button className="lg:hidden p-2 rounded-lg" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-card-border bg-bg/95 backdrop-blur-xl px-4 py-6 space-y-4"
          >
            {Object.entries(dropdowns).map(([key, items]) => (
              <MobileDropdown key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} items={items} />
            ))}
            
            <div className="pt-4 border-t border-card-border space-y-3">
              <Button variant="outline" className="w-full justify-start">Sign In</Button>
              <Button variant="primary" className="w-full justify-start">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  )
}

function DropdownMenu({ label, items }: { label: string; items: { label: string; href: string; icon?: React.ComponentType<{ className?: string }> }[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative group">
      <button
        className="px-4 py-2 rounded-xl text-sm font-medium text-fg-muted hover:text-primary hover:bg-muted transition-colors flex items-center gap-1"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {label}
        <Zap className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 card p-2 shadow-xl border border-card-border rounded-xl z-50"
            role="menu"
          >
            {items.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 + i * 0.02 }}
                className="block px-3 py-2 rounded-lg text-sm text-fg-muted hover:text-primary hover:bg-muted transition-colors flex items-center gap-2"
                role="menuitem"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileDropdown({ label, items }: { label: string; items: { label: string; href: string; icon?: React.ComponentType<{ className?: string }> }[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-card-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between text-fg hover:bg-muted transition-colors font-medium"
        aria-expanded={open}
      >
        <span>{label}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-fg-muted"
        >
          <Zap className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-muted/50 px-4 pb-3 space-y-2"
          >
            {items.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 + i * 0.02 }}
                className="block px-4 py-2 rounded-lg text-sm text-fg-muted hover:text-primary hover:bg-muted/50 transition-colors flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}