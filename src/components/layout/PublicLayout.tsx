import { Outlet, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ScrollToTop } from "@/components/layout/ScrollToTop"

export function PublicLayout() {
  const location = useLocation()
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
