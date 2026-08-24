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
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useSuggestionsQuery, useUpdateSuggestionMutation, useDeleteSuggestionMutation } from "@/lib/queries"
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

export default function AdminSuggestions() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null)
  const [editStatus, setEditStatus] = useState("")
  const [editNotes, setEditNotes] = useState("")

  const { data: suggestionsData, isLoading, refetch } = useSuggestionsQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: search ? search : undefined,
  })

  const updateMutation = useUpdateSuggestionMutation()
  const deleteMutation = useDeleteSuggestionMutation()

  const suggestions = suggestionsData?.suggestions || []

  const handleOpenDialog = (sug: any) => {
    setSelectedSuggestion(sug)
    setEditStatus(sug.status)
    setEditNotes(sug.adminNotes || "")

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
      toast.success("Suggestion updated successfully")
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
          suggestions.map((sug: any) => (
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
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-slate-950 border border-slate-800 text-purple-300 text-xs font-semibold">
                  <ChevronUp className="size-3.5 text-purple-400" />
                  <span>{sug.upvotes || 1}</span>
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
          ))
        )}
      </div>

      {/* Edit / Detail Dialog */}
      <Dialog open={!!selectedSuggestion} onOpenChange={(open) => !open && setSelectedSuggestion(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-purple-400 font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                {selectedSuggestion?.suggestionId}
              </span>
              <DialogTitle className="text-lg font-bold">{selectedSuggestion?.title}</DialogTitle>
            </div>
            <DialogDescription className="text-slate-400 text-xs">
              Submitted by {selectedSuggestion?.name} ({selectedSuggestion?.email}) from {selectedSuggestion?.church}
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
              <label className="text-xs font-semibold text-slate-300">Admin Notes & Roadmap Comments</label>
              <Textarea
                rows={3}
                placeholder="Internal notes or public roadmap comment for this suggestion..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="bg-slate-900 border-slate-800 text-white text-xs resize-none rounded-[8px]"
              />
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
