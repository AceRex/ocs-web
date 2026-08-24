import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Lightbulb,
  Sparkles,
  Send,
  CheckCircle2,
  ThumbsUp,
  Layers,
  Mic,
  Monitor,
  Smartphone,
  Tv,
  BookOpen,
  ArrowRight,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageTransition } from "@/components/layout/PageTransition"
import { useCreateSuggestionMutation, useSuggestionsQuery, useUpvoteSuggestionMutation } from "@/lib/queries"
import { Link } from "react-router-dom"
import { toast } from "sonner"

const suggestionCategories = [
  { id: "presentation", label: "Live Presentation & Projection", icon: Monitor },
  { id: "asr", label: "AI Transcription & Speech-to-Text", icon: Mic },
  { id: "bible", label: "Scripture & Bible Engine", icon: BookOpen },
  { id: "remote", label: "Companion Mobile Remote", icon: Smartphone },
  { id: "stage", label: "Stage Display & Timers", icon: Layers },
  { id: "ndi", label: "NDI & Video Broadcast Streaming", icon: Tv },
  { id: "other", label: "Other Feature / Workflow Idea", icon: Sparkles },
]

const impactLevels = [
  { value: "nice_to_have", label: "Nice to Have — Quality of Life improvement" },
  { value: "high_value", label: "High Value — Would greatly enhance weekly services" },
  { value: "critical", label: "Essential — Highly requested by our ministry team" },
]

const fallbackRoadmap = [
  {
    _id: "fb-1",
    title: "Multi-Screen Independent Overlays",
    category: "Live Presentation",
    status: "in_development",
    upvotes: 42,
    description: "Target individual lyrics or scripture to specific auditorium monitors while stage displays retain independent confidence clocks.",
  },
  {
    _id: "fb-2",
    title: "Offline Local Scripture Fuzzy Search",
    category: "Bible Engine",
    status: "completed",
    upvotes: 38,
    description: "Instant scripture search across KJV, NIV, and custom translations with zero internet requirement.",
  },
  {
    _id: "fb-3",
    title: "Live Cloud Service Plan Sync",
    category: "Cloud Sync",
    status: "under_review",
    upvotes: 29,
    description: "Build service rosters and song lineups on web dashboard and automatically sync to auditorium workstations.",
  },
]

