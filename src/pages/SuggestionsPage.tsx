import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Lightbulb,
  Sparkles,
  Send,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Mic,
  Monitor,
  Smartphone,
  Tv,
  BookOpen,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Search,
  Plus,
  ShieldCheck,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { PageTransition } from "@/components/layout/PageTransition"
import {
  useCreateSuggestionMutation,
  useSuggestionsQuery,
  useUpvoteSuggestionMutation,
  useDownvoteSuggestionMutation,
  useAddSuggestionCommentMutation
} from "@/lib/queries"
import type { SuggestionItem } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const suggestionCategories = [
  { id: "all", label: "All Categories", icon: Sparkles },
  { id: "Live Presentation & Projection", label: "Live Presentation & Projection", icon: Monitor },
  { id: "AI Transcription & Speech-to-Text", label: "AI Transcription & Speech-to-Text", icon: Mic },
  { id: "Scripture & Bible Engine", label: "Scripture & Bible Engine", icon: BookOpen },
  { id: "Companion Mobile Remote", label: "Companion Mobile Remote", icon: Smartphone },
  { id: "Stage Display & Timers", label: "Stage Display & Timers", icon: Layers },
  { id: "NDI & Video Broadcast Streaming", label: "NDI & Video Broadcast Streaming", icon: Tv },
  { id: "Other Feature / Workflow Idea", label: "Other Feature / Workflow Idea", icon: Lightbulb },
]

const impactLevels = [
  { value: "nice_to_have", label: "Nice to Have — Quality of Life improvement" },
  { value: "high_value", label: "High Value — Would greatly enhance weekly services" },
  { value: "critical", label: "Essential — Highly requested by our ministry team" },
]

