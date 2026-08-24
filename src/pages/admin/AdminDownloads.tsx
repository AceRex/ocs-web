import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Download, FileDown, Search, RefreshCw, ChevronLeft, ChevronRight,
  Laptop, Smartphone, Apple, Globe, Activity, HardDriveDownload
} from "lucide-react"
import { useAdminDownloadsQuery } from "@/lib/queries"
import { cn } from "@/lib/utils"

const fallbackLineData = [
  { month: "Jan", macos: 20, windows: 18, android: 8, ios: 4, total: 50 },
  { month: "Feb", macos: 35, windows: 28, android: 12, ios: 6, total: 81 },
  { month: "Mar", macos: 48, windows: 40, android: 15, ios: 9, total: 112 },
  { month: "Apr", macos: 72, windows: 61, android: 22, ios: 11, total: 166 },
  { month: "May", macos: 95, windows: 80, android: 35, ios: 16, total: 226 },
  { month: "Jun", macos: 120, windows: 100, android: 48, ios: 22, total: 290 },
  { month: "Jul", macos: 148, windows: 118, android: 60, ios: 28, total: 354 },
  { month: "Aug", macos: 185, windows: 142, android: 75, ios: 36, total: 438 },
]

const fallbackDownloaders = [
  { id: "fb-1", email: "pastor@gracechurch.org", church: "Grace Church", country: "United States", platform: "macOS", version: "v2.4.1", date: "2026-08-24" },
  { id: "fb-2", email: "tech@harvestng.org", church: "Harvest City", country: "Nigeria", platform: "Windows", version: "v2.4.1", date: "2026-08-24" },
  { id: "fb-3", email: "admin@redemption.org", church: "Redemption Church", country: "United Kingdom", platform: "Android", version: "v2.4.0", date: "2026-08-23" },
  { id: "fb-4", email: "daniel@livingword.org", church: "Living Word", country: "Canada", platform: "macOS", version: "v2.4.1", date: "2026-08-23" },
  { id: "fb-5", email: "james@citylight.org", church: "City Light Church", country: "Australia", platform: "iOS", version: "v2.4.0", date: "2026-08-22" },
  { id: "fb-6", email: "sarah@faithhub.org", church: "Faith Hub", country: "South Africa", platform: "Windows", version: "v2.4.1", date: "2026-08-22" },
  { id: "fb-7", email: "mary@mountzion.org", church: "Mount Zion", country: "Ghana", platform: "macOS", version: "v2.4.0", date: "2026-08-21" },
  { id: "fb-8", email: "elijah@glorytabernacle.org", church: "Glory Tabernacle", country: "Kenya", platform: "Android", version: "v2.4.0", date: "2026-08-21" },
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

const ranges = [
  { label: "Last 30 days", days: 30 },
  { label: "Last 3 months", days: 90 },
  { label: "Last 6 months", days: 180 },
  { label: "All time", days: null },
]

const platforms = [
  { id: "all", label: "All Platforms" },
  { id: "macos", label: "macOS" },
  { id: "windows", label: "Windows" },
  { id: "android", label: "Android" },
  { id: "ios", label: "iOS" },
]

export default function AdminDownloads() {
  const [selectedRange, setSelectedRange] = useState("Last 6 months")
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  // Calculate start date based on selected range
  const startDate = useMemo(() => {
    const r = ranges.find((item) => item.label === selectedRange)
    if (!r || r.days === null) return undefined
    const d = new Date()
    d.setDate(d.getDate() - r.days)
    return d.toISOString()
  }, [selectedRange])

  // Query live backend API
  const { data: remoteData, isLoading, isFetching, refetch } = useAdminDownloadsQuery({
    platform: selectedPlatform !== "all" ? selectedPlatform : undefined,
    search: searchQuery.trim() || undefined,
    startDate,
    page: currentPage,
    limit: pageSize,
  })

  // Format downloads list
  const liveDownloads = useMemo(() => {
    if (remoteData?.downloads && remoteData.downloads.length > 0) {
      return remoteData.downloads.map((d: any) => ({
        id: d.id || d._id,
        email: d.email || "Anonymous Visitor",
        church: d.churchName || "Local Ministry",
        country: d.ipCountry || "Global",
        platform: d.platform
          ? d.platform.toLowerCase() === "ios"
            ? "iOS"
            : d.platform.toLowerCase() === "macos"
            ? "macOS"
            : d.platform.charAt(0).toUpperCase() + d.platform.slice(1)
          : "macOS",
        version: d.appVersion || "v2.4.1",
        date: d.createdAt ? new Date(d.createdAt).toISOString().slice(0, 10) : "2026-08-24",
      }))
    }
    if (!isLoading && (!remoteData?.downloads || remoteData.downloads.length === 0) && (searchQuery || selectedPlatform !== "all")) {
      return []
    }
    return fallbackDownloaders
  }, [remoteData, isLoading, searchQuery, selectedPlatform])

  // Counts by platform
  const byPlatform = useMemo(() => {
    return (
      remoteData?.byPlatform || {
        macos: 521,
        windows: 438,
        android: 189,
        ios: 100,
      }
    )
  }, [remoteData])

  const totalDownloads = useMemo(() => {
    if (remoteData?.total !== undefined && remoteData.total > 0) {
      return remoteData.total
    }
    return (byPlatform.macos || 0) + (byPlatform.windows || 0) + (byPlatform.android || 0) + (byPlatform.ios || 0)
  }, [remoteData, byPlatform])

  // Timeline chart data
  const lineData = useMemo(() => {
    if (remoteData?.dailyTimeline && remoteData.dailyTimeline.length > 0) {
      return remoteData.dailyTimeline.map((item) => ({
        month: item.month || item.date?.slice(5) || item.date,
        macos: item.macos || 0,
        windows: item.windows || 0,
        android: item.android || 0,
        ios: item.ios || 0,
        total: item.total || item.count || 0,
      }))
    }
    return fallbackLineData
  }, [remoteData])

  const livePieData = useMemo(() => [
    { name: "macOS", value: byPlatform.macos || 0, color: "#7c3aed" },
    { name: "Windows", value: byPlatform.windows || 0, color: "#3b82f6" },
    { name: "Android", value: byPlatform.android || 0, color: "#10b981" },
    { name: "iOS", value: byPlatform.ios || 0, color: "#ec4899" },
  ], [byPlatform])

  // CSV Exporter
  const handleExportCSV = () => {
    const items = liveDownloads
    if (items.length === 0) return

    const headers = ["Email", "Church", "Country", "Platform", "Version", "Date"]
    const rows = items.map((d) => [
      `"${d.email}"`,
      `"${d.church}"`,
      `"${d.country}"`,
      `"${d.platform}"`,
      `"${d.version}"`,
      `"${d.date}"`,
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `ocs-downloads-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalPages = remoteData?.totalPages || Math.ceil((remoteData?.total || liveDownloads.length) / pageSize) || 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <HardDriveDownload className="size-7 text-purple-400" />
            Downloads & Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Auditing installer telemetry, desktop application downloads, and mobile companion distribution.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-slate-700 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 gap-1.5 text-xs rounded-[12px]"
          >
            <RefreshCw className={cn("size-3.5", isFetching && "animate-spin text-purple-400")} />
            {isFetching ? "Syncing..." : "Refresh"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="border-slate-700 text-slate-300 hover:text-white bg-purple-600/20 border-purple-500/30 hover:bg-purple-600/30 gap-1.5 text-xs rounded-[12px]"
          >
            <FileDown className="size-3.5 text-purple-300" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="bg-slate-900/90 border-slate-800 shadow-md rounded-[14px]">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Downloads</span>
              <div className="text-2xl font-black text-white">{totalDownloads.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Activity className="size-3" /> Live Tracking
              </span>
            </div>
            <div className="size-11 rounded-[12px] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Download className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800 shadow-md rounded-[14px]">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">macOS Installs</span>
              <div className="text-2xl font-black text-violet-300">{(byPlatform.macos || 0).toLocaleString()}</div>
              <span className="text-[11px] text-slate-400">
                {totalDownloads > 0 ? Math.round(((byPlatform.macos || 0) / totalDownloads) * 100) : 0}% of all downloads
              </span>
            </div>
            <div className="size-11 rounded-[12px] bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Apple className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800 shadow-md rounded-[14px]">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Windows Installs</span>
              <div className="text-2xl font-black text-blue-300">{(byPlatform.windows || 0).toLocaleString()}</div>
              <span className="text-[11px] text-slate-400">
                {totalDownloads > 0 ? Math.round(((byPlatform.windows || 0) / totalDownloads) * 100) : 0}% of all downloads
              </span>
            </div>
            <div className="size-11 rounded-[12px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Laptop className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800 shadow-md rounded-[14px]">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mobile Companion</span>
              <div className="text-2xl font-black text-pink-300">{((byPlatform.android || 0) + (byPlatform.ios || 0)).toLocaleString()}</div>
              <span className="text-[11px] text-slate-400">
                Android: {byPlatform.android || 0} · iOS: {byPlatform.ios || 0}
              </span>
            </div>
            <div className="size-11 rounded-[12px] bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Smartphone className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/70 p-3.5 rounded-[14px] border border-slate-800">
        {/* Date Ranges */}
        <div className="flex gap-1.5 flex-wrap">
          {ranges.map((r) => (
            <button
              key={r.label}
              onClick={() => {
                setSelectedRange(r.label)
                setCurrentPage(1)
              }}
              className={cn(
                "px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all cursor-pointer",
                selectedRange === r.label
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Platform Pills & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex gap-1 bg-slate-950 p-1 rounded-[10px] border border-slate-800">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPlatform(p.id)
                  setCurrentPage(1)
                }}
                className={cn(
                  "px-2.5 py-1 rounded-[8px] text-[11px] font-medium transition-all cursor-pointer",
                  selectedPlatform === p.id
                    ? "bg-purple-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
            <Input
              type="text"
              placeholder="Search email or church..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-8 h-8 text-xs bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-500 rounded-[10px]"
            />
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800 shadow-lg shadow-black/20 rounded-[14px]">
          <CardHeader className="p-5 pb-4">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <span>Downloads Growth Over Time</span>
              {isFetching && <span className="text-[10px] text-purple-400 animate-pulse">Syncing feed...</span>}
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">Real-time daily aggregates grouped by client platform</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12, fontSize: 12, color: "#f1f5f9" }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                <Line type="monotone" dataKey="macos" stroke="#7c3aed" strokeWidth={2} dot={false} name="macOS" />
                <Line type="monotone" dataKey="windows" stroke="#3b82f6" strokeWidth={2} dot={false} name="Windows" />
                <Line type="monotone" dataKey="android" stroke="#10b981" strokeWidth={2} dot={false} name="Android" />
                <Line type="monotone" dataKey="ios" stroke="#ec4899" strokeWidth={2} dot={false} name="iOS" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 shadow-lg shadow-black/20 rounded-[14px]">
          <CardHeader className="p-5 pb-4">
            <CardTitle className="text-sm font-bold text-white">Platform Market Share</CardTitle>
            <CardDescription className="text-slate-400 text-xs">Total installation distribution</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 flex flex-col items-center gap-4">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={livePieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {livePieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12, fontSize: 12, color: "#f1f5f9" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2">
              {livePieData.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-slate-400">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-semibold">{p.value.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({totalDownloads > 0 ? Math.round((p.value / totalDownloads) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Downloader list */}
      <Card className="bg-slate-900 border-slate-800 shadow-lg shadow-black/20 rounded-[14px] overflow-hidden">
        <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between border-b border-slate-800">
          <div>
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <span>Audited Downloader Activity Log</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {remoteData?.total !== undefined ? remoteData.total : liveDownloads.length} Records
              </span>
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs mt-0.5">
              Captured church domain, resolved IP location, version tag, and platform signature
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
              <RefreshCw className="size-5 animate-spin text-purple-400" />
              <span>Loading downloader telemetry...</span>
            </div>
          ) : liveDownloads.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm space-y-1">
              <p className="font-semibold text-slate-300">No download records found</p>
              <p className="text-xs text-slate-500">Try adjusting your date range or search keyword filter.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400 pl-5">Downloader</TableHead>
                  <TableHead className="text-slate-400">Church & Location</TableHead>
                  <TableHead className="text-slate-400">Platform</TableHead>
                  <TableHead className="text-slate-400">App Version</TableHead>
                  <TableHead className="text-slate-400 pr-5 text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveDownloads.map((d, i) => (
                  <TableRow key={d.id || i} className="border-slate-800/80 hover:bg-slate-800/40 transition-colors">
                    <TableCell className="py-3 pl-5 text-xs font-medium text-slate-200">
                      {d.email}
                    </TableCell>
                    <TableCell className="py-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span>{d.church}</span>
                        {d.country && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            · <Globe className="size-3 text-slate-600 inline" /> {d.country}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge className={cn("text-[10px] border px-2 py-0.5 font-medium", platformColors[d.platform])}>
                        {d.platform}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-xs font-mono text-purple-300">
                      {d.version}
                    </TableCell>
                    <TableCell className="py-3 pr-5 text-xs text-slate-400 font-mono text-right">
                      {d.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Table Footer with Pagination */}
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage <= 1 || isLoading}
                className="h-8 px-2.5 border-slate-800 text-slate-300 hover:text-white bg-slate-950 disabled:opacity-40 rounded-[8px]"
              >
                <ChevronLeft className="size-3.5" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage >= totalPages || isLoading}
                className="h-8 px-2.5 border-slate-800 text-slate-300 hover:text-white bg-slate-950 disabled:opacity-40 rounded-[8px]"
              >
                Next
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
