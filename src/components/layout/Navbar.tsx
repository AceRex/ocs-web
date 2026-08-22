import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Download", href: "/download" },
  { label: "Support", href: "/support" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setMobileOpen(false), [location])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none"
    >
      <div className={cn(
        "container mx-auto h-14 max-w-4xl px-4 sm:px-6 rounded-full flex items-center justify-between pointer-events-auto transition-all duration-300",
        "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 shadow-lg shadow-purple-900/5 ring-1 ring-purple-100/50"
      )}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="size-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-md shadow-purple-300/40 group-hover:shadow-purple-400/50 transition-all">
            <span className="text-white font-black text-sm tracking-tighter">OCS</span>
          </div>
          <div className="font-bold text-slate-900 dark:text-white tracking-tight">
            OCS Platform
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-700",
                location.pathname === link.href
                  ? "text-purple-700"
                  : "text-slate-600 dark:text-slate-300"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-purple-700">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button variant="gradient" size="sm" asChild>
            <Link to="/download" className="flex items-center gap-1.5">
              <Download className="size-3.5" />
              Download
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-purple-50 text-slate-700 transition-colors cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-purple-100/60 overflow-hidden"
          >
            <div className="container px-6 py-4 space-y-3 max-w-7xl mx-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-purple-700 py-2"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-purple-100/60">
                <Button variant="outline-purple" size="sm" asChild className="flex-1">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="gradient" size="sm" asChild className="flex-1">
                  <Link to="/download">Download</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
