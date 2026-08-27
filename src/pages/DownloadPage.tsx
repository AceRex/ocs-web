import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Download, Monitor, Smartphone, Apple, CheckCircle2,
  ChevronDown, Info
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

interface PlatformConfig {
  id: Platform
  label: string
  icon: any
  version: string
  size: string
  req: string
  downloadUrl: string
  intelDownloadUrl?: string
  badge: string
  available: boolean
}

const platforms: PlatformConfig[] = [
  {
    id: "macos",
    label: "macOS",
    icon: Apple,
    version: "v1.0.0 (Latest)",
    size: "202 MB",
    req: "macOS 12.0 Monterey or later · Apple Silicon & Intel",
    downloadUrl: "https://github.com/AceRex/OCS/releases/download/v1.0.0/OCS-1.0.0-arm64.dmg",
    intelDownloadUrl: "https://github.com/AceRex/OCS/releases/download/v1.0.0/OCS-1.0.0.dmg",
    badge: "Official Release",
    available: true,
  },
  {
    id: "windows",
    label: "Windows",
    icon: Monitor,
    version: "v1.0.0 (Latest)",
    size: "356 MB",
    req: "Windows 10 / 11 · 64-bit & 32-bit Installer",
    downloadUrl: "https://github.com/AceRex/OCS/releases/download/v1.0.0/OCS.Setup.1.0.0.exe",
    badge: "Official Release",
    available: true,
  },
  {
    id: "android",
    label: "Android",
    icon: Smartphone,
    version: "Coming Soon",
    size: "—",
    req: "Android 10 or later · Companion app",
    downloadUrl: "#",
    badge: "Coming Soon",
    available: false,
  },
  {
    id: "ios",
    label: "iOS",
    icon: Apple,
    version: "Coming Soon",
    size: "—",
    req: "iOS 15 or later · Companion app",
    downloadUrl: "#",
    badge: "Coming Soon",
    available: false,
  },
]

import { useLogDownloadMutation, useFaqsQuery } from "@/lib/queries"

