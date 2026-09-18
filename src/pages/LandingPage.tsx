import { Link } from "react-router-dom"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  Download, ArrowRight, Monitor, Mic, Users, Shield,
  Zap, LayoutGrid, ChevronRight, Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageTransition } from "@/components/layout/PageTransition"
import { useTestimonialsQuery } from "@/lib/queries"

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
    color: "bg-[#00A8FF]",
    bg: "bg-[#00A8FF]/10",
  },
  {
    icon: Mic,
    title: "Live Transcription",
    desc: "Real-time microphone transcription synced across your team. Never miss a word during your service.",
    color: "bg-[#8B5CF6]",
    bg: "bg-[#8B5CF6]/10",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Multi-device companion app support. Your stage manager and tech lead can work together seamlessly.",
    color: "bg-[#00A8FF]",
    bg: "bg-[#00A8FF]/10",
  },
  {
    icon: LayoutGrid,
    title: "Smart Scheduling",
    desc: "Plan your order of service, load media, and broadcast — all from a single unified interface.",
    color: "bg-[#00A8FF]",
    bg: "bg-[#00A8FF]/10",
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    desc: "No complex setup. Install and be running in minutes. Works on macOS, Windows, iOS, and Android.",
    color: "bg-[#8B5CF6]",
    bg: "bg-[#8B5CF6]/10",
  },
  {
    icon: Shield,
    title: "Secure Auth",
    desc: "Enterprise-grade login with deep-link session management. Your church data stays private and protected.",
    color: "bg-[#00A8FF]",
    bg: "bg-[#00A8FF]/10",
  },
]

const stats = [
  { value: "4 Platforms", label: "macOS, Windows, iOS, Android" },
  { value: "Offline-First", label: "In-process speech engine" },
  { value: "Secure", label: "End-to-end auth sessions" },
  { value: "Licensed", label: "Church & team management" },
]

