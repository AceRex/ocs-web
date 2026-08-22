import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Mic, Monitor, Layers, Clock, Radio,
  CheckCircle2, ArrowRight, ArrowUpRight, Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageTransition } from "@/components/layout/PageTransition"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
}

const metrics = [
  { value: "100% Offline", label: "In-Process Whisper.cpp & Vosk Engine" },
  { value: "<100ms", label: "Multi-Display Synchronization Latency" },
  { value: "4 Surfaces", label: "Controller, General, Stage & NDI Broadcast" },
  { value: "0 Clicks", label: "AI Voice-Driven Hands-Free Operation" },
]

export default function DocsPage() {
  return (
    <PageTransition>
      {/* ── HERO SECTION (Matching Napoly reference layout) ── */}
      <section className="relative overflow-hidden pt-24 pb-16 gradient-hero">
        <div className="mesh-blob w-[700px] h-[700px] bg-purple-300/40 -top-60 left-1/2 -translate-x-1/2" />
        <div className="mesh-blob w-[500px] h-[500px] bg-pink-300/30 top-10 -left-40" />
        <div className="mesh-blob w-[500px] h-[500px] bg-indigo-300/30 top-10 -right-40" />

        <div className="relative z-10 container mx-auto px-6 max-w-5xl text-center space-y-6 pt-12 pb-8">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <Badge className="bg-purple-100/80 text-purple-700 border-purple-200 text-xs font-semibold px-4 py-1 rounded-full backdrop-blur-sm shadow-sm">
              <Sparkles className="size-3.5 mr-1.5 inline text-purple-600" />
              OCS PLATFORM ARCHITECTURE & PRD
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight text-slate-900"
          >
            Everything Your Ministry Production Needs in{" "}
            <span className="gradient-text">One Platform</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto"
          >
            Offline-first speech recognition, dynamic multi-layer display compositing,
            and stage orchestration engineered specifically for church media teams.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-7 h-12 text-sm font-semibold shadow-lg shadow-blue-600/25">
              <Link to="/signup" className="flex items-center gap-2">
                Get Started <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-300 text-slate-700 hover:border-purple-400 hover:text-purple-700 bg-white/80 backdrop-blur-sm rounded-full px-7 h-12 text-sm font-semibold"
              asChild
            >
              <a href="#features" className="flex items-center gap-2">
                Explore Solutions <ArrowRight className="size-4" />
              </a>
            </Button>
          </motion.div>
        </div>

        {/* ── 3-CARD MINI PREVIEW ROW (Matching reference header illustration) ── */}
        <div className="container mx-auto px-6 max-w-5xl pt-6 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Mini Card 1: ASR Intent */}
            <div className="glass-card rounded-2xl p-5 shadow-lg shadow-purple-900/5 border border-white/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Mic className="size-3.5 text-purple-600" /> ASR Confidence
                </span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0">
                  98.4% Match
                </Badge>
              </div>
              <div className="bg-slate-900 text-white rounded-xl p-3 text-xs font-mono space-y-1.5">
                <div className="text-slate-400 text-[10px]">UTTERANCE ID: #8824</div>
                <div className="text-purple-300 font-semibold">"John chapter three verse sixteen"</div>
                <div className="text-emerald-400 text-[10px]">→ RESOLVED: John 3:16 (NKJV)</div>
              </div>
            </div>

            {/* Mini Card 2: Display Canvas */}
            <div className="glass-card rounded-2xl p-5 shadow-lg shadow-purple-900/5 border border-white/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Layers className="size-3.5 text-blue-600" /> Display Canvas
                </span>
                <span className="text-xs font-semibold text-slate-700">4 Layers Active</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between bg-purple-50/80 rounded-lg px-2.5 py-1 text-xs text-purple-900">
                  <span>Pinned: Lower-Third Logo</span>
                  <span className="text-[10px] text-purple-600">Z-Index 3</span>
                </div>
                <div className="flex items-center justify-between bg-blue-50/80 rounded-lg px-2.5 py-1 text-xs text-blue-900">
                  <span>Content: Scripture Passage</span>
                  <span className="text-[10px] text-blue-600">Slot 1</span>
                </div>
                <div className="flex items-center justify-between bg-slate-100 rounded-lg px-2.5 py-1 text-xs text-slate-700">
                  <span>Background: Motion Loop</span>
                  <span className="text-[10px] text-slate-500">Cover</span>
                </div>
              </div>
            </div>

            {/* Mini Card 3: Multi-Output Status */}
            <div className="glass-card rounded-2xl p-5 shadow-lg shadow-purple-900/5 border border-white/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Monitor className="size-3.5 text-pink-600" /> Output Status
                </span>
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <div className="text-xs font-bold text-slate-800">General View</div>
                  <div className="text-[10px] text-emerald-600 font-medium">1080p60 · Live</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <div className="text-xs font-bold text-slate-800">Speaker View</div>
                  <div className="text-[10px] text-purple-600 font-medium">Stage · Active</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── METRICS STRIP (Matching reference stats) ── */}
      <section className="bg-white border-y border-purple-100/80 py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {m.value}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1 max-w-[180px] mx-auto leading-relaxed">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTIONS SECTION: Alternating 2-Column Blocks (Matching Napoly style) ── */}
      <section id="features" className="py-24 bg-slate-50/60">
        <div className="container mx-auto px-6 max-w-6xl space-y-16">
          {/* Header */}
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">SOLUTIONS & SPECS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Solutions for modern church production
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Designed around how live services actually run. Deeply documented and verified against PRD v1.10.
            </p>
          </div>

          {/* ── BLOCK 1: Speech & AI (Text Left, Visual Right) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm"
          >
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">AI & SPEECH RECOGNITION</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Live speech intelligence & continuous scripture detection
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Powered by native in-process <strong>whisper.cpp</strong> with automatic <strong>Vosk-small fallback</strong>.
                OCS captures 16kHz audio directly through Web Audio with high-pass filtering (100Hz) and a 2× software pre-amp.
                Our 4-pass reference intent gate detects scriptures in continuous preaching with zero cloud dependency.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span><strong>500ms Pre-Roll Buffer:</strong> Prevents clipped initial syllables on trigger words.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span><strong>Ordinal Book Handling:</strong> Disambiguates compound references (e.g. "First Corinthians 13").</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span><strong>Dual-Engine Phonetic Aliasing:</strong> Independent mishearing dictionaries for whisper and Vosk.</span>
                </li>
              </ul>
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 gap-1.5">
                <Link to="/download">
                  Try Speech Engine <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>

            {/* Visual Container Right */}
            <div className="bg-gradient-to-br from-blue-50/80 via-purple-50/60 to-pink-50/40 rounded-2xl p-6 border border-purple-100/80 flex items-center justify-center min-h-[300px]">
              <div className="w-full max-w-sm glass-card rounded-2xl p-5 shadow-xl border border-white space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800">ASR Adapter Pipeline</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    whisper.cpp (Primary)
                  </Badge>
                </div>

                {/* Simulated Audio Wave */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Input: 16kHz PCM High-Pass</span>
                    <span className="text-emerald-600 font-semibold">Latency: 18ms</span>
                  </div>
                  <div className="h-8 bg-slate-900 rounded-lg flex items-center justify-center gap-1 px-3">
                    {[40, 65, 30, 90, 75, 45, 85, 95, 60, 40, 80, 50, 70, 35, 60].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-purple-400 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100 text-xs">
                  <div className="text-[10px] font-mono text-slate-400">RESOLVED INTENT:</div>
                  <div className="font-bold text-slate-900">Romans 8:28</div>
                  <div className="text-slate-500 text-[11px] italic">
                    "And we know that all things work together for good..."
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── BLOCK 2: Display Canvas (Visual Left, Text Right) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm"
          >
            {/* Visual Container Left */}
            <div className="order-2 lg:order-1 bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-indigo-50/40 rounded-2xl p-6 border border-purple-100/80 flex items-center justify-center min-h-[300px]">
              <div className="w-full max-w-sm glass-card rounded-2xl p-5 shadow-xl border border-white space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Display Canvas Compositor</span>
                  <Badge className="bg-purple-100 text-purple-700 text-[10px] border-0">Non-Destructive</Badge>
                </div>
                {/* Visual Layers Stack */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-purple-600 text-white rounded-xl flex items-center justify-between font-semibold shadow-sm">
                    <span>4. Chrome Layer</span>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Blackout / Logo</span>
                  </div>
                  <div className="p-2.5 bg-blue-600 text-white rounded-xl flex items-center justify-between font-semibold shadow-sm">
                    <span>3. Pinned Layers (Z-Ordered)</span>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Persistent Graphic</span>
                  </div>
                  <div className="p-2.5 bg-emerald-600 text-white rounded-xl flex items-center justify-between font-semibold shadow-sm">
                    <span>2. Content Slot</span>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Bible / Presentation</span>
                  </div>
                  <div className="p-2.5 bg-slate-800 text-slate-200 rounded-xl flex items-center justify-between font-semibold shadow-sm">
                    <span>1. Background Layer</span>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Cover Scaled Video</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Right */}
            <div className="order-1 lg:order-2 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">COMPOSITOR & MEDIA</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Unified multi-layer Display Canvas compositor
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Media, Scenes, Text, and Presentations resolve into two layer types (<strong>background</strong>, <strong>pinned</strong>)
                and two content slots (<strong>scene</strong>, <strong>presentation</strong>). Switching between Bible verses and Timers
                never clears your pinned church logo, sponsor graphic, or live lower third.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span><strong>Adjusting Nodes:</strong> Drag-and-resize handles in Controller preview with normalized coordinates.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span><strong>PPTX & PDF Import:</strong> High-res slide conversion with speaker notes and voice slide navigation.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span><strong>Normalized Video Pipeline:</strong> Automated VP9/WebM normalization for glitch-free GPU playback.</span>
                </li>
              </ul>
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 gap-1.5">
                <Link to="/about">
                  Explore Architecture <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* ── BLOCK 3: Order of Service & Teleprompter (Text Left, Visual Right) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm"
          >
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">SERVICE AUTOMATION</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Order of Service, Timers & Speech Teleprompter
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pre-plan your service flow and drive it hands-free. The <strong>Timer Lifecycle Bus</strong> synchronizes
                countdown clocks across the stage monitor and companion devices, while the generalized alignment engine
                auto-scrolls scripts and lyrics with bounded backward resynchronization.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span><strong>Stage Monitor Sync:</strong> Preacher sees current verse, upcoming item, speaker notes, and timer.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span><strong>Speech Read-Along Auto-Advance:</strong> Paged lyrics and notes track speaker cadence in real time.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span><strong>Live REC Indication:</strong> Automatic session audio recording triggered by service timer start.</span>
                </li>
              </ul>
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 gap-1.5">
                <Link to="/download">
                  Get Started <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>

            {/* Visual Container Right */}
            <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-blue-50/40 rounded-2xl p-6 border border-purple-100/80 flex items-center justify-center min-h-[300px]">
              <div className="w-full max-w-sm glass-card rounded-2xl p-5 shadow-xl border border-white space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-800">Stage Master Clock</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    REC 00:32:15
                  </span>
                </div>

                <div className="bg-slate-950 text-white rounded-xl p-4 text-center space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">Sermon Message Timer</div>
                  <div className="text-3xl font-extrabold font-mono tracking-tight text-emerald-400">18:45</div>
                  <div className="text-[11px] text-slate-400">Next: Closing Worship & Benediction</div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Teleprompter Read-Along:</div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 text-[11px] leading-snug">
                    <span className="bg-purple-200 text-purple-900 font-semibold px-1 rounded">"Grace and peace</span> to you from God our Father and the Lord Jesus Christ..."
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── BLOCK 4: NDI, Broadcast & Companion (Visual Left, Text Right) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm"
          >
            {/* Visual Container Left */}
            <div className="order-2 lg:order-1 bg-gradient-to-br from-pink-50/80 via-purple-50/60 to-blue-50/40 rounded-2xl p-6 border border-purple-100/80 flex items-center justify-center min-h-[300px]">
              <div className="w-full max-w-sm glass-card rounded-2xl p-5 shadow-xl border border-white space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Radio className="size-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">Broadcast Streams</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 text-[10px]">mDNS Active</Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">OBS Program Stream</div>
                      <div className="text-[10px] text-slate-500 font-mono">http://192.168.1.50:8088/stream</div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">1080p</Badge>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">Mobile Companion</div>
                      <div className="text-[10px] text-slate-500">Worship Lead iPhone (Paired)</div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 text-[10px]">PTT Active</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Right */}
            <div className="order-1 lg:order-2 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">BROADCAST & MOBILE</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                NDI/OBS broadcast feeds & remote mobile control
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connect OCS directly into your livestream workflow. Program and Stage outputs are advertised via mDNS
                and streamed via low-latency HTTP/MJPEG directly into <strong>OBS Studio</strong>, <strong>vMix</strong>,
                or hardware switchers without heavy capture cards.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span><strong>Mobile Companion App:</strong> React Native / Expo app for stage remote control & push-to-talk mic.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span><strong>Continuous Secondary Mic Mode:</strong> Hands-free mobile voice detection for worship pastors.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span><strong>Per-Device Token Pairing:</strong> Launch-scoped QR pairing with instant revocation control.</span>
                </li>
              </ul>
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 gap-1.5">
                <Link to="/download">
                  Download Mobile Companion <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRD ARCHITECTURE CALLOUT BANNER ── */}
      <section id="licensing" className="py-20 bg-white border-t border-purple-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-purple-200/80 shadow-xl bg-gradient-to-br from-purple-50/50 to-pink-50/30">
            <div className="max-w-3xl space-y-6">
              <Badge className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                SECTION 13 · PRD v1.10
              </Badge>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Organization Authentication & Offline Grace Period
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                OCS balances modern organization-level licensing with strict <strong>offline-first sanctuary reliability</strong>.
                Desktop apps authenticate once via secure web-redirect (<code className="bg-purple-100 px-1 py-0.5 rounded text-purple-800 text-xs">ocs://auth-callback</code>)
                and cache credentials locally with an offline grace period.
                Your Sunday service will never be blocked by an unexpected internet outage or router reboot.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button size="lg" asChild className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-7 font-semibold">
                  <Link to="/signup">Register Your Church</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-slate-300 rounded-xl px-7 bg-white">
                  <Link to="/about">Read The OCS Story</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
