import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, Lock, ArrowRight, Monitor, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/layout/PageTransition"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
}

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isDesktopFlow = searchParams.get("app") === "desktop"
  const state = searchParams.get("state")
  const redirectUri = searchParams.get("redirect_uri")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }
    setLoading(true)
    // Simulate auth — in production this calls Supabase
    setTimeout(() => {
      setLoading(false)
      if (isDesktopFlow && redirectUri && state) {
        const callbackUrl = `${redirectUri}?token=mock_session_token&state=${state}`
        window.location.href = callbackUrl
      }
    }, 1500)
  }

  return (
    <PageTransition>
      <div className="min-h-screen gradient-hero flex items-center justify-center px-4 pt-16 pb-12 relative overflow-hidden">
        <div className="mesh-blob w-96 h-96 bg-purple-300/30 -top-20 -left-20" />
        <div className="mesh-blob w-72 h-72 bg-pink-300/20 bottom-0 right-0" />

        <div className="relative z-10 w-full max-w-md">
          {/* Desktop auth banner */}
          {isDesktopFlow && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-purple-600/10 border border-purple-300/40 rounded-[12px] flex items-center gap-3 text-sm text-purple-800 backdrop-blur-sm"
            >
              <Monitor className="size-4 shrink-0 text-purple-600" />
              <span>Signing in to <strong>OCS Desktop App</strong>. You'll be redirected back automatically.</span>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass-card rounded-[12px] p-5 sm:p-8 shadow-2xl shadow-purple-200/40 w-full max-w-full overflow-hidden"
          >
            {/* Logo */}
            <div className="text-center space-y-3 mb-8">
              <div className="flex justify-center">
                <div className="size-12 rounded-[12px] bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-300/40">
                  <span className="text-white font-black text-lg tracking-tighter">OCS</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
                <p className="text-sm text-slate-500 mt-1">Sign in to your OCS account</p>
              </div>
            </div>

            {/* Google OAuth btn */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
              <Button
                variant="outline"
                className="w-full border-slate-300 bg-white hover:bg-slate-50 gap-3 h-11 text-black font-semibold rounded-[12px] shadow-sm"
                type="button"
              >
                <svg className="size-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </motion.div>

            <div className="my-6 flex items-center gap-3">
              <Separator className="flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">or continue with email</span>
              <Separator className="flex-1 bg-slate-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="space-y-2">
                <Label htmlFor="email" className="text-slate-800 font-semibold text-xs sm:text-sm">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="pastor@church.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white border-slate-300 h-11 text-black font-semibold placeholder:text-slate-500 focus-visible:ring-purple-500"
                    autoComplete="email"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-800 font-semibold text-xs sm:text-sm">Password</Label>
                  <button type="button" className="text-xs text-purple-600 hover:text-purple-800 font-medium cursor-pointer">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white border-slate-300 h-11 text-black font-semibold placeholder:text-slate-500 focus-visible:ring-purple-500"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </motion.div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-[12px] px-3 py-2"
                >
                  {error}
                </motion.p>
              )}

              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}>
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full h-11 gap-2 rounded-[12px]"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <>Sign In <ArrowRight className="size-4" /></>
                  )}
                </Button>
              </motion.div>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{" "}
              <Link
                to={`/signup${state ? `?state=${state}&app=${searchParams.get("app")}&redirect_uri=${redirectUri}` : ""}`}
                className="text-purple-600 font-semibold hover:text-purple-800"
              >
                Create one
              </Link>
            </p>
          </motion.div>

          <p className="text-center text-xs text-slate-400 mt-4">
            By signing in, you agree to our{" "}
            <Link to="#" className="underline hover:text-slate-600">Terms</Link> and{" "}
            <Link to="#" className="underline hover:text-slate-600">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </PageTransition>
  )
}