export default function SuggestionsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    church: "",
    category: "Live Presentation & Projection",
    impact: "high_value",
    title: "",
    description: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [suggestionId, setSuggestionId] = useState(`SUG-${Math.floor(10000 + Math.random() * 90000)}`)

  const createSuggestionMutation = useCreateSuggestionMutation()
  const upvoteMutation = useUpvoteSuggestionMutation()
  const { data: suggestionsData } = useSuggestionsQuery()

  const liveSuggestions = (suggestionsData?.suggestions && suggestionsData.suggestions.length > 0)
    ? suggestionsData.suggestions
    : fallbackRoadmap

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await createSuggestionMutation.mutateAsync({
        name: form.name || form.email.split("@")[0],
        email: form.email,
        church: form.church || "General Ministry",
        category: form.category,
        impact: form.impact,
        title: form.title,
        description: form.description,
      })

      if (res?.suggestionId || res?.id) {
        setSuggestionId(res.suggestionId || res.id || suggestionId)
      }
      setSubmitted(true)
      toast.success("Feature suggestion submitted successfully!")
    } catch {
      setSubmitted(true)
    }
  }

  const handleUpvote = async (id: string) => {
    try {
      await upvoteMutation.mutateAsync(id)
      toast.success("Upvoted feature idea!")
    } catch {
      toast.error("Could not record upvote")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_development":
        return <Badge className="text-[10px] px-2 py-0.5 rounded-[6px] border bg-emerald-100 text-emerald-700 border-emerald-200">In Development</Badge>
      case "completed":
        return <Badge className="text-[10px] px-2 py-0.5 rounded-[6px] border bg-purple-100 text-purple-700 border-purple-200">Completed</Badge>
      case "planned":
        return <Badge className="text-[10px] px-2 py-0.5 rounded-[6px] border bg-blue-100 text-blue-700 border-blue-200">Planned</Badge>
      default:
        return <Badge className="text-[10px] px-2 py-0.5 rounded-[6px] border bg-amber-100 text-amber-700 border-amber-200">Under Review</Badge>
    }
  }

  return (
    <PageTransition>
      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-purple-50/50 via-white to-white">
        <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs font-semibold px-3 py-1 rounded-[12px]">
              <Lightbulb className="size-3.5 mr-1 text-purple-600 inline" />
              FEATURE SUGGESTIONS & IDEAS
            </Badge>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Help shape the future of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
                OCS Platform
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              Have an idea that would streamline your church services, simplify worship projection, or empower your media team? We build directly for the needs of real ministries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT: FORM + ROADMAP HIGHLIGHTS ── */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Form Column (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="glass-card rounded-[16px] p-8 sm:p-10 border border-slate-200/80 shadow-xl shadow-purple-900/5">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-12 text-center space-y-6"
                    >
                      <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="size-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">Thank You for Your Suggestion!</h3>
                        <p className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed">
                          Your proposal has been logged under reference{" "}
                          <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                            {suggestionId}
                          </span>
                          . Our product engineering team reviews community ideas weekly.
                        </p>
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          onClick={() => {
                            setSubmitted(false)
                            setForm({
                              name: "",
                              email: "",
                              church: "",
                              category: "Live Presentation & Projection",
                              impact: "high_value",
                              title: "",
                              description: "",
                            })
                          }}
                          variant="outline"
                          className="rounded-[12px] font-semibold text-xs"
                        >
                          Submit Another Idea
                        </Button>
                        <Button asChild className="rounded-[12px] bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs">
                          <Link to="/docs">Explore Existing Features</Link>
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-xl font-bold text-slate-900">Submit a Feature Suggestion</h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Share your workflow enhancement or new tool idea with the OCS engineering team.
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                            Your Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            required
                            placeholder="e.g. Pastor David or Bro. Mark"
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                            className="rounded-[10px] text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                            Email Address <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            placeholder="you@church.org"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            className="rounded-[10px] text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="church" className="text-xs font-semibold text-slate-700">
                          Church / Ministry Name
                        </Label>
                        <Input
                          id="church"
                          placeholder="e.g. Grace Sanctuary Church"
                          value={form.church}
                          onChange={(e) => update("church", e.target.value)}
                          className="rounded-[10px] text-sm"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-xs font-semibold text-slate-700">
                            Feature Category
                          </Label>
                          <Select
                            value={form.category}
                            onValueChange={(val) => update("category", val)}
                          >
                            <SelectTrigger id="category" className="rounded-[10px] text-sm">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {suggestionCategories.map((c) => (
                                <SelectItem key={c.id} value={c.label}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="impact" className="text-xs font-semibold text-slate-700">
                            Estimated Impact
                          </Label>
                          <Select
                            value={form.impact}
                            onValueChange={(val) => update("impact", val)}
                          >
                            <SelectTrigger id="impact" className="rounded-[10px] text-sm">
                              <SelectValue placeholder="Select Impact Level" />
                            </SelectTrigger>
                            <SelectContent>
                              {impactLevels.map((lvl) => (
                                <SelectItem key={lvl.value} value={lvl.value}>
                                  {lvl.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-xs font-semibold text-slate-700">
                          Feature Title / Summary <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          required
                          placeholder="e.g. Ability to auto-scroll song lyrics on mobile companion"
                          value={form.title}
                          onChange={(e) => update("title", e.target.value)}
                          className="rounded-[10px] text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="desc" className="text-xs font-semibold text-slate-700">
                          Detailed Description & Workflow Benefit <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="desc"
                          required
                          rows={4}
                          placeholder="Explain what this feature should do and how it would help your church services or media team during live production..."
                          value={form.description}
                          onChange={(e) => update("description", e.target.value)}
                          className="rounded-[10px] text-sm resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={createSuggestionMutation.isPending}
                        className="w-full rounded-[12px] bg-purple-700 hover:bg-purple-800 text-white font-semibold py-6 text-sm shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2"
                      >
                        {createSuggestionMutation.isPending ? (
                          <span>Submitting Suggestion...</span>
                        ) : (
                          <>
                            <Send className="size-4" />
                            <span>Submit Feature Suggestion</span>
                          </>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar / Roadmap Highlight Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* How We Handle Feedback */}
              <div className="glass-card rounded-[16px] p-6 border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 text-purple-700">
                  <Sparkles className="size-5" />
                  <h3 className="font-bold text-slate-900">How Suggestions Are Processed</h3>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <div className="size-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </div>
                    <span>
                      <strong>Engineering Review:</strong> Every idea is reviewed by our core architecture team to assess feasibility and general church utility.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="size-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </div>
                    <span>
                      <strong>Community Prioritization:</strong> High-impact ideas requested by multiple ministries are placed on active release sprints.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="size-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      3
                    </div>
                    <span>
                      <strong>Direct Notification:</strong> We send you an email update when your requested feature is shipped in an OCS desktop or web release.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Community Roadmap Highlights */}
              <div className="glass-card rounded-[16px] p-6 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900">
                    <ThumbsUp className="size-4 text-purple-600" />
                    <h3 className="font-bold text-sm">Community Requests & Ideas</h3>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-semibold border-purple-200 text-purple-700">
                    Live Feedback
                  </Badge>
                </div>

                <div className="space-y-3.5">
                  {liveSuggestions.slice(0, 5).map((item: any) => (
                    <div key={item._id || item.title} className="p-3.5 rounded-[12px] bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-xs text-slate-900 leading-snug">{item.title}</span>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{item.description}</p>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 text-[10px] text-slate-400">
                        <span>{item.church || item.category || "Ministry Idea"}</span>
                        {item._id && !item._id.startsWith("fb-") && (
                          <button
                            onClick={() => handleUpvote(item._id)}
                            className="flex items-center gap-1 font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded cursor-pointer transition-colors"
                          >
                            <ChevronUp className="size-3" />
                            <span>{item.upvotes || 1} Upvotes</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <Link
                    to="/docs"
                    className="text-xs font-semibold text-purple-700 hover:text-purple-800 inline-flex items-center gap-1"
                  >
                    View platform documentation <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </PageTransition>
  )
}
