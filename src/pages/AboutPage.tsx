import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Mic, Clock, Smartphone, FolderArchive, Radio,
  Heart, Sparkles, Layers
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

const pillars = [
  {
    icon: Mic,
    title: "Live AI Speech & Scripture Tracking",
    desc: "OCS listens to spoken sermon speech and intelligently detects Bible references in real time, helping operators surface the right passage without scrambling through books.",
    tag: "Whisper.cpp & Vosk",
    color: "from-violet-500 to-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Clock,
    title: "Timers & Production Automation",
    desc: "Automate countdowns, service segments, and teleprompters so volunteers and pastors stay perfectly synchronized without frantic hand signals.",
    tag: "Stage Clock Bus",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
  },
  {
    icon: Smartphone,
    title: "Mobile Companion App",
    desc: "Pastors, worship leaders, and stage managers can trigger slides, monitor countdowns, and speak voice commands directly from their phones.",
    tag: "React Native / Expo",
    color: "from-pink-500 to-rose-600",
    bg: "bg-pink-50",
  },
  {
    icon: FolderArchive,
    title: "Automatic Session Archives",
    desc: "Turn completed services into organized archives, including high-quality Opus audio and formatted PDF transcripts ready for podcasts, sermon recaps, and church documentation.",
    tag: "Opus & PDF Transcripts",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Radio,
    title: "Broadcast & Display Integration",
    desc: "As OCS grows, it connects with existing production ecosystems through OBS Studio, NDI, browser sources, and external video hardware for multi-camera livestreams.",
    tag: "mDNS & HTTP/MJPEG",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
  },
  {
    icon: Layers,
    title: "Multi-Layer Display Canvas",
    desc: "Non-destructive background video and pinned lower-third graphics that stay on screen even while switching between scripture, presentation slides, and timers.",
    tag: "Compositor Architecture",
    color: "from-purple-600 to-indigo-700",
    bg: "bg-indigo-50",
  },
]

const tiers = [
  {
    stage: "A Small Church",
    headline: "Start Simple",
    description: "Plug in a single computer and monitor. Let automated AI voice tracking handle scriptures while volunteers focus on greeting and prayer.",
  },
  {
    stage: "A Growing Church",
    headline: "Scale Seamlessly",
    description: "Add a stage monitor for the pastor, connect worship leaders via mobile companion devices, and organize multi-segment service schedules.",
  },
  {
    stage: "A Large Church",
    headline: "Integrate Deeply",
    description: "Stream Program and Stage feeds directly into OBS Studio, vMix, and broadcast switchers via low-latency NDI/mDNS streaming.",
  },
]

export default function AboutPage() {
  return (
    <PageTransition>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-16 gradient-hero">
        <div className="mesh-blob w-[650px] h-[650px] bg-purple-300/40 -top-50 left-1/2 -translate-x-1/2" />
        <div className="mesh-blob w-[500px] h-[500px] bg-pink-300/30 top-10 -left-40" />

        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center space-y-6 pt-8 pb-4">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <Badge className="bg-purple-100/80 text-purple-700 border-purple-200 text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
              <Heart className="size-3.5 mr-1.5 inline text-purple-600" />
              THE OCS MISSION & STORY
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-slate-900"
          >
            Making Church Production{"\n"}
            <span className="gradient-text">More Accessible</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto"
          >
            Live church production shouldn’t feel like something only churches with big budgets can afford.
            We are building the modern operating system for church production.
          </motion.p>
        </div>
      </section>

      {/* ── THE PROBLEM & WHY WE'RE BUILDING OCS ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl space-y-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">THE REALITY</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                The Media Barrier in Modern Ministry
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                For many local churches, building a proper media and AV setup is daunting and expensive.
                You need computers, projection screens, cameras, audio equipment, presentation software licenses,
                complex networking, and people with technical expertise to operate it every Sunday.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                For a growing or smaller church, that technical friction can become a serious barrier to ministry.
                Volunteers get overwhelmed, verses are missed, and screens go blank.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-xl border border-purple-100 bg-gradient-to-br from-purple-50/60 to-pink-50/40 space-y-4">
              <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                <Sparkles className="size-4 text-purple-600" />
                <span>Our Founding Commitment</span>
              </div>
              <blockquote className="text-slate-700 text-sm font-medium italic leading-relaxed">
                "OCS exists to eliminate every technical distraction between a congregation and their worship experience.
                When technology works invisibly, the Spirit moves freely."
              </blockquote>
              <div className="pt-2 text-xs text-slate-500 border-t border-purple-200/60 flex items-center justify-between">
                <span>Are Oluwasegun Johnson</span>
                <span className="font-semibold text-purple-700">Lead Architect, OCS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT OCS IS BRINGING TOGETHER (Pillars from brief_about.md) ── */}
      <section className="py-24 bg-slate-50 border-t border-purple-100/80">
        <div className="container mx-auto px-6 max-w-6xl space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
              CORE CAPABILITIES
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What OCS is bringing together
            </h2>
            <p className="text-slate-500 text-sm">
              We’re starting with the essentials and building an integrated production ecosystem from there.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-card rounded-2xl p-6 space-y-4 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className={`size-11 rounded-xl ${p.bg} flex items-center justify-center`}>
                    <p.icon className="size-5 text-purple-700" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-purple-200 text-purple-700">
                    {p.tag}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE THREE TIERS VISION (From brief_about.md) ── */}
      <section id="vision" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl space-y-14">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">SCALABLE FOUNDATION</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Platform Built for Every Church Size
            </h2>
            <p className="text-slate-500 text-sm">
              OCS is designed to scale gracefully from a small church plant to a multi-campus cathedral.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((t, i) => (
              <motion.div
                key={t.stage}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-3 hover:border-purple-300 transition-colors"
              >
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">{t.stage}</span>
                <h3 className="text-xl font-extrabold text-slate-900">{t.headline}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / MISSION SUMMARY ── */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center space-y-8">
          <Badge className="bg-purple-600/30 text-purple-300 border-purple-500/30 text-xs px-3 py-1 rounded-full">
            THE MISSION AHEAD
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            We're building a modern operating system for church production.
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            We’re building OCS because we believe technology should reduce friction in ministry — not create more of it.
            Join us in shaping the future of church AV.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-8 font-semibold shadow-lg shadow-purple-600/30">
              <Link to="/download">Download OCS Platform</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-slate-700 text-slate-300 hover:text-white bg-transparent rounded-xl px-8">
              <Link to="/docs">View Documentation</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
