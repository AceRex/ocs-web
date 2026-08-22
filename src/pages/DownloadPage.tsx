import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Download, Monitor, Smartphone, Apple, CheckCircle2,
  ChevronDown, ExternalLink, Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { PageTransition } from "@/components/layout/PageTransition"
import { cn } from "@/lib/utils"

type Platform = "macos" | "windows" | "android" | "ios"

function detectPlatform(): Platform {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes("mac")) return "macos"
  if (ua.includes("win")) return "windows"
  if (ua.includes("android")) return "android"
  if (ua.includes("iphone") || ua.includes("ipad")) return "ios"
  return "macos"
}

const platforms = [
  {
    id: "macos" as Platform,
    label: "macOS",
    icon: Apple,
    version: "v2.4.1",
    size: "68 MB",
    req: "macOS 12.0 Monterey or later · Apple Silicon & Intel",
    downloadUrl: "#",
    badge: "Apple Silicon Native",
  },
  {
    id: "windows" as Platform,
    label: "Windows",
    icon: Monitor,
    version: "v2.4.1",
    size: "74 MB",
    req: "Windows 10 (64-bit) or later",
    downloadUrl: "#",
    badge: null,
  },
  {
    id: "android" as Platform,
    label: "Android",
    icon: Smartphone,
    version: "v2.4.0",
    size: "31 MB",
    req: "Android 10 or later · Companion app",
    downloadUrl: "#",
    badge: "Play Store",
  },
  {
    id: "ios" as Platform,
    label: "iOS",
    icon: Apple,
    version: "v2.4.0",
    size: "28 MB",
    req: "iOS 15 or later · Companion app",
    downloadUrl: "#",
    badge: "App Store",
  },
]

const requirements: { q: string; a: string }[] = [
  {
    q: "Do I need an account to download?",
    a: "No — OCS is free to download. You'll need to create a free account to unlock all features within the app.",
  },
  {
    q: "What are the system requirements?",
    a: "Desktop: macOS 12+ or Windows 10 (64-bit). Companion: Android 10+ or iOS 15+. A local network connection is recommended for multi-device sync.",
  },
  {
    q: "Is OCS free to use?",
    a: "Yes, OCS is completely free for churches. There are no subscription fees or hidden costs.",
  },
  {
    q: "How do I update OCS?",
    a: "OCS checks for updates automatically on launch. You can also check manually in Settings → About → Check for Updates.",
  },
]

export default function DownloadPage() {
  const [detected, setDetected] = useState<Platform>("macos")
  const [selected, setSelected] = useState<Platform>("macos")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [pendingPlatform, setPendingPlatform] = useState<Platform | null>(null)
  const [captureEmail, setCaptureEmail] = useState("")
  const [captureChurch, setCaptureChurch] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const p = detectPlatform()
    setDetected(p)
    setSelected(p)
  }, [])

  const triggerDownload = (platform: Platform) => {
    setPendingPlatform(platform)
    setShowModal(true)
    setSubmitted(false)
  }

  const handleCapture = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    // In production: POST to analytics endpoint, then redirect to download URL
    setTimeout(() => setShowModal(false), 1600)
  }

  return (
    <PageTransition>
      {/* Hero */}
      <section className="gradient-hero pt-28 pb-16 relative overflow-hidden">
        <div className="mesh-blob w-96 h-96 bg-purple-300/30 -top-20 -left-40" />
        <div className="mesh-blob w-72 h-72 bg-pink-300/20 top-0 right-0" />
        <div className="relative z-10 container mx-auto px-6 max-w-5xl text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs font-semibold px-3 py-1 rounded-full">
              FREE DOWNLOAD
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight text-slate-900"
          >
            Download OCS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg text-slate-600 max-w-xl mx-auto"
          >
            Available on macOS, Windows, Android, and iOS. Free for all churches.
          </motion.p>
        </div>
      </section>

      {/* Platform cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          {detected && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-2.5 text-sm text-purple-800"
            >
              <Info className="size-4 shrink-0 text-purple-500" />
              We detected you're on <strong className="capitalize">{detected}</strong>. The recommended version is pre-selected.
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            {platforms.map((p, i) => {
              const isSelected = selected === p.id
              const isRecommended = detected === p.id
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelected(p.id)}
                  className={cn(
                    "rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200",
                    isSelected
                      ? "border-purple-500 bg-purple-50/60 shadow-lg shadow-purple-100"
                      : "border-slate-200 bg-white hover:border-purple-300 hover:shadow-md"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "size-10 rounded-xl flex items-center justify-center",
                        isSelected ? "bg-gradient-to-br from-violet-600 to-purple-700" : "bg-slate-100"
                      )}>
                        <p.icon className={cn("size-5", isSelected ? "text-white" : "text-slate-500")} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{p.label}</div>
                        <div className="text-xs text-slate-500">{p.version} · {p.size}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {isRecommended && (
                        <Badge className="bg-purple-600 text-white border-0 text-[10px] px-2 py-0.5">
                          Recommended
                        </Badge>
                      )}
                      {p.badge && !isRecommended && (
                        <Badge variant="outline" className="text-[10px] px-2 py-0.5">{p.badge}</Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mb-5">{p.req}</p>

                  <Button
                    variant={isSelected ? "gradient" : "outline"}
                    className="w-full gap-2"
                    onClick={(e) => { e.stopPropagation(); triggerDownload(p.id) }}
                  >
                    <Download className="size-4" />
                    Download for {p.label}
                  </Button>
                </motion.div>
              )
            })}
          </div>

          {/* GitHub releases note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500"
          >
            <ExternalLink className="size-3.5" />
            <span>All releases are also available on{" "}
              <a href="#" className="text-purple-600 hover:underline font-medium">GitHub Releases</a>.
              SHA256 checksums are provided for each build.
            </span>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {requirements.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left gap-4 cursor-pointer hover:bg-purple-50/40 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-800">{item.q}</span>
                  <ChevronDown
                    className={cn("size-4 text-slate-400 transition-transform shrink-0", openFaq === i && "rotate-180")}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download capture modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Almost there!</DialogTitle>
            <DialogDescription>
              Leave your email and church name so we can keep you updated on new releases.
            </DialogDescription>
          </DialogHeader>
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleCapture}
                className="space-y-4 mt-2"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="dl-email">Email address</Label>
                  <Input
                    id="dl-email"
                    type="email"
                    placeholder="pastor@church.org"
                    value={captureEmail}
                    onChange={(e) => setCaptureEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dl-church">Church name</Label>
                  <Input
                    id="dl-church"
                    placeholder="Grace Community Church"
                    value={captureChurch}
                    onChange={(e) => setCaptureChurch(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" variant="gradient" className="w-full gap-2">
                  <Download className="size-4" />
                  Download for {platforms.find((p) => p.id === pendingPlatform)?.label}
                </Button>
                <p className="text-[11px] text-center text-slate-400">
                  We'll never spam you. Unsubscribe at any time.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-6 text-center"
              >
                <div className="size-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="size-7 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Your download is starting!</p>
                  <p className="text-sm text-slate-500 mt-1">Thanks — we'll keep you in the loop on updates.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}
