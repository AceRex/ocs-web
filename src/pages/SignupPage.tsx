import { useState, useEffect } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail, Lock, User, Building2, Eye, EyeOff, ArrowRight,
  Monitor, CheckCircle2, Sparkles, ShieldCheck,
  Radio, Mic, Tv, Headphones, Check, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PageTransition } from "@/components/layout/PageTransition"
import { useSignupMutation, useCurrentUserQuery } from "@/lib/queries"
import { getAuthToken } from "@/lib/api"
import { useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"

type CustomerCategory = "church" | "streamer" | "podcast"

const customerCards: {
  id: CustomerCategory
  title: string
  subtitle: string
  icon: any
  badge?: string
  fieldLabel: string
  fieldPlaceholder: string
  fieldIcon: any
  helper: string
}[] = [
  {
    id: "church",
    title: "Church",
    subtitle: "Sanctuary & Ministry",
    icon: Building2,
    badge: "Default",
    fieldLabel: "Church or Ministry Name",
    fieldPlaceholder: "e.g. Grace Community Church",
    fieldIcon: Building2,
    helper: "For sanctuary presentation, scripture projection & mobile companion control.",
  },
  {
    id: "streamer",
    title: "Streamer",
    subtitle: "OBS, vMix & NDI",
    icon: Radio,
    badge: "Creator",
    fieldLabel: "Channel or Stream Link",
    fieldPlaceholder: "e.g. YouTube, Twitch, TikTok, Instagram, or Facebook URL",
    fieldIcon: Tv,
    helper: "Paste your YouTube, Twitch, TikTok, Instagram, or Facebook channel link.",
  },
  {
    id: "podcast",
    title: "Podcast",
    subtitle: "Studio & Shows",
    icon: Mic,
    badge: "Broadcast",
    fieldLabel: "Podcast Link or Show Title",
    fieldPlaceholder: "e.g. Spotify, Apple Podcasts, YouTube Show URL or Show Title",
    fieldIcon: Headphones,
    helper: "Paste your Spotify, Apple Podcasts, YouTube show link or podcast title.",
  },
]

export default function SignupPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [customerType, setCustomerType] = useState<CustomerCategory>("church")
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [registeredData, setRegisteredData] = useState<any>(null)
  const [form, setForm] = useState({
    name: "",
    email: "",
    orgIdentifier: "",
    password: "",
  })

  const signupMutation = useSignupMutation()
  const { data: userData } = useCurrentUserQuery()
  const user = userData?.user
  const token = typeof window !== "undefined" ? getAuthToken() : null

  const isDesktopFlow = searchParams.get("app") === "desktop"
  const state = searchParams.get("state")
  const redirectUri = searchParams.get("redirect_uri")

  // Redirect to profile if user is already logged in on web
  useEffect(() => {
    if (token && user && !isDesktopFlow) {
      navigate("/profile", { replace: true })
    }
  }, [token, user, isDesktopFlow, navigate])

  const currentCard = customerCards.find((c) => c.id === customerType) || customerCards[0]

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    setError("")

    if (!form.orgIdentifier.trim()) {
      setError(
        customerType === "streamer"
          ? "Please paste your channel or stream link."
          : customerType === "podcast"
            ? "Please provide your podcast link or show title."
            : "Please provide your church or ministry name."
      )
      return
    }

    try {
      const data = await signupMutation.mutateAsync({
        name: form.name,
        email: form.email,
        password: form.password,
        customerType,
        churchName: form.orgIdentifier.trim(),
        channelLink: customerType === "streamer" ? form.orgIdentifier.trim() : "",
        podcastLink: customerType === "podcast" ? form.orgIdentifier.trim() : "",
      })

      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
      await queryClient.refetchQueries({ queryKey: ["auth", "me"] })

      setRegisteredData(data)
      setIsSuccess(true)

      if (isDesktopFlow && redirectUri) {
        setTimeout(() => {
          const tier = data.user?.subscriptionTier || data.user?.effectiveTier || "trial"
          const daysLeft = data.user?.trialRemainingDays ?? 60
          const callbackUrl = `${redirectUri}?token=${data.token}&state=${state || "session_init"}&email=${encodeURIComponent(form.email)}&org=${encodeURIComponent(form.orgIdentifier)}&tier=${encodeURIComponent(tier)}&days_left=${daysLeft}`
          window.location.href = callbackUrl
        }, 1500)
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    }
  }

  const handleManualDesktopLaunch = () => {
    if (redirectUri && registeredData?.token) {
      const tier = registeredData.user?.subscriptionTier || registeredData.user?.effectiveTier || "trial"
      const daysLeft = registeredData.user?.trialRemainingDays ?? 60
      const callbackUrl = `${redirectUri}?token=${registeredData.token}&state=${state || "session_init"}&email=${encodeURIComponent(form.email)}&org=${encodeURIComponent(form.orgIdentifier)}&tier=${encodeURIComponent(tier)}&days_left=${daysLeft}`
      window.location.href = callbackUrl
    } else {
      navigate("/profile", { replace: true })
    }
  }

  // Prevent showing signup/create form to already authenticated users
  if (token && user && !isDesktopFlow) {
    return (
      <PageTransition>
        <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
          <div className="text-center space-y-3">
            <Loader2 className="size-8 animate-spin text-purple-700 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Redirecting to profile...</p>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen gradient-hero flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        <div className="mesh-blob w-96 h-96 bg-purple-300/30 -top-20 -left-20" />
        <div className="mesh-blob w-72 h-72 bg-pink-300/20 bottom-0 right-0" />

        <div className="relative z-10 w-full max-w-lg">
          {/* Desktop auth banner */}
          {isDesktopFlow && !isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-purple-600/10 border border-purple-300/40 rounded-[12px] flex items-center gap-3 text-sm text-purple-800 backdrop-blur-sm"
            >
              <Monitor className="size-4 shrink-0 text-purple-600" />
              <span>Setting up your license for <strong>OCS Desktop</strong>.</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-[16px] p-5 sm:p-8 shadow-2xl shadow-purple-200/40 w-full max-w-full overflow-hidden bg-white/95 backdrop-blur-xl"
              >
                <div className="text-center space-y-2 mb-6">
                  <div className="flex justify-center">
                    <div className="size-12 rounded-[12px] bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-300/40">
                      <span className="text-white font-black text-lg tracking-tighter">OCS</span>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Select how you will be using OCS</p>
                  </div>
                </div>

                {/* ── 3 CUSTOMER CARDS (Church, Streamer, Podcast) ────────── */}
                <div className="mb-6 space-y-2">
                  <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    I am registering as:
                  </Label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {customerCards.map((card) => {
                      const isSelected = customerType === card.id
                      const Icon = card.icon
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => {
                            setCustomerType(card.id)
                            setError("")
                          }}
                          className={cn(
                            "relative flex flex-col items-center text-center p-3 rounded-[12px] border transition-all cursor-pointer select-none",
                            isSelected
                              ? "bg-purple-50/90 border-purple-600 ring-2 ring-purple-600/20 shadow-md shadow-purple-200/50"
                              : "bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 size-4 rounded-full bg-purple-600 text-white flex items-center justify-center">
                              <Check className="size-2.5 stroke-[3]" />
                            </div>
                          )}
                          <div className={cn(
                            "size-8 rounded-full flex items-center justify-center mb-1.5",
                            isSelected ? "bg-purple-600 text-white shadow-sm" : "bg-slate-200 text-slate-600"
                          )}>
                            <Icon className="size-4" />
                          </div>
                          <span className={cn(
                            "text-xs font-bold leading-tight",
                            isSelected ? "text-purple-950" : "text-slate-700"
                          )}>
                            {card.title}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">
                            {card.subtitle}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-slate-800 font-semibold text-xs sm:text-sm">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="e.g. Pastor John Doe / Creator Name"
                        value={form.name}
                        onChange={update("name")}
                        className="pl-10 bg-white border-slate-300 h-11 text-black font-semibold placeholder:text-slate-500 focus-visible:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-slate-800 font-semibold text-xs sm:text-sm">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your-email@domain.com"
                        value={form.email}
                        onChange={update("email")}
                        required
                        className="pl-10 bg-white border-slate-300 h-11 text-black font-semibold placeholder:text-slate-500 focus-visible:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Dynamic Organization / Channel / Podcast Field */}
                  <motion.div
                    key={customerType}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <Label htmlFor="orgIdentifier" className="text-slate-800 font-semibold text-xs sm:text-sm">
                        {currentCard.fieldLabel} *
                      </Label>
                      <Badge className="bg-purple-100 text-purple-800 border-0 text-[10px] px-2 py-0">
                        {currentCard.title} Account
                      </Badge>
                    </div>
                    <div className="relative">
                      <currentCard.fieldIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-purple-600" />
                      <Input
                        id="orgIdentifier"
                        type="text"
                        placeholder={currentCard.fieldPlaceholder}
                        value={form.orgIdentifier}
                        onChange={update("orgIdentifier")}
                        required
                        className="pl-10 bg-white border-purple-300/80 focus-visible:border-purple-600 focus-visible:ring-purple-500 h-11 text-black font-semibold placeholder:text-slate-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal pl-0.5">
                      {currentCard.helper}
                    </p>
                  </motion.div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password" className="text-slate-800 font-semibold text-xs sm:text-sm">
                      Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 8 characters"
                        value={form.password}
                        onChange={update("password")}
                        required
                        className="pl-10 pr-10 bg-white border-slate-300 h-11 text-black font-semibold placeholder:text-slate-500 focus-visible:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group pt-1">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 accent-purple-600"
                    />
                    <span className="text-xs text-slate-500 leading-relaxed">
                      I agree to the{" "}
                      <Link to="#" className="text-purple-600 underline">Terms of Service</Link>
                      {" "}and{" "}
                      <Link to="#" className="text-purple-600 underline">Privacy Policy</Link>.
                    </span>
                  </label>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-[12px] px-3 py-2"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full h-11 gap-2 mt-2 font-semibold shadow-lg shadow-purple-500/20"
                    disabled={signupMutation.isPending || !agreed}
                  >
                    {signupMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating {currentCard.title} Account...
                      </span>
                    ) : (
                      <>Create {currentCard.title} Account <ArrowRight className="size-4" /></>
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                  Already have an account?{" "}
                  <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-800">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signup-success"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-[16px] p-6 sm:p-9 shadow-2xl shadow-emerald-500/10 text-center space-y-6 w-full max-w-full overflow-hidden bg-white/95 backdrop-blur-xl"
              >
                <div className="size-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="size-10 text-emerald-600" />
                </div>

                <div className="space-y-2">
                  <Badge className="bg-emerald-100 text-emerald-800 border-0 text-xs px-3 py-1 rounded-[12px]">
                    <ShieldCheck className="size-3.5 mr-1 inline" />
                    {currentCard.title} License Ready
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome to OCS!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                    Your {currentCard.title.toLowerCase()} account for <strong className="text-slate-900">{form.orgIdentifier || "your channel"}</strong> has been created successfully.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/80 rounded-[12px] text-left text-xs space-y-2 text-slate-700 border border-emerald-200/50">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <Sparkles className="size-4 text-emerald-600" />
                    <span>{currentCard.title} Allocation Active:</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-600 pl-1">
                    <li>✓ 2 Desktop Display Stations enabled</li>
                    <li>✓ 5 Mobile Companion & Remote Control Devices allocated</li>
                    <li>✓ OBS, NDI, Multi-screen outputs & Cloud sync unlocked</li>
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  {isDesktopFlow && redirectUri ? (
                    <Button
                      onClick={handleManualDesktopLaunch}
                      variant="gradient"
                      size="lg"
                      className="w-full h-12 gap-2 text-sm sm:text-base font-semibold shadow-lg shadow-purple-200/60 rounded-[12px]"
                    >
                      <Monitor className="size-4" />
                      Open OCS Desktop App Now
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate("/")}
                      variant="gradient"
                      size="lg"
                      className="w-full h-12 gap-2 text-sm sm:text-base font-semibold shadow-lg shadow-purple-200/60 rounded-[12px]"
                    >
                      Explore OCS Platform <ArrowRight className="size-4" />
                    </Button>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    to="/"
                    className="text-xs text-slate-500 hover:text-purple-700 font-medium transition-colors"
                  >
                    Go to Homepage
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}

