import { createBrowserRouter } from "react-router-dom"
import { PublicLayout } from "@/components/layout/PublicLayout"
import AdminLayout from "@/pages/admin/AdminLayout"
import LandingPage from "@/pages/LandingPage"
import LoginPage from "@/pages/LoginPage"
import SignupPage from "@/pages/SignupPage"
import DownloadPage from "@/pages/DownloadPage"
import SupportPage from "@/pages/SupportPage"
import AdminDashboard from "@/pages/admin/AdminDashboard"
import AdminDownloads from "@/pages/admin/AdminDownloads"
import AdminComplaints from "@/pages/admin/AdminComplaints"
import AdminUsers from "@/pages/admin/AdminUsers"

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/download", element: <DownloadPage /> },
      { path: "/support", element: <SupportPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "downloads", element: <AdminDownloads /> },
      { path: "complaints", element: <AdminComplaints /> },
      { path: "users", element: <AdminUsers /> },
    ],
  },
])
