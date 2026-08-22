import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Send, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

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

const mockComplaints: Complaint[] = [
  {
    id: "OCS-10042", subject: "Stage view not refreshing on macOS", email: "pastor@grace.org", church: "Grace Church",
    message: "After the latest update, the stage view freezes and only updates after a manual refresh. It was working fine before v2.4.1.",
    category: "Display & Screen Issues", status: "open", priority: "high", date: "2026-08-22 10:14", notes: [],
  },
  {
    id: "OCS-10041", subject: "Login loop on Windows", email: "tech@harvest.org", church: "Harvest City",
    message: "When logging in on Windows 11 with our church credentials, it shows a success message then redirects back to the login screen repeatedly.",
    category: "Authentication / Login", status: "in_progress", priority: "high", date: "2026-08-22 07:45", notes: ["Reproduced internally — investigating Electron session token handling on Win11"],
  },
  {
    id: "OCS-10039", subject: "Live transcript delay on iOS companion", email: "admin@redeemed.ng", church: "Redeemed Assembly",
    message: "The transcript on the iOS app lags 5-6 seconds behind what the speaker is actually saying. Doesn't happen on Android.",
    category: "Live Transcription", status: "open", priority: "normal", date: "2026-08-21 14:20", notes: [],
  },
  {
    id: "OCS-10038", subject: "Feature request: Export schedule to PDF", email: "james@citylight.org", church: "City Light",
    message: "It would be great to export the current schedule/order of service to a PDF that can be printed and handed to the worship team.",
    category: "Feature Request", status: "resolved", priority: "low", date: "2026-08-19 09:30", notes: ["Logged in product backlog. Planned for v2.5"],
  },
  {
    id: "OCS-10036", subject: "App crashes on Android 10", email: "mary@mountzion.org", church: "Mount Zion",
    message: "The app crashes immediately on launch on my Android 10 device. I'm running OCS v2.4.0.",
    category: "App Crashing / Performance", status: "resolved", priority: "high", date: "2026-08-18 18:55", notes: ["Fixed in v2.4.1 — user notified"],
  },
]

const filters: { label: string; value: Status | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
]

