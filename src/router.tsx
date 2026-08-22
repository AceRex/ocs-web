import { createBrowserRouter } from "react-router-dom"
import { PublicLayout } from "@/components/layout/PublicLayout"
import AdminLayout from "@/pages/admin/AdminLayout"
import LandingPage from "@/pages/LandingPage"
import LoginPage from "@/pages/LoginPage"
import SignupPage from "@/pages/SignupPage"
import DownloadPage from "@/pages/DownloadPage"
import SupportPage from "@/pages/SupportPage"
import DocsPage from "@/pages/DocsPage"
import AboutPage from "@/pages/AboutPage"
import TestimonialsPage from "@/pages/TestimonialsPage"
import DesktopLoginPage from "@/pages/DesktopLoginPage"
import AdminLoginPage from "@/pages/admin/AdminLoginPage"
import AdminDashboard from "@/pages/admin/AdminDashboard"
import AdminDownloads from "@/pages/admin/AdminDownloads"
import AdminComplaints from "@/pages/admin/AdminComplaints"
import AdminUsers from "@/pages/admin/AdminUsers"
import AdminFaqs from "@/pages/admin/AdminFaqs"

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/docs", element: <DocsPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/testimonials", element: <TestimonialsPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/download", element: <DownloadPage /> },
      { path: "/support", element: <SupportPage /> },
    ],
  },
  {
    path: "/auth/desktop",
    element: <DesktopLoginPage />,
  },
  {
    path: "/desktop-login",
    element: <DesktopLoginPage />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "downloads", element: <AdminDownloads /> },
      { path: "faqs", element: <AdminFaqs /> },
      { path: "complaints", element: <AdminComplaints /> },
      { path: "users", element: <AdminUsers /> },
    ],
  },
])
