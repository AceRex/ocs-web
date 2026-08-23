import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Check, X, Building2, Zap, Sprout,
  ArrowRight, Sparkles, Crown, Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageTransition } from "@/components/layout/PageTransition"
import { cn } from "@/lib/utils"

interface MatrixRow {
  feature: string
  category: "timer" | "docs" | "worship" | "limits"
  trial: string | boolean
  mini: string | boolean
  standard: string | boolean
  large: string | boolean
  premium: string | boolean
  hint?: string
}

const matrixRows: MatrixRow[] = [
  // ── Timer & Broadcast
  { feature: "Timer", category: "timer", trial: "Mini Access", mini: true, standard: true, large: true, premium: true },
  { feature: "Broadcast", category: "timer", trial: "Included", mini: "Included", standard: "Included", large: "Included", premium: true },
  { feature: "Start Timer Time", category: "timer", trial: false, mini: false, standard: false, large: true, premium: true, hint: "Schedule custom countdown start timestamps" },
  { feature: "Timer Interval", category: "timer", trial: false, mini: false, standard: true, large: true, premium: true, hint: "Configurable interval loops and segments" },
  { feature: "Change Timer View", category: "timer", trial: false, mini: false, standard: true, large: true, premium: true, hint: "Custom timer layouts & display skins" },
  { feature: "Intro / Outro", category: "timer", trial: false, mini: false, standard: false, large: true, premium: true, hint: "Automated video bumpers and broadcast wraps" },

  // ── Documents & Presentation
  { feature: "View PDF", category: "docs", trial: true, mini: true, standard: true, large: true, premium: true },
  { feature: "Edit PDF", category: "docs", trial: false, mini: false, standard: true, large: true, premium: true, hint: "In-app sermon notes and bulletin adjustments" },
  { feature: "Slides & Projections", category: "docs", trial: false, mini: false, standard: true, large: true, premium: true },
  { feature: "Scene Animations", category: "docs", trial: false, mini: false, standard: false, large: true, premium: true },
  { feature: "Scene Transitions", category: "docs", trial: false, mini: false, standard: false, large: true, premium: true },

  // ── Worship & Lyrics
  { feature: "Basic Song & Lyrics", category: "worship", trial: true, mini: true, standard: true, large: true, premium: true },
  { feature: "Chorus Flow", category: "worship", trial: false, mini: false, standard: false, large: true, premium: true, hint: "Interactive chorus loops & bridge triggers" },
  { feature: "Repeat Controls", category: "worship", trial: false, mini: false, standard: false, large: true, premium: true },
  { feature: "Sing Along", category: "worship", trial: false, mini: false, standard: false, large: true, premium: true, hint: "Synchronized karaoke style lyric highlights" },
  { feature: "Read Along", category: "worship", trial: false, mini: false, standard: false, large: true, premium: true, hint: "Scripture prompter with stage feedback" },

  // ── Device Limits
  { feature: "Desktop Display Limit", category: "limits", trial: "1 Workstation", mini: "1 Workstation", standard: "1 Workstation", large: "2 Workstations", premium: "Unlimited" },
  { feature: "Phone Companion Limit", category: "limits", trial: "3 Mobile Seats", mini: "3 Mobile Seats", standard: "5 Mobile Seats", large: "5 Mobile Seats", premium: "Unlimited" },
]

function renderCell(val: string | boolean) {
  if (typeof val === "boolean") {
    return val ? (
      <div className="flex justify-center text-emerald-600">
        <div className="size-6 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200">
          <Check className="size-3.5 stroke-[3]" />
        </div>
      </div>
    ) : (
      <div className="flex justify-center text-slate-300">
        <X className="size-4" />
      </div>
    )
  }
  return <span className="text-xs font-semibold text-slate-700">{val}</span>
}