export default function DownloadPage() {
  const [detected, setDetected] = useState<Platform>("macos")
  const [selected, setSelected] = useState<Platform>("macos")
  const [macArch, setMacArch] = useState<"arm64" | "x64">("arm64")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [pendingPlatform, setPendingPlatform] = useState<Platform | null>(null)
  const [captureEmail, setCaptureEmail] = useState("")
  const [captureChurch, setCaptureChurch] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const logDownloadMutation = useLogDownloadMutation()
  const { data: remoteFaqs } = useFaqsQuery()

  const liveFaqs = remoteFaqs?.map((f: any) => ({
    q: f.question || f.q || "",
    a: f.answer || f.a || "",
  })) || []

  useEffect(() => {
    const p = detectPlatform()
    setDetected(p)
    setSelected(p)
  }, [])

  const handleDownload = async (platform: PlatformConfig, urlOverride?: string) => {
    const targetUrl = urlOverride || (platform.id === "macos" && macArch === "x64" && platform.intelDownloadUrl ? platform.intelDownloadUrl : platform.downloadUrl)
    
    // Log download analytics
    try {
      await logDownloadMutation.mutateAsync({
        platform: platform.id,
        appVersion: platform.version,
      })
    } catch {
      // Ignored for seamless user download
    }

    if (targetUrl && targetUrl !== "#") {
      const a = document.createElement("a")
      a.href = targetUrl
      a.download = targetUrl.split("/").pop() || "OCS-Installer"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const triggerNotifyModal = (platformId: Platform) => {
    setPendingPlatform(platformId)
    setShowModal(true)
    setSubmitted(false)
  }

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    try {
      const activePlat = pendingPlatform || selected
      const platObj = platforms.find((p) => p.id === activePlat)
      await logDownloadMutation.mutateAsync({
        platform: activePlat,
        appVersion: platObj?.version || "1.0.0",
        email: captureEmail || undefined,
        churchName: captureChurch || undefined,
      })
    } catch {
      // Ignored for smooth UX
    }
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
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-semibold px-3 py-1 rounded-[12px]">
              v1.0.0 NOW AVAILABLE FOR macOS & WINDOWS
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight text-slate-900"
          >
            Download OCS Desktop
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg text-slate-600 max-w-xl mx-auto"
          >
            Get the full-featured workstation software for seamless church service presentation, live AI voice tracking, and multi-screen projection.
          </motion.p>
        </div>
      </section>

      {/* Platform cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          {detected === "macos" ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-3 bg-emerald-50/80 border border-emerald-200 rounded-[12px] flex items-center gap-2.5 text-sm text-emerald-900"
            >
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              We detected you're on <strong>macOS</strong>. The native Apple Silicon & Intel build is ready for download.
            </motion.div>
          ) : detected === "windows" ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-3 bg-emerald-50/80 border border-emerald-200 rounded-[12px] flex items-center gap-2.5 text-sm text-emerald-900"
            >
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              We detected you're on <strong>Windows</strong>. The official Windows 64-bit & 32-bit installer is ready for download.
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-3 bg-blue-50/80 border border-blue-200 rounded-[12px] flex items-center gap-2.5 text-sm text-blue-900"
            >
              <Info className="size-4 shrink-0 text-blue-600" />
              We detected you're on <strong className="capitalize">{detected}</strong>. Desktop builds for macOS and Windows are live; companion apps are coming soon.
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            {platforms.map((p, i) => {
              const isSelected = selected === p.id
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelected(p.id)}
                  className={cn(
                    "rounded-[16px] p-6 transition-all duration-200 flex flex-col justify-between h-full",
                    p.available
                      ? "bg-gradient-to-br from-purple-50/60 via-white to-indigo-50/40 border border-purple-200/80 shadow-md ring-1 ring-purple-500/20"
                      : isSelected
                      ? "bg-slate-50 shadow-sm ring-1 ring-slate-300"
                      : "bg-white shadow-sm hover:shadow-md hover:bg-slate-50/50 border border-slate-100"
                  )}
                >
                  {/* Top content */}
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "size-10 rounded-[12px] flex items-center justify-center",
                          p.available
                            ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                            : isSelected ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500"
                        )}>
                          <p.icon className={cn("size-5", p.available ? "text-white" : isSelected ? "text-white" : "text-slate-500")} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-base">{p.label}</div>
                          <div className="text-xs text-slate-500">{p.version} {p.available && `· ${p.size}`}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <Badge variant="outline" className={cn(
                          "text-[10px] px-2 py-0.5 rounded-[12px] font-medium",
                          p.available
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        )}>
                          {p.badge}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mb-6 min-h-[32px]">{p.req}</p>
                  </div>

                  {/* Bottom actions & selector slot */}
                  <div className="mt-auto space-y-3">
                    {p.available ? (
                      <>
                        {/* Fixed-height architecture slot for perfect card balancing */}
                        <div className="h-[38px] flex items-center">
                          {p.id === "macos" ? (
                            <div className="w-full flex items-center gap-1.5 p-1 bg-slate-100/80 border border-slate-200/60 rounded-[10px] text-xs">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setMacArch("arm64") }}
                                className={cn(
                                  "flex-1 py-1.5 px-2 rounded-[8px] font-semibold transition-all text-center",
                                  macArch === "arm64"
                                    ? "bg-white text-purple-700 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                                )}
                              >
                                Apple Silicon (M1/M2/M3/M4)
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setMacArch("x64") }}
                                className={cn(
                                  "flex-1 py-1.5 px-2 rounded-[8px] font-semibold transition-all text-center",
                                  macArch === "x64"
                                    ? "bg-white text-purple-700 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                                )}
                              >
                                Intel Mac
                              </button>
                            </div>
                          ) : p.id === "windows" ? (
                            <div className="w-full flex items-center justify-center py-1.5 px-3 bg-slate-100/60 border border-slate-200/50 rounded-[10px] text-xs text-slate-600 font-medium">
                              Universal Package (64-bit & 32-bit x86)
                            </div>
                          ) : (
                            <div className="w-full h-full" />
                          )}
                        </div>

                        <Button
                          onClick={() => handleDownload(p)}
                          className="w-full h-11 gap-2 rounded-[12px] bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md shadow-purple-600/20"
                        >
                          <Download className="size-4" />
                          {p.id === "macos"
                            ? `Download macOS (${macArch === "arm64" ? "Apple Silicon" : "Intel"})`
                            : `Download Windows Installer (.exe)`}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="h-[38px] flex items-center justify-center text-xs text-slate-400 italic">
                          Companion mobile app under review
                        </div>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            disabled
                            className="w-full h-11 gap-2 rounded-[12px] opacity-75 cursor-not-allowed bg-slate-100 text-slate-500 border-slate-200 font-medium"
                          >
                            <Download className="size-4" />
                            Coming Soon
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-[8px]"
                            onClick={(e) => { e.stopPropagation(); triggerNotifyModal(p.id) }}
                          >
                            Notify me when available →
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-10">
            Frequently Asked Questions
          </h2>
          {liveFaqs.length > 0 ? (
            <div className="space-y-3">
              {liveFaqs.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card rounded-[12px] overflow-hidden"
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
          ) : (
            <div className="text-center py-10 px-6 rounded-[12px] bg-white border border-slate-200/80 max-w-md mx-auto space-y-2">
              <p className="text-sm text-slate-500">
                Frequently asked questions are loaded directly from the server.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Download capture modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get Notified on Release</DialogTitle>
            <DialogDescription>
              Downloads are not available yet. Leave your email and church name to get notified as soon as OCS launches on your platform.
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
                <Button type="submit" variant="gradient" className="w-full gap-2 rounded-[12px]">
                  Notify Me for {platforms.find((p) => p.id === pendingPlatform)?.label}
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
                <div className="size-14 rounded-[12px] bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="size-7 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">You're on the notification list!</p>
                  <p className="text-sm text-slate-500 mt-1">We'll send you an email as soon as this build is ready.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}
