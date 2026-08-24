import { useState, useRef, useEffect } from "react"
import { Link, Outlet, useLocation, useNavigate, Navigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  LayoutDashboard, Download, MessageSquare, Users,
  ChevronRight, LogOut, Menu, X, Bell, HelpCircle, Key,
  Lightbulb, Star, UserPlus, Sparkles, RefreshCw, CheckCheck
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollToTop } from "@/components/layout/ScrollToTop"
import { getAuthToken, clearAuthToken, API_BASE_URL } from "@/lib/api"
import {
  useAdminNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation
} from "@/lib/queries"
import { io, Socket } from "socket.io-client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  // Real-time live notifications query (with 15s fallback poll)
  const { data: notifData, refetch: refetchNotifs, isFetching: isRefreshingNotifs } = useAdminNotificationsQuery(undefined, {
    refetchInterval: 15000,
  })

  // Real-time WebSocket connection for instant push notifications
  useEffect(() => {
    let socket: Socket | null = null
    try {
      const socketUrl = API_BASE_URL.replace(/\/api\/?$/, "") || (typeof window !== "undefined" ? window.location.origin : "http://localhost:5000")
      socket = io(socketUrl, {
        transports: ["websocket", "polling"],
        reconnection: true,
      })

      socket.emit("join:admin")

      socket.on("admin:notification", (notification: any) => {
        refetchNotifs()
        toast.info(notification.title || "New Activity Alert", {
          description: notification.summary || "New update received on the admin console.",
          action: notification.targetUrl
            ? {
                label: "View",
                onClick: () => navigate(notification.targetUrl),
              }
            : undefined,
        })
      })
    } catch (err) {
      console.warn("[AdminLayout WebSocket] Notice:", err)
    }

    return () => {
      if (socket) socket.disconnect()
    }
  }, [refetchNotifs, navigate])

  // Close notification popover on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [notifOpen])

  // Auth Protection Guard: redirect immediately if not logged in
  const token = getAuthToken()
  const isAuth = typeof window !== "undefined" && localStorage.getItem("ocs_admin_authenticated") === "true"

  if (!token && !isAuth) {
    return <Navigate to={`/admin/login?redirect=${encodeURIComponent(location.pathname)}`} state={{ from: location }} replace />
  }

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("ocs_admin_user") || "{}")
    } catch {
      return {}
    }
  })()

  const adminName = storedUser.name || "WaveIO Master Admin"
  const adminEmail = storedUser.email || "waveio@ocs.app"
  const adminInitials = adminName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "AD"

  const counts = notifData?.counts || {
    totalUnread: 0,
    unreadSuggestions: 0,
    openTickets: 0,
  }

  const feed = notifData?.feed || []

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Bell, label: "Notifications", href: "/admin/notifications", badge: counts.totalUnread > 0 ? counts.totalUnread : null },
    { icon: Key, label: "Permissions & Plans", href: "/admin/permissions" },
    { icon: Users, label: "Users", href: "/admin/users" },
    {
      icon: Lightbulb,
      label: "Suggestions",
      href: "/admin/suggestions",
      badge: counts.unreadSuggestions > 0 ? counts.unreadSuggestions : null,
    },
    {
      icon: MessageSquare,
      label: "Complaints",
      href: "/admin/complaints",
      badge: counts.openTickets > 0 ? counts.openTickets : null,
    },
    { icon: Download, label: "Downloads", href: "/admin/downloads" },
    { icon: HelpCircle, label: "FAQs", href: "/admin/faqs" },
  ]

  const handleLogout = () => {
    clearAuthToken()
    localStorage.removeItem("ocs_admin_authenticated")
    localStorage.removeItem("ocs_admin_user")
    toast.success("Signed out successfully", {
      description: "You have been safely logged out of the admin console.",
    })
    navigate("/admin/login", { replace: true })
  }

  const markReadMutation = useMarkNotificationReadMutation()
  const markAllReadMutation = useMarkAllNotificationsReadMutation()

  const getFeedIcon = (type: string) => {
    switch (type) {
      case "suggestion":
        return <Lightbulb className="size-3.5 text-amber-400" />
      case "complaint":
        return <MessageSquare className="size-3.5 text-red-400" />
      case "download":
        return <Download className="size-3.5 text-cyan-400" />
      case "testimonial":
        return <Star className="size-3.5 text-purple-400" />
      default:
        return <UserPlus className="size-3.5 text-emerald-400" />
    }
  }

  const handleNotificationClick = (item: any) => {
    setNotifOpen(false)
    if (item.isUnread) {
      markReadMutation.mutate(item.id)
    }
    if (item.targetUrl) {
      navigate(item.targetUrl)
    } else if (item.type === "suggestion") {
      navigate("/admin/suggestions")
    } else if (item.type === "complaint") {
      navigate("/admin/complaints")
    } else if (item.type === "download") {
      navigate("/admin/downloads")
    } else if (item.type === "testimonial") {
      navigate("/admin/testimonials")
    } else if (item.type === "user") {
      navigate("/admin/users")
    } else {
      navigate("/admin")
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <ScrollToTop />
      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-950 border-r border-slate-800/60 fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-800/60">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-[12px] bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow shadow-purple-900/50">
              <span className="text-white font-black text-sm tracking-tighter">OCS</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm">OCS Admin</div>
              <div className="text-slate-500 text-[10px]">Platform Monitor</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = item.href === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-all group",
                  isActive
                    ? "bg-purple-600/20 text-purple-300 border border-purple-700/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                )}
              >
                <item.icon className={cn("size-4", isActive ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300")} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] px-1.5 py-0 h-4 rounded-[12px]">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800/60 space-y-2">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Avatar className="size-8">
              <AvatarFallback className="bg-purple-700 text-white text-xs font-bold">
                {adminInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">{adminName}</div>
              <div className="text-slate-500 text-[10px] truncate">{adminEmail}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-[8px] bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold cursor-pointer transition-colors"
          >
            <LogOut className="size-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Sidebar — Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 w-60 bg-slate-950 border-r border-slate-800/60 z-50 flex flex-col lg:hidden"
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-[12px] bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                    <span className="text-white font-black text-sm">OCS</span>
                  </div>
                  <span className="text-white font-bold text-sm">Admin</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 cursor-pointer">
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = item.href === "/admin"
                    ? location.pathname === "/admin"
                    : location.pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-all",
                        isActive
                          ? "bg-purple-600/20 text-purple-300 border border-purple-700/30"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      )}
                    >
                      <item.icon className="size-4" />
                      {item.label}
                      {item.badge && (
                        <Badge className="ml-auto bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] px-1.5 py-0 h-4">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </nav>
              <div className="p-4 border-t border-slate-800/60">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-2 rounded-[8px] bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold"
                >
                  <LogOut className="size-3.5" /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-slate-950 border-b border-slate-800/60 flex items-center justify-between px-6 sticky top-0 z-20">
          <button
            className="lg:hidden text-slate-400 hover:text-slate-200 cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-300 transition-colors">OCS Platform</Link>
            <ChevronRight className="size-3" />
            <span className="text-slate-300">Admin Dashboard</span>
          </div>

          <div className="flex items-center gap-3 ml-auto relative" ref={notifRef}>
            {/* Real-time Notification Bell */}
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              className={cn(
                "relative p-2 rounded-[8px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer",
                notifOpen ? "bg-slate-900 text-purple-300" : "hover:bg-slate-900"
              )}
              title="Activity & Notifications"
            >
              <Bell className="size-5" />
              {counts.totalUnread > 0 && (
                <span className="absolute top-1 right-1 size-2.5 rounded-full bg-purple-500 ring-2 ring-slate-950 animate-pulse" />
              )}
            </button>

            {/* Notification Popover Dropdown */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-80 sm:w-96 rounded-[14px] bg-slate-900 border border-slate-800 shadow-2xl shadow-purple-950/40 z-50 overflow-hidden flex flex-col"
                >
                  <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-purple-400" />
                      <span className="text-xs font-bold text-white">Live Activity Monitor</span>
                      {counts.totalUnread > 0 && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] px-1.5 py-0 h-4">
                          {counts.totalUnread} new
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {counts.totalUnread > 0 && (
                        <button
                          onClick={() => {
                            markAllReadMutation.mutate(undefined, {
                              onSuccess: () => toast.success("All marked as read"),
                            })
                          }}
                          disabled={markAllReadMutation.isPending}
                          className="text-slate-400 hover:text-emerald-400 p-1 rounded hover:bg-slate-800 transition-colors"
                          title="Mark all as read"
                        >
                          <CheckCheck className="size-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => refetchNotifs()}
                        className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
                        title="Refresh activity"
                      >
                        <RefreshCw className={cn("size-3.5", isRefreshingNotifs && "animate-spin text-purple-400")} />
                      </button>
                    </div>
                  </div>

                  {/* Feed List */}
                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60 scrollbar-thin">
                    {feed.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500">
                        No recent updates or alerts.
                      </div>
                    ) : (
                      feed.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleNotificationClick(item)}
                          className={cn(
                            "p-3 hover:bg-slate-800/60 transition-colors cursor-pointer flex gap-3 items-start",
                            item.isUnread ? "bg-slate-950/40" : ""
                          )}
                        >
                          <div className="size-7 rounded-[8px] bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                            {getFeedIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                              <span className="text-[10px] text-slate-500 shrink-0">
                                {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                              {item.summary}
                            </p>
                            <div className="flex items-center gap-2 pt-0.5">
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-slate-700 text-slate-400">
                                {item.badge}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 text-center">
                    <Link
                      to="/admin/notifications"
                      onClick={() => setNotifOpen(false)}
                      className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1"
                    >
                      View All Notifications & Activity →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2.5">
              <Avatar className="size-8 cursor-pointer">
                <AvatarFallback className="bg-purple-700 text-white text-xs font-bold">
                  {adminInitials}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 px-2 py-1 rounded-[6px] hover:bg-red-500/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="size-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
