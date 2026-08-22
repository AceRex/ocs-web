import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star, Heart, MessageSquare, Building2, User,
  CheckCircle2, Send, Sparkles, MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageTransition } from "@/components/layout/PageTransition"
import { cn } from "@/lib/utils"

const initialTestimonials = [
  {
    id: "1",
    author: "Pastor James A.",
    role: "Lead Pastor",
    church: "Redeemed Church",
    location: "Lagos, Nigeria",
    quote: "OCS completely transformed how we run our Sunday services. The stage monitor alone is worth it, keeping our timing tight and our focus where it belongs.",
    feature: "Stage Monitor & Timers",
    stars: 5,
    avatar: "JA",
    date: "August 2026",
    tag: "Pastor",
  },
  {
    id: "2",
    author: "Sarah M.",
    role: "Media & AV Lead",
    church: "Grace Community",
    location: "Abuja, Nigeria",
    quote: "Our tech team loves the multi-display control. We went from chaos to confidence every week. The offline speech detection works even when our local network acts up.",
    feature: "AI Speech Tracking",
    stars: 5,
    avatar: "SM",
    date: "July 2026",
    tag: "Tech Lead",
  },
  {
    id: "3",
    author: "Elder David K.",
    role: "Production Director",
    church: "City Harvest Assembly",
    location: "Port Harcourt",
    quote: "The live transcript feature is a game changer for accessibility in our congregation, and the automatic session archive saves us hours of post-service editing.",
    feature: "Session Archives",
    stars: 5,
    avatar: "DK",
    date: "August 2026",
    tag: "Tech Lead",
  },
  {
    id: "4",
    author: "Hannah T.",
    role: "Worship Pastor",
    church: "Living Waters Fellowship",
    location: "Ibadan, Nigeria",
    quote: "Being able to use the mobile companion app to trigger lyrics and view countdown clocks from the stage has brought unmatched peace of mind during worship sets.",
    feature: "Mobile Companion",
    stars: 5,
    avatar: "HT",
    date: "August 2026",
    tag: "Worship Team",
  },
]

const features = [
  "Live AI Scripture Tracking",
  "Stage Monitor & Countdown Timers",
  "Multi-Layer Display Compositor",
  "Mobile Companion App",
  "Session Archives & Transcripts",
  "NDI & OBS Broadcast Streaming",
]

const roles = [
  "Lead Pastor",
  "Associate / Teaching Pastor",
  "Media & AV Lead",
  "AV / Sound Volunteer",
  "Worship Pastor / Music Director",
  "Church Administrator",
]

