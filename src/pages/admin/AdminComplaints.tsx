import { useState, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, X, MessageSquare, RefreshCw, AtSign, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useTicketsQuery, useUpdateTicketMutation, useAddTicketNoteMutation, useAdminUsersQuery } from "@/lib/queries"
import { toast } from "sonner"

type Status = "open" | "in_progress" | "resolved"
type Priority = "high" | "normal" | "low"

interface Complaint {
  id: string
  subject: string
  email: string
  church: string
  message: string
  category: string
  status: Status
  priority: Priority
  date: string
  notes: string[]
}

const filters: { label: string; value: Status | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
]

const statusConfig: Record<Status, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  in_progress: { label: "In Progress", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  resolved: { label: "Resolved", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
}

const priorityConfig: Record<Priority, string> = {
  high: "bg-red-500/15 text-red-400 border-red-500/30",
  normal: "bg-slate-600/15 text-slate-400 border-slate-700",
  low: "bg-slate-700/15 text-slate-500 border-slate-800",
}

// Helper to render mentions styled with badge pills
function renderNoteContent(content: string) {
  if (!content) return null
  const tokens = content.split(/(@[A-Za-z0-9_.\s-]+?(?=\s+[-–—:,]|\s+@|[.,!?;]|\n|$))/g)

  return (
    <span>
      {tokens.map((token, i) => {
        if (token.startsWith("@")) {
          return (
            <span
              key={i}
              className="inline-flex items-center text-purple-300 bg-purple-900/60 font-semibold px-1.5 py-0.5 rounded text-[11px] border border-purple-700/50 mx-0.5"
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

export default function AdminComplaints() {
  const [filter, setFilter] = useState<Status | "all">("all")
  const [selected, setSelected] = useState<string | null>(null)
  const [note, setNote] = useState("")

  // Autocomplete mention state
  const [mentionQuery, setMentionQuery] = useState<string | null>(null)
  const [cursorPos, setCursorPos] = useState<number>(0)
  const [mentionIndex, setMentionIndex] = useState<number>(0)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const { data: remoteTickets, isLoading, refetch, isFetching } = useTicketsQuery()
  const { data: adminUsers } = useAdminUsersQuery()
  const updateTicketMutation = useUpdateTicketMutation()
  const addNoteMutation = useAddTicketNoteMutation()

  // Real admin and team members only (no regular customers)
  const existingUsers = useMemo(() => {
    const list: { id: string; name: string; email: string; role: string; tag: string }[] = []
    const seen = new Set<string>()

    const add = (u: any) => {
      if (!u) return
      const email = u.email || ""
      const name = u.name || email.split("@")[0] || ""
      if (!email && !name) return
      const key = (email || name).toLowerCase()
      if (seen.has(key)) return
      seen.add(key)
      const cleanTag = name.replace(/\s+/g, "") || email.split("@")[0]
      list.push({
        id: u._id || u.id || key,
        name: name || email,
        email,
        role: u.role || "admin",
        tag: `@${cleanTag}`,
      })
    }

    if (Array.isArray(adminUsers)) {
      adminUsers
        .filter((u: any) => !u.role || u.role === "admin" || u.role === "super_admin")
        .forEach(add)
    }
    return list
  }, [adminUsers])

  // Filtered users matching typed @ query
  const filteredMentionUsers = useMemo(() => {
    if (mentionQuery === null) return []
    const q = mentionQuery.toLowerCase()
    return existingUsers.filter((u) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.tag.toLowerCase().includes(q)
    ).slice(0, 6)
  }, [mentionQuery, existingUsers])

  // Detect @query when typing in note textarea
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    const selStart = e.target.selectionStart || 0
    setNote(val)
    setCursorPos(selStart)

    const textBefore = val.slice(0, selStart)
    const match = textBefore.match(/@([A-Za-z0-9_.-]*)$/)
    if (match) {
      setMentionQuery(match[1].toLowerCase())
      setMentionIndex(0)
    } else {
      setMentionQuery(null)
    }
  }

  // Keyboard navigation inside dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionQuery !== null && filteredMentionUsers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setMentionIndex((prev) => (prev + 1) % filteredMentionUsers.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setMentionIndex((prev) => (prev - 1 + filteredMentionUsers.length) % filteredMentionUsers.length)
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault()
        handleSelectMention(filteredMentionUsers[mentionIndex])
      } else if (e.key === "Escape") {
        setMentionQuery(null)
      }
    }
  }

  // Insert selected mention tag into text
  const handleSelectMention = (targetUser: { name: string; tag: string }) => {
    const textBefore = note.slice(0, cursorPos)
    const textAfter = note.slice(cursorPos)
    const atIndex = textBefore.lastIndexOf("@")
    if (atIndex !== -1) {
      const newBefore = textBefore.slice(0, atIndex)
      const insertion = `${targetUser.tag} `
      const newNote = `${newBefore}${insertion}${textAfter}`
      setNote(newNote)
      setMentionQuery(null)

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          const newPos = atIndex + insertion.length
          textareaRef.current.setSelectionRange(newPos, newPos)
          setCursorPos(newPos)
        }
      }, 50)
    }
  }

  // Real backend tickets only — no mock duplicates
  const complaints: Complaint[] = (remoteTickets || []).map((t: any) => ({
    id: t._id || t.id || t.ticketId || "TICKET",
    subject: t.subject || "Support Inquiry",
    email: t.email || (t.userId?.email) || "user@church.org",
    church: t.churchName || (t.userId?.churchName) || "Community Church",
    message: t.message || "",
    category: t.category || "General Support",
    status: (t.status || "open") as Status,
    priority: (t.priority || "normal") as Priority,
    date: t.createdAt ? new Date(t.createdAt).toLocaleString() : "Recently",
    notes: (t.notes || []).map((n: any) => typeof n === "string" ? n : n.note || ""),
  }))

  const filtered = filter === "all" ? complaints : complaints.filter((c) => c.status === filter)
  const detail = complaints.find((c) => c.id === selected)

  const handleUpdateStatus = (id: string, newStatus: Status) => {
    updateTicketMutation.mutate(
      { id, payload: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(`Ticket marked as ${statusConfig[newStatus].label}`)
        },
        onError: (err: any) => {
          toast.error("Failed to update status", { description: err.message })
        },
      }
    )
  }

  const handleAddNote = (id: string) => {
    if (!note.trim()) return
    const text = note.trim()
    addNoteMutation.mutate(
      { id, note: text },
      {
        onSuccess: () => {
          setNote("")
          toast.success("Internal note added to ticket")
        },
        onError: (err: any) => {
          toast.error("Failed to add note", { description: err.message })
        },
      }
    )
  }

  const counts = {
    all: complaints.length,
    open: complaints.filter((c) => c.status === "open").length,
    in_progress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Support & Complaints</h1>
            {counts.open > 0 && (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs px-2 py-0.5">
                {counts.open} open
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Live queue of church inquiries, bug reports, and customer requests.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white rounded-[10px] text-xs gap-1.5 cursor-pointer"
          >
            <RefreshCw className={cn("size-3.5", isFetching && "animate-spin text-purple-400")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-slate-800/60 pb-3">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-3 py-1.5 rounded-[12px] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
              filter === f.value
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
            )}
          >
            {f.label}
            <span className={cn(
              "size-4 rounded-full flex items-center justify-center text-[10px] font-bold",
              filter === f.value ? "bg-white/20" : "bg-slate-800 text-slate-400"
            )}>
              {counts[f.value]}
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-500 text-sm">
          <RefreshCw className="size-6 animate-spin mx-auto mb-2 text-purple-400" />
          Loading support tickets...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800 rounded-[14px]">
          <CardContent className="py-16 text-center space-y-2">
            <MessageSquare className="size-8 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">No support tickets found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When users submit complaints or support inquiries from the web app or desktop help menu, they will appear here in real time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={cn("grid gap-4", detail ? "lg:grid-cols-2" : "grid-cols-1")}>
          {/* Ticket list */}
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  onClick={() => setSelected(selected === c.id ? null : c.id)}
                  className={cn(
                    "cursor-pointer rounded-[12px] p-4 transition-all bg-slate-900 border border-slate-800 shadow-md",
                    selected === c.id
                      ? "ring-2 ring-purple-500 shadow-lg shadow-purple-900/30 bg-slate-850"
                      : "hover:bg-slate-800/80"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[10px] font-mono text-slate-500">{c.id.slice(-8)}</span>
                        <Badge className={cn("text-[10px] border px-1.5 py-0.5 rounded-[6px]", priorityConfig[c.priority])}>
                          {c.priority.toUpperCase()}
                        </Badge>
                        <Badge className={cn("text-[10px] border px-1.5 py-0.5 rounded-[6px]", statusConfig[c.status].color)}>
                          {statusConfig[c.status].label}
                        </Badge>
                        <span className="text-[10px] text-slate-500 ml-auto">{c.date}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white truncate">{c.subject}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{c.message}</p>
                      <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400 flex-wrap">
                        <span className="text-purple-300 font-medium">{c.email}</span>
                        <span>·</span>
                        <span>{c.church}</span>
                        {c.notes.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="text-amber-400 font-medium">{c.notes.length} internal note{c.notes.length > 1 ? "s" : ""}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Ticket detail */}
          <AnimatePresence>
            {detail && (
              <motion.div
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="rounded-[14px] p-5 bg-slate-900 border border-slate-800 space-y-5 sticky top-20 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-500">{detail.id}</span>
                      <Badge className={cn("text-[10px] border px-1.5 py-0.5 rounded-[6px]", statusConfig[detail.status].color)}>
                        {statusConfig[detail.status].label}
                      </Badge>
                      <Badge className={cn("text-[10px] border px-1.5 py-0.5 rounded-[6px]", priorityConfig[detail.priority])}>
                        {detail.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <h2 className="text-base font-bold text-white">{detail.subject}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Submitted by <strong className="text-slate-200">{detail.email}</strong> ({detail.church}) · {detail.date}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Message body */}
                <div className="p-4 rounded-[10px] bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {detail.message}
                </div>

                {/* Status action buttons */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2">Update Ticket Status</label>
                  <div className="flex gap-2">
                    {(["open", "in_progress", "resolved"] as Status[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(detail.id, st)}
                        disabled={detail.status === st || updateTicketMutation.isPending}
                        className={cn(
                          "flex-1 py-1.5 px-3 rounded-[8px] text-xs font-semibold transition-all cursor-pointer border text-center",
                          detail.status === st
                            ? statusConfig[st].color + " shadow-sm font-bold"
                            : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                        )}
                      >
                        {statusConfig[st].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Internal notes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-400 block">
                      Internal Team Notes ({detail.notes.length})
                    </label>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <AtSign className="size-2.5 text-purple-400" /> Type @ in note to mention a team member
                    </span>
                  </div>

                  {detail.notes.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {detail.notes.map((n, idx) => (
                        <div key={idx} className="p-2.5 rounded-[8px] bg-purple-950/30 border border-purple-900/40 text-xs text-purple-200 leading-relaxed whitespace-pre-wrap">
                          {renderNoteContent(n)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 italic">No notes logged yet.</p>
                  )}

                  {/* Textarea container with Autocomplete Mentions Dropdown */}
                  <div className="relative">
                    <AnimatePresence>
                      {mentionQuery !== null && filteredMentionUsers.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          className="absolute bottom-full left-0 mb-2 w-72 bg-slate-900/95 border border-purple-500/50 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-md"
                        >
                          <div className="px-3 py-1.5 bg-purple-950/70 border-b border-purple-900/40 text-[10px] font-semibold text-purple-300 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <AtSign className="size-3 text-purple-400" /> Tag Team Member
                            </span>
                            <span className="text-[9px] text-slate-400">↑↓ select · Enter</span>
                          </div>
                          <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/60 p-1">
                            {filteredMentionUsers.map((u, idx) => (
                              <button
                                key={u.id}
                                type="button"
                                onClick={() => handleSelectMention(u)}
                                onMouseEnter={() => setMentionIndex(idx)}
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer",
                                  idx === mentionIndex
                                    ? "bg-purple-600/30 text-white font-medium border border-purple-500/30"
                                    : "hover:bg-slate-800/70 text-slate-300"
                                )}
                              >
                                <div className="min-w-0 pr-2">
                                  <div className="font-semibold text-white truncate flex items-center gap-1.5">
                                    <User className="size-3 text-purple-400 shrink-0" />
                                    <span>{u.name}</span>
                                    <span className="text-[10px] text-purple-300 font-mono">{u.tag}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">{u.email}</div>
                                </div>
                                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-purple-800/60 text-purple-300 shrink-0 capitalize">
                                  {u.role.replace('_', ' ')}
                                </Badge>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-2 items-end">
                      <Textarea
                        ref={textareaRef}
                        id="internal-note-textarea"
                        placeholder="Add an internal note or type @ to mention a user..."
                        value={note}
                        onChange={handleNoteChange}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => setCursorPos(e.currentTarget.selectionStart || 0)}
                        onKeyUp={(e) => setCursorPos(e.currentTarget.selectionStart || 0)}
                        className="text-xs text-white placeholder:text-slate-500 bg-slate-950 border-slate-800 focus:border-purple-500 min-h-[72px] resize-none focus:ring-1 focus:ring-purple-500"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddNote(detail.id)}
                        disabled={!note.trim() || addNoteMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-500 text-white shrink-0 rounded-[8px] cursor-pointer h-9 px-3 gap-1 shadow-md shadow-purple-900/30"
                      >
                        <Send className="size-3.5" />
                        <span className="text-xs">Add</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
