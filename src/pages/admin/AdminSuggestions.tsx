import { useState } from "react"
import { motion } from "framer-motion"
import {
  Lightbulb,
  Search,
  Trash2,
  Filter,
  Building,
  User,
  Mail,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AtSign,
  Reply,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  useSuggestionsQuery,
  useUpdateSuggestionMutation,
  useDeleteSuggestionMutation,
  useDeleteSuggestionCommentMutation,
  useAddSuggestionCommentMutation,
} from "@/lib/queries"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "under_review", label: "Under Review" },
  { value: "planned", label: "Planned" },
  { value: "in_development", label: "In Development" },
  { value: "completed", label: "Completed" },
  { value: "declined", label: "Declined" },
]

// Helper to render mentions in dark admin mode
function renderAdminCommentText(content: string) {
  if (!content) return null
  const tokens = content.split(/(@[A-Za-z0-9_.\s]+?(?=\s+[-–—:,]|\s+@|[.,!?;]|\n|$))/g)

  return (
    <span>
      {tokens.map((token, i) => {
        if (token.startsWith("@")) {
          return (
            <span
              key={i}
              className="inline-flex items-center text-purple-300 bg-purple-950/70 font-semibold px-1.5 py-0.2 rounded text-[10px] border border-purple-800/50 mx-0.5"
            >
              {token}
            </span>
          )
        }
        return <span key={i}>{token}</span>
      })}
    </span>
  )
}

