import { useState } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail, Lock, User, Building2, Eye, EyeOff, ArrowRight,
  Monitor, CheckCircle2, Sparkles, ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/layout/PageTransition"
import { useSignupMutation } from "@/lib/queries"

export default function SignupPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [registeredData, setRegisteredData] = useState<any>(null)
  const [form, setForm] = useState({ name: "", email: "", church: "", password: "" })

  const signupMutation = useSignupMutation()

  const isDesktopFlow = searchParams.get("app") === "desktop"
  const state = searchParams.get("state")
  const redirectUri = searchParams.get("redirect_uri")

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    setError("")

    try {
      const data = await signupMutation.mutateAsync({
        name: form.name,
        email: form.email,
        password: form.password,
        churchName: form.church,
      })

      setRegisteredData(data)
      setIsSuccess(true)

      if (isDesktopFlow && redirectUri) {
        setTimeout(() => {
          const callbackUrl = `${redirectUri}?token=${data.token}&state=${state || "session_init"}&email=${encodeURIComponent(form.email)}&org=${encodeURIComponent(form.church || "OCS Sanctuary")}&tier=standard`
          window.location.href = callbackUrl
        }, 1500)
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    }
  }

  const handleManualDesktopLaunch = () => {
    if (redirectUri && registeredData?.token) {
      const callbackUrl = `${redirectUri}?token=${registeredData.token}&state=${state || "session_init"}&email=${encodeURIComponent(form.email)}&org=${encodeURIComponent(form.church || "OCS Sanctuary")}&tier=standard`
      window.location.href = callbackUrl
    } else {
      navigate("/")
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen gradient-hero flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        <div className="mesh-blob w-96 h-96 bg-purple-300/30 -top-20 -left-20" />
        <div className="mesh-blob w-72 h-72 bg-pink-300/20 bottom-0 right-0" />

        <div className="relative z-10 w-full max-w-md">
          {/* Desktop auth banner */}
          {isDesktopFlow && !isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-purple-600/10 border border-purple-300/40 rounded-[12px] flex items-center gap-3 text-sm text-purple-800 backdrop-blur-sm"
            >
              <Monitor className="size-4 shrink-0 text-purple-600" />
              <span>Setting up your organization for <strong>OCS Desktop</strong>.</span>
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
                className="glass-card rounded-[12px] p-5 sm:p-8 shadow-2xl shadow-purple-200/40 w-full max-w-full overflow-hidden bg-white/95 backdrop-blur-xl"
              >
                <div className="text-center space-y-3 mb-8">
                  <div className="flex justify-center">
                    <div className="size-12 rounded-[12px] bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-300/40">
                      <span className="text-white font-black text-lg tracking-tighter">OCS</span>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
                    <p className="text-sm text-slate-500 mt-1">Get started with OCS Platform</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-slate-300 bg-white hover:bg-slate-50 gap-3 h-11 text-black font-semibold mb-6 rounded-[12px] shadow-sm"
                  type="button"
                >
                  <svg className="size-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign up with Google
                </Button>

                <div className="mb-6 flex items-center gap-3">
                  <Separator className="flex-1 bg-slate-200" />
                  <span className="text-xs text-slate-400 font-medium">or with email</span>
                  <Separator className="flex-1 bg-slate-200" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { id: "name", label: "Full Name", icon: User, type: "text", placeholder: "Pastor John Doe" },
                    { id: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "pastor@church.org" },
                    { id: "church", label: "Church / Ministry Name", icon: Building2, type: "text", placeholder: "Grace Community Church" },
                  ].map((field, i) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="space-y-1.5"
                    >
                      <Label htmlFor={field.id} className="text-slate-800 font-semibold text-xs sm:text-sm">{field.label}</Label>
                      <div className="relative">
                        <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                          id={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={form[field.id as keyof typeof form]}
                          onChange={update(field.id as keyof typeof form)}
                          required={field.id !== "name"}
                          className="pl-10 bg-white border-slate-300 h-11 text-black font-semibold placeholder:text-slate-500 focus-visible:ring-purple-500"
                        />
                      </div>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.21 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor="signup-password" className="text-slate-800 font-semibold text-xs sm:text-sm">Password</Label>
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
                  </motion.div>

                  <label className="flex items-start gap-3 cursor-pointer group">
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
                      className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-[12px] px-3 py-2"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full h-11 gap-2 mt-2 font-semibold"
                    disabled={signupMutation.isPending || !agreed}
                  >
                    {signupMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      <>Create Account <ArrowRight className="size-4" /></>
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
                className="glass-card rounded-[12px] p-6 sm:p-9 shadow-2xl shadow-emerald-500/10 text-center space-y-6 w-full max-w-full overflow-hidden bg-white/95 backdrop-blur-xl"
              >
                <div className="size-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="size-10 text-emerald-600" />
                </div>

                <div className="space-y-2">
                  <Badge className="bg-emerald-100 text-emerald-800 border-0 text-xs px-3 py-1 rounded-[12px]">
                    <ShieldCheck className="size-3.5 mr-1 inline" />
                    Successfully Registered
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome to OCS!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                    Your church account for <strong>{form.church || "your ministry"}</strong> has been created successfully.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/80 rounded-[12px] text-left text-xs space-y-2 text-slate-700 border border-emerald-200/50">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <Sparkles className="size-4 text-emerald-600" />
                    <span>Church License Active:</span>
                  </div>
                  <ul className="space-y-1 text-slate-600 pl-1">
                    <li>✓ 2 Desktop Display Workstations allocated</li>
                    <li>✓ 5 Mobile Companion Devices ready for stage pairing</li>
                    <li>✓ Automatic cloud synchronization & AI features enabled</li>
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
