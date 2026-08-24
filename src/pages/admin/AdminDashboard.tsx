import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Download, MessageSquare, Users,
  ArrowUpRight, Monitor, Smartphone, Apple,
  ShieldCheck, Sliders, Sparkles, CheckCircle2
} from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { useTicketsQuery, useUsersQuery, useAdminDownloadsQuery } from "@/lib/queries"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, string> = {
  open: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  resolved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
}

export default function AdminDashboard() {
  const { data: remoteTickets } = useTicketsQuery()
  const { data: remoteDownloadsAdmin } = useAdminDownloadsQuery()
  const { data: remoteCustomers } = useUsersQuery()

  const customers = remoteCustomers || []
  const liveTickets = remoteTickets || []

  // Dynamic real count calculation across active subscription tiers
  const planCounts = {
    trial: customers.filter((c: any) => (c.subscriptionTier || c.effectiveTier || "trial") === "trial").length,
    mini: customers.filter((c: any) => (c.subscriptionTier || c.effectiveTier) === "mini").length,
    standard: customers.filter((c: any) => (c.subscriptionTier || c.effectiveTier) === "standard").length,
    large: customers.filter((c: any) => (c.subscriptionTier || c.effectiveTier) === "large").length,
    premium: customers.filter((c: any) => (c.subscriptionTier || c.effectiveTier) === "premium").length,
    free: customers.filter((c: any) => (c.subscriptionTier || c.effectiveTier) === "free").length,
  }

  const totalDownloads = remoteDownloadsAdmin?.total ?? 0
  const openTicketsCount = liveTickets.filter((t: any) => t.status === "open").length
  const activeCustomersCount = customers.length

  const byPlatform = remoteDownloadsAdmin?.byPlatform || {
    macos: 0,
    windows: 0,
    android: 0,
    ios: 0,
  }

  const platformTotal = (byPlatform.macos + byPlatform.windows + byPlatform.android + byPlatform.ios) || (totalDownloads > 0 ? totalDownloads : 1)

  const platformBreakdown = [
    { icon: Apple, label: "macOS", count: byPlatform.macos || 0, pct: Math.round(((byPlatform.macos || 0) / platformTotal) * 100), color: "bg-violet-500" },
    { icon: Monitor, label: "Windows", count: byPlatform.windows || 0, pct: Math.round(((byPlatform.windows || 0) / platformTotal) * 100), color: "bg-blue-500" },
    { icon: Smartphone, label: "Android", count: byPlatform.android || 0, pct: Math.round(((byPlatform.android || 0) / platformTotal) * 100), color: "bg-emerald-500" },
    { icon: Apple, label: "iOS", count: byPlatform.ios || 0, pct: Math.round(((byPlatform.ios || 0) / platformTotal) * 100), color: "bg-pink-500" },
  ]

  // Chart data built from real download history timeline
  const chartData = (remoteDownloadsAdmin?.dailyTimeline && remoteDownloadsAdmin.dailyTimeline.length > 0)
    ? remoteDownloadsAdmin.dailyTimeline.map((item: any) => ({
        month: item.date?.slice(5) || item.month || "Day",
        downloads: item.count || 0,
      }))
    : [
        { month: "Day 1", downloads: Math.round(totalDownloads * 0.1) },
        { month: "Day 5", downloads: Math.round(totalDownloads * 0.25) },
        { month: "Day 10", downloads: Math.round(totalDownloads * 0.45) },
        { month: "Day 15", downloads: Math.round(totalDownloads * 0.65) },
        { month: "Day 20", downloads: Math.round(totalDownloads * 0.85) },
        { month: "Today", downloads: totalDownloads },
      ]

  const dynamicKpis = [
    { label: "Total Downloads", value: totalDownloads.toLocaleString(), change: "All Platforms", icon: Download, color: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "Active Accounts", value: activeCustomersCount.toString(), change: "Registered Ministries", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Open Tickets", value: openTicketsCount.toString(), change: openTicketsCount === 0 ? "All Resolved" : "Requires Attention", icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Active 2-Mo Trials", value: planCounts.trial.toString(), change: "60-Day Evaluation", icon: Sparkles, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Live platform metrics on subscriptions, downloads, and customer activity.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white rounded-[10px] text-xs gap-1.5 cursor-pointer" asChild>
            <Link to="/admin/permissions">
              <ShieldCheck className="size-3.5 text-purple-400" />
              Permissions Matrix
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white rounded-[10px] text-xs gap-1.5 cursor-pointer" asChild>
            <Link to="/admin/users">
              <Sliders className="size-3.5 text-cyan-400" />
              Manage Users & Plans
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicKpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card className="bg-slate-900 border-slate-800 shadow-lg shadow-black/20 hover:bg-slate-850 transition-colors rounded-[14px]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
                <CardTitle className="text-xs font-medium text-slate-400">{k.label}</CardTitle>
                <div className={`size-8 rounded-[10px] ${k.bg} flex items-center justify-center`}>
                  <k.icon className={`size-4 ${k.color}`} />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-extrabold text-white">{k.value}</div>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{k.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Subscription Plans Distribution */}
      <Card className="bg-slate-900 border-slate-800 rounded-[16px] shadow-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="size-4 text-purple-400" />
              Active Subscription Tiers & Customer Distribution
            </h2>
            <p className="text-xs text-slate-500">Live breakdown of registered ministry accounts across all tiers</p>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-purple-400 hover:text-purple-300 h-7 cursor-pointer" asChild>
            <Link to="/admin/users">View Customer Table <ArrowUpRight className="size-3 ml-1" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: "trial", label: "2-Mo Free Trial", price: "$0 / 2mo", count: planCounts.trial, color: "border-purple-500/40 bg-purple-500/10 text-purple-300" },
            { id: "mini", label: "Mini Setup", price: "$2 / 6mo", count: planCounts.mini, color: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
            { id: "standard", label: "Standard Setup", price: "$3 / 6mo", count: planCounts.standard, color: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300" },
            { id: "large", label: "Large Setup", price: "$5 / 6mo", count: planCounts.large, color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300" },
            { id: "premium", label: "Premium Tier", price: "Custom", count: planCounts.premium, color: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
            { id: "free", label: "Free Mode", price: "Basic", count: planCounts.free, color: "border-slate-500/40 bg-slate-500/10 text-slate-300" },
          ].map((plan) => (
            <div key={plan.id} className={`p-3 rounded-[12px] border ${plan.color} flex flex-col justify-between space-y-2`}>
              <div>
                <div className="text-[11px] font-bold text-white truncate">{plan.label}</div>
                <div className="text-[10px] text-slate-400">{plan.price}</div>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xl font-black text-white">{plan.count}</span>
                <span className="text-[10px] text-slate-400">users</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chart */}
      <Card className="bg-slate-900 border-slate-800 shadow-lg shadow-black/20 rounded-[14px]">
        <CardHeader className="p-5 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-white">Downloads Timeline</CardTitle>
            <CardDescription className="text-slate-500 text-xs mt-0.5">Total software installations over time</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 text-xs rounded-[10px] cursor-pointer" asChild>
            <Link to="/admin/downloads">Full Downloads Report <ArrowUpRight className="size-3.5 ml-1" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12, fontSize: 12, color: "#f1f5f9" }}
                cursor={{ stroke: "#7c3aed", strokeWidth: 1 }}
              />
              <Line type="monotone" dataKey="downloads" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Platform breakdown & Recent Complaints */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-slate-800 shadow-lg shadow-black/20 rounded-[14px]">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold text-white">Downloads by Platform</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3">
            {platformBreakdown.map((p) => (
              <div key={p.label} className="flex items-center gap-3">
                <p.icon className="size-4 text-slate-400 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{p.label}</span>
                    <span className="text-slate-500">{p.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
                <span className="text-xs text-slate-500 w-8 text-right">{p.pct}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Complaints */}
        <Card className="bg-slate-900 border-slate-800 shadow-lg shadow-black/20 rounded-[14px]">
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-white">Recent Support Inquiries</CardTitle>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200 text-xs h-7 cursor-pointer" asChild>
              <Link to="/admin/complaints">View All Tickets</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {liveTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="size-6 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                No pending support tickets.
              </div>
            ) : (
              <Table>
                <TableBody>
                  {liveTickets.slice(0, 4).map((c: any) => (
                    <TableRow key={c.id || c._id} className="border-slate-800/80 hover:bg-slate-800/40">
                      <TableCell className="py-3 px-5">
                        <div className="text-xs font-medium text-slate-200 truncate max-w-[180px]">{c.subject}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{c.email || "User"} · {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Recent"}</div>
                      </TableCell>
                      <TableCell className="py-3 pr-5 text-right">
                        <Badge className={cn("text-[10px] border px-2 py-0.5", statusConfig[c.status || "open"] || statusConfig["open"])}>
                          {(c.status || "open").replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
