import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Mic, Monitor, Layers, Clock, Radio, Smartphone,
  ShieldCheck, CheckCircle2, ArrowUpRight,
  Sparkles, Search, BookOpen, FileText, LayoutGrid,
  Zap, Award, Menu, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PageTransition } from "@/components/layout/PageTransition"
import { cn } from "@/lib/utils"

interface DocSection {
  id: string
  title: string
  shortTitle: string
  category: string
  icon: any
  badge?: string
}

const docSections: DocSection[] = [
  {
    id: "overview",
    title: "1. Overview & Platform Architecture",
    shortTitle: "Platform Overview",
    category: "Architecture",
    icon: LayoutGrid,
    badge: "Core",
  },
  {
    id: "speech-ai",
    title: "2. Voice-Driven Scripture Projection (AI ASR)",
    shortTitle: "AI Voice Scripture",
    category: "Presentation",
    icon: Mic,
    badge: "AI Powered",
  },
  {
    id: "display-canvas",
    title: "3. Dual-Display Compositor & 4-Layer Canvas",
    shortTitle: "Display Compositor",
    category: "Presentation",
    icon: Layers,
  },
  {
    id: "agenda-planner",
    title: "4. Service Agenda Planner & Automated Cues",
    shortTitle: "Agenda & Timers",
    category: "Orchestration",
    icon: Clock,
  },
  {
    id: "sermon-archiving",
    title: "5. Sermon Archiving, Bumpers & PDF Notes",
    shortTitle: "Sermon Archiving",
    category: "Recording",
    icon: FileText,
    badge: "Tier 2+",
  },
  {
    id: "ndi-broadcast",
    title: "6. NDI, OBS & Live Streaming Overlays",
    shortTitle: "NDI & Broadcast",
    category: "Broadcasting",
    icon: Radio,
  },
  {
    id: "mobile-companion",
    title: "7. Wireless Mobile Companion & Intercom",
    shortTitle: "Mobile Companion",
    category: "Mobile",
    icon: Smartphone,
    badge: "Stage",
  },
  {
    id: "auth-licensing",
    title: "8. 60-Day Trial & Offline Grace Period",
    shortTitle: "Licensing & Grace",
    category: "Security",
    icon: ShieldCheck,
    badge: "60-Day Trial",
  },
  {
    id: "cloud-portal",
    title: "9. Cloud Web Portal & Admin Intelligence",
    shortTitle: "Cloud Admin Hub",
    category: "Cloud",
    icon: Zap,
  },
]

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>("overview")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false)
  const location = useLocation()

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140
      for (const section of docSections) {
        const element = document.getElementById(section.id)
        if (element) {
          const top = element.offsetTop
          const height = element.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "")
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" })
          setActiveSection(id)
        }, 100)
      }
    }
  }, [location])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -90
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      setActiveSection(id)
      setMobileSidebarOpen(false)
    }
  }

  const filteredSections = docSections.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.shortTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageTransition>
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden pt-28 pb-12 gradient-hero border-b border-purple-100/60">
        <div className="mesh-blob w-[600px] h-[600px] bg-purple-300/30 -top-40 left-1/2 -translate-x-1/2" />
        <div className="mesh-blob w-[400px] h-[400px] bg-pink-300/20 top-0 -left-20" />
        <div className="mesh-blob w-[400px] h-[400px] bg-indigo-300/20 top-0 -right-20" />

        <div className="relative z-10 container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs font-semibold px-3 py-0.5 rounded-[12px]">
                  <Sparkles className="size-3.5 mr-1.5 inline text-purple-600" />
                  OCS Platform Documentation
                </Badge>
                <Badge variant="outline" className="text-xs text-slate-500 border-slate-300">
                  Version 1.14
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                Complete Feature Guide & Documentation
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Explore comprehensive operational workflows, speech intelligence specs, dual-screen canvas controls, and cloud synchronization rules for <strong>Organised Church Service (OCS)</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white rounded-[12px] px-5 h-11 text-xs font-bold shadow-lg shadow-purple-600/25">
                <Link to="/download" className="flex items-center gap-2">
                  Download Desktop <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-slate-300 text-slate-700 hover:bg-white bg-white/80 rounded-[12px] px-5 h-11 text-xs font-semibold">
                <Link to="/support">Support Desk</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT WITH SIDEBAR ── */}
      <div className="container mx-auto px-6 max-w-7xl py-10">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden mb-6 flex items-center justify-between p-3.5 bg-slate-900 text-white rounded-[12px] shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold">
            <BookOpen className="size-4 text-purple-400" />
            <span>Table of Contents ({docSections.length} Features)</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-purple-300 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* ── LEFT SIDEBAR (Sticky Navigation) ── */}
          <aside className={cn(
            "lg:col-span-4 xl:col-span-3 sticky top-24 z-20 space-y-4",
            mobileSidebarOpen ? "block" : "hidden lg:block"
          )}>
            <div className="bg-white rounded-[16px] border border-slate-200 shadow-sm p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search features & guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs bg-slate-50 border-slate-200 focus:bg-white rounded-[10px] h-9"
                />
              </div>

              {/* Navigation List */}
              <div className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 scrollbar-thin">
                {filteredSections.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.id
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "w-full text-left p-2.5 rounded-[10px] text-xs font-semibold transition-all flex items-center justify-between group cursor-pointer",
                        isActive
                          ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={cn("size-4 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-purple-600")} />
                        <span className="truncate">{section.shortTitle}</span>
                      </div>
                      {section.badge && (
                        <span className={cn(
                          "text-[9px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ml-2",
                          isActive ? "bg-white/20 text-white" : "bg-purple-100 text-purple-700"
                        )}>
                          {section.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Leadership note */}
              <div className="p-3 bg-purple-50/80 rounded-[12px] border border-purple-100 text-[11px] text-purple-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Award className="size-3.5 text-purple-700" /> OCS Vision
                </div>
                <p className="text-slate-600 text-[10px] leading-relaxed">
                  Founded and led by <strong>Are Oluwasegun Johnson</strong>, empowering modern church services globally.
                </p>
              </div>
            </div>
          </aside>

          {/* ── RIGHT MAIN DOCUMENTATION BODY ── */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-12">
            {/* 1. OVERVIEW */}
            <section id="overview" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    <LayoutGrid className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">1. Overview & Platform Architecture</h2>
                    <p className="text-xs text-slate-500">The complete multi-surface sanctuary presentation engine</p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">Core</Badge>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
                <p>
                  <strong>OCS (Organised Church Service)</strong> is engineered from the ground up for zero-latency, offline-first worship presentation.
                  Unlike traditional slide packages that require frantic mouse clicking during preaching, OCS automates scripture lookup, hymnal rendering, and multi-display stage coordination using local speech recognition.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 not-prose pt-2">
                  <div className="p-4 rounded-[12px] bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <Monitor className="size-4 text-purple-600" /> Main Congregation Projection
                    </div>
                    <p className="text-xs text-slate-600">
                      High-contrast Bible verses, dynamic typography, smooth video motion loops, and lower-third announcements rendered in native 1080p/4K 60FPS.
                    </p>
                  </div>

                  <div className="p-4 rounded-[12px] bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <Smartphone className="size-4 text-blue-600" /> Stage Foldback & Confidence Monitor
                    </div>
                    <p className="text-xs text-slate-600">
                      Dedicated display for pastors and choir members featuring speech teleprompter read-along, upcoming sermon points, countdown clocks, and private audio intercom.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. SPEECH & AI */}
            <section id="speech-ai" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    <Mic className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">2. Voice-Driven Scripture Projection (AI ASR)</h2>
                    <p className="text-xs text-slate-500">Zero-typing instant Bible verse detection in continuous speech</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">AI Powered</Badge>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
                <p>
                  Powered by native in-process <strong>whisper.cpp</strong> with automatic <strong>Vosk-small fallback</strong>, OCS captures 16kHz microphone audio through Web Audio with high-pass filtering (100Hz) and a 2× software pre-amplifier.
                </p>

                <div className="bg-slate-950 text-white rounded-[14px] p-4 font-mono text-xs space-y-2 not-prose">
                  <div className="text-purple-400 text-[11px] font-bold">LIVE SPEECH DETECTION WORKFLOW:</div>
                  <div className="text-slate-300">1. Spoken input: <span className="text-emerald-400">"Let us turn our Bibles to First Corinthians thirteen verse four"</span></div>
                  <div className="text-slate-300">2. 4-Pass Parser matches: <span className="text-cyan-400">1 Corinthians 13:4 (NKJV)</span></div>
                  <div className="text-slate-300">3. Projection compositor triggers non-destructive fade transition in <span className="text-amber-400">&lt;65ms</span>.</div>
                </div>

                <ul className="space-y-2 text-xs text-slate-700 list-disc pl-5">
                  <li><strong>Ordinal Book Disambiguation:</strong> Seamlessly resolves "First John", "2nd Kings", "First Samuel", and dialect variants.</li>
                  <li><strong>Dual-Engine Phonetic Aliasing:</strong> Integrated phonetic dictionary corrects common acoustic mishearings (e.g. "Romans ate" → "Romans 8").</li>
                  <li><strong>100% Offline:</strong> No internet connection required during services — all speech transcription executes locally.</li>
                </ul>
              </div>
            </section>

            {/* 3. DISPLAY CANVAS */}
            <section id="display-canvas" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    <Layers className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">3. Dual-Display Compositor & 4-Layer Canvas</h2>
                    <p className="text-xs text-slate-500">Non-destructive graphics stack with panic blackout keys</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
                <p>
                  The OCS rendering pipeline uses a 4-layer non-destructive composite stack. Toggling blackouts or showing emergency nursery alerts never removes currently active scriptures or song slides:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-semibold not-prose">
                  <div className="p-3 bg-purple-600 text-white rounded-[10px] text-center shadow-sm">
                    <div className="text-[10px] text-purple-200">Layer 4</div>
                    <div>Chrome (Logo / Blackout)</div>
                  </div>
                  <div className="p-3 bg-blue-600 text-white rounded-[10px] text-center shadow-sm">
                    <div className="text-[10px] text-blue-200">Layer 3</div>
                    <div>Transient (Alerts)</div>
                  </div>
                  <div className="p-3 bg-slate-800 text-white rounded-[10px] text-center shadow-sm">
                    <div className="text-[10px] text-slate-300">Layer 2</div>
                    <div>Content (Verse/Hymn)</div>
                  </div>
                  <div className="p-3 bg-slate-100 text-slate-700 rounded-[10px] text-center border">
                    <div className="text-[10px] text-slate-400">Layer 1</div>
                    <div>Background (Motion)</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-[12px] border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">Emergency Hotkeys:</div>
                  <div className="text-slate-600">
                    <kbd className="bg-white px-2 py-0.5 rounded border border-slate-300 font-mono text-[10px]">F10</kbd> Instant Blackout &nbsp;|&nbsp; 
                    <kbd className="bg-white px-2 py-0.5 rounded border border-slate-300 font-mono text-[10px] ml-1">F11</kbd> Logo Mute &nbsp;|&nbsp; 
                    <kbd className="bg-white px-2 py-0.5 rounded border border-slate-300 font-mono text-[10px] ml-1">ESC</kbd> Clear Content
                  </div>
                </div>
              </div>
            </section>

            {/* 4. AGENDA PLANNER */}
            <section id="agenda-planner" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">4. Service Agenda Planner & Automated Cues</h2>
                    <p className="text-xs text-slate-500">Synchronized order of service, dual timer edits, and media bumpers</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
                <p>
                  The Agenda Planner organizes the entire service flow (Opening Prayer, Praise & Worship, Sermon, Tithes & Offering, Benediction) with allocated durations:
                </p>

                <ul className="space-y-2 text-xs text-slate-700 list-disc pl-5">
                  <li><strong>Dual-Action Timer Editor:</strong> Provides distinct <strong>"Add"</strong> (adds extra minutes to running timer) and <strong>"Update"</strong> (overrides remaining duration) actions while always updating speaker labels.</li>
                  <li><strong>Mid-Run Cues:</strong> Flashes amber warning background color and chime at 10-second or half-time threshold.</li>
                  <li><strong>Completion Actions:</strong> Automatic screen blackout, outro video bumper playback, and closing chime triggers when timer reaches <code>00:00:00</code>.</li>
                </ul>
              </div>
            </section>

            {/* 5. SERMON ARCHIVING */}
            <section id="sermon-archiving" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">5. Sermon Archiving, Bumpers & PDF Notes</h2>
                    <p className="text-xs text-slate-500">Automated multi-track recording and formatted congregation notes</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">Tier 2+</Badge>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
                <p>
                  When a sermon agenda timer begins, OCS automatically records high-fidelity audio directly from your audio interface. Upon conclusion, FFmpeg stitches branded church video/audio bumpers to the start and finish of the audio track.
                </p>

                <div className="p-4 bg-emerald-50 rounded-[12px] border border-emerald-100 text-xs text-emerald-900 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-600" /> Automated Sermon PDF Generator
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    OCS compiles all detected scriptures, preacher points, and timestamps into an elegant, branded PDF sermon outline ready for print or church app distribution.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. NDI & BROADCAST */}
            <section id="ndi-broadcast" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-pink-100 flex items-center justify-center text-pink-700 font-bold">
                    <Radio className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">6. NDI, OBS & Live Streaming Overlays</h2>
                    <p className="text-xs text-slate-500">Broadcast lower-thirds and transparent alpha keying</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
                <p>
                  Integrate OCS directly into your livestreaming switcher (OBS Studio, vMix, Blackmagic ATEM). OCS outputs broadcast feeds with alpha-channel transparency, so scriptures and lyrics appear as clean lower-thirds over live camera feeds.
                </p>
              </div>
            </section>

            {/* 7. MOBILE COMPANION */}
            <section id="mobile-companion" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold">
                    <Smartphone className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">7. Wireless Mobile Companion & Intercom</h2>
                    <p className="text-xs text-slate-500">Handheld teleprompter, stage controls, and crew push-to-talk</p>
                  </div>
                </div>
                <Badge className="bg-cyan-100 text-cyan-700 border-0 text-xs">Stage App</Badge>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
                <p>
                  Pastors and worship leaders can control lyrics, search Bible verses, and communicate with the sound booth using the OCS Mobile app.
                </p>

                <ul className="space-y-2 text-xs text-slate-700 list-disc pl-5">
                  <li><strong>1-Hour Offline Guest Window:</strong> Allows immediate testing during rehearsals without logging in.</li>
                  <li><strong>Push-to-Talk Intercom:</strong> Low-latency voice streaming between stage personnel and the audio/visual desk.</li>
                  <li><strong>Instant Verse Push:</strong> Search any Bible chapter/verse on mobile and push it live to sanctuary screens in 1 tap.</li>
                </ul>
              </div>
            </section>

            {/* 8. AUTH & LICENSING */}
            <section id="auth-licensing" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">8. 60-Day Free Trial & Offline Grace Period</h2>
                    <p className="text-xs text-slate-500">Uninterrupted sanctuary reliability with flexible cloud sync</p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">60-Day Trial</Badge>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
                <p>
                  Every new church account receives a full <strong>60-Day (2-Month) Free Trial</strong> with zero feature gating.
                  Desktop workstations cache authenticated credentials locally with a <strong>72-hour offline grace period</strong>, ensuring that internet hiccups or router reboots never disrupt Sunday services.
                </p>
              </div>
            </section>

            {/* 9. CLOUD PORTAL */}
            <section id="cloud-portal" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-violet-100 flex items-center justify-center text-violet-700 font-bold">
                    <Zap className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">9. Cloud Web Portal & Admin Intelligence</h2>
                    <p className="text-xs text-slate-500">Real-time WebSocket alerts, multi-platform downloads, and support hub</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
                <p>
                  The OCS Web platform provides church administrators with a real-time console for managing licenses, reviewing service downloads, filing technical support tickets, and receiving live push notifications.
                </p>

                <div className="flex flex-wrap gap-3 pt-4 not-prose">
                  <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white rounded-[12px] px-6 text-xs font-bold shadow-md">
                    <Link to="/signup">Start 60-Day Free Trial</Link>
                  </Button>
                  <Button variant="outline" asChild className="border-slate-300 rounded-[12px] px-6 text-xs font-semibold">
                    <Link to="/pricing">View Plans & Pricing</Link>
                  </Button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </PageTransition>
  )
}
