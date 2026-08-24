import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import {
  Bell, MessageSquare, Lightbulb, Download, Star,
  CheckCircle2, RefreshCw, Filter, Sparkles, ArrowRight,
  ShieldCheck, Clock, ExternalLink
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAdminNotificationsQuery } from "@/lib/queries"
import { cn } from "@/lib/utils"

type CategoryFilter = "all" | "complaint" | "suggestion" | "download" | "testimonial"

export default function AdminNotifications() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<CategoryFilter>("all")

  const {
    data: notifData,
    isLoading,
    refetch,
    isFetching,
  } = useAdminNotificationsQuery({
    refetchInterval: 10000,
  })

  const feed = notifData?.feed || []
  const counts = notifData?.counts || {
    totalUnread: 0,
    unreadSuggestions: 0,
    openTickets: 0,
  }

  const filteredFeed = filter === "all"
    ? feed
    : feed.filter((item: any) => item.type === filter)

  const getIcon = (type: string) => {
    switch (type) {
      case "complaint":
        return <MessageSquare className="size-4 text-red-400" />
      case "suggestion":
        return <Lightbulb className="size-4 text-amber-400" />
      case "download":
        return <Download className="size-4 text-cyan-400" />
      case "testimonial":
        return <Star className="size-4 text-purple-400" />
      default:
        return <Bell className="size-4 text-blue-400" />
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "complaint":
        return "bg-red-500/15 text-red-400 border-red-500/30"
      case "suggestion":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30"
      case "download":
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
      case "testimonial":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30"
      default:
        return "bg-slate-700/30 text-slate-300 border-slate-700"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Notifications & Activity</h1>
            {counts.totalUnread > 0 && (
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-xs px-2 py-0.5">
                {counts.totalUnread} new
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time activity feed from connected church installations, support tickets, and community suggestions.
          </p>
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
            Refresh Feed
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/60 pb-3">
        {[
          { label: "All Activity", value: "all", count: feed.length },
          { label: "Support & Complaints", value: "complaint", count: feed.filter((f: any) => f.type === "complaint").length },
          { label: "Suggestions", value: "suggestion", count: feed.filter((f: any) => f.type === "suggestion").length },
          { label: "App Downloads", value: "download", count: feed.filter((f: any) => f.type === "download").length },
          { label: "Testimonials", value: "testimonial", count: feed.filter((f: any) => f.type === "testimonial").length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as CategoryFilter)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
              filter === tab.value
                ? "bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-md shadow-purple-950/40"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] text-slate-300">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <Card className="bg-slate-900 border-slate-800 rounded-[14px]">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              <RefreshCw className="size-6 animate-spin mx-auto mb-2 text-purple-400" />
              Loading real-time notifications...
            </div>
          ) : filteredFeed.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Sparkles className="size-8 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-400">No activity recorded in this category</p>
              <p className="text-xs text-slate-600">New alerts will appear here automatically via WebSocket stream.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {filteredFeed.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => item.targetUrl && navigate(item.targetUrl)}
                  className={cn(
                    "p-4 hover:bg-slate-800/50 transition-colors flex items-start gap-4 cursor-pointer",
                    item.isUnread ? "bg-purple-950/10" : ""
                  )}
                >
                  <div className="size-9 rounded-[10px] bg-slate-800 border border-slate-700/50 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-sm font-bold text-white tracking-tight">{item.title}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5", getBadgeColor(item.type))}>
                          {item.badge || item.category}
                        </Badge>
                        <span className="text-xs text-slate-500 shrink-0">
                          {item.timestamp ? new Date(item.timestamp).toLocaleString() : "Recently"}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {item.summary}
                    </p>
                  </div>

                  {item.targetUrl && (
                    <div className="shrink-0 pt-1 text-slate-500 hover:text-purple-400 transition-colors">
                      <ArrowRight className="size-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
