import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUserQuery } from "@/lib/queries";
import { getAuthToken } from "@/lib/api";
import { cn } from "@/lib/utils";
import { WaveLogo } from "@/components/ui/WaveLogo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Documentation", href: "/docs" },
  { label: "About", href: "/about" },
  { label: "Download", href: "/download" },
  { label: "Suggestions", href: "/suggestions" },
  { label: "Support", href: "/support" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [token, setToken] = useState<string | null>(getAuthToken());
  const { data: userData, refetch } = useCurrentUserQuery();
  const user = userData?.user;

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(getAuthToken());
      refetch();
    };

    window.addEventListener("ocs-auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("ocs-auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [refetch]);

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
          "bg-[#0B1020]/90 backdrop-blur-xl border border-white/15 shadow-lg shadow-[#0B1020]/40 text-white",
        )}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <WaveLogo variant="icon" color="fullColor" className="h-8 w-8 group-hover:scale-105" />
          <div className="font-bold text-white tracking-tight text-base">
            wave<span className="text-[#00E5FF] font-extrabold">.io</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#00A8FF]",
                location.pathname === link.href
                  ? "text-[#00A8FF] font-semibold"
                  : "text-[#E5E7EB]",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {token && user ? (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-[#00A8FF]/30 bg-[#00A8FF]/10 hover:bg-[#00A8FF]/20 text-[#00E5FF] rounded-[12px] gap-2 px-3 text-xs font-semibold shadow-sm"
            >
              <Link to="/profile" className="flex items-center gap-2">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="size-5 rounded-full object-cover border border-[#00A8FF]/50"
                  />
                ) : (
                  <div className="size-5 rounded-full bg-[#00A8FF] text-[#0B1020] flex items-center justify-center text-[10px] font-bold">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="max-w-[120px] truncate">{user.name || "Profile"}</span>
              </Link>
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-[#E5E7EB] hover:text-[#00A8FF] hover:bg-white/10 font-medium"
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button
                variant="default"
                size="sm"
                asChild
                className="rounded-[12px] px-4 font-bold shadow-md shadow-[#00A8FF]/20 bg-[#00A8FF] text-[#0B1020] hover:bg-[#00A8FF]/90"
              >
                <Link to="/signup" className="flex items-center gap-1.5">
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-[12px] hover:bg-white/10 text-white transition-colors cursor-pointer"
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
            className="md:hidden pointer-events-auto mt-2 mx-auto max-w-lg bg-[#0B1020]/95 backdrop-blur-2xl border border-white/15 rounded-[12px] p-5 shadow-xl shadow-[#0B1020]/50 overflow-hidden"
          >
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-sm font-medium text-[#E5E7EB] hover:text-[#00A8FF] py-1.5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-3 border-t border-white/15">
                {token && user ? (
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="flex-1 rounded-[12px] text-xs bg-[#00A8FF] text-[#0B1020] font-bold"
                  >
                    <Link to="/profile" className="flex items-center justify-center gap-2">
                      <UserIcon className="size-4" /> My Profile & Subscription
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1 rounded-[12px] border-white/20 text-white hover:bg-white/10"
                    >
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      asChild
                      className="flex-1 rounded-[12px] bg-[#00A8FF] text-[#0B1020] font-bold"
                    >
                      <Link to="/signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