export default function TestimonialsPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [form, setForm] = useState({
    name: "",
    role: "",
    church: "",
    location: "",
    feature: "",
    rating: 5,
    story: "",
    consent: true,
  })
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const update = (k: keyof typeof form, v: string | number | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.church || !form.story) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1400)
  }

  const filteredStories =
    activeFilter === "All"
      ? initialTestimonials
      : initialTestimonials.filter((t) => t.tag === activeFilter)

  return (
    <PageTransition>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-28 pb-16 gradient-hero">
        <div className="mesh-blob w-[650px] h-[650px] bg-purple-300/40 -top-50 left-1/2 -translate-x-1/2" />
        <div className="mesh-blob w-[500px] h-[500px] bg-pink-300/30 top-10 -left-40" />

        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center space-y-5 pt-8 pb-4">
          <Badge className="bg-purple-100/80 text-purple-700 border-purple-200 text-xs font-semibold px-4 py-1.5 rounded-[12px] backdrop-blur-sm shadow-sm">
            <Heart className="size-3.5 mr-1.5 inline text-purple-600" />
            COMMUNITY & STORIES
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-slate-900">
            Stories from Churches{"\n"}
            <span className="gradient-text">Powered by OCS</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Discover how ministry teams across the globe are running distraction-free services,
            or share your church's journey with us.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700 text-white rounded-[12px] px-7 font-semibold shadow-lg shadow-purple-600/25">
              <a href="#submit-form">Share Your Story</a>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-slate-300 bg-white/80 rounded-[12px] px-7">
              <a href="#wall">Read Testimonials</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL SUBMISSION FORM ── */}
      <section id="submit-form" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card rounded-[12px] p-5 sm:p-8 md:p-10 shadow-xl space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="size-4" />
                    <span>Submit a Testimonial</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Tell us about your experience with OCS
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Your feedback encourages the team and helps other ministry teams discover OCS.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  {/* Star rating selector */}
                  <div className="space-y-2">
                    <Label className="text-slate-800 font-semibold text-sm">Overall Experience Rating</Label>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (hoverRating !== null ? hoverRating : form.rating) >= star
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            onClick={() => update("rating", star)}
                            className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                            aria-label={`${star} star rating`}
                          >
                            <Star
                              className={cn(
                                "size-6 sm:size-7 transition-colors",
                                isFilled ? "text-amber-400 fill-amber-400" : "text-slate-300"
                              )}
                            />
                          </button>
                        )
                      })}
                      <span className="text-xs font-bold text-slate-700 ml-2">
                        {form.rating} of 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Name & Role Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="t-name" className="text-slate-800 text-xs font-semibold flex items-center gap-1.5">
                        <User className="size-3.5 text-slate-400" /> Your Full Name & Title
                      </Label>
                      <Input
                        id="t-name"
                        placeholder="Pastor John Doe"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className="bg-white border-slate-300 h-11 text-black font-semibold placeholder:text-slate-500 focus-visible:ring-purple-500"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-slate-800 text-xs font-semibold flex items-center gap-1.5">
                        Ministry Role
                      </Label>
                      <Select value={form.role} onValueChange={(v) => update("role", v)}>
                        <SelectTrigger className="bg-white border-slate-300 h-11 text-black font-semibold placeholder:text-slate-500">
                          <SelectValue placeholder="Select your role..." />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Church Name & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="t-church" className="text-slate-800 text-xs font-semibold flex items-center gap-1.5">
                        <Building2 className="size-3.5 text-slate-400" /> Church Name
                      </Label>
                      <Input
                        id="t-church"
                        placeholder="Grace City Church"
                        value={form.church}
                        onChange={(e) => update("church", e.target.value)}
                        className="bg-white border-slate-300 h-11 text-black font-semibold placeholder:text-slate-500 focus-visible:ring-purple-500"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="t-location" className="text-slate-800 text-xs font-semibold flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-slate-400" /> City & Country
                      </Label>
                      <Input
                        id="t-location"
                        placeholder="Lagos, Nigeria"
                        value={form.location}
                        onChange={(e) => update("location", e.target.value)}
                        className="bg-white border-slate-300 h-11 text-black font-semibold placeholder:text-slate-500 focus-visible:ring-purple-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Primary Feature Used */}
                  <div className="space-y-1.5">
                    <Label className="text-slate-800 text-xs font-semibold flex items-center gap-1.5">
                      Favorite OCS Feature
                    </Label>
                    <Select value={form.feature} onValueChange={(v) => update("feature", v)}>
                      <SelectTrigger className="bg-white border-slate-300 h-11 text-black font-semibold placeholder:text-slate-500">
                        <SelectValue placeholder="Which feature made the biggest difference?" />
                      </SelectTrigger>
                      <SelectContent>
                        {features.map((f) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Testimonial Story */}
                  <div className="space-y-1.5">
                    <Label htmlFor="t-story" className="text-slate-800 text-xs font-semibold flex items-center gap-1.5">
                      <MessageSquare className="size-3.5 text-slate-400" /> Your Experience / Story
                    </Label>
                    <Textarea
                      id="t-story"
                      placeholder="Share how OCS has helped your services run smoother, supported your team, or made media presentation easier..."
                      value={form.story}
                      onChange={(e) => update("story", e.target.value)}
                      className="bg-white border-slate-300 min-h-[120px] sm:min-h-[130px] text-black font-semibold placeholder:text-slate-500 focus-visible:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Consent checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => update("consent", e.target.checked)}
                      className="mt-0.5 accent-purple-600 size-4 rounded shrink-0"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I agree to allow OCS to display this testimonial on their website and promotional materials.
                    </span>
                  </label>

                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full h-12 gap-2 text-sm sm:text-base font-semibold shadow-lg shadow-purple-200/60 rounded-[12px]"
                    disabled={loading || !form.consent}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting Review...
                      </span>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Submit Church Testimonial
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-[12px] p-6 sm:p-10 md:p-12 text-center shadow-xl space-y-6 w-full max-w-full overflow-hidden"
              >
                <div className="size-20 rounded-[12px] bg-purple-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-10 text-purple-700" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-slate-900">Thank You, {form.name}!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Your testimonial for <strong>{form.church}</strong> has been received and will be reviewed by our team.
                  </p>
                  <p className="text-xs text-slate-400">
                    Thank you for being a vital part of the OCS ministry community!
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-[12px]"
                  onClick={() => {
                    setSubmitted(false)
                    setForm({
                      name: "",
                      role: "",
                      church: "",
                      location: "",
                      feature: "",
                      rating: 5,
                      story: "",
                      consent: true,
                    })
                  }}
                >
                  Submit Another Review
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── TESTIMONIAL WALL OF STORIES ── */}
      <section id="wall" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">VERIFIED STORIES</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Community Testimonials
              </h2>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {["All", "Pastor", "Tech Lead", "Worship Team"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-[12px] text-xs font-semibold transition-all cursor-pointer",
                    activeFilter === tag
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-white text-slate-900 hover:bg-purple-50 shadow-sm"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredStories.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-[12px] p-7 space-y-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} className="size-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <Badge variant="outline" className="text-[10px] border-0 text-purple-800 bg-purple-100 font-semibold rounded-[12px]">
                    {t.feature}
                  </Badge>
                </div>

                <blockquote className="text-sm text-slate-700 leading-relaxed italic">
                  "{t.quote}"
                </blockquote>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-[12px] bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white text-xs font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{t.author}</div>
                      <div className="text-[11px] text-slate-500">{t.role} · {t.church}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">{t.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
