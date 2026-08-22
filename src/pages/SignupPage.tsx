import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, Lock, User, Building2, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { PageTransition } from "@/components/layout/PageTransition"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", church: "", password: "" })

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <PageTransition>
      <div className="min-h-screen gradient-hero flex items-center justify-center px-4 pt-20 pb-12 relative overflow-hidden">
        <div className="mesh-blob w-96 h-96 bg-purple-300/30 -top-20 -left-20" />
        <div className="mesh-blob w-72 h-72 bg-pink-300/20 bottom-0 right-0" />

        <div className="relative z-10 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-8 shadow-2xl shadow-purple-200/40"
          >
            <div className="text-center space-y-3 mb-8">
              <div className="flex justify-center">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-300/40">
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
              className="w-full border-slate-200 bg-white hover:bg-slate-50 gap-3 h-11 text-slate-700 font-medium mb-6"
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
                { id: "church", label: "Church Name", icon: Building2, type: "text", placeholder: "Grace Community Church" },
              ].map((field, i) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="space-y-1.5"
                >
                  <Label htmlFor={field.id} className="text-slate-700">{field.label}</Label>
                  <div className="relative">
                    <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.id as keyof typeof form]}
                      onChange={update(field.id as keyof typeof form)}
                      className="pl-10 bg-white/80 border-slate-200 h-11 focus-visible:ring-purple-400"
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
                <Label htmlFor="signup-password" className="text-slate-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={update("password")}
                    className="pl-10 pr-10 bg-white/80 border-slate-200 h-11 focus-visible:ring-purple-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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

              <Button
                type="submit"
                variant="gradient"
                className="w-full h-11 gap-2 mt-2"
                disabled={loading || !agreed}
              >
                {loading ? (
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
        </div>
      </div>
    </PageTransition>
  )
}
