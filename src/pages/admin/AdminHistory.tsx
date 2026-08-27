import { useState, useMemo } from "react"
import {
  History, Search, ArrowRight,
  Clock, Sparkles, RefreshCw, Eye,
  FileText, ChevronLeft, ChevronRight, Filter
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSubscriptionHistoryQuery } from "@/lib/queries"
import { cn } from "@/lib/utils"

const PLAN_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  trial: { label: "2-Mo Trial", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  free: { label: "Free Mode", color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/30" },
  mini: { label: "Mini Setup", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  mini_setup: { label: "Mini Setup", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  standard: { label: "Standard Setup", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  standard_setup: { label: "Standard Setup", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  large: { label: "Large Setup", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
  large_setup: { label: "Large Setup", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
  premium: { label: "Premium Setup", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  premium_setup: { label: "Premium Setup", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
}

function getPlanBadge(planKey: string) {
  const normalized = (planKey || "trial").toLowerCase()
  const conf = PLAN_STYLES[normalized] || {
    label: planKey?.toUpperCase() || "UNKNOWN",
    color: "text-slate-300",
    bg: "bg-slate-800",
    border: "border-slate-700",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border tracking-tight",
        conf.bg,
        conf.color,
        conf.border
      )}
    >
      {conf.label}
    </span>
  )
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "N/A"
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  } catch {
    return dateStr
  }
}

export default function AdminHistory() {
  const [search, setSearch] = useState("")
  const [planFilter, setPlanFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [selectedTx, setSelectedTx] = useState<any | null>(null)

  const { data, isLoading, isFetching, refetch } = useSubscriptionHistoryQuery({
    page,
    limit: 20,
    search: search.trim() || undefined,
    plan: planFilter !== "all" ? planFilter : undefined,
  })

  const historyList = useMemo(() => data?.history || [], [data?.history])
  const total = data?.total || 0
  const totalPages = data?.totalPages || 1

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalTransactions = total
    const upgradesCount = historyList.filter(
      (h) => h.newPlan && h.newPlan !== "free" && h.newPlan !== "trial"
    ).length
    const recentCount = historyList.filter((h) => {
      const diffDays = (Date.now() - new Date(h.upgradedAt || h.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      return diffDays <= 7
    }).length

    return { totalTransactions, upgradesCount, recentCount }
  }, [total, historyList])

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <History className="size-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Plan Upgrade & Transaction History
              </h1>
              <p className="text-xs md:text-sm text-slate-400">
                Audit trail of customer subscription tier changes, renewals, and remaining days
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 gap-1.5 h-9"
        >
          <RefreshCw className={cn("size-3.5", isFetching && "animate-spin text-purple-400")} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Total Plan Adjustments</p>
              <p className="text-2xl font-bold text-white mt-1">{total}</p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <History className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Paid Setup Upgrades</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{metrics.upgradesCount}</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Sparkles className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Recent Activity (7 Days)</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{metrics.recentCount}</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Toolbar */}
      <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <Input
                placeholder="Search church, customer name, email, or TX ref..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9 bg-slate-950/60 border-slate-800 text-sm text-slate-200 placeholder:text-slate-500 h-9"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1 shrink-0">
                <Filter className="size-3.5" /> Plan:
              </span>
              {[
                { id: "all", label: "All" },
                { id: "trial", label: "Trial" },
                { id: "mini", label: "Mini" },
                { id: "standard", label: "Standard" },
                { id: "large", label: "Large" },
                { id: "premium", label: "Premium" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPlanFilter(p.id)
                    setPage(1)
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 border",
                    planFilter === p.id
                      ? "bg-purple-600 border-purple-500 text-white shadow-sm"
                      : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Transactions Table */}
      <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur overflow-hidden">
        <CardHeader className="p-4 pb-3 border-b border-slate-800/60">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="size-4 text-purple-400" />
              Transaction Records ({total})
            </CardTitle>
            {isFetching && <span className="text-xs text-purple-400 animate-pulse">Syncing...</span>}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 text-center text-slate-400">
              <RefreshCw className="size-6 animate-spin mx-auto text-purple-400 mb-2" />
              <p className="text-xs">Loading transaction history...</p>
            </div>
          ) : historyList.length === 0 ? (
            <div className="py-16 text-center text-slate-400 px-4">
              <History className="size-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No plan history records found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {search || planFilter !== "all"
                  ? "Try adjusting your search criteria or plan filter."
                  : "Plan changes, upgrades, and renewals will automatically be recorded here."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-950/40">
                  <TableRow className="border-slate-800/60 hover:bg-transparent">
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3">Customer / Church</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3">Plan Transition</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3">Date Upgraded</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3">Duration & Expiry</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3">Days Left</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3">Updated By</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-3 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyList.map((tx) => {
                    const initials = (tx.userName || tx.churchName || tx.userEmail || "U")
                      .split(" ")
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()

                    return (
                      <TableRow key={tx.id} className="border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                        {/* Customer */}
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8 rounded-lg bg-slate-800 border border-slate-700">
                              <AvatarFallback className="text-[11px] font-bold text-purple-300">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-slate-200 truncate">{tx.churchName || tx.userName || "Customer"}</span>
                              <span className="text-[11px] text-slate-400 truncate">{tx.userEmail}</span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Plan Transition */}
                        <TableCell className="py-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {getPlanBadge(tx.previousPlan)}
                            <ArrowRight className="size-3 text-slate-500 shrink-0" />
                            {getPlanBadge(tx.newPlan)}
                          </div>
                        </TableCell>

                        {/* Date Upgraded */}
                        <TableCell className="py-3 text-xs text-slate-300">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-200">{formatDate(tx.upgradedAt || tx.createdAt)}</span>
                            <span className="text-[10px] text-slate-500">{tx.transactionReference || "Admin action"}</span>
                          </div>
                        </TableCell>

                        {/* Duration & Expiry */}
                        <TableCell className="py-3">
                          <div className="flex flex-col text-xs">
                            <span className="font-semibold text-slate-300">
                              {tx.durationMonths ? `${tx.durationMonths} Month${tx.durationMonths > 1 ? "s" : ""}` : "Standard"}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Exp: {tx.newExpiryDate ? new Date(tx.newExpiryDate).toLocaleDateString() : "No expiry"}
                            </span>
                          </div>
                        </TableCell>

                        {/* Days Left */}
                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[11px] font-bold px-2 py-0.5",
                              tx.daysRemaining > 10
                                ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                                : tx.daysRemaining > 0
                                ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                                : "border-red-500/30 text-red-400 bg-red-500/10"
                            )}
                          >
                            {tx.daysRemaining > 0 ? `${tx.daysRemaining} days left` : "Expired"}
                          </Badge>
                        </TableCell>

                        {/* Updated By */}
                        <TableCell className="py-3">
                          <div className="flex flex-col text-xs">
                            <span className="font-medium text-slate-300">{tx.changedBy?.name || "Admin"}</span>
                            <span className="text-[10px] text-slate-500 capitalize">{tx.changedBy?.role || "admin"}</span>
                          </div>
                        </TableCell>

                        {/* Action View */}
                        <TableCell className="py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTx(tx)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                            title="View Transaction Details"
                          >
                            <Eye className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40">
              <span>
                Showing page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong> ({total} total)
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-7 px-2 border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40"
                >
                  <ChevronLeft className="size-3.5" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-7 px-2 border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40"
                >
                  Next <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <DialogContent className="border-slate-800 bg-slate-900 text-slate-200 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <History className="size-4 text-purple-400" />
              Plan Transition Receipt
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Complete transaction metadata and subscription entitlement details
            </DialogDescription>
          </DialogHeader>

          {selectedTx && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Customer</span>
                  <span className="font-bold text-white">{selectedTx.churchName || selectedTx.userName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Email</span>
                  <span className="text-slate-300 font-mono">{selectedTx.userEmail}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Reference ID</span>
                  <span className="text-purple-300 font-mono">{selectedTx.transactionReference || selectedTx.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Previous Plan</span>
                  <div className="mt-1">{getPlanBadge(selectedTx.previousPlan)}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400">New Plan</span>
                  <div className="mt-1">{getPlanBadge(selectedTx.newPlan)}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Upgraded On</span>
                  <span className="text-slate-200">{formatDate(selectedTx.upgradedAt || selectedTx.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Duration Added</span>
                  <span className="text-slate-200 font-semibold">
                    {selectedTx.durationMonths} Month{selectedTx.durationMonths > 1 ? "s" : ""} ({selectedTx.durationMonths * 30} Days)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">New Expiry Date</span>
                  <span className="text-slate-200">{formatDate(selectedTx.newExpiryDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Days Remaining</span>
                  <span className="text-emerald-400 font-bold">{selectedTx.daysRemaining} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Updated By</span>
                  <span className="text-slate-200">
                    {selectedTx.changedBy?.name} ({selectedTx.changedBy?.email || selectedTx.changedBy?.role || "admin"})
                  </span>
                </div>
                {selectedTx.reason && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400 block mb-0.5">Reason / Notes</span>
                    <span className="text-slate-300 italic">{selectedTx.reason}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