const statusConfig: Record<Status, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  in_progress: { label: "In Progress", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  resolved: { label: "Resolved", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
}

const priorityConfig: Record<Priority, string> = {
  high: "bg-red-500/15 text-red-400 border-red-500/20",
  normal: "bg-slate-600/15 text-slate-400 border-slate-700",
  low: "bg-slate-700/15 text-slate-500 border-slate-800",
}

import { useTicketsQuery } from "@/lib/queries"

export default function AdminComplaints() {
  const [filter, setFilter] = useState<Status | "all">("all")
  const [selected, setSelected] = useState<string | null>(null)
  const [localComplaints, setLocalComplaints] = useState<Complaint[]>(mockComplaints)
  const [note, setNote] = useState("")

  const { data: remoteTickets } = useTicketsQuery()

  // Merge live tickets from backend with mock complaints
  const complaints: Complaint[] = [
    ...(remoteTickets?.map((t: any) => ({
      id: t.ticketId || t._id || t.id || `OCS-${Math.floor(10000 + Math.random() * 90000)}`,
      subject: t.subject || "Support Inquiry",
      email: t.email || "user@church.org",
      church: t.churchName || t.church || "Community Ministry",
      message: t.message || "",
      category: t.category || "General",
      status: (t.status || "open") as Status,
      priority: (t.priority || "normal") as Priority,
      date: t.createdAt ? new Date(t.createdAt).toLocaleString() : "Just now",
      notes: t.notes || [],
    })) || []),
    ...localComplaints,
  ]

  const filtered = filter === "all" ? complaints : complaints.filter((c) => c.status === filter)
  const detail = complaints.find((c) => c.id === selected)

  const updateStatus = (id: string, status: Status) => {
    setLocalComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status } : c))
  }

  const addNote = (id: string) => {
    if (!note.trim()) return
    setLocalComplaints((prev) => prev.map((c) => c.id === id ? { ...c, notes: [...c.notes, note.trim()] } : c))
    setNote("")
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Support Tickets</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage incoming complaint and support requests.</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="size-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs text-slate-400">{counts.open} open</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-3 py-1.5 rounded-[12px] text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5",
              filter === f.value
                ? "bg-purple-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            )}
          >
            {f.label}
            <span className={cn(
              "size-4 rounded-[12px] flex items-center justify-center text-[10px] font-bold",
              filter === f.value ? "bg-white/20" : "bg-slate-700"
            )}>
              {counts[f.value]}
            </span>
          </button>
        ))}
      </div>

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
                  "cursor-pointer rounded-[12px] p-4 transition-all bg-slate-900 shadow-md",
                  selected === c.id
                    ? "ring-2 ring-purple-500 shadow-lg shadow-purple-900/30"
                    : "hover:bg-slate-800/80"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono text-slate-600">{c.id}</span>
                      <Badge className={cn("text-[10px] border-0 px-1.5 py-0.5 rounded-[12px]", priorityConfig[c.priority])}>
                        {c.priority.toUpperCase()}
                      </Badge>
                      <Badge className={cn("text-[10px] border-0 px-1.5 py-0.5 rounded-[12px]", statusConfig[c.status].color)}>
                        {statusConfig[c.status].label}
                      </Badge>
                      <span className="text-[10px] text-slate-600 ml-auto">{c.date}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-200 truncate">{c.subject}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.message}</p>
                    <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500">
                      <span>{c.email}</span>
                      <span>·</span>
                      <span className="capitalize">{c.category}</span>
                      {c.notes.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-purple-400 font-medium">{c.notes.length} note{c.notes.length > 1 ? "s" : ""}</span>
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
            >
              <Card className="bg-slate-900 shadow-xl rounded-[12px] sticky top-20">
                <CardHeader className="p-5 border-b border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-500">{detail.id}</span>
                        <Badge className={cn("text-[10px] border px-1.5 py-0.5 rounded-[12px]", priorityConfig[detail.priority])}>
                          {detail.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <CardTitle className="text-base text-slate-100">{detail.subject}</CardTitle>
                      <p className="text-xs text-slate-400 mt-0.5">{detail.email}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7 text-slate-400 hover:text-slate-200 rounded-[12px]"
                      onClick={() => setSelected(null)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>

                  {/* Status switcher */}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-slate-500">Status:</span>
                    {(["open", "in_progress", "resolved"] as Status[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(detail.id, s)}
                        className={cn(
                          "px-2 py-0.5 rounded-[12px] text-[10px] font-semibold border transition-all cursor-pointer",
                          detail.status === s
                            ? statusConfig[s].color
                            : "border-slate-800 text-slate-600 hover:border-slate-700"
                        )}
                      >
                        {statusConfig[s].label}
                      </button>
                    ))}
                    <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500 rounded-[12px]">{detail.date}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-5">
                  {/* Message */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Message</h4>
                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/60 rounded-[12px] p-4 border border-slate-800">
                      {detail.message}
                    </p>
                  </div>

                  {/* Internal notes */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Plus className="size-3.5" /> Internal Notes
                    </h4>
                    <div className="space-y-2 mb-3">
                      {detail.notes.length === 0 ? (
                        <p className="text-xs text-slate-600 italic">No notes yet.</p>
                      ) : (
                        detail.notes.map((n, i) => (
                          <div key={i} className="text-xs text-slate-400 bg-slate-800/40 rounded-[12px] p-3 border-l-2 border-purple-600/40">
                            {n}
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add an internal note..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="min-h-[60px] text-xs bg-slate-800 border-slate-700 text-slate-300 placeholder:text-slate-600 focus-visible:ring-purple-600 rounded-[12px]"
                      />
                      <Button
                        size="icon"
                        variant="admin"
                        onClick={() => addNote(detail.id)}
                        className="shrink-0 self-end"
                      >
                        <Send className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
