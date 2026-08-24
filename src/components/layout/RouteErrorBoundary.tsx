import { useRouteError, isRouteErrorResponse, Link, useNavigate } from "react-router-dom"
import { AlertTriangle, Home, LogIn, RefreshCw, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function RouteErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  let title = "Something went wrong"
  let description = "An unexpected error occurred while loading this page. Please try refreshing or returning to the home page."
  let statusCode = 500

  if (isRouteErrorResponse(error)) {
    statusCode = error.status
    if (error.status === 404) {
      title = "Page Not Found"
      description = "The page you are looking for might have been moved, deleted, or doesn't exist."
    } else if (error.status === 401) {
      title = "Unauthorized Access"
      description = "You must be signed in to access this area of the application."
    } else if (error.status === 403) {
      title = "Access Forbidden"
      description = "You do not have permission to view this resource."
    } else {
      description = error.statusText || error.data?.message || description
    }
  } else if (error instanceof Error) {
    description = error.message
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Mesh blobs */}
      <div className="mesh-blob w-96 h-96 bg-purple-300/30 -top-20 -left-20" />
      <div className="mesh-blob w-72 h-72 bg-pink-300/20 bottom-0 right-0" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-[16px] p-6 sm:p-10 shadow-2xl shadow-purple-200/40 w-full max-w-lg text-center space-y-6 bg-white/90 backdrop-blur-xl relative z-10 border border-purple-100"
      >
        <div className="size-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="size-8 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          {statusCode === 404 && (
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              404 Error
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-[12px] gap-2 h-11 font-semibold"
          >
            <RefreshCw className="size-4" />
            Reload Page
          </Button>

          <Button
            asChild
            className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-[12px] gap-2 h-11 font-semibold shadow-md shadow-purple-600/20"
          >
            <Link to="/">
              <Home className="size-4" />
              Return Home
            </Link>
          </Button>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-500">
          <button
            onClick={() => navigate(-1)}
            className="hover:text-purple-700 font-medium flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="size-3" /> Go Back
          </button>
          <span>•</span>
          <Link to="/login" className="hover:text-purple-700 font-medium flex items-center gap-1">
            <LogIn className="size-3" /> Sign In
          </Link>
          <span>•</span>
          <Link to="/support" className="hover:text-purple-700 font-medium">
            Contact Support
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default RouteErrorBoundary
