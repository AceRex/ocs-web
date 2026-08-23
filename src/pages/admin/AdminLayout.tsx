import { useState } from "react"
import { Link, Outlet, useLocation, useNavigate, Navigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  LayoutDashboard, Download, MessageSquare, Users,
  Settings, ChevronRight, LogOut, Menu, X, Bell, HelpCircle, Key
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollToTop } from "@/components/layout/ScrollToTop"
import { getAuthToken, clearAuthToken } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Key, label: "Permissions & Plans", href: "/admin/permissions" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Download, label: "Downloads", href: "/admin/downloads" },
  { icon: HelpCircle, label: "FAQs", href: "/admin/faqs" },
  { icon: MessageSquare, label: "Complaints", href: "/admin/complaints", badge: 4 },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  const handleLogout = () => {
    clearAuthToken()
    localStorage.removeItem("ocs_admin_authenticated")
    localStorage.removeItem("ocs_admin_user")
    toast.success("Signed out successfully", {
      description: "You have been safely logged out of the admin console.",
    })
    navigate("/admin/login", { replace: true })
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
              <div className="text-slate-500 text-[10px]">Platform Dashboard</div>
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
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] px-1.5 py-0 h-4 rounded-[12px]">
                    {item.badge}
                  </Badge>
                )}
                {isActive && <ChevronRight className="size-3 text-purple-400" />}
              </Link>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3 p-2 rounded-[12px] hover:bg-slate-800/60 transition-colors">
            <Avatar className="size-8 rounded-[12px]">
              <AvatarFallback className="bg-purple-700 text-white text-xs font-bold rounded-[12px]">
                {adminInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-200 font-medium truncate">{adminName}</div>
              <div className="text-[10px] text-slate-500 truncate">{adminEmail}</div>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-[8px] transition-colors cursor-pointer"
              title="Sign out of admin console"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-60 bg-slate-950 border-r border-slate-800/60 flex flex-col"
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
                        <Badge className="ml-auto bg-red-500/20 text-red-400 border-red-500/30 text-[10px] px-1.5 py-0 h-4">
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

      {/* Main */}
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
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
              <Bell className="size-5" />
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-red-500" />
            </button>
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
