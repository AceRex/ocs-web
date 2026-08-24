import { useState } from "react"
import { motion } from "framer-motion"
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileDown } from "lucide-react"
import { useAdminDownloadsQuery } from "@/lib/queries"
import { cn } from "@/lib/utils"

const fallbackLineData = [
  { month: "Jan", macos: 20, windows: 18, android: 8, ios: 4 },
  { month: "Feb", macos: 35, windows: 28, android: 12, ios: 6 },
  { month: "Mar", macos: 48, windows: 40, android: 15, ios: 9 },
  { month: "Apr", macos: 72, windows: 61, android: 22, ios: 11 },
  { month: "May", macos: 95, windows: 80, android: 35, ios: 16 },
  { month: "Jun", macos: 120, windows: 100, android: 48, ios: 22 },
  { month: "Jul", macos: 148, windows: 118, android: 60, ios: 28 },
  { month: "Aug", macos: 185, windows: 142, android: 75, ios: 36 },
]

const fallbackDownloaders = [
  { email: "pastor@gracechurch.org", church: "Grace Church", platform: "macOS", version: "v2.4.1", date: "2026-08-22" },
  { email: "tech@harvestng.org", church: "Harvest City", platform: "Windows", version: "v2.4.1", date: "2026-08-22" },
  { email: "admin@redemption.org", church: "Redemption Church", platform: "Android", version: "v2.4.0", date: "2026-08-21" },
  { email: "daniel@livingword.org", church: "Living Word", platform: "macOS", version: "v2.4.1", date: "2026-08-21" },
  { email: "james@citylight.org", church: "City Light Church", platform: "iOS", version: "v2.4.0", date: "2026-08-20" },
  { email: "sarah@faithhub.org", church: "Faith Hub", platform: "Windows", version: "v2.4.1", date: "2026-08-20" },
  { email: "mary@mountzion.org", church: "Mount Zion", platform: "macOS", version: "v2.4.0", date: "2026-08-19" },
  { email: "elijah@glorytabernacle.org", church: "Glory Tabernacle", platform: "Android", version: "v2.4.0", date: "2026-08-19" },
]

const platformColors: Record<string, string> = {
  macOS: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  macos: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  Windows: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  windows: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Android: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  android: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  iOS: "bg-pink-500/15 text-pink-400 border-pink-500/20",
  ios: "bg-pink-500/15 text-pink-400 border-pink-500/20",
}

const ranges = ["Last 30 days", "Last 3 months", "Last 6 months", "All time"]

export default function AdminDownloads() {
  const [range, setRange] = useState("Last 6 months")
  const { data: remoteData } = useAdminDownloadsQuery()

  const liveDownloads = remoteData?.downloads && remoteData.downloads.length > 0
    ? remoteData.downloads.map((d: any) => ({
        email: d.email || "Anonymous",
        church: d.churchName || d.ipCountry || "Worldwide Ministry",
        platform: d.platform ? (d.platform.toLowerCase() === "ios" ? "iOS" : d.platform.toLowerCase() === "macos" ? "macOS" : d.platform.charAt(0).toUpperCase() + d.platform.slice(1)) : "macOS",
        version: d.appVersion || "v2.4.1",
        date: d.createdAt ? new Date(d.createdAt).toISOString().slice(0, 10) : "2026-08-24",
      }))
    : fallbackDownloaders

  const byPlatform = remoteData?.byPlatform || { macos: 521, windows: 438, android: 189, ios: 100 }
  const lineData = fallbackLineData
  const livePieData = [
    { name: "macOS", value: byPlatform.macos || 0, color: "#7c3aed" },
    { name: "Windows", value: byPlatform.windows || 0, color: "#3b82f6" },
    { name: "Android", value: byPlatform.android || 0, color: "#10b981" },
    { name: "iOS", value: byPlatform.ios || 0, color: "#ec4899" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Downloads</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track downloads by platform, version, and downloader.</p>
        </div>
        <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-slate-200 bg-transparent hover:bg-slate-800 gap-2">
          <FileDown className="size-4" />
          Export CSV
        </Button>
      </div>

      {/* Date range filter */}
      <div className="flex gap-2 flex-wrap">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={cn(
              "px-3 py-1.5 rounded-[12px] text-xs font-medium transition-all cursor-pointer",
              range === r
                ? "bg-purple-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-slate-900 shadow-lg shadow-black/20 rounded-[12px]">
          <CardHeader className="p-5 pb-4">
            <CardTitle className="text-sm font-bold text-white">Downloads Over Time</CardTitle>
            <CardDescription className="text-slate-500 text-xs">Broken down by platform</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: 12, fontSize: 12, color: "#f1f5f9" }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                <Line type="monotone" dataKey="macos" stroke="#7c3aed" strokeWidth={2} dot={false} name="macOS" />
                <Line type="monotone" dataKey="windows" stroke="#3b82f6" strokeWidth={2} dot={false} name="Windows" />
                <Line type="monotone" dataKey="android" stroke="#10b981" strokeWidth={2} dot={false} name="Android" />
                <Line type="monotone" dataKey="ios" stroke="#ec4899" strokeWidth={2} dot={false} name="iOS" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 shadow-lg shadow-black/20 rounded-[12px]">
          <CardHeader className="p-5 pb-4">
            <CardTitle className="text-sm font-bold text-white">By Platform</CardTitle>
            <CardDescription className="text-slate-500 text-xs">Total distribution</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 flex flex-col items-center gap-4">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={livePieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {livePieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: 12, fontSize: 12, color: "#f1f5f9" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2">
              {livePieData.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-slate-400">{p.name}</span>
                  </div>
                  <span className="text-slate-300 font-medium">{p.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Downloader list */}
      <Card className="bg-slate-900 shadow-lg shadow-black/20 rounded-[12px]">
        <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-white">Downloader List</CardTitle>
            <CardDescription className="text-slate-500 text-xs mt-0.5">Captured email, church, and platform at download time</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 gap-1.5 text-xs rounded-[12px]">
            <Download className="size-3.5" />
            Export
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-500 pl-5">Email</TableHead>
                <TableHead className="text-slate-500">Church</TableHead>
                <TableHead className="text-slate-500">Platform</TableHead>
                <TableHead className="text-slate-500">Version</TableHead>
                <TableHead className="text-slate-500 pr-5">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liveDownloads.map((d, i) => (
                <TableRow key={i} className="border-slate-800 hover:bg-slate-800/40">
                  <TableCell className="py-3 pl-5 text-xs text-slate-300">{d.email}</TableCell>
                  <TableCell className="py-3 text-xs text-slate-400">{d.church}</TableCell>
                  <TableCell className="py-3">
                    <Badge className={cn("text-[10px] border px-2 py-0.5", platformColors[d.platform])}>
                      {d.platform}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-xs font-mono text-slate-500">{d.version}</TableCell>
                  <TableCell className="py-3 pr-5 text-xs text-slate-500">{d.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
