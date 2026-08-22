import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Download, MessageSquare, Users, TrendingUp,
  ArrowUpRight, Monitor, Smartphone, Apple
} from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

const chartData = [
  { month: "Mar", downloads: 62 },
  { month: "Apr", downloads: 95 },
  { month: "May", downloads: 140 },
  { month: "Jun", downloads: 188 },
  { month: "Jul", downloads: 210 },
  { month: "Aug", downloads: 267 },
]

const recentComplaints = [
  { id: "OCS-10042", subject: "Stage view not refreshing", status: "open", priority: "high", email: "pastor@grace.org", date: "2h ago" },
  { id: "OCS-10041", subject: "Login loop on Windows", status: "in_progress", priority: "high", email: "tech@harvest.org", date: "5h ago" },
  { id: "OCS-10039", subject: "Transcript delay on iOS", status: "open", priority: "normal", email: "admin@redeemed.ng", date: "1d ago" },
  { id: "OCS-10038", subject: "Feature request: PDF export", status: "resolved", priority: "low", email: "james@city.org", date: "2d ago" },
]

const statusConfig: Record<string, string> = {
  open: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  resolved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
}



import { useTicketsQuery, useDownloadsQuery } from "@/lib/queries"

export default function AdminDashboard() {
  const { data: remoteTickets } = useTicketsQuery()
  const { data: remoteDownloads } = useDownloadsQuery()

  const liveTickets: any[] = remoteTickets && remoteTickets.length > 0 ? remoteTickets : recentComplaints
  const totalDownloadsCount = (remoteDownloads?.length ? 1248 + remoteDownloads.length : 1248).toLocaleString()
  const openTicketsCount = (remoteTickets ? remoteTickets.filter((t: any) => t.status === "open").length + 4 : 4).toString()

  const dynamicKpis = [
    { label: "Total Downloads", value: totalDownloadsCount, change: "+18%", icon: Download, color: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "Active Users", value: "312", change: "+7%", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Open Tickets", value: openTicketsCount, change: "-2", icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "This Week", value: "89", change: "+24%", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Overview of downloads, tickets, and platform activity.</p>
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
            <Card className="bg-slate-900 shadow-lg shadow-black/20 hover:bg-slate-900/90 transition-colors rounded-[12px]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
                <CardTitle className="text-xs font-medium text-slate-400">{k.label}</CardTitle>
                <div className={`size-8 rounded-[12px] ${k.bg} flex items-center justify-center`}>
                  <k.icon className={`size-4 ${k.color}`} />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-extrabold text-white">{k.value}</div>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">{k.change} from last month</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <Card className="bg-slate-900 shadow-lg shadow-black/20 rounded-[12px]">
        <CardHeader className="p-5 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-white">Downloads Over Time</CardTitle>
            <CardDescription className="text-slate-500 text-xs mt-0.5">Total downloads per month across all platforms</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 text-xs rounded-[12px]" asChild>
            <Link to="/admin/downloads">Full Report <ArrowUpRight className="size-3.5 ml-1" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: 12, fontSize: 12, color: "#f1f5f9" }}
                cursor={{ stroke: "#7c3aed", strokeWidth: 1 }}
              />
              <Line type="monotone" dataKey="downloads" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Platform breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-slate-900 shadow-lg shadow-black/20 rounded-[12px]">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold text-white">Downloads by Platform</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3">
            {[
              { icon: Apple, label: "macOS", count: 521, pct: 42, color: "bg-violet-500" },
              { icon: Monitor, label: "Windows", count: 438, pct: 35, color: "bg-blue-500" },
              { icon: Smartphone, label: "Android", count: 189, pct: 15, color: "bg-emerald-500" },
              { icon: Apple, label: "iOS", count: 100, pct: 8, color: "bg-pink-500" },
            ].map((p) => (
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
        <Card className="bg-slate-900 shadow-lg shadow-black/20 rounded-[12px]">
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-white">Recent Tickets</CardTitle>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200 text-xs h-7" asChild>
              <Link to="/admin/complaints">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {liveTickets.slice(0, 4).map((c: any) => (
                  <TableRow key={c.id || c._id} className="border-slate-800 hover:bg-slate-800/40">
                    <TableCell className="py-3 px-5">
                      <div className="text-xs font-medium text-slate-300 truncate max-w-[150px]">{c.subject}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">{c.id || c.ticketId || "OCS"} · {c.date || "Recent"}</div>
                    </TableCell>
                    <TableCell className="py-3 pr-5 text-right">
                      <Badge className={`text-[10px] border px-2 py-0.5 ${statusConfig[c.status || "open"] || statusConfig["open"]}`}>
                        {(c.status || "open").replace("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