export default function AdminSuggestions() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null)
  const [editStatus, setEditStatus] = useState("")
  const [editNotes, setEditNotes] = useState("")
  const [adminCommentContent, setAdminCommentContent] = useState("")

  const { data: suggestionsData, isLoading, refetch } = useSuggestionsQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: search ? search : undefined,
  })

  const updateMutation = useUpdateSuggestionMutation()
  const deleteMutation = useDeleteSuggestionMutation()
  const deleteCommentMutation = useDeleteSuggestionCommentMutation()
  const addCommentMutation = useAddSuggestionCommentMutation()

  const suggestions = suggestionsData?.suggestions || []

  const handleOpenDialog = (sug: any) => {
    setSelectedSuggestion(sug)
    setEditStatus(sug.status)
    setEditNotes(sug.adminNotes || "")
    setAdminCommentContent("")

    // Mark as read by admin
    if (!sug.isReadByAdmin) {
      updateMutation.mutate({
        id: sug._id,
        payload: { isReadByAdmin: true },
      })
    }
  }

  const handleSaveUpdate = async () => {
    if (!selectedSuggestion) return
    try {
      await updateMutation.mutateAsync({
        id: selectedSuggestion._id,
        payload: {
          status: editStatus,
          adminNotes: editNotes,
        },
      })
      toast.success("Suggestion status & roadmap notes updated")
      setSelectedSuggestion(null)
      refetch()
    } catch {
      toast.error("Failed to update suggestion")
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this feature suggestion?")) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success("Suggestion removed")
      if (selectedSuggestion?._id === id) setSelectedSuggestion(null)
      refetch()
    } catch {
      toast.error("Failed to delete suggestion")
    }
  }

  const handleAdminMention = (name: string) => {
    const mentionTag = `@${name.trim()} `
    setAdminCommentContent((prev) => (prev.includes(mentionTag) ? prev : `${mentionTag}${prev}`))
    toast.info(`Replying to ${name}`)
  }

  const handlePostAdminComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSuggestion || !adminCommentContent.trim()) {
      toast.error("Please enter a reply")
      return
    }

    try {
      const res = await addCommentMutation.mutateAsync({
        id: selectedSuggestion._id,
        payload: {
          name: "OCS Core Team (Are Oluwasegun)",
          church: "Verified Admin",
          content: adminCommentContent.trim(),
        },
      })

      if (res?.comments) {
        setSelectedSuggestion((prev: any) => ({
          ...prev,
          comments: res.comments,
        }))
      }
      setAdminCommentContent("")
      toast.success("Official response posted")
      refetch()
    } catch {
      toast.error("Failed to post comment")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_development":
        return <Badge className="text-xs border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">In Development</Badge>
      case "completed":
        return <Badge className="text-xs border bg-purple-500/10 text-purple-400 border-purple-500/20">Completed</Badge>
      case "planned":
        return <Badge className="text-xs border bg-blue-500/10 text-blue-400 border-blue-500/20">Planned</Badge>
      case "declined":
        return <Badge className="text-xs border bg-red-500/10 text-red-400 border-red-500/20">Declined</Badge>
      default:
        return <Badge className="text-xs border bg-amber-500/10 text-amber-400 border-amber-500/20">Under Review</Badge>
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Lightbulb className="size-6 text-purple-400" />
            Feature Suggestions & Ideas
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review, prioritize, and manage community proposals submitted by church tech teams.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30 px-3 py-1.5 text-xs font-semibold">
            {suggestions.length} Suggestions Logged
          </Badge>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 p-4 rounded-[14px] border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search proposals, churches, ideas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-950 border-slate-800 text-white rounded-[10px] text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44 bg-slate-950 border-slate-800 text-white rounded-[10px] text-xs">
              <Filter className="size-3.5 mr-2 text-slate-400" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white text-xs">
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="grid gap-3.5">
        {isLoading ? (
          <div className="py-16 text-center text-slate-500 text-sm">Loading suggestions...</div>
        ) : suggestions.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 rounded-[14px] border border-slate-800/60 space-y-2">
            <Lightbulb className="size-8 text-slate-600 mx-auto" />
            <p className="text-slate-400 font-semibold text-sm">No suggestions match your filters</p>
            <p className="text-xs text-slate-600">Feature suggestions submitted from the web portal will appear here.</p>
          </div>
        ) : (
          suggestions.map((sug: any) => {
            const commentCount = sug.comments?.length || 0
            const score = (sug.upvotes || 0) - (sug.downvotes || 0)

            return (
              <motion.div
                key={sug._id}
                onClick={() => handleOpenDialog(sug)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-5 rounded-[14px] border bg-slate-900/50 hover:bg-slate-900/80 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4",
                  !sug.isReadByAdmin ? "border-purple-500/40 shadow-sm shadow-purple-900/20" : "border-slate-800/80"
                )}
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs text-purple-400 font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                      {sug.suggestionId || "SUG"}
                    </span>
                    <h3 className="font-bold text-white text-sm truncate">{sug.title}</h3>
                    {getStatusBadge(sug.status)}
                    {sug.impact === "critical" && (
                      <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">
                        High Impact
                      </Badge>
                    )}
                    {!sug.isReadByAdmin && (
                      <span className="size-2 rounded-full bg-purple-400 inline-block animate-pulse" />
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{sug.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <User className="size-3 text-slate-400" />
                      <strong className="text-slate-300">{sug.name}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="size-3 text-slate-400" />
                      {sug.church || "General"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="size-3 text-slate-400" />
                      {sug.email}
                    </span>
                    <span className="flex items-center gap-1 text-purple-400 font-medium">
                      <MessageSquare className="size-3" />
                      {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                    </span>
                    <span className="text-slate-600">
                      {new Date(sug.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {/* Community Net Score */}
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-[8px] bg-slate-950 border border-slate-800 text-xs font-semibold">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ThumbsUp className="size-3" /> {sug.upvotes || 0}
                    </span>
                    {sug.downvotes > 0 && (
                      <span className="flex items-center gap-1 text-red-400">
                        <ThumbsDown className="size-3" /> {sug.downvotes}
                      </span>
                    )}
                    <span className="text-purple-300 border-l border-slate-800 pl-1.5 font-mono font-bold">
                      {score}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(sug._id, e)}
                    className="p-2 rounded-[8px] hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                    title="Delete proposal"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Edit / Detail Dialog */}
      <Dialog open={!!selectedSuggestion} onOpenChange={(open) => !open && setSelectedSuggestion(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-purple-400 font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                {selectedSuggestion?.suggestionId}
              </span>
              <DialogTitle className="text-lg font-bold">{selectedSuggestion?.title}</DialogTitle>
            </div>
            <DialogDescription className="text-slate-400 text-xs flex items-center justify-between">
              <span>
                Submitted by {selectedSuggestion?.name} ({selectedSuggestion?.email}) from {selectedSuggestion?.church}
              </span>
              <button
                type="button"
                onClick={() => handleAdminMention(selectedSuggestion?.name)}
                className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <AtSign className="size-3" /> Mention Author
              </button>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-4 rounded-[10px] bg-slate-900/70 border border-slate-800/80 space-y-2">
              <h4 className="text-xs font-semibold text-slate-300">Detailed Description & Use Case</h4>
              <p className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed">
                {selectedSuggestion?.description}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Status</label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-[8px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white text-xs">
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_development">In Development</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Category</label>
                <div className="p-2 rounded-[8px] bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  {selectedSuggestion?.category}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Admin Notes & Public Roadmap Comments</label>
              <Textarea
                rows={3}
                placeholder="Official OCS team feedback or public roadmap commentary..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white text-xs resize-none rounded-[8px]"
              />
            </div>

            {/* Community Discussion Moderation & Admin Reply */}
            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="size-3.5 text-purple-400" />
                  Community Discussion ({selectedSuggestion?.comments?.length || 0})
                </label>
              </div>

              {(!selectedSuggestion?.comments || selectedSuggestion.comments.length === 0) ? (
                <p className="text-xs text-slate-500 italic py-1">No community comments on this proposal yet.</p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {selectedSuggestion.comments.map((cm: any) => (
                    <div key={cm.commentId} className="p-2.5 rounded-[8px] bg-slate-900 border border-slate-800 flex items-start justify-between gap-2">
                      <div className="space-y-1 text-xs flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-200">{cm.name}</span>
                            {cm.church && <span className="text-[10px] text-slate-400">({cm.church})</span>}
                            <span className="text-[10px] text-slate-500">
                              {new Date(cm.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAdminMention(cm.name)}
                            className="text-purple-400 hover:text-purple-300 text-[10px] font-medium inline-flex items-center gap-0.5 cursor-pointer"
                          >
                            <Reply className="size-2.5" /> Reply
                          </button>
                        </div>
                        <div className="text-slate-300 text-xs whitespace-pre-wrap">
                          {renderAdminCommentText(cm.content)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          if (!confirm("Delete this comment?")) return
                          try {
                            await deleteCommentMutation.mutateAsync({
                              id: selectedSuggestion._id,
                              commentId: cm.commentId,
                            })
                            setSelectedSuggestion((prev: any) => ({
                              ...prev,
                              comments: prev.comments.filter((c: any) => c.commentId !== cm.commentId),
                            }))
                            toast.success("Comment deleted")
                            refetch()
                          } catch {
                            toast.error("Failed to delete comment")
                          }
                        }}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                        title="Delete comment"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Admin Reply Input Box */}
              <form onSubmit={handlePostAdminComment} className="flex gap-2 items-center pt-1">
                <Input
                  value={adminCommentContent}
                  onChange={(e) => setAdminCommentContent(e.target.value)}
                  placeholder="Post an official reply or @Mention someone..."
                  className="h-8.5 text-xs bg-slate-900 border-slate-800 text-white rounded-[8px]"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={addCommentMutation.isPending}
                  className="h-8.5 px-3 rounded-[8px] bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold gap-1 shrink-0"
                >
                  <Send className="size-3" />
                  Reply
                </Button>
              </form>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSelectedSuggestion(null)}
              className="border-slate-800 text-slate-300 hover:bg-slate-900 text-xs rounded-[8px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUpdate}
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs rounded-[8px]"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