export default function SuggestionsPage() {
  // Filters & Pagination state
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [currentPage, setCurrentPage] = useState(1)

  // Accordion expanded item IDs
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})

  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSubmitted, setModalSubmitted] = useState(false)
  const [submittedSugId, setSubmittedSugId] = useState("")

  // New suggestion form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    church: "",
    category: "Live Presentation & Projection",
    impact: "high_value",
    title: "",
    description: "",
  })

  // Comment draft state per suggestion: { [suggestionId]: { name: "", church: "", content: "" } }
  const [commentDrafts, setCommentDrafts] = useState<Record<string, { name: string; church: string; content: string }>>({})

  // Local voter key for tracking upvotes/downvotes
  const voterKey = useMemo(() => {
    if (typeof window === "undefined") return "voter_anon"
    let key = localStorage.getItem("ocs_voter_key")
    if (!key) {
      key = `voter_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      localStorage.setItem("ocs_voter_key", key)
    }
    return key
  }, [])

  // User vote tracker (stored in localStorage)
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down">>(() => {
    if (typeof window === "undefined") return {}
    try {
      return JSON.parse(localStorage.getItem("ocs_user_votes") || "{}")
    } catch {
      return {}
    }
  })

  // React Query hooks
  const {
    data: suggestionsData,
    isLoading,
    isFetching,
    refetch,
  } = useSuggestionsQuery({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    search: search.trim() ? search.trim() : undefined,
    sortBy,
    page: currentPage,
    limit: 10,
  })

  const createSuggestionMutation = useCreateSuggestionMutation()
  const upvoteMutation = useUpvoteSuggestionMutation()
  const downvoteMutation = useDownvoteSuggestionMutation()
  const commentMutation = useAddSuggestionCommentMutation()

  const suggestions: SuggestionItem[] = suggestionsData?.suggestions || []
  const total = suggestionsData?.total || 0
  const totalPages = suggestionsData?.totalPages || Math.max(1, Math.ceil(total / 10))

  // Stats calculation
  const stats = useMemo(() => {
    const all = suggestions
    return {
      totalCount: total,
      inDev: all.filter((s) => s.status === "in_development").length,
      planned: all.filter((s) => s.status === "planned").length,
      completed: all.filter((s) => s.status === "completed").length,
    }
  }, [suggestions, total])

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Upvote handler
  const handleUpvote = (e: React.MouseEvent, sug: SuggestionItem) => {
    e.stopPropagation()
    const currentVote = userVotes[sug._id]
    if (currentVote === "up") {
      toast.info("You already upvoted this suggestion")
      return
    }

    const updatedVotes = { ...userVotes, [sug._id]: "up" as const }
    setUserVotes(updatedVotes)
    if (typeof window !== "undefined") {
      localStorage.setItem("ocs_user_votes", JSON.stringify(updatedVotes))
    }

    upvoteMutation.mutate(
      { id: sug._id, voterKey },
      {
        onSuccess: () => {
          toast.success("Upvote recorded!")
        },
        onError: () => {
          toast.error("Failed to register upvote")
        },
      }
    )
  }

  // Downvote handler
  const handleDownvote = (e: React.MouseEvent, sug: SuggestionItem) => {
    e.stopPropagation()
    const currentVote = userVotes[sug._id]
    if (currentVote === "down") {
      toast.info("You already downvoted this suggestion")
      return
    }

    const updatedVotes = { ...userVotes, [sug._id]: "down" as const }
    setUserVotes(updatedVotes)
    if (typeof window !== "undefined") {
      localStorage.setItem("ocs_user_votes", JSON.stringify(updatedVotes))
    }

    downvoteMutation.mutate(
      { id: sug._id, voterKey },
      {
        onSuccess: () => {
          toast.info("Downvote recorded")
        },
        onError: () => {
          toast.error("Failed to register downvote")
        },
      }
    )
  }

  // Submit new suggestion modal form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.title || !form.description) {
      toast.error("Please fill in email, title, and description")
      return
    }

    try {
      const res = await createSuggestionMutation.mutateAsync({
        name: form.name.trim() || form.email.split("@")[0],
        email: form.email.trim(),
        church: form.church.trim() || "General Ministry",
        category: form.category,
        impact: form.impact,
        title: form.title.trim(),
        description: form.description.trim(),
      })

      const newId = res?.suggestionId || res?.id || `SUG-${Math.floor(10000 + Math.random() * 90000)}`
      setSubmittedSugId(newId)
      setModalSubmitted(true)
      toast.success("Feature suggestion submitted successfully!")
      refetch()
    } catch {
      toast.error("Failed to submit suggestion. Please try again.")
    }
  }

  const resetModalForm = () => {
    setForm({
      name: "",
      email: "",
      church: "",
      category: "Live Presentation & Projection",
      impact: "high_value",
      title: "",
      description: "",
    })
    setModalSubmitted(false)
    setIsModalOpen(false)
  }

  // Comment submission handler
  const handleCommentSubmit = (e: React.FormEvent, suggestionId: string) => {
    e.preventDefault()
    const draft = commentDrafts[suggestionId]
    if (!draft || !draft.content.trim()) {
      toast.error("Please enter a comment")
      return
    }

    commentMutation.mutate(
      {
        id: suggestionId,
        payload: {
          name: draft.name.trim() || "Church Member",
          church: draft.church.trim() || "Ministry Tech Team",
          content: draft.content.trim(),
        },
      },
      {
        onSuccess: () => {
          toast.success("Comment posted!")
          setCommentDrafts((prev) => ({
            ...prev,
            [suggestionId]: { name: draft.name, church: draft.church, content: "" },
          }))
          refetch()
        },
        onError: () => {
          toast.error("Failed to post comment")
        },
      }
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_development":
        return (
          <Badge className="text-[11px] px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold shadow-xs">
            ⚡ In Development
          </Badge>
        )
      case "completed":
        return (
          <Badge className="text-[11px] px-2.5 py-0.5 rounded-full border bg-purple-50 text-purple-700 border-purple-200 font-semibold shadow-xs">
            ✓ Completed & Live
          </Badge>
        )
      case "planned":
        return (
          <Badge className="text-[11px] px-2.5 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200 font-semibold shadow-xs">
            📋 Planned for Next Release
          </Badge>
        )
      case "declined":
        return (
          <Badge className="text-[11px] px-2.5 py-0.5 rounded-full border bg-slate-100 text-slate-600 border-slate-200 font-semibold">
            Closed
          </Badge>
        )
      default:
        return (
          <Badge className="text-[11px] px-2.5 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200 font-semibold shadow-xs">
            🔍 Under Community Review
          </Badge>
        )
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "critical":
        return <Badge variant="outline" className="text-[10px] text-red-600 border-red-200 bg-red-50/50">Critical Impact</Badge>
      case "high_value":
        return <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-200 bg-purple-50/50">High Value</Badge>
      default:
        return <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200 bg-slate-50/50">Quality of Life</Badge>
    }
  }

  return (
    <PageTransition>
      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-purple-50/60 via-white to-slate-50/30 border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-800 text-xs font-semibold"
            >
              <Sparkles className="size-3.5 text-purple-600 animate-pulse" />
              <span>Community Feedback & Feature Roadmap</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight"
            >
              Shaping the Future of Church Presentation Together
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed"
            >
              Explore community ideas, upvote upcoming capabilities, discuss workflows, and submit your church's technical wishlist directly to the core engineering team.
            </motion.p>

            {/* Quick KPI stats */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="pt-2 flex flex-wrap items-center justify-center gap-3"
            >
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] bg-white border border-slate-200/80 shadow-xs text-xs font-medium text-slate-700">
                <Lightbulb className="size-4 text-amber-500" />
                <span><strong>{stats.totalCount}</strong> Community Ideas</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] bg-white border border-slate-200/80 shadow-xs text-xs font-medium text-slate-700">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span><strong>{stats.inDev}</strong> In Active Development</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] bg-white border border-slate-200/80 shadow-xs text-xs font-medium text-slate-700">
                <span className="size-2 rounded-full bg-purple-500" />
                <span><strong>{stats.completed}</strong> Completed & Shipped</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MAIN COMMUNITY FEED & BLOG BOARD ── */}
      <section className="py-12 bg-slate-50/50 min-h-[700px]">
        <div className="container mx-auto px-6 max-w-6xl space-y-8">
          
          {/* Top Bar: Actions & Filters */}
          <div className="bg-white rounded-[16px] border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search suggestions, church workflows, or features..."
                  className="pl-10 h-11 bg-slate-50/50 border-slate-200 rounded-[10px] text-sm focus-visible:ring-purple-500"
                />
              </div>

              {/* Primary Action: Create Suggestion Modal Trigger */}
              <Button
                onClick={() => setIsModalOpen(true)}
                className="h-11 px-5 rounded-[10px] bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-600/20 gap-2 shrink-0 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <Plus className="size-4" />
                Suggest a Feature
              </Button>
            </div>

            {/* Filter & Sort Controls: Single Flex Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {/* Category Dropdown */}
                <Select
                  value={selectedCategory}
                  onValueChange={(v) => {
                    setSelectedCategory(v)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="h-9 w-full sm:w-[220px] bg-slate-50 border-slate-200 rounded-[8px] text-xs font-medium">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[10px]">
                    {suggestionCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status Dropdown */}
                <Select
                  value={selectedStatus}
                  onValueChange={(v) => {
                    setSelectedStatus(v)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="h-9 w-full sm:w-[170px] bg-slate-50 border-slate-200 rounded-[8px] text-xs font-medium">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[10px]">
                    <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                    <SelectItem value="under_review" className="text-xs">Under Review</SelectItem>
                    <SelectItem value="planned" className="text-xs">Planned</SelectItem>
                    <SelectItem value="in_development" className="text-xs">In Development</SelectItem>
                    <SelectItem value="completed" className="text-xs">Completed</SelectItem>
                    <SelectItem value="declined" className="text-xs">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By Selector */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="text-xs text-slate-500 font-medium">Sort:</span>
                <Select
                  value={sortBy}
                  onValueChange={(v) => {
                    setSortBy(v)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="h-9 w-[170px] bg-slate-50 border-slate-200 rounded-[8px] text-xs font-medium">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[10px]">
                    <SelectItem value="popular" className="text-xs">🔥 Most Upvoted</SelectItem>
                    <SelectItem value="newest" className="text-xs">🕒 Newest First</SelectItem>
                    <SelectItem value="comments" className="text-xs">💬 Most Discussed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* ── ACCORDION LIST FEED ── */}
          <div className="space-y-4">
            {isLoading || isFetching ? (
              /* Loading Skeleton State */
              <div className="space-y-3">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="p-6 rounded-[14px] bg-white border border-slate-200/80 shadow-xs animate-pulse flex items-start gap-5"
                  >
                    <div className="size-16 rounded-[10px] bg-slate-100 shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-2">
                        <div className="h-4 w-24 bg-slate-100 rounded-full" />
                        <div className="h-4 w-32 bg-slate-100 rounded-full" />
                      </div>
                      <div className="h-5 w-3/4 bg-slate-200 rounded" />
                      <div className="h-3.5 w-full bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : suggestions.length === 0 ? (
              /* Empty State */
              <div className="p-12 text-center bg-white rounded-[16px] border border-slate-200 shadow-xs space-y-4">
                <div className="size-14 rounded-full bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                  <Lightbulb className="size-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800">No suggestions match your filters</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Be the first to submit a request for this workflow or clear the search criteria.
                  </p>
                </div>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-[10px] bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
                >
                  <Plus className="size-3.5 mr-1" />
                  Post First Suggestion
                </Button>
              </div>
            ) : (
              /* Accordion List Items */
              suggestions.map((item) => {
                const isExpanded = !!expandedIds[item._id]
                const myVote = userVotes[item._id]
                const commentCount = item.comments?.length || 0
                const score = (item.upvotes || 0) - (item.downvotes || 0)

                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={cn(
                      "bg-white rounded-[14px] border transition-all shadow-xs overflow-hidden",
                      isExpanded
                        ? "border-purple-300 ring-2 ring-purple-500/10 shadow-md"
                        : "border-slate-200/90 hover:border-slate-300 hover:shadow-sm"
                    )}
                  >
                    {/* Header Row / Summary Card */}
                    <div
                      onClick={() => toggleExpand(item._id)}
                      className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 cursor-pointer select-none"
                    >
                      {/* Vote Score Card */}
                      <div className="flex sm:flex-col items-center gap-1.5 sm:gap-1 bg-slate-50 border border-slate-200/80 rounded-[10px] p-1.5 sm:px-2.5 sm:py-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleUpvote(e, item)}
                          title="Upvote idea"
                          className={cn(
                            "p-1.5 rounded-[6px] transition-colors cursor-pointer",
                            myVote === "up"
                              ? "bg-purple-600 text-white shadow-xs"
                              : "text-slate-500 hover:text-purple-600 hover:bg-purple-50"
                          )}
                        >
                          <ThumbsUp className="size-4" />
                        </button>

                        <span className={cn(
                          "font-bold text-xs sm:text-sm px-1 font-mono",
                          score > 0 ? "text-purple-700" : score < 0 ? "text-red-500" : "text-slate-600"
                        )}>
                          {score}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleDownvote(e, item)}
                          title="Downvote idea"
                          className={cn(
                            "p-1.5 rounded-[6px] transition-colors cursor-pointer",
                            myVote === "down"
                              ? "bg-red-500 text-white shadow-xs"
                              : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                          )}
                        >
                          <ThumbsDown className="size-4" />
                        </button>
                      </div>

                      {/* Main Title & Metadata */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          {getStatusBadge(item.status)}
                          <Badge variant="outline" className="text-[10px] text-slate-600 border-slate-200 bg-slate-50">
                            {item.category}
                          </Badge>
                          {getImpactBadge(item.impact)}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-purple-700 transition-colors">
                          {item.title}
                        </h3>

                        {/* Collapsed Description Preview */}
                        {!isExpanded && (
                          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        {/* Author & Activity Footer */}
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <User className="size-3 text-slate-400" />
                            {item.name}
                            {item.church && <span className="text-slate-400 font-normal">({item.church})</span>}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3 text-slate-400" />
                            {new Date(item.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-purple-600 font-semibold">
                            <MessageSquare className="size-3" />
                            {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                          </span>
                        </div>
                      </div>

                      {/* Expand / Collapse Button */}
                      <div className="hidden sm:flex items-center justify-center size-8 rounded-full bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors shrink-0">
                        {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </div>
                    </div>

                    {/* ── EXPANDED ACCORDION CONTENT & DISCUSSION (MINI BLOG) ── */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="border-t border-slate-100 bg-slate-50/40 p-5 sm:p-6 space-y-6"
                        >
                          {/* Full Description */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Detailed Request & Workflow Context
                            </h4>
                            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-white p-4 rounded-[10px] border border-slate-200/80 shadow-xs">
                              {item.description}
                            </p>
                          </div>

                          {/* Official Admin / Roadmap Note (if available) */}
                          {item.adminNotes && (
                            <div className="p-4 rounded-[12px] bg-gradient-to-r from-purple-900/5 to-indigo-900/5 border border-purple-200/80 space-y-1.5">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                                <ShieldCheck className="size-4 text-purple-600" />
                                <span>Official Response from OCS Product Team</span>
                              </div>
                              <p className="text-xs text-purple-950/80 leading-relaxed pl-5.5 font-medium">
                                {item.adminNotes}
                              </p>
                            </div>
                          )}

                          {/* ── COMMUNITY COMMENTS / DISCUSSION THREAD ── */}
                          <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <MessageSquare className="size-3.5 text-purple-600" />
                                Community Discussion ({commentCount})
                              </h4>
                              <span className="text-[11px] text-slate-400">
                                Share your thoughts or how your church would use this
                              </span>
                            </div>

                            {/* Existing Comments List */}
                            <div className="space-y-2.5">
                              {commentCount === 0 ? (
                                <p className="text-xs text-slate-400 italic py-2">
                                  No comments yet. Be the first to start the discussion!
                                </p>
                              ) : (
                                item.comments?.map((comment) => (
                                  <div
                                    key={comment.commentId}
                                    className="p-3.5 rounded-[10px] bg-white border border-slate-200/80 shadow-xs space-y-1.5"
                                  >
                                    <div className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-800">{comment.name}</span>
                                        {comment.church && (
                                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-slate-200 text-slate-500 font-normal">
                                            {comment.church}
                                          </Badge>
                                        )}
                                      </div>
                                      <span className="text-[10px] text-slate-400">
                                        {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                                      {comment.content}
                                    </p>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Post a Comment Form */}
                            <form
                              onSubmit={(e) => handleCommentSubmit(e, item._id)}
                              className="bg-white p-4 rounded-[12px] border border-slate-200/80 shadow-xs space-y-3"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <Input
                                  value={commentDrafts[item._id]?.name || ""}
                                  onChange={(e) =>
                                    setCommentDrafts((prev) => ({
                                      ...prev,
                                      [item._id]: {
                                        name: e.target.value,
                                        church: prev[item._id]?.church || "",
                                        content: prev[item._id]?.content || "",
                                      },
                                    }))
                                  }
                                  placeholder="Your Name (e.g. Pastor John)"
                                  className="h-8.5 text-xs bg-slate-50 border-slate-200 rounded-[8px]"
                                />
                                <Input
                                  value={commentDrafts[item._id]?.church || ""}
                                  onChange={(e) =>
                                    setCommentDrafts((prev) => ({
                                      ...prev,
                                      [item._id]: {
                                        name: prev[item._id]?.name || "",
                                        church: e.target.value,
                                        content: prev[item._id]?.content || "",
                                      },
                                    }))
                                  }
                                  placeholder="Church / Ministry (e.g. Grace Fellowship)"
                                  className="h-8.5 text-xs bg-slate-50 border-slate-200 rounded-[8px]"
                                />
                              </div>

                              <Textarea
                                value={commentDrafts[item._id]?.content || ""}
                                onChange={(e) =>
                                  setCommentDrafts((prev) => ({
                                    ...prev,
                                    [item._id]: {
                                      name: prev[item._id]?.name || "",
                                      church: prev[item._id]?.church || "",
                                      content: e.target.value,
                                    },
                                  }))
                                }
                                placeholder="Add your feedback or how this feature would benefit your services..."
                                rows={2}
                                className="text-xs bg-slate-50 border-slate-200 rounded-[8px] resize-none"
                              />

                              <div className="flex justify-end">
                                <Button
                                  type="submit"
                                  size="sm"
                                  disabled={commentMutation.isPending}
                                  className="h-8 px-4 rounded-[8px] bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
                                >
                                  <Send className="size-3" />
                                  {commentMutation.isPending ? "Posting..." : "Post Comment"}
                                </Button>
                              </div>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })
            )}
          </div>

          {/* ── PAGINATION BAR (10 Per Page) ── */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 text-xs text-slate-500">
              <span>
                Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({total} total suggestions)
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-8 px-3 rounded-[8px] text-xs gap-1 border-slate-200"
                >
                  <ChevronLeft className="size-3.5" /> Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, index, array) => {
                    const prevP = array[index - 1]
                    const showEllipsis = prevP && p - prevP > 1
                    return (
                      <div key={p} className="flex items-center">
                        {showEllipsis && <span className="px-1 text-slate-400">...</span>}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={cn(
                            "size-8 rounded-[8px] font-semibold text-xs transition-colors cursor-pointer",
                            currentPage === p
                              ? "bg-purple-600 text-white shadow-xs"
                              : "hover:bg-slate-200 text-slate-700 bg-white border border-slate-200"
                          )}
                        >
                          {p}
                        </button>
                      </div>
                    )
                  })}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 px-3 rounded-[8px] text-xs gap-1 border-slate-200"
                >
                  Next <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── MODAL: CREATE SUGGESTION FORM POPUP ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-[16px] p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="size-5 text-purple-600" />
              Propose a Feature or Idea
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Submit your request to our public community roadmap board. All users can view, vote, and comment on your idea.
            </DialogDescription>
          </DialogHeader>

          {modalSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="size-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Idea Submitted Successfully!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Tracking Reference: <strong className="text-purple-600 font-mono">{submittedSugId}</strong>
                </p>
                <p className="text-xs text-slate-500">
                  Your idea is now live on the board for other ministry leaders to vote and comment.
                </p>
              </div>
              <Button
                onClick={resetModalForm}
                className="mt-2 rounded-[10px] bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-6"
              >
                Close & View on Board
              </Button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Your Name</Label>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Pastor David Adeleke"
                    className="h-9.5 text-xs bg-slate-50 border-slate-200 rounded-[8px]"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Email Address *</Label>
                  <Input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@yourchurch.org"
                    className="h-9.5 text-xs bg-slate-50 border-slate-200 rounded-[8px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Church / Organization</Label>
                  <Input
                    value={form.church}
                    onChange={(e) => setForm({ ...form, church: e.target.value })}
                    placeholder="e.g. Grace International Church"
                    className="h-9.5 text-xs bg-slate-50 border-slate-200 rounded-[8px]"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Impact Level</Label>
                  <Select
                    value={form.impact}
                    onValueChange={(v) => setForm({ ...form, impact: v })}
                  >
                    <SelectTrigger className="h-9.5 text-xs bg-slate-50 border-slate-200 rounded-[8px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-[10px]">
                      {impactLevels.map((lvl) => (
                        <SelectItem key={lvl.value} value={lvl.value} className="text-xs">
                          {lvl.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Feature Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger className="h-9.5 text-xs bg-slate-50 border-slate-200 rounded-[8px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[10px]">
                    {suggestionCategories.filter((c) => c.id !== "all").map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Suggestion Title *</Label>
                <Input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Multi-Track Audio Routing per Presentation Slide"
                  className="h-9.5 text-xs bg-slate-50 border-slate-200 rounded-[8px]"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  Detailed Description & Practical Worship Context *
                </Label>
                <Textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe how this feature would solve a specific challenge during your service preparations, rehearsal, or live projection..."
                  rows={4}
                  className="text-xs bg-slate-50 border-slate-200 rounded-[8px] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 rounded-[8px] text-xs border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createSuggestionMutation.isPending}
                  className="h-9 px-5 rounded-[8px] bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs"
                >
                  {createSuggestionMutation.isPending ? "Submitting..." : "Post Idea to Board"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}
