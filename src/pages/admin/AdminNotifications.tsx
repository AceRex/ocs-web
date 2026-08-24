import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Bell, MessageSquare, Lightbulb, Download, Star,
  RefreshCw, Sparkles, ArrowRight, Check, CheckCheck,
  Trash2, EyeOff, UserPlus
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  useAdminNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkNotificationUnreadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useClearReadNotificationsMutation
} from "@/lib/queries"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type CategoryFilter = "all" | "unread" | "complaint" | "suggestion" | "download" | "testimonial" | "user"

export default function AdminNotifications() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<CategoryFilter>("all")
  const [notificationToDelete, setNotificationToDelete] = useState<any | null>(null)
  const [showClearReadModal, setShowClearReadModal] = useState(false)

  const {
    data: notifData,
    isLoading,
    refetch,
    isFetching,
  } = useAdminNotificationsQuery(undefined, {
    refetchInterval: 10000,
  })

  const markReadMutation = useMarkNotificationReadMutation()
  const markUnreadMutation = useMarkNotificationUnreadMutation()
  const markAllReadMutation = useMarkAllNotificationsReadMutation()
  const deleteMutation = useDeleteNotificationMutation()
  const clearReadMutation = useClearReadNotificationsMutation()

  const feed = notifData?.feed || []

  const filteredFeed = feed.filter((item: any) => {
    if (filter === "unread") return item.isUnread
    if (filter === "all") return true
    return item.type === filter
  })

  const unreadCount = feed.filter((item: any) => item.isUnread).length

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    markReadMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Marked as read")
      },
    })
  }

  const handleMarkAsUnread = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    markUnreadMutation.mutate(id, {
      onSuccess: () => {
        toast.info("Marked as unread")
      },
    })
  }

  const handleConfirmDeleteNotification = () => {
    if (!notificationToDelete) return
    deleteMutation.mutate(notificationToDelete.id, {
      onSuccess: () => {
        toast.success("Notification removed")
        setNotificationToDelete(null)
      },
    })
  }

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("All notifications marked as read")
      },
    })
  }

  const handleConfirmClearRead = () => {
    clearReadMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("All read notifications cleared")
        setShowClearReadModal(false)
      },
    })
  }

  const handleItemClick = (item: any) => {
    if (item.isUnread) {
      markReadMutation.mutate(item.id)
    }
    if (item.targetUrl) {
      navigate(item.targetUrl)
    }
  }

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
      case "user":
        return <UserPlus className="size-4 text-emerald-400" />
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
      case "user":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
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
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white">Notifications & Activity Feed</h1>
            {unreadCount > 0 && (
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-xs px-2.5 py-0.5">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage real-time activity, support inquiries, community feature requests, and system telemetry.
          </p>
        </div>

        {/* Global Notification Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={markAllReadMutation.isPending}
              className="border-purple-500/40 bg-purple-600/15 text-purple-200 hover:bg-purple-600/25 hover:text-white rounded-[10px] text-xs gap-1.5 cursor-pointer"
            >
              <CheckCheck className="size-3.5 text-purple-300" />
              {markAllReadMutation.isPending ? "Marking..." : "Mark All as Read"}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowClearReadModal(true)}
            disabled={clearReadMutation.isPending || feed.length === unreadCount}
            className="border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-[10px] text-xs gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Trash2 className="size-3.5" />
            Clear Read
          </Button>

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
          { label: "Unread", value: "unread", count: unreadCount, highlight: unreadCount > 0 },
          { label: "Support & Complaints", value: "complaint", count: feed.filter((f: any) => f.type === "complaint").length },
          { label: "Suggestions", value: "suggestion", count: feed.filter((f: any) => f.type === "suggestion").length },
          { label: "App Downloads", value: "download", count: feed.filter((f: any) => f.type === "download").length },
          { label: "Testimonials", value: "testimonial", count: feed.filter((f: any) => f.type === "testimonial").length },
          { label: "Registrations", value: "user", count: feed.filter((f: any) => f.type === "user").length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as CategoryFilter)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
              filter === tab.value
                ? "bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-md shadow-purple-950/40"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800",
              tab.highlight && filter !== tab.value ? "text-purple-300 border-purple-500/30" : ""
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px]",
                tab.highlight ? "bg-purple-500/30 text-purple-200" : "bg-black/40 text-slate-400"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <Card className="bg-slate-900 border-slate-800 rounded-[14px] overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              <RefreshCw className="size-6 animate-spin mx-auto mb-2 text-purple-400" />
              Loading real-time notifications...
            </div>
          ) : filteredFeed.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Sparkles className="size-8 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-400">
                {filter === "unread" ? "You're all caught up! No unread notifications." : "No activity recorded in this category"}
              </p>
              <p className="text-xs text-slate-600">New alerts will appear here automatically via WebSocket stream.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              <AnimatePresence initial={false}>
                {filteredFeed.map((item: any) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "p-4 hover:bg-slate-800/50 transition-colors flex items-start gap-4 cursor-pointer group relative",
                      item.isUnread ? "bg-purple-950/15" : ""
                    )}
                  >
                    {/* Unread Indicator Bar */}
                    {item.isUnread && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-r" />
                    )}

                    <div className="size-9 rounded-[10px] bg-slate-800 border border-slate-700/50 flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(item.type)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-sm tracking-tight",
                            item.isUnread ? "font-bold text-white" : "font-medium text-slate-300"
                          )}>
                            {item.title}
                          </span>
                          {item.isUnread && (
                            <span className="size-2 rounded-full bg-purple-400 animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 font-medium", getBadgeColor(item.type))}>
                            {item.badge || item.category}
                          </Badge>
                          <span className="text-xs text-slate-500 shrink-0 font-mono">
                            {item.timestamp ? new Date(item.timestamp).toLocaleString() : "Recently"}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                        {item.summary}
                      </p>
                    </div>

                    {/* Notification Actions */}
                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      {item.isUnread ? (
                        <button
                          onClick={(e) => handleMarkAsRead(e, item.id)}
                          title="Mark as read"
                          className="p-1.5 rounded-[8px] text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        >
                          <Check className="size-4" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleMarkAsUnread(e, item.id)}
                          title="Mark as unread"
                          className="p-1.5 rounded-[8px] text-slate-500 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                        >
                          <EyeOff className="size-4" />
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setNotificationToDelete(item)
                        }}
                        title="Archive notification"
                        className="p-1.5 rounded-[8px] text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>

                      {item.targetUrl && (
                        <div className="p-1.5 text-slate-500 group-hover:text-purple-400 transition-colors">
                          <ArrowRight className="size-4" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── DELETE SINGLE NOTIFICATION MODAL ── */}
      <Dialog open={!!notificationToDelete} onOpenChange={() => setNotificationToDelete(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-2">
              <Trash2 className="size-5" />
            </div>
            <DialogTitle className="text-base font-bold text-white">Archive Notification</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Are you sure you want to remove this alert from your active notifications feed?
            </DialogDescription>
          </DialogHeader>

          {notificationToDelete && (
            <div className="p-3 rounded-[8px] bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-white line-clamp-1">{notificationToDelete.title}</div>
              <div className="text-slate-400 text-[11px] line-clamp-2">{notificationToDelete.summary}</div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              onClick={() => setNotificationToDelete(null)}
              className="border-slate-800 text-slate-300 hover:bg-slate-900 text-xs rounded-[8px] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              disabled={deleteMutation.isPending}
              onClick={handleConfirmDeleteNotification}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-[8px] cursor-pointer"
            >
              {deleteMutation.isPending ? "Archiving..." : "Archive Alert"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── CLEAR ALL READ NOTIFICATIONS MODAL ── */}
      <Dialog open={showClearReadModal} onOpenChange={setShowClearReadModal}>
        <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-2">
              <Trash2 className="size-5" />
            </div>
            <DialogTitle className="text-base font-bold text-white">Clear Read Notifications</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Are you sure you want to clear all read alerts? Unread notifications will remain in your feed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowClearReadModal(false)}
              className="border-slate-800 text-slate-300 hover:bg-slate-900 text-xs rounded-[8px] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              disabled={clearReadMutation.isPending}
              onClick={handleConfirmClearRead}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-[8px] cursor-pointer"
            >
              {clearReadMutation.isPending ? "Clearing..." : "Clear Read Alerts"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
