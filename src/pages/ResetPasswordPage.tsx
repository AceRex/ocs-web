import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  KeyRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageTransition } from "@/components/layout/PageTransition"
import { useResetPasswordMutation } from "@/lib/queries"
import { toast } from "sonner"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [countdown, setCountdown] = useState(4)

  const resetPasswordMutation = useResetPasswordMutation()

  // If no token is provided in the URL, redirect to login after a brief notice
  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link", {
        description: "Missing security token. Please request a new password reset link.",
      })
      const timer = setTimeout(() => {
        navigate("/login", { replace: true })
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [token, navigate])

  // Countdown timer on success
  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
      return () => clearTimeout(timer)
    } else if (isSuccess && countdown === 0) {
      navigate("/login", { replace: true })
    }
  }, [isSuccess, countdown, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!token) {
      setError("Missing or invalid password reset token. Please request a new link.")
      return
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your password.")
      return
    }

    try {
      const res = await resetPasswordMutation.mutateAsync({
        token: token.trim(),
        password,
      })

      setIsSuccess(true)
      toast.success("Password reset successful", {
        description: res.message || "Your password has been updated. You can now log in.",
      })
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to reset password. The link may have expired or already been used."
      setError(msg)
      toast.error("Reset failed", { description: msg })
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen gradient-hero flex items-center justify-center px-4 pt-16 pb-12 relative overflow-hidden">
        {/* Ambient mesh blobs matching LoginPage */}
        <div className="mesh-blob w-96 h-96 bg-purple-300/30 -top-20 -left-20" />
        <div className="mesh-blob w-72 h-72 bg-pink-300/20 bottom-0 right-0" />
        <div className="mesh-blob w-64 h-64 bg-indigo-300/20 top-1/2 right-1/4" />

        <div className="relative z-10 w-full max-w-md">
          {!token ? (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="glass-card rounded-[16px] p-6 sm:p-9 shadow-2xl shadow-purple-200/40 w-full max-w-md text-center space-y-5 bg-white/90 backdrop-blur-xl"
            >
              <div className="size-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle className="size-7 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Missing Reset Token</h2>
                <p className="text-xs text-slate-600 mt-2">
                  This password reset link is invalid or incomplete. Redirecting you to the sign-in page...
                </p>
              </div>
              <div className="pt-2">
                <Button asChild className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-[12px]">
                  <Link to="/login">Return to Sign In</Link>
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass-card rounded-[16px] p-6 sm:p-9 shadow-2xl shadow-purple-200/40 w-full max-w-full overflow-hidden bg-white/95 backdrop-blur-xl"
            >
              {!isSuccess ? (
                <>
                  {/* Header */}
                <div className="text-center space-y-3 mb-7">
                  <div className="flex justify-center">
                    <div className="size-13 rounded-[14px] bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 flex items-center justify-center shadow-lg shadow-purple-300/40">
                      <KeyRound className="size-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Set New Password</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Choose a secure new password for your OCS account
                    </p>
                  </div>
                </div>

                {/* Error notice */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-[12px] flex items-start gap-2.5 text-xs text-rose-800"
                  >
                    <AlertTriangle className="size-4 shrink-0 text-rose-600 mt-0.5" />
                    <span className="leading-relaxed font-medium">{error}</span>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* New Password */}
                  <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="space-y-1.5">
                    <Label htmlFor="new-password" className="text-slate-800 font-semibold text-xs sm:text-sm">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 bg-white/80 border-slate-200 text-slate-900 rounded-[12px] text-sm focus:border-purple-500 focus:ring-purple-200"
                        autoComplete="new-password"
                        autoFocus
                        disabled={resetPasswordMutation.isPending}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">Must be at least 8 characters</p>
                  </motion.div>

                  {/* Confirm Password */}
                  <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="space-y-1.5">
                    <Label htmlFor="confirm-password" className="text-slate-800 font-semibold text-xs sm:text-sm">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 bg-white/80 border-slate-200 text-slate-900 rounded-[12px] text-sm focus:border-purple-500 focus:ring-purple-200"
                        autoComplete="new-password"
                        disabled={resetPasswordMutation.isPending}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="pt-2">
                    <Button
                      type="submit"
                      disabled={resetPasswordMutation.isPending}
                      className="w-full h-11 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-sm rounded-[12px] shadow-md shadow-purple-300/40 gap-2 cursor-pointer transition-all"
                    >
                      {resetPasswordMutation.isPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Updating password...</span>
                        </>
                      ) : (
                        <>
                          <span>Reset Password</span>
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 font-semibold transition-colors"
                  >
                    <ArrowLeft className="size-3.5" /> Back to Sign In
                  </Link>
                </div>
              </>
            ) : (
              /* Success confirmation state */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-5 py-3"
              >
                <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="size-9 stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Password Updated!</h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Your password has been securely updated. You can now sign in with your new credentials.
                  </p>
                </div>

                <div className="p-3 bg-purple-50 rounded-[12px] border border-purple-100 text-xs text-purple-900 font-medium">
                  Redirecting to sign-in page in <strong className="text-purple-700">{countdown}s</strong>...
                </div>

                <Button asChild className="w-full h-11 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-[12px]">
                  <Link to="/login">Sign In Immediately</Link>
                </Button>
              </motion.div>
            )}
          </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
