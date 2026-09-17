"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { 
  Sparkles, ArrowRight, ExternalLink, Mail, 
  Link2, GitBranch, Music, Play,
  CheckCircle2, Zap, Film, Users, Target, Calendar,
  Shield, Globe, Award, Bot, Layers, Cpu,
  Image, Camera
} from "lucide-react"

interface FooterLink {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  external?: boolean
}

const footerLinks: Record<string, FooterLink[]> = {
  product: [
    { label: "AI UGC Video Generator", href: "/tools/ai-ugc-video-generator" },
    { label: "AI Influencer Generator", href: "/tools/ai-influencer-generator" },
    { label: "TikTok Scheduler", href: "/tools/tiktok-scheduler" },
    { label: "AI Meme Generator", href: "/tools/ai-meme-generator" },
    { label: "Hook Generator", href: "/tools/hook-generator" },
    { label: "All Tools", href: "/tools" },
    { label: "AI Models", href: "/models" },
  ],
  compare: [
    { label: "vs Arcads", href: "/compare/velocity-vs-arcads" },
    { label: "vs Creatify", href: "/compare/velocity-vs-creatify" },
    { label: "vs MakeUGC", href: "/compare/velocity-vs-makeugc" },
    { label: "vs Buffer", href: "/compare/velocity-vs-buffer" },
    { label: "vs Bluma", href: "/compare/velocity-vs-bluma" },
    { label: "vs Superscale", href: "/compare/velocity-vs-superscale" },
    { label: "All Comparisons", href: "/compare" },
    { label: "Tool Reviews", href: "/review" },
    { label: "Pricing Guides", href: "/pricing" },
    { label: "Head to Head", href: "/vs" },
  ],
  alternatives: [
    { label: "ReelFarm Alternatives", href: "/alternatives/reelfarm-alternatives" },
    { label: "Genviral Alternatives", href: "/alternatives/genviral-alternatives" },
    { label: "Layers Alternatives", href: "/alternatives/layers-alternatives" },
    { label: "Doublespeed Alternatives", href: "/alternatives/doublespeed-alternatives" },
    { label: "Blaze Alternatives", href: "/alternatives/blaze-alternatives" },
    { label: "HardLaunch Alternatives", href: "/alternatives/hardlaunch-alternatives" },
    { label: "All Alternatives", href: "/alternatives" },
  ],
  industries: [
    { label: "Mobile Apps", href: "/for/mobile-apps" },
    { label: "Shopify & E-commerce", href: "/for/shopify-ecommerce" },
    { label: "SaaS", href: "/for/saas" },
    { label: "Dropshipping", href: "/for/dropshipping" },
    { label: "AI UGC Ads", href: "/for/ai-ugc-ads" },
    { label: "Marketing Agencies", href: "/for/marketing-agencies" },
    { label: "TikTok Shop", href: "/for/tiktok-shop" },
    { label: "All Industries", href: "/for" },
  ],
  developer: [
    { label: "API Documentation", href: "https://developers.velocity.ai/", external: true },
    { label: "MCP Documentation", href: "https://developers.velocity.ai/#mcp", external: true },
  ],
  company: [
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/pricing" },
    { label: "Affiliate Program", href: "https://velocity.affonso.io/", external: true },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  social: [
    { label: "LinkedIn", href: "https://linkedin.com/company/velocity", icon: Link2, external: true },
    { label: "GitHub", href: "https://github.com/velocity", icon: GitBranch, external: true },
    { label: "TikTok", href: "https://tiktok.com/@velocity", icon: Music, external: true },
  ]
}

interface FooterProps {
  className?: string
  variant?: "full" | "minimal"
}

export function Footer({ className, variant = "full" }: FooterProps) {
  if (variant === "minimal") {
    return (
      <footer className={cn("border-t border-card-border bg-bg-muted/50 py-8", className)}>
        <div className="container-main">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl">Velocity</span>
            </div>
            <p className="text-sm text-fg-muted">
              © {new Date().getFullYear()} Velocity. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://linkedin.com/company/velocity" target="_blank" rel="noopener noreferrer" className="text-fg-muted hover:text-fg transition-colors">
                <Link2 className="w-5 h-5" />
              </a>
              <a href="https://github.com/velocity" target="_blank" rel="noopener noreferrer" className="text-fg-muted hover:text-fg transition-colors">
                <GitBranch className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className={cn("border-t border-card-border bg-bg-muted/50", className)}>
      {/* Main footer content */}
      <div className="container-main py-16 lg:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display font-bold text-2xl">Velocity</span>
            </div>
            <p className="text-fg-muted mb-6 max-w-xs">
              Turn trending videos into content for your brand. Create, schedule, and publish AI-generated shorts across every platform.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://linkedin.com/company/velocity" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-fg-muted hover:bg-primary/10 hover:text-primary transition-all">
                <Link2 className="w-5 h-5" />
              </a>
              <a href="https://github.com/velocity" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-fg-muted hover:bg-primary/10 hover:text-primary transition-all">
                <GitBranch className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/velocity" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-fg-muted hover:bg-primary/10 hover:text-primary transition-all">
                <Music className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com/@velocity" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-fg-muted hover:bg-primary/10 hover:text-primary transition-all">
                <Music className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4">Product</h4>
            <nav className="space-y-3">
              {footerLinks.product.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.03 }}
                  className="text-sm text-fg-muted hover:text-primary transition-colors flex items-center gap-2"
                >
                  {link.external && <ExternalLink className="w-3 h-3" />}
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Compare */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <h4 className="font-semibold mb-4">Compare</h4>
            <nav className="space-y-3">
              {footerLinks.compare.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.03 }}
                  className="text-sm text-fg-muted hover:text-primary transition-colors flex items-center gap-2"
                >
                  {link.external && <ExternalLink className="w-3 h-3" />}
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Alternatives */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4">Alternatives</h4>
            <nav className="space-y-3">
              {footerLinks.alternatives.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.03 }}
                  className="text-sm text-fg-muted hover:text-primary transition-colors flex items-center gap-2"
                >
                  {link.external && <ExternalLink className="w-3 h-3" />}
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Industries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            <h4 className="font-semibold mb-4">Industries</h4>
            <nav className="space-y-3">
              {footerLinks.industries.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.03 }}
                  className="text-sm text-fg-muted hover:text-primary transition-colors flex items-center gap-2"
                >
                  {link.external && <ExternalLink className="w-3 h-3" />}
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold mb-4">Company</h4>
            <nav className="space-y-3">
              {footerLinks.company.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.03 }}
                  className="text-sm text-fg-muted hover:text-primary transition-colors flex items-center gap-2"
                >
                  {link.external && <ExternalLink className="w-3 h-3" />}
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-card-border mb-8" />

        {/* Bottom section */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <div className="card p-6 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Stay in the Loop</h4>
              </div>
              <p className="text-fg-muted mb-6 max-w-md">
                Get the latest trending formats, AI updates, and growth tips delivered weekly. No spam, unsubscribe anytime.
              </p>
              <form className="flex gap-3 max-w-md" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input flex-1"
                  required
                />
                <Button variant="primary" type="submit">
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
              <p className="text-xs text-fg-muted mt-3">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4">Trusted By</h4>
            <div className="grid grid-cols-2 gap-3">
              <TrustBadge icon={Shield} label="SOC 2 Certified" />
              <TrustBadge icon={Globe} label="Global CDN" />
              <TrustBadge icon={Award} label="#1 Product Hunt" />
              <TrustBadge icon={Users} label="10,000+ Teams" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Legal bottom */}
      <div className="border-t border-card-border pt-8 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-fg-muted">
            © {new Date().getFullYear()} Velocity. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-fg-muted">
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://linkedin.com/company/velocity" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-fg-muted hover:bg-primary/10 hover:text-primary transition-all">
              <Link2 className="w-4 h-4" />
            </a>
            <a href="https://github.com/velocity" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-fg-muted hover:bg-primary/10 hover:text-primary transition-all">
              <GitBranch className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function TrustBadge({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted hover:bg-muted-hover transition-colors">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-xs font-medium text-fg-muted">{label}</span>
    </div>
  )
}