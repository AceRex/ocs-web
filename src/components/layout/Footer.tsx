import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { WaveLogo } from "@/components/ui/WaveLogo"

const footerLinks = {
  Product: [
    { label: "Overview", href: "/" },
    { label: "Pricing & Plans", href: "/pricing" },
    { label: "Documentation", href: "/docs" },
    { label: "Download", href: "/download" },
    { label: "Features", href: "/docs#features" },
  ],
  Company: [
    { label: "About wave.io", href: "/about" },
    { label: "Mission & Vision", href: "/about#vision" },
    { label: "Church Licensing", href: "/docs#licensing" },
    { label: "Church Testimonials", href: "/testimonials" },
  ],
  Support: [
    { label: "Submit Ticket", href: "/support" },
    { label: "Feature Suggestions", href: "/suggestions" },
    { label: "Share Your Story", href: "/testimonials#submit-form" },
    { label: "Help & FAQ", href: "/download#faq" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <WaveLogo variant="icon" color="fullColor" className="h-8 w-8" />
              <span className="text-white font-bold text-base">wave<span className="text-cyan-400">.io</span></span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              The professional Live Presentation & Worship Platform for modern ministry teams.
            </p>
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} wave.io. All rights reserved.</p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-200">{group}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-500 hover:text-slate-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-slate-800" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <span>Built for churches — by a team that loves ministry.</span>
          <div className="flex items-center gap-4">
            <Link to="/suggestions" className="hover:text-slate-400 transition-colors">Feature Suggestions</Link>
            <Link to="/support" className="hover:text-slate-400 transition-colors">Help Center</Link>
            <Link to="/admin/login" className="hover:text-purple-400 transition-colors">Admin Console</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
