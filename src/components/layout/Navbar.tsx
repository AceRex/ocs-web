import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Documentation", href: "/docs" },
  { label: "About", href: "/about" },
  { label: "Download", href: "/download" },
  { label: "Support", href: "/support" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none"
    >
      <div
        className={cn(
          "container mx-auto h-14 max-w-5xl px-4 sm:px-6 rounded-[12px] flex items-center justify-between pointer-events-auto transition-all duration-300",
          "bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 shadow-lg shadow-purple-900/5 ring-1 ring-purple-100/50",
        )}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="size-8 rounded-[2px] bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-md shadow-purple-300/40 group-hover:shadow-purple-400/50 transition-all">
            <span className="text-white font-black text-sm tracking-tighter">
              OCS
            </span>
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
                  ? "text-purple-700 font-semibold"
                  : "text-slate-600 dark:text-slate-300",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-slate-600 hover:text-purple-700 font-medium"
          >
            <Link to="/login">Sign In</Link>
          </Button>
          <Button
            variant="gradient"
            size="sm"
            asChild
            className="rounded-full px-4 font-semibold shadow-md shadow-purple-400/20"
          >
            <Link to="/signup" className="flex items-center gap-1.5">
              Get Started
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
            className="md:hidden pointer-events-auto mt-2 mx-auto max-w-lg bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-purple-100/80 rounded-2xl p-5 shadow-xl shadow-purple-900/10 overflow-hidden"
          >
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-purple-700 py-1.5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-3 border-t border-purple-100/60">
                <Button
                  variant="outline-purple"
                  size="sm"
                  asChild
                  className="flex-1 rounded-xl"
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  asChild
                  className="flex-1 rounded-xl"
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
