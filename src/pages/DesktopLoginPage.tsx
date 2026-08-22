import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail, Lock, CheckCircle2, ArrowRight, Eye, EyeOff,
  ExternalLink, Sparkles, RefreshCw, ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/layout/PageTransition"

import { useDesktopAuthMutation } from "@/lib/queries"

export default function DesktopLoginPage() {
  const [searchParams] = useSearchParams()
  const rawRedirect = searchParams.get("redirect_uri") || searchParams.get("redirectUri") || "ocs://auth/callback"
  const redirectUri = rawRedirect.startsWith("http") ? rawRedirect : (rawRedirect.includes("://") ? rawRedirect : decodeURIComponent(rawRedirect))
  const stateParam = searchParams.get("state") || searchParams.get("stateParam") || "session_init"
  const platformParam = searchParams.get("platform") || "desktop"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [authSuccess, setAuthSuccess] = useState(false)
  const [token, setToken] = useState("")

  const desktopAuthMutation = useDesktopAuthMutation()

  const handleAuth = async (authEmail = email, authPassword = password) => {
    setError("")
    if (!authEmail) {
      setError("Please enter your account email address.")
      return
    }

    try {
      const res = await desktopAuthMutation.mutateAsync({
        email: authEmail,
        password: authPassword || "demo123456",
        platform: platformParam,
        state: stateParam,
        redirectUri,
      })

      setToken(res.token)
      setAuthSuccess(true)

      // Trigger custom protocol deep link to hand token off to desktop app
      try {
        window.location.href = res.deepLink
      } catch {
        // Fallback handled in UI
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate desktop session.")
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please enter both email and password.")
      return
    }
    handleAuth(email, password)
  }

  const handleGoogleAuth = () => {
    handleAuth("pastor.lead@gracechurch.org", "oauth_google_session")
  }

  const triggerManualLaunch = () => {
    const deepLink = `${redirectUri}?token=${token}&state=${stateParam}&email=${encodeURIComponent(email || "pastor.lead@gracechurch.org")}`
    window.location.href = deepLink
  }

  return (
    <PageTransition>
      <div className="min-h-screen gradient-hero flex items-center justify-center px-4 pt-20 pb-16 relative overflow-hidden">
        {/* Ambient mesh blobs */}
        <div className="mesh-blob w-[550px] h-[550px] bg-purple-300/40 -top-40 left-1/2 -translate-x-1/2" />
        <div className="mesh-blob w-[400px] h-[400px] bg-pink-300/30 bottom-0 right-10" />
        <div className="mesh-blob w-[350px] h-[350px] bg-blue-300/20 top-20 left-10" />

        <div className="relative z-10 w-full max-w-md">
          <AnimatePresence mode="wait">
            {!authSuccess ? (
              <motion.div
                key="login-box"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-[12px] p-6 sm:p-9 shadow-2xl shadow-purple-900/10 space-y-7 w-full max-w-full overflow-hidden bg-white/90 backdrop-blur-xl"
              >
                {/* Header */}
                <div className="text-center space-y-2.5">
                  <div className="inline-flex size-13 rounded-[12px] bg-gradient-to-br from-violet-600 to-purple-700 items-center justify-center shadow-lg shadow-purple-400/30 text-white font-black text-xl tracking-tight">
                    OCS
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Sign in to Desktop App
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xs mx-auto">
                      Authorize this device to sync scriptures, timers, and multi-display feeds.
                    </p>
                  </div>
                </div>

                {/* Google SSO */}
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={desktopAuthMutation.isPending}
                  className="w-full border-slate-300 bg-white hover:bg-slate-50 gap-3 h-11 text-black font-semibold rounded-[12px] shadow-sm"
                >
                  <svg className="size-4.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <div className="flex items-center gap-3">
                  <Separator className="flex-1 bg-slate-200" />
                  <span className="text-[11px] uppercase font-bold text-slate-400">or sign in with email</span>
                  <Separator className="flex-1 bg-slate-200" />
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="d-email" className="text-slate-800 font-semibold text-xs sm:text-sm">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="d-email"
                        type="email"
                        placeholder="pastor@church.org"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white border-slate-300 h-11 text-black font-semibold placeholder:text-slate-500 focus-visible:ring-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="d-password" className="text-slate-800 font-semibold text-xs sm:text-sm">
                        Password
                      </Label>
                      <Link to="/forgot-password" className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="d-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-white border-slate-300 h-11 text-black font-semibold placeholder:text-slate-500 focus-visible:ring-purple-500"
                        required
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

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 text-red-700 text-xs rounded-[12px] border border-red-200"
                    >
                      {error}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full h-12 gap-2 text-sm sm:text-base font-semibold shadow-lg shadow-purple-200/60 rounded-[12px]"
                    disabled={desktopAuthMutation.isPending}
                  >
                    {desktopAuthMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="animate-spin size-4" />
                        Authorizing Desktop App...
                      </span>
                    ) : (
                      <>
                        Authorize & Open Desktop App <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="pt-2 text-center text-xs text-slate-500">
                  <p>
                    Don't have an OCS account yet?{" "}
                    <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
                      Create account
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Success / Protocol Redirect Screen */
              <motion.div
                key="success-box"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-[12px] p-6 sm:p-10 shadow-2xl shadow-purple-900/10 text-center space-y-6 w-full max-w-full overflow-hidden bg-white/95 backdrop-blur-xl"
              >
                <div className="size-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="size-10 text-emerald-600" />
                </div>

                <div className="space-y-2">
                  <Badge className="bg-emerald-100 text-emerald-800 border-0 text-xs px-3 py-1 rounded-[12px]">
                    <ShieldCheck className="size-3.5 mr-1 inline" />
                    Authentication Successful
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Opening OCS Desktop...
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                    Your browser has been authorized. We are transferring your active session back to the desktop application.
                  </p>
                </div>

                {/* Browser Prompt Helper Box */}
                <div className="p-4 bg-purple-50/80 rounded-[12px] text-left text-xs space-y-2 text-slate-700">
                  <div className="flex items-center gap-2 font-bold text-purple-900">
                    <Sparkles className="size-4 text-purple-600" />
                    <span>Browser Prompt Instructions:</span>
                  </div>
                  <p className="leading-relaxed">
                    If your browser displays a prompt asking to <strong>"Open OCS"</strong> or <strong>"Allow this site to open ocs link"</strong>, click <strong>Open / Allow</strong> to complete sign in.
                  </p>
                </div>

                {/* Manual Trigger Fallback */}
                <div className="space-y-3 pt-2">
                  <Button
                    onClick={triggerManualLaunch}
                    variant="gradient"
                    size="lg"
                    className="w-full h-12 gap-2 text-sm sm:text-base font-semibold shadow-lg shadow-purple-200/60 rounded-[12px]"
                  >
                    <ExternalLink className="size-4" />
                    Launch OCS Desktop App Now
                  </Button>
                </div>

                <div className="pt-2">
                  <Link
                    to="/"
                    className="text-xs text-slate-500 hover:text-purple-700 font-medium transition-colors"
                  >
                    Return to OCS Web Platform
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
