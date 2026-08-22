import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Shield, Lock, Mail, KeyRound, ArrowRight,
  Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PageTransition } from "@/components/layout/PageTransition"

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("admin@church.org")
  const [password, setPassword] = useState("••••••••••••")
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please provide your admin email and master key.")
      return
    }

    setLoading(true)

    // Simulate secure admin authentication
    setTimeout(() => {
      setLoading(false)
      navigate("/admin")
    }, 1200)
  }

  const fillDemo = () => {
    setEmail("admin@church.org")
    setPassword("MasterAdmin2026!")
    setError("")
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-slate-100">
        {/* Background ambient lighting */}
        <div className="absolute w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-3xl -top-40 -left-40 pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-3xl bottom-0 right-0 pointer-events-none" />

        {/* Back to public link */}
        <div className="relative z-10 mb-6 w-full max-w-md flex justify-between items-center text-xs text-slate-500">
          <Link
            to="/"
            className="flex items-center gap-1.5 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to public website
          </Link>
          <span className="font-mono text-[11px] text-slate-600">INTERNAL CONSOLE</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-md bg-slate-900 rounded-[12px] p-5 sm:p-8 shadow-2xl shadow-purple-950/60 overflow-hidden"
        >
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <div className="size-14 rounded-[12px] bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 flex items-center justify-center shadow-lg shadow-purple-900/40">
                <Shield className="size-7 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">OCS Admin Portal</h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Authorized personnel & platform maintenance access
              </p>
            </div>
            <Badge className="bg-purple-500/15 text-purple-300 border-0 text-[10px] px-2.5 py-0.5 rounded-[12px]">
              RESTRICTED CONSOLE
            </Badge>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-xs font-semibold text-slate-300">
                Admin Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@church.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white border-slate-300 text-black font-semibold placeholder:text-slate-500 h-11 focus-visible:ring-purple-600 text-sm rounded-[12px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password" className="text-xs font-semibold text-slate-300">
                  Master Password
                </Label>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="text-[11px] text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
                >
                  Fill Demo Access
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white border-slate-300 text-black font-semibold placeholder:text-slate-500 h-11 focus-visible:ring-purple-600 text-sm rounded-[12px]"
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

            {/* Optional 2FA Expansion */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShow2FA(!show2FA)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="size-3.5 text-purple-400" />
                {show2FA ? "Hide Hardware Key / 2FA code" : "Enter Hardware Key / 2FA code (Optional)"}
              </button>

              {show2FA && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2.5 space-y-1.5"
                >
                  <Input
                    placeholder="6-digit security token"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-600 h-10 font-mono text-center tracking-widest text-sm focus-visible:ring-purple-600 rounded-[12px]"
                    maxLength={6}
                  />
                </motion.div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-[12px] text-xs text-red-400"
              >
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              variant="admin"
              className="w-full h-11 text-sm font-semibold rounded-[12px] gap-2 shadow-lg shadow-purple-950/50 mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating Console...
                </span>
              ) : (
                <>
                  Enter Dashboard <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer security note */}
          <div className="mt-8 pt-5 border-t border-slate-800/80 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span>TLS 1.3 · IP Logging Active · Session Encrypted</span>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
