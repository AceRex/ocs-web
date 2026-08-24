import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Mic, Monitor, Layers, Clock, Radio, Smartphone,
  ShieldCheck, CheckCircle2, ArrowUpRight,
  Sparkles, Search, BookOpen, FileText, LayoutGrid,
  Zap, Award, Menu, X, Hourglass, Lock, Tv, Laptop,
  Volume2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PageTransition } from "@/components/layout/PageTransition"
import { cn } from "@/lib/utils"
import oneHourUseTimeImg from "@/assets/1hr use time.png"

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
    id: "setup-guide",
    title: "2. Hardware & Dual-Screen Setup Guide",
    shortTitle: "How to Set Up (Hardware)",
    category: "Setup Guide",
    icon: Tv,
    badge: "Essential",
  },
  {
    id: "speech-ai",
    title: "3. Voice-Driven Scripture Projection (AI ASR)",
    shortTitle: "AI Voice Scripture",
    category: "Presentation",
    icon: Mic,
    badge: "AI Powered",
  },
  {
    id: "display-canvas",
    title: "4. Dual-Display Compositor & 4-Layer Canvas",
    shortTitle: "Display Compositor",
    category: "Presentation",
    icon: Layers,
  },
  {
    id: "agenda-planner",
    title: "5. Service Agenda Planner & Automated Cues",
    shortTitle: "Agenda & Timers",
    category: "Orchestration",
    icon: Clock,
  },
  {
    id: "sermon-archiving",
    title: "6. Sermon Archiving, Bumpers & PDF Notes",
    shortTitle: "Sermon Archiving",
    category: "Recording",
    icon: FileText,
    badge: "Tier 2+",
  },
  {
    id: "ndi-broadcast",
    title: "7. NDI, OBS & Live Streaming Overlays",
    shortTitle: "NDI & Broadcast",
    category: "Broadcasting",
    icon: Radio,
  },
  {
    id: "desktop-features",
    title: "8. Complete Desktop Features Reference",
    shortTitle: "Desktop Features",
    category: "Desktop",
    icon: Laptop,
    badge: "Workstation",
  },
  {
    id: "mobile-companion",
    title: "9. Wireless Mobile Companion & Intercom",
    shortTitle: "Mobile Companion & App",
    category: "Mobile",
    icon: Smartphone,
    badge: "Stage",
  },
  {
    id: "auth-licensing",
    title: "10. 60-Day Trial & Offline Grace Period",
    shortTitle: "Licensing & Grace",
    category: "Security",
    icon: ShieldCheck,
    badge: "60-Day Trial",
  },
  {
    id: "guest-evaluation",
    title: "11. 1-Hour Offline Guest Evaluation (1hr Use Time)",
    shortTitle: "1hr Use Time (Guest)",
    category: "Evaluation",
    icon: Hourglass,
    badge: "1-Hour",
  },
  {
    id: "cloud-portal",
    title: "12. Cloud Web Portal & Admin Intelligence",
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
                Complete Setup & Feature Documentation
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Step-by-step sanctuary hardware configuration, dual-view setup instructions, mobile companion guides, and complete feature references for <strong>Organised Church Service (OCS)</strong>.
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
            <span>Table of Contents ({docSections.length} Sections)</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-purple-300 hover:text-white cursor-pointer"
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
                  placeholder="Search features & setup..."
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
                  <Award className="size-3.5 text-purple-700" /> OCS Vision & Leadership
                </div>
                <p className="text-slate-600 text-[10px] leading-relaxed">
                  Founded and led by **Are Oluwasegun Johnson**, providing dependable, cutting-edge worship presentation technology for churches globally.
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
                  <strong>OCS (Organised Church Service)</strong> is an integrated worship presentation suite engineered for zero-latency, offline-first execution.
                  It replaces traditional manual slide clicking with automatic speech-driven scripture detection, non-destructive multi-layer graphics compositing, and synchronized stage foldback.
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

            {/* 2. HOW TO SET UP & HARDWARE GUIDE */}
            <section id="setup-guide" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    <Tv className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">2. Hardware & Dual-Screen Setup Guide</h2>
                    <p className="text-xs text-slate-500">Everything needed to configure and activate both sanctuary views</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">Essential Setup</Badge>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                <p>
                  To take full advantage of OCS, your sanctuary workstation drives two independent video outputs simultaneously: the <strong>Congregation General View</strong> (Auditorium Projector/LED Wall) and the <strong>Speaker Foldback View</strong> (Stage Confidence Monitor).
                </p>

                {/* Hardware Checklist Box */}
                <div className="not-prose rounded-[14px] bg-slate-900 text-white p-5 space-y-4 shadow-lg">
                  <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                    <Laptop className="size-4 text-purple-400" /> Equipment & Devices Required Checklist
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-800/80 rounded-[10px] space-y-1.5 border border-slate-700/60">
                      <div className="font-bold text-white flex items-center gap-2">
                        <Monitor className="size-3.5 text-cyan-400" /> 1. Host Computer
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Mac (M1/M2/M3 Apple Silicon or Intel) or Windows 10/11 x64 PC with at least 8GB RAM and two external display outputs (HDMI, DisplayPort, or USB-C to Dual-HDMI Adapter).
                      </p>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-[10px] space-y-1.5 border border-slate-700/60">
                      <div className="font-bold text-white flex items-center gap-2">
                        <Tv className="size-3.5 text-purple-400" /> 2. Display 1: Congregation Screen
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Sanctuary Projector, Video Wall, or TV Screen facing the audience connected via HDMI / SDI / NDI.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-[10px] space-y-1.5 border border-slate-700/60">
                      <div className="font-bold text-white flex items-center gap-2">
                        <Tv className="size-3.5 text-emerald-400" /> 3. Display 2: Stage Foldback Monitor
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Stage Floor Monitor, Choir TV, or Preacher Confidence Screen facing the pulpit.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-[10px] space-y-1.5 border border-slate-700/60">
                      <div className="font-bold text-white flex items-center gap-2">
                        <Volume2 className="size-3.5 text-amber-400" /> 4. Audio Input & Local Wi-Fi
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Wireless lapel or podium mic plugged into a USB Audio Interface (16kHz speech input) + Local Wi-Fi Router for wireless Mobile Stage Companions.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 pt-2">Step-by-Step Connection Instructions:</h3>

                <ol className="space-y-3 text-xs text-slate-700 list-decimal pl-5">
                  <li>
                    <strong>Configure Extended Desktop Display Mode:</strong>
                    <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-600">
                      <li><strong>macOS:</strong> Open <em>System Settings → Displays</em>. Set the external displays to <strong>"Extended Desktop"</strong> (Ensure <em>"Mirror Displays"</em> is unchecked).</li>
                      <li><strong>Windows:</strong> Press <kbd className="bg-slate-100 px-1 py-0.5 rounded border text-[10px]">Win + P</kbd> on your keyboard and select <strong>"Extend"</strong>.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Connect the Preacher Microphone:</strong>
                    <p className="text-slate-600 mt-1">
                      Plug your wireless receiver or mixer USB output into the computer. In OCS Settings, select this audio input. OCS automatically applies high-pass filtering (100Hz) and 2× pre-amplification for Whisper.cpp.
                    </p>
                  </li>
                  <li>
                    <strong>Launch OCS Desktop:</strong>
                    <p className="text-slate-600 mt-1">
                      The Controller UI opens on your laptop/desk monitor. OCS automatically opens the <strong>General View</strong> on Output 1 and the <strong>Speaker Foldback View</strong> on Output 2.
                    </p>
                  </li>
                  <li>
                    <strong>Connect the Mobile Stage Companion:</strong>
                    <p className="text-slate-600 mt-1">
                      Connect your iOS or Android device to the sanctuary Wi-Fi network. Open OCS Mobile and scan the on-screen pairing QR code for instant teleprompter synchronization and push-to-talk intercom access.
                    </p>
                  </li>
                </ol>
              </div>
            </section>

            {/* 3. SPEECH & AI */}
            <section id="speech-ai" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    <Mic className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">3. Voice-Driven Scripture Projection (AI ASR)</h2>
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

            {/* 4. DISPLAY CANVAS */}
            <section id="display-canvas" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    <Layers className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">4. Dual-Display Compositor & 4-Layer Canvas</h2>
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

            {/* 5. AGENDA PLANNER */}
            <section id="agenda-planner" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">5. Service Agenda Planner & Automated Cues</h2>
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

            {/* 6. SERMON ARCHIVING */}
            <section id="sermon-archiving" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">6. Sermon Archiving, Bumpers & PDF Notes</h2>
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

            {/* 7. NDI & BROADCAST */}
            <section id="ndi-broadcast" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-pink-100 flex items-center justify-center text-pink-700 font-bold">
                    <Radio className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">7. NDI, OBS & Live Streaming Overlays</h2>
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

            {/* 8. COMPLETE DESKTOP FEATURES REFERENCE */}
            <section id="desktop-features" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    <Laptop className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">8. Complete Desktop Features Reference</h2>
                    <p className="text-xs text-slate-500">Comprehensive capabilities of the OCS Sanctuary Workstation</p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">Workstation</Badge>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
                <div className="grid sm:grid-cols-2 gap-3 not-prose">
                  <div className="p-3.5 bg-slate-50 rounded-[12px] border border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Mic className="size-3.5 text-purple-600" /> Continuous AI ASR Engine
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Native Whisper.cpp + Vosk fallback with pre-roll buffering, phonetic mishearing dictionary, and ordinal book disambiguation.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-[12px] border border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Layers className="size-3.5 text-blue-600" /> 4-Layer Non-Destructive Canvas
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Independent rendering for backgrounds, scriptures, transient alert banners, and emergency blackouts without state loss.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-[12px] border border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="size-3.5 text-amber-600" /> Agenda Planner & Master Timers
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Time allocations per service item, dual-action timer edits ("Add" vs "Update"), mid-run chimes, and automatic screen blackout upon completion.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-[12px] border border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="size-3.5 text-emerald-600" /> Automated Sermon Archiving
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Multi-track audio recording, branded intro/outro video bumper auto-merging via FFmpeg, and formatted PDF sermon note generation.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-[12px] border border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Radio className="size-3.5 text-pink-600" /> NDI & OBS Broadcast Keying
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Transparent alpha lower-thirds streamed over local network via mDNS for direct ingestion into OBS Studio and vMix.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-[12px] border border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-purple-600" /> Offline Sanctuary Grace Period
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      72-hour offline cached validation ensuring Sunday services operate without interruption even during internet outages.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 9. WIRELESS MOBILE COMPANION */}
            <section id="mobile-companion" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold">
                    <Smartphone className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">9. Wireless Mobile Companion & Intercom Features</h2>
                    <p className="text-xs text-slate-500">Handheld stage teleprompter, pulpit controls, and crew push-to-talk</p>
                  </div>
                </div>
                <Badge className="bg-cyan-100 text-cyan-700 border-0 text-xs">Stage App</Badge>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
                <p>
                  Pastors, worship leaders, and stage directors can connect their mobile devices directly to the OCS Sanctuary workstation over local Wi-Fi without needing an active internet connection.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 not-prose pt-1">
                  <div className="p-3.5 bg-cyan-50/70 rounded-[12px] border border-cyan-100 space-y-1">
                    <div className="text-xs font-bold text-cyan-900 flex items-center gap-1.5">
                      <BookOpen className="size-3.5 text-cyan-700" /> Stage Teleprompter Read-Along
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Auto-scrolls sermons, sermon notes, and song lyrics in real time synchronized to the speaker's vocal cadence.
                    </p>
                  </div>

                  <div className="p-3.5 bg-cyan-50/70 rounded-[12px] border border-cyan-100 space-y-1">
                    <div className="text-xs font-bold text-cyan-900 flex items-center gap-1.5">
                      <Volume2 className="size-3.5 text-cyan-700" /> Push-to-Talk Crew Intercom
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Private, low-latency audio link between stage personnel and the AV booth with background audio waveform ducking.
                    </p>
                  </div>

                  <div className="p-3.5 bg-cyan-50/70 rounded-[12px] border border-cyan-100 space-y-1">
                    <div className="text-xs font-bold text-cyan-900 flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-cyan-700" /> Instant Scripture & Hymn Push
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Search any Bible reference or hymnal on your phone and beam it live to the auditorium screens in 1 tap.
                    </p>
                  </div>

                  <div className="p-3.5 bg-cyan-50/70 rounded-[12px] border border-cyan-100 space-y-1">
                    <div className="text-xs font-bold text-cyan-900 flex items-center gap-1.5">
                      <Hourglass className="size-3.5 text-cyan-700" /> 1-Hour Guest Rehearsal Window
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Visiting pastors can immediately test teleprompter and remote controls during rehearsals without signing in.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 10. AUTH & LICENSING */}
            <section id="auth-licensing" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">10. 60-Day Free Trial & Offline Grace Period</h2>
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

            {/* 11. 1-HOUR OFFLINE GUEST EVALUATION */}
            <section id="guest-evaluation" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                    <Hourglass className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">11. 1-Hour Offline Guest Evaluation Window ("1hr Use Time")</h2>
                    <p className="text-xs text-slate-500">Unauthenticated instant rehearsal mode with hardware anti-tamper tracking</p>
                  </div>
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-0 text-xs">1-Hour Limit</Badge>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                <p>
                  When launching <strong>OCS Desktop</strong> or the <strong>OCS Mobile Companion</strong> without signing in, operators immediately enter a <strong>1-hour (3,600 seconds) unauthenticated evaluation window</strong>.
                  This allows church AV technicians, visiting guest pastors, and choir teams to test scripture projection, speech recognition, and stage controls instantly during rehearsals without waiting for account setup.
                </p>

                {/* Screenshot Asset Showcase */}
                <div className="not-prose rounded-[16px] overflow-hidden border border-slate-200 bg-slate-950 shadow-xl p-3 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between px-2 text-xs text-slate-400">
                    <span className="font-mono text-[11px] text-purple-400 font-semibold flex items-center gap-1.5">
                      <Sparkles className="size-3.5" /> 1-Hour Guest Session Expiration & Lock Gate Preview
                    </span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">FR-13.1b / FR-18.2 Verified</span>
                  </div>
                  <div className="rounded-[12px] overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                    <img
                      src={oneHourUseTimeImg}
                      alt="1-Hour Guest Session Expiration & Evaluation Lock Gate"
                      className="w-full h-auto object-contain rounded-[10px] hover:scale-[1.01] transition-transform duration-300"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 text-center italic">
                    When the 1-hour offline evaluation concludes, the full-screen modal gate locks presentation controls until the church signs in to unlock their 60-day free trial.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 not-prose pt-2">
                  <div className="p-3.5 rounded-[12px] bg-amber-50/70 border border-amber-200/80 space-y-1">
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Lock className="size-3.5 text-amber-700" /> Hardware Anti-Tamper
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Generated SHA-256 machine hash stored across multi-anchor system files prevents app restarts or cache clearing from resetting the 1-hour quota.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-[12px] bg-blue-50/70 border border-blue-200/80 space-y-1">
                    <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Clock className="size-3.5 text-blue-700" /> 100% Offline Wall-Clock Sync
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Elapsed time is computed continuously using the local system clock, ensuring accurate enforcement even with no internet connection.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-[12px] bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-emerald-700" /> 1-Click 60-Day Unlock
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Logging in with any free trial or church subscription account immediately unlocks full presentation features for 60 days.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-3 not-prose">
                  <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white rounded-[12px] px-6 text-xs font-bold shadow-md">
                    <Link to="/signup">Start Free 60-Day Trial</Link>
                  </Button>
                  <Button variant="outline" asChild className="border-slate-300 rounded-[12px] px-6 text-xs font-semibold">
                    <Link to="/login">Sign In To Unlock</Link>
                  </Button>
                </div>
              </div>
            </section>

            {/* 12. CLOUD PORTAL */}
            <section id="cloud-portal" className="scroll-mt-28 bg-white rounded-[16px] border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-[12px] bg-violet-100 flex items-center justify-center text-violet-700 font-bold">
                    <Zap className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">12. Cloud Web Portal & Admin Intelligence</h2>
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