export default function PricingPage() {
  const [showMatrix, setShowMatrix] = useState(false)

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-[#f5f3ff] via-[#f7f6fe] to-[#eef2ff] pt-28 pb-24 relative overflow-hidden">
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-purple-200/40 via-indigo-100/30 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* ── HEADER ────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-purple-100/90 border border-purple-200/80 text-purple-900 text-xs font-semibold shadow-xs"
          >
            <span>Simple, transparent pricing</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight"
          >
            Choose the perfect plan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed"
          >
            Flexible plans for individuals, growing churches, and enterprises.
          </motion.p>
        </section>

        {/* ── PRICING CARDS SECTION ──────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mt-14 space-y-6">
          
          {/* ── ROW 1: 3 CARDS (Trial, Mini, Standard) ─────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* ── CARD 1: 2-MONTH FREE TRIAL ───────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-[28px] p-7 sm:p-8 border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.07)] transition-all flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header with Icon */}
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-[18px] bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-xs shrink-0">
                    <Sprout className="size-7 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Free Trial</h3>
                    <p className="text-xs text-slate-500 font-medium">For getting started</p>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-1 pt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black text-slate-900 tracking-tight">$0</span>
                    <span className="text-sm font-semibold text-slate-500">/ 2 months</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Mini Setup included for first 60 days</p>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-3.5 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>1 Workstation Display</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>3 Mobile Companion Seats</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Basic Countdown & Broadcast</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>PDF Viewer & Sermon Notes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Hymn & Song Lyrics Projection</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="size-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                      <X className="size-3 stroke-[2.5]" />
                    </div>
                    <span>Interval timers & PDF editor</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Link to="/signup" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-[16px] bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80 text-slate-900 font-bold text-sm shadow-xs transition-all cursor-pointer"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* ── CARD 2: MINI SETUP ───────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="bg-white rounded-[28px] p-7 sm:p-8 border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.07)] transition-all flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header with Icon */}
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-[18px] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs shrink-0">
                    <Layers className="size-7 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Mini Setup</h3>
                    <p className="text-xs text-slate-500 font-medium">Starter sanctuary control</p>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-1 pt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black text-slate-900 tracking-tight">$2</span>
                    <span className="text-sm font-semibold text-slate-500">/ 6 months</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Affordable starter semi-annual license</p>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-3.5 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>1 Workstation Display</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>3 Mobile Companion Seats</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Service Countdown & Broadcast</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Presentation Engine & PDF Viewer</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Song Lyrics & Scene Management</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="size-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                      <X className="size-3 stroke-[2.5]" />
                    </div>
                    <span>Advanced video animations</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Link to="/signup" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-[16px] bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80 text-slate-900 font-bold text-sm shadow-xs transition-all cursor-pointer"
                  >
                    Choose Mini
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* ── CARD 3: STANDARD SETUP (GLOWING HERO CARD) ───── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="bg-gradient-to-b from-[#3240db] via-[#4537dc] to-[#6329db] text-white rounded-[28px] p-7 sm:p-8 border border-indigo-300/40 shadow-[0_20px_50px_rgba(67,56,202,0.38)] relative overflow-visible flex flex-col justify-between ring-2 ring-cyan-400/40"
            >
              {/* Floating Most Popular Badge */}
              <div className="absolute -top-3.5 right-6">
                <div className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#1b1c6a]/90 backdrop-blur-md border border-indigo-400/50 text-white text-[11px] font-bold shadow-lg shadow-indigo-950/50">
                  <span className="text-amber-300">★</span>
                  <span>Most Popular</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Header with Icon */}
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-[18px] bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-inner shrink-0">
                    <Zap className="size-7 fill-white stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Standard Setup</h3>
                    <p className="text-xs text-indigo-200 font-medium">For growing sanctuaries</p>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-1 pt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black text-white tracking-tight">$3</span>
                    <span className="text-sm font-semibold text-indigo-200">/ 6 months</span>
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-xs text-indigo-200 font-medium">Billed semi-annually</span>
                    <Badge className="bg-emerald-400/30 text-emerald-200 border border-emerald-400/40 text-[10px] font-bold px-2 py-0">
                      Best Value
                    </Badge>
                  </div>
                </div>

                <div className="border-t border-white/15 pt-6 space-y-3.5 text-xs text-indigo-50 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>1 Workstation Display</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>5 Mobile Companion Seats</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Interval Timers & Segment Loops</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>PDF In-App Editor & Annotator</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Slide Designer & Scripture Cues</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Custom Timer Layouts & Skins</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Link to="/signup" className="block">
                  <Button className="w-full h-12 rounded-[16px] bg-gradient-to-r from-[#7c4dff] to-[#651fff] hover:from-[#651fff] hover:to-[#5310e6] text-white font-bold text-sm shadow-lg shadow-indigo-950/40 border border-white/20 transition-all cursor-pointer">
                    Choose Standard
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* ── ROW 2: 2 CARDS (Large Setup & Premium Gold Card) ─ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto">
            
            {/* ── CARD 4: LARGE SETUP ──────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="bg-white rounded-[28px] p-7 sm:p-8 border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.07)] transition-all flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header with Icon */}
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-[18px] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs shrink-0">
                    <Building2 className="size-7 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Large Setup</h3>
                    <p className="text-xs text-slate-500 font-medium">For broadcast & multi-screen</p>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-1 pt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black text-slate-900 tracking-tight">$5</span>
                    <span className="text-sm font-semibold text-slate-500">/ 6 months</span>
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-xs text-slate-400 font-medium">Billed semi-annually</span>
                    <Badge className="bg-indigo-100 text-indigo-800 border-0 text-[10px] font-bold px-2 py-0">
                      Broadcast Ready
                    </Badge>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-3.5 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>2 Workstations (Multi-Screen Projection)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>5 Mobile Companion Seats</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Scheduled Start Timer Time</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Intro & Outro Video Bumpers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Dynamic Animations & Transitions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Chorus Flow, Sing Along & Read Along</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Link to="/signup" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-[16px] bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80 text-slate-900 font-bold text-sm shadow-xs transition-all cursor-pointer"
                  >
                    Choose Large
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* ── CARD 5: PREMIUM (GOLD BORDERED "LET'S CHAT!" CARD) ─ */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-b from-amber-500/[0.04] via-amber-500/[0.01] to-white rounded-[28px] p-7 sm:p-8 border-2 border-amber-400/90 shadow-[0_15px_45px_rgba(245,158,11,0.18)] hover:shadow-[0_20px_55px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/30 transition-all flex flex-col justify-between relative overflow-visible"
            >
              {/* Floating Top Badge */}
              <div className="absolute -top-3.5 right-6">
                <div className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black shadow-md shadow-amber-500/30">
                  <Crown className="size-3 fill-slate-950" />
                  <span>UNLIMITED ENTERPRISE</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Header with Icon */}
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-[18px] bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-700 shadow-xs shrink-0">
                    <Sparkles className="size-7 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Premium</h3>
                    <p className="text-xs text-amber-800/80 font-semibold">For mega-churches & custom needs</p>
                  </div>
                </div>

                {/* Price Display matching reference image */}
                <div className="space-y-1 pt-2">
                  <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    Let's chat!
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Custom tailored enterprise package</p>
                </div>

                <div className="border-t border-amber-200/60 pt-6 space-y-3.5 text-xs text-slate-800 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span className="font-semibold text-slate-900">Unlimited active projects</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span className="font-semibold text-slate-900">Unlimited workstations & displays</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span className="font-semibold text-slate-900">Unlimited companion users</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Unlimited documents & storage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Full unconstrained feature bypass</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span>Dedicated 24/7 SLA priority support</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Link to="/support" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-[16px] bg-slate-100/90 hover:bg-slate-200/90 border border-slate-300/80 text-slate-900 font-bold text-sm shadow-xs transition-all cursor-pointer"
                  >
                    Request Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── EXPANDABLE DETAILED COMPARISON TABLE ─────────── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mt-16 text-center">
          <Button
            variant="outline"
            onClick={() => setShowMatrix(!showMatrix)}
            className="rounded-full border-slate-200 bg-white/80 hover:bg-white text-xs font-semibold gap-2 shadow-xs text-slate-700"
          >
            <span>{showMatrix ? "Hide Feature Breakdown Matrix" : "View Detailed Feature Comparison Matrix"}</span>
            <ArrowRight className={cn("size-3.5 transition-transform", showMatrix && "rotate-90")} />
          </Button>

          {showMatrix && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-left overflow-x-auto rounded-[24px] border border-slate-200 bg-white shadow-md p-2"
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-700">
                    <th className="py-4 px-6 min-w-[200px]">Feature Capability</th>
                    <th className="py-4 px-3 text-center min-w-[130px] bg-emerald-50/60 text-emerald-950">
                      Free Trial <br /><span className="text-[10px] font-normal text-emerald-700">First 2 Months</span>
                    </th>
                    <th className="py-4 px-3 text-center min-w-[110px]">Mini Setup <br /><span className="text-[10px] font-normal text-slate-500">$2 / 6 mos</span></th>
                    <th className="py-4 px-3 text-center min-w-[120px] bg-purple-50/50 text-purple-950">
                      Standard Setup <br /><span className="text-[10px] font-normal text-purple-700">$3 / 6 mos</span>
                    </th>
                    <th className="py-4 px-3 text-center min-w-[110px]">Large Setup <br /><span className="text-[10px] font-normal text-slate-500">$5 / 6 mos</span></th>
                    <th className="py-4 px-3 text-center min-w-[110px] bg-amber-50/60 text-amber-950">Premium <br /><span className="text-[10px] font-normal text-amber-700">Let's chat!</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {/* Category: Timer & Broadcast */}
                  <tr className="bg-slate-50/50 font-bold text-slate-900 text-xs uppercase tracking-wider">
                    <td colSpan={6} className="py-2.5 px-6">1. Timer & Broadcast Engine</td>
                  </tr>
                  {matrixRows.filter(r => r.category === "timer").map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-6 font-medium text-slate-900">
                        <div>{r.feature}</div>
                        {r.hint && <div className="text-[10px] text-slate-400 font-normal">{r.hint}</div>}
                      </td>
                      <td className="py-3 px-3 text-center bg-emerald-50/20">{renderCell(r.trial)}</td>
                      <td className="py-3 px-3 text-center">{renderCell(r.mini)}</td>
                      <td className="py-3 px-3 text-center bg-purple-50/20 font-semibold">{renderCell(r.standard)}</td>
                      <td className="py-3 px-3 text-center">{renderCell(r.large)}</td>
                      <td className="py-3 px-3 text-center bg-amber-50/20 font-semibold">{renderCell(r.premium)}</td>
                    </tr>
                  ))}

                  {/* Category: Documents & Presentation */}
                  <tr className="bg-slate-50/50 font-bold text-slate-900 text-xs uppercase tracking-wider">
                    <td colSpan={6} className="py-2.5 px-6">2. Documents, PDF & Presentation Scenes</td>
                  </tr>
                  {matrixRows.filter(r => r.category === "docs").map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-6 font-medium text-slate-900">
                        <div>{r.feature}</div>
                        {r.hint && <div className="text-[10px] text-slate-400 font-normal">{r.hint}</div>}
                      </td>
                      <td className="py-3 px-3 text-center bg-emerald-50/20">{renderCell(r.trial)}</td>
                      <td className="py-3 px-3 text-center">{renderCell(r.mini)}</td>
                      <td className="py-3 px-3 text-center bg-purple-50/20 font-semibold">{renderCell(r.standard)}</td>
                      <td className="py-3 px-3 text-center">{renderCell(r.large)}</td>
                      <td className="py-3 px-3 text-center bg-amber-50/20 font-semibold">{renderCell(r.premium)}</td>
                    </tr>
                  ))}

                  {/* Category: Worship & Lyrics */}
                  <tr className="bg-slate-50/50 font-bold text-slate-900 text-xs uppercase tracking-wider">
                    <td colSpan={6} className="py-2.5 px-6">3. Worship Songs, Hymns & Teleprompter</td>
                  </tr>
                  {matrixRows.filter(r => r.category === "worship").map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-6 font-medium text-slate-900">
                        <div>{r.feature}</div>
                        {r.hint && <div className="text-[10px] text-slate-400 font-normal">{r.hint}</div>}
                      </td>
                      <td className="py-3 px-3 text-center bg-emerald-50/20">{renderCell(r.trial)}</td>
                      <td className="py-3 px-3 text-center">{renderCell(r.mini)}</td>
                      <td className="py-3 px-3 text-center bg-purple-50/20 font-semibold">{renderCell(r.standard)}</td>
                      <td className="py-3 px-3 text-center">{renderCell(r.large)}</td>
                      <td className="py-3 px-3 text-center bg-amber-50/20 font-semibold">{renderCell(r.premium)}</td>
                    </tr>
                  ))}

                  {/* Category: Device Limits */}
                  <tr className="bg-slate-50/50 font-bold text-slate-900 text-xs uppercase tracking-wider">
                    <td colSpan={6} className="py-2.5 px-6">4. Licensed Workstations & Stage Devices</td>
                  </tr>
                  {matrixRows.filter(r => r.category === "limits").map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-6 font-medium text-slate-900">{r.feature}</td>
                      <td className="py-3 px-3 text-center bg-emerald-50/20 font-semibold text-emerald-900">{renderCell(r.trial)}</td>
                      <td className="py-3 px-3 text-center font-semibold">{renderCell(r.mini)}</td>
                      <td className="py-3 px-3 text-center bg-purple-50/20 font-semibold text-purple-900">{renderCell(r.standard)}</td>
                      <td className="py-3 px-3 text-center font-semibold">{renderCell(r.large)}</td>
                      <td className="py-3 px-3 text-center bg-amber-50/20 font-semibold text-amber-900">{renderCell(r.premium)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </section>
      </div>
    </PageTransition>
  )
}
