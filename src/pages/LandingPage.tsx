import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Download, ArrowRight, Monitor, Mic, Users, Shield,
  Zap, LayoutGrid, ChevronRight, Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageTransition } from "@/components/layout/PageTransition"
import desktopViewImg from "@/assets/desktopview.png"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
}

const features = [
  {
    icon: Monitor,
    title: "Multi-Display Control",
    desc: "Manage General Display and Stage Monitor simultaneously. Broadcast to any screen from a single control hub.",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
  },
  {
    icon: Mic,
    title: "Live Transcription",
    desc: "Real-time microphone transcription synced across your team. Never miss a word during your service.",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Multi-device companion app support. Your stage manager and tech lead can work together seamlessly.",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
  },
  {
    icon: LayoutGrid,
    title: "Smart Scheduling",
    desc: "Plan your order of service, load media, and broadcast — all from a single unified interface.",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    desc: "No complex setup. Install and be running in minutes. Works on macOS, Windows, iOS, and Android.",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
  },
  {
    icon: Shield,
    title: "Secure Auth",
    desc: "Enterprise-grade login with deep-link session management. Your church data stays private and protected.",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
  },
]

const stats = [
  { value: "4 Platforms", label: "macOS, Windows, iOS, Android" },
  { value: "Offline-First", label: "In-process speech engine" },
  { value: "Secure", label: "End-to-end auth sessions" },
  { value: "Licensed", label: "Church & team management" },
]

const testimonials = [
  {
    quote: "OCS completely transformed how we run our Sunday services. The stage monitor alone is worth it.",
    author: "Pastor James A.",
    church: "Redeemed Church, Lagos",
    avatar: "JA",
    stars: 5,
  },
  {
    quote: "Our tech team loves the multi-display control. We went from chaos to confidence every week.",
    author: "Sarah M.",
    church: "Grace Community, Abuja",
    avatar: "SM",
    stars: 5,
  },
  {
    quote: "The live transcript feature is a game changer for accessibility in our congregation.",
    author: "Elder David K.",
    church: "City Harvest, Port Harcourt",
    avatar: "DK",
    stars: 5,
  },
]

export default function LandingPage() {
  return (
    <PageTransition>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-16">
        {/* Background — soft lavender-pink-purple gradient like reference */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-100/80 via-pink-100/50 to-purple-200/70" />
        {/* Mesh cloud blobs */}
        <div className="mesh-blob w-[700px] h-[700px] bg-purple-300/50 -top-60 left-1/2 -translate-x-1/2" />
        <div className="mesh-blob w-[500px] h-[500px] bg-pink-300/40 top-10 -left-40" />
        <div className="mesh-blob w-[500px] h-[500px] bg-violet-300/40 top-10 -right-40" />
        <div className="mesh-blob w-[600px] h-[600px] bg-pink-200/50 bottom-0 left-1/4" />
        <div className="mesh-blob w-[600px] h-[600px] bg-purple-200/50 bottom-0 right-1/4" />

        <div className="relative z-10">
          {/* ── Text block: centered ── */}
          <div className="container mx-auto px-6 max-w-4xl pt-20 pb-12 text-center">
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
              <Badge className="bg-purple-200/60 text-purple-800 border-purple-300/50 hover:bg-purple-200/60 text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm">
                ✦ CHURCH SERVICE MANAGEMENT
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="mt-8 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight text-slate-900"
            >
              The Modern Church{"\n"}
              <span className="gradient-text">Service Platform</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto"
            >
              OCS helps your team run flawless services. Control displays, manage live
              transcription, and coordinate your entire tech team — from one app.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-9 flex flex-wrap items-center justify-center gap-4"
            >
              <Button size="lg" asChild className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-slate-900/20">
                <Link to="/download" className="flex items-center gap-2">
                  <Download className="size-5" />
                  Get Started
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 text-slate-700 hover:border-purple-400 hover:text-purple-700 bg-white/70 backdrop-blur-sm rounded-xl px-8 h-12 text-base font-semibold"
                asChild
              >
                <Link to="/#features" className="flex items-center gap-2">
                  See Features
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* ── Dashboard screenshot: floating with 3D perspective ── */}
          <div className="container mx-auto px-6 max-w-6xl pb-0" style={{ perspective: "1800px" }}>
            <motion.div
              initial={{ opacity: 0, y: 60, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, rotateX: 4 }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glow behind image */}
              <div className="absolute -inset-4 bg-gradient-to-b from-purple-400/20 via-purple-500/10 to-transparent rounded-3xl blur-2xl" />

              {/* Screenshot */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/30 ring-1 ring-white/20">
                <img
                  src={desktopViewImg}
                  alt="OCS Desktop Application — General Display, Stage Monitor, Live Transcript, and Schedule Management"
                  className="w-full h-auto block"
                  draggable={false}
                />
                {/* Bottom gradient fade into next section */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-white border-y border-purple-100">
        <div className="container mx-auto px-6 max-w-7xl py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-2xl font-extrabold gradient-text">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-purple-50/40">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs font-semibold px-3 py-1 rounded-full">
                FEATURES
              </Badge>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900"
            >
              Everything your team needs
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-lg text-slate-500 max-w-2xl mx-auto"
            >
              Built specifically for church tech teams. Every feature is designed around how
              real services actually run.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-6 group hover:shadow-xl hover:shadow-purple-100/60 transition-all"
              >
                <div className={`size-11 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <div className={`size-6 bg-gradient-to-br ${f.color} rounded-lg flex items-center justify-center`}>
                    <f.icon className="size-3.5 text-white" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center text-xs font-semibold text-purple-600 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="size-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-14">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              TESTIMONIALS
            </Badge>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Churches love OCS
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 space-y-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="size-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <div className="size-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t.author}</div>
                    <div className="text-xs text-slate-500">{t.church}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="py-24 bg-gradient-to-br from-violet-600 via-purple-700 to-purple-800 relative overflow-hidden">
        <div className="mesh-blob w-96 h-96 bg-white/10 -top-20 -left-20" />
        <div className="mesh-blob w-80 h-80 bg-pink-400/20 bottom-0 right-0" />
        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Ready to transform your service?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-purple-200 text-lg max-w-2xl mx-auto"
          >
            Join hundreds of churches already using OCS to run professional, distraction-free services.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button variant="nav-cta" size="lg" asChild>
              <Link to="/download" className="flex items-center gap-2">
                <Download className="size-5" />
                Download App
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm"
              asChild
            >
              <Link to="/support">Contact Support</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
