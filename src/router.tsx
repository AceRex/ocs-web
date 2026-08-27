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
import SuggestionsPage from "@/pages/SuggestionsPage"
import PricingPage from "@/pages/PricingPage"
import ProfilePage from "@/pages/ProfilePage"
import DesktopLoginPage from "@/pages/DesktopLoginPage"
import ResetPasswordPage from "@/pages/ResetPasswordPage"
import AdminLoginPage from "@/pages/admin/AdminLoginPage"
import AdminDashboard from "@/pages/admin/AdminDashboard"
import AdminDownloads from "@/pages/admin/AdminDownloads"
import AdminComplaints from "@/pages/admin/AdminComplaints"
import AdminUsers from "@/pages/admin/AdminUsers"
import AdminUserDetail from "@/pages/admin/AdminUserDetail"
import AdminFaqs from "@/pages/admin/AdminFaqs"
import AdminPermissions from "@/pages/admin/AdminPermissions"
import AdminHistory from "@/pages/admin/AdminHistory"
import AdminSuggestions from "@/pages/admin/AdminSuggestions"
import AdminNotifications from "@/pages/admin/AdminNotifications"
import { RouteErrorBoundary } from "@/components/layout/RouteErrorBoundary"

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/pricing", element: <PricingPage /> },
      { path: "/docs", element: <DocsPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/testimonials", element: <TestimonialsPage /> },
      { path: "/suggestions", element: <SuggestionsPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/forgot-password", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
      { path: "/download", element: <DownloadPage /> },
      { path: "/support", element: <SupportPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/dashboard", element: <ProfilePage /> },
      { path: "*", element: <RouteErrorBoundary /> },
    ],
  },
  {
    path: "/auth/desktop",
    element: <DesktopLoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/desktop-login",
    element: <DesktopLoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "notifications", element: <AdminNotifications /> },
      { path: "downloads", element: <AdminDownloads /> },
      { path: "faqs", element: <AdminFaqs /> },
      { path: "complaints", element: <AdminComplaints /> },
      { path: "suggestions", element: <AdminSuggestions /> },
      { path: "users", element: <AdminUsers /> },
      { path: "users/:id", element: <AdminUserDetail /> },
      { path: "permissions", element: <AdminPermissions /> },
      { path: "history", element: <AdminHistory /> },
    ],
  },
])