export default function LandingPage() {
  const { data: remoteTestimonials } = useTestimonialsQuery()

  const liveTestimonials = remoteTestimonials?.map((t: any, i: number) => ({
    id: t._id || t.id || `live-${i}`,
    quote: t.quote || t.message || t.story || "",
    author: t.name || t.author || "Ministry Leader",
    church: t.church ? `${t.church}${t.location ? `, ${t.location}` : ""}` : (t.location || "Community Church"),
    avatar: (t.name || t.author || "CL").substring(0, 2).toUpperCase(),
    stars: t.rating || t.stars || 5,
  })) || []

  // ── 3D Interactive Mouse Parallax ──
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 100 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -4]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig)
  const glareOpacity = useSpring(useTransform(mouseY, [-0.5, 0.5], [0.35, 0.05]), springConfig)
  const scale = useSpring(useTransform(mouseY, [-0.5, 0.5], [1.02, 1.01]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <PageTransition>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40">
        {/* Soft Ambient Brand Mesh Glows for Light Background */}
        <div className="mesh-blob w-[600px] h-[600px] bg-[#00A8FF]/8 -top-40 left-1/2 -translate-x-1/2" />
        <div className="mesh-blob w-[450px] h-[450px] bg-[#8B5CF6]/6 top-20 -left-20" />
        <div className="mesh-blob w-[450px] h-[450px] bg-[#00E5FF]/6 top-20 -right-20" />

        <div className="relative z-10">
          {/* ── Text block: centered ── */}
          <div className="container mx-auto px-6 max-w-4xl pt-8 pb-12 text-center">
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
              <Badge className="bg-[#00A8FF]/10 text-[#0070BA] border border-[#00A8FF]/25 hover:bg-[#00A8FF]/15 text-xs font-bold px-4 py-1.5 rounded-[12px] shadow-sm">
                ✦ CHURCH SERVICE MANAGEMENT
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="mt-8 text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight text-slate-900"
            >
              The Modern Church{"\n"}
              <span className="bg-gradient-to-r from-[#00A8FF] via-[#7B2CBF] to-[#00A8FF] bg-clip-text text-transparent">
                Service Platform
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-6 text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto"
            >
              wave.io helps your team run flawless services. Control displays, manage live
              transcription, and coordinate your entire tech team — from one app.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-9 flex flex-wrap items-center justify-center gap-4"
            >
              <Button size="lg" asChild className="bg-[#00A8FF] hover:bg-[#0092dd] text-white rounded-[12px] px-8 h-12 text-base font-bold shadow-lg shadow-[#00A8FF]/25 transition-all">
                <Link to="/download" className="flex items-center gap-2">
                  <Download className="size-5" />
                  Get Started
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-[12px] px-8 h-12 text-base font-semibold shadow-sm transition-all"
                asChild
              >
                <Link to="/#features" className="flex items-center gap-2">
                  See Features
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* ── Dashboard screenshot: floating with interactive 3D perspective mouse effect ── */}
          <div
            className="container mx-auto px-6 max-w-6xl pb-4 cursor-pointer relative"
            style={{ perspective: "1800px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* ── 3D Floating Dashboard Frame ── */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
              style={{
                rotateX,
                rotateY,
                scale,
                transformStyle: "preserve-3d",
              }}
              className="relative z-10"
            >
              {/* Soft ambient brand aura behind container */}
              <div className="absolute -inset-4 bg-gradient-to-b from-[#00A8FF]/15 via-[#8B5CF6]/10 to-transparent rounded-[24px] blur-2xl pointer-events-none" />

              {/* 
                User Specification:
                Image in a div that has a rounded border of 20px, padding of 10px and border white of 4px
              */}
              <div
                className="relative rounded-[20px] p-[10px] border-[4px] border-white shadow-2xl shadow-slate-400/30 bg-white/85 backdrop-blur-md ring-1 ring-slate-200/70"
                style={{ borderRadius: "20px" }}
              >
                {/* Screenshot Frame */}
                <div className="relative rounded-[12px] overflow-hidden shadow-md bg-slate-950">
                  <picture>
                    <source srcSet="/assets/wave/hero_workspace.avif" type="image/avif" />
                    <source srcSet="/assets/wave/hero_workspace.webp" type="image/webp" />
                    <img
                      src="/assets/wave/hero_workspace.png"
                      alt="wave.io live production workspace with camera sources, program preview, and lower-third controls."
                      width={1024}
                      height={638}
                      loading="eager"
                      fetchPriority="high"
                      className="w-full h-auto block transform-gpu"
                      draggable={false}
                    />
                  </picture>

                  {/* Interactive subtle dynamic light glare */}
                  <motion.div
                    style={{ opacity: glareOpacity }}
                    className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-white/20"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-[#F8FAFC] py-12 border-y border-slate-200/70 relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
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
                <div className="text-3xl font-black text-[#00A8FF]">{stat.value}</div>
                <div className="text-sm text-slate-600 font-semibold mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-[#00A8FF]/10 text-[#0070BA] border border-[#00A8FF]/25 text-xs font-semibold px-3 py-1 rounded-[12px]">
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
              className="text-lg text-slate-600 max-w-2xl mx-auto"
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
                className="bg-slate-50/70 hover:bg-white rounded-[12px] p-6 group hover:shadow-xl hover:shadow-slate-200/80 border border-slate-200/80 hover:border-[#00A8FF]/40 transition-all"
              >
                <div className={`size-11 rounded-[12px] ${f.bg} flex items-center justify-center mb-4`}>
                  <div className={`size-6 ${f.color} rounded-[12px] flex items-center justify-center`}>
                    <f.icon className="size-3.5 text-white" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#00A8FF] transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center text-xs font-semibold text-[#00A8FF] gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="size-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-[#F8FAFC] border-t border-slate-200/60">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-14">
            <Badge className="bg-[#8B5CF6]/10 text-[#7C3AED] border border-[#8B5CF6]/25 text-xs font-semibold px-3 py-1 rounded-[12px] mb-4">
              TESTIMONIALS
            </Badge>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Churches love wave.io
            </h2>
          </div>
          {liveTestimonials.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {liveTestimonials.map((t: any, i: number) => (
                <motion.div
                  key={t.id || t.author || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[12px] p-6 space-y-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-1">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} className="size-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    <div className="size-9 rounded-[12px] bg-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold">
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
          ) : (
            <div className="text-center py-12 px-6 rounded-[12px] bg-white border border-slate-200 max-w-xl mx-auto space-y-4 shadow-sm">
              <p className="text-sm text-slate-600">
                No church testimonials yet. Be the first ministry to share your story with wave.io!
              </p>
              <Button asChild variant="outline" className="rounded-[12px] font-semibold text-xs border-slate-300 hover:bg-slate-50 text-slate-800">
                <Link to="/testimonials#submit-form">Share Your Experience</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="py-20 bg-white border-t border-slate-200/60">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="relative rounded-[20px] overflow-hidden bg-gradient-to-br from-[#0B1020] via-[#151D36] to-[#0B1020] p-10 md:p-16 text-center space-y-8 shadow-2xl shadow-slate-900/10 border border-white/10">
            <div className="mesh-blob w-96 h-96 bg-[#00A8FF]/15 -top-20 -left-20" />
            <div className="mesh-blob w-80 h-80 bg-[#8B5CF6]/15 bottom-0 right-0" />
            <div className="relative z-10 space-y-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-extrabold text-white tracking-tight"
              >
                Ready to transform your service?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-[#E5E7EB] text-base md:text-lg max-w-2xl mx-auto"
              >
                Join hundreds of churches already using wave.io to run professional, distraction-free services.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4 pt-2"
              >
                <Button size="lg" asChild className="bg-[#00A8FF] text-white hover:bg-[#0092dd] font-bold rounded-[12px] shadow-lg shadow-[#00A8FF]/30 px-8">
                  <Link to="/download" className="flex items-center gap-2">
                    <Download className="size-5" />
                    Download App
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-white/5 rounded-[12px] font-semibold px-8"
                  asChild
                >
                  <Link to="/support">Contact Support</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
