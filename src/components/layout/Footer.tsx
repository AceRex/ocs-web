import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
  Product: [
    { label: "Download", href: "/download" },
    { label: "Features", href: "/#features" },
    { label: "Changelog", href: "#" },
  ],
  Support: [
    { label: "Submit a Request", href: "/support" },
    { label: "Documentation", href: "#" },
    { label: "Status", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
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
              <div className="size-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                <span className="text-white font-black text-sm tracking-tighter">OCS</span>
              </div>
              <span className="text-white font-bold">OCS Platform</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              The professional Church Service Management platform for modern ministry teams.
            </p>
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} OCS. All rights reserved.</p>
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
            <Link to="/support" className="hover:text-slate-400 transition-colors">Report an Issue</Link>
            <Link to="/admin" className="hover:text-slate-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
