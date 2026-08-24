import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"
import {
  User,
  Building,
  Mail,
  Camera,
  Trash2,
  Laptop,
  Smartphone,
  ShieldCheck,
  CreditCard,
  Clock,
  AlertTriangle,
  Lock,
  LogOut,
  Save,
  Sparkles,
  RefreshCw,
  Crown,
  Loader2,
  Sprout,
  Layers,
  Zap,
  Building2,
  Check,
  X,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { PageTransition } from "@/components/layout/PageTransition"
import {
  useCurrentUserQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
  useChangePasswordMutation,
  useRemoveDeviceMutation,
  usePaySubscriptionMutation,
} from "@/lib/queries"
import { getAuthToken, clearAuthToken } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const BIBLE_TRANSLATIONS = ["KJV", "NKJV", "NIV", "ESV", "NLT", "AMP", "MSG", "NASB", "CSB"]

const PLANS = [
  {
    tier: "mini",
    name: "Mini Setup",
    subtitle: "Starter sanctuary control",
    price: "$2",
    billingPeriod: "/ 6 months",
    priceNote: "Affordable starter semi-annual license",
    desktops: 1,
    mobiles: 3,
    description: "Essential presentation, PDF viewing, and song projection.",
    features: [
      "1 Workstation Display",
      "3 Mobile Companion Seats",
      "Service Countdown & Broadcast",
      "Presentation Engine & PDF Viewer",
      "Song Lyrics & Scene Management",
    ],
  },
  {
    tier: "standard",
    name: "Standard Setup",
    popular: true,
    subtitle: "For growing sanctuaries",
    price: "$3",
    billingPeriod: "/ 6 months",
    priceNote: "Billed semi-annually",
    badge: "Best Value",
    desktops: 1,
    mobiles: 5,
    description: "Full dual-screen projector, slide builder, and stage timing.",
    features: [
      "1 Workstation Display",
      "5 Mobile Companion Seats",
      "Sessions Archive & Audio Capture",
      "Interval Timers & Segment Loops",
      "PDF In-App Editor & Annotator",
      "Custom Timer Layouts & Skins",
    ],
  },
  {
    tier: "large",
    name: "Large Setup",
    subtitle: "For broadcast & multi-screen",
    price: "$5",
    billingPeriod: "/ 6 months",
    priceNote: "Billed semi-annually",
    badge: "Broadcast Ready",
    desktops: 2,
    mobiles: 5,
    description: "Advanced scene animations, transitions, and sing-along lyrics.",
    features: [
      "2 Workstations (Multi-Screen Projection)",
      "5 Mobile Companion Seats",
      "Scheduled Start Timer Time",
      "Intro & Outro Video Bumpers",
      "Dynamic Animations & Transitions",
      "Chorus Flow, Sing Along & Read Along",
    ],
  },
  {
    tier: "premium",
    name: "Premium",
    subtitle: "For mega-churches & custom needs",
    price: "Let's chat!",
    billingPeriod: "",
    priceNote: "Custom tailored enterprise package",
    badge: "UNLIMITED ENTERPRISE",
    isEnterprise: true,
    desktops: "Unlimited",
    mobiles: "Unlimited",
    description: "Unlimited projection rigs, companion stage devices, and full bypass.",
    features: [
      "Unlimited active projects",
      "Unlimited workstations & displays",
      "Unlimited companion users",
      "Unlimited documents & storage",
      "Full unconstrained feature bypass",
      "Dedicated 24/7 SLA priority support",
    ],
  },
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const token = getAuthToken()

  // Protect route
  useEffect(() => {
    if (!token) {
      toast.error("Please sign in to access your profile.")
      navigate("/login")
    }
  }, [token, navigate])

  const { data: userData, isLoading, isError, refetch } = useCurrentUserQuery()
  const user = userData?.user

  const updateProfileMutation = useUpdateProfileMutation()
  const uploadAvatarMutation = useUploadAvatarMutation()
  const deleteAvatarMutation = useDeleteAvatarMutation()
  const changePasswordMutation = useChangePasswordMutation()
  const removeDeviceMutation = useRemoveDeviceMutation()
  const paySubscriptionMutation = usePaySubscriptionMutation()

  const [activeTab, setActiveTab] = useState<"profile" | "subscription" | "devices" | "security">("profile")

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    churchName: "",
    phone: "",
    bio: "",
    preferredBibleTranslation: "KJV",
    roleTitle: "Worship Leader & Media Director",
    channelLink: "",
    podcastLink: "",
    emailUpdates: true,
    serviceReminders: true,
    weeklyDigest: true,
  })

  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Modals state
  const [showAvatarDeleteModal, setShowAvatarDeleteModal] = useState(false)
  const [deviceToDelete, setDeviceToDelete] = useState<{ id: string; name: string; platform: string } | null>(null)
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any | null>(null)
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Populate form on user load
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        churchName: user.churchName || "",
        phone: user.phone || "",
        bio: user.bio || "",
        preferredBibleTranslation: user.preferredBibleTranslation || "KJV",
        roleTitle: user.roleTitle || "Worship Leader & Media Director",
        channelLink: user.channelLink || "",
        podcastLink: user.podcastLink || "",
        emailUpdates: user.notificationPreferences?.emailUpdates ?? true,
        serviceReminders: user.notificationPreferences?.serviceReminders ?? true,
        weeklyDigest: user.notificationPreferences?.weeklyDigest ?? true,
      })
    }
  }, [user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfileMutation.mutateAsync({
        name: formData.name,
        churchName: formData.churchName,
        phone: formData.phone,
        bio: formData.bio,
        preferredBibleTranslation: formData.preferredBibleTranslation,
        roleTitle: formData.roleTitle,
        channelLink: formData.channelLink,
        podcastLink: formData.podcastLink,
        notificationPreferences: {
          emailUpdates: formData.emailUpdates,
          serviceReminders: formData.serviceReminders,
          weeklyDigest: formData.weeklyDigest,
        },
      })
      toast.success("Profile updated successfully")
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile")
    }
  }

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      try {
        await uploadAvatarMutation.mutateAsync(base64)
        toast.success("Profile picture updated on Cloudinary")
      } catch (err: any) {
        toast.error(err.message || "Failed to upload photo")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleConfirmDeleteAvatar = async () => {
    try {
      await deleteAvatarMutation.mutateAsync()
      setShowAvatarDeleteModal(false)
      toast.success("Profile photo removed")
    } catch (err: any) {
      toast.error(err.message || "Failed to remove photo")
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword })
      toast.success("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      toast.error(err.message || "Failed to change password")
    }
  }

  const handleConfirmDeleteDevice = async () => {
    if (!deviceToDelete) return
    try {
      await removeDeviceMutation.mutateAsync(deviceToDelete.id)
      setDeviceToDelete(null)
      toast.success("Device disconnected and deauthorized")
    } catch (err: any) {
      toast.error(err.message || "Failed to remove device")
    }
  }

  const handleProcessPayment = async () => {
    if (!selectedPlanForPayment) return
    setPaymentProcessing(true)
    try {
      await paySubscriptionMutation.mutateAsync({
        tier: selectedPlanForPayment.tier,
        billingCycle: "semi-annual",
        paymentMethod: "card",
      })
      toast.success(`Subscription updated to ${selectedPlanForPayment.name}!`)
      setSelectedPlanForPayment(null)
    } catch (err: any) {
      toast.error(err.message || "Payment processing failed")
    } finally {
      setPaymentProcessing(false)
    }
  }

  const handleLogout = () => {
    clearAuthToken()
    toast.success("Signed out successfully")
    navigate("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/60 text-slate-900 flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-3 p-8 rounded-[16px] bg-white border border-slate-200/80 shadow-xs">
          <RefreshCw className="size-8 text-purple-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading your profile & subscription...</p>
        </div>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-slate-50/60 text-slate-900 flex items-center justify-center pt-24 px-4">
        <Card className="max-w-md bg-white border-slate-200 shadow-xl text-slate-900 text-center p-6 space-y-4 rounded-[16px]">
          <AlertTriangle className="size-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Session Expired or Invalid</h2>
          <p className="text-xs text-slate-600">Please log in again to access your account dashboard.</p>
          <Button onClick={() => navigate("/login")} className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-[10px]">
            Go to Login
          </Button>
        </Card>
      </div>
    )
  }

  // Days left calculation
  const isTrial = user.isTrial || user.subscriptionTier === "trial" || user.effectiveTier === "trial"
  const isFree = (user.subscriptionTier === "free" || user.effectiveTier === "free") && !user.subscriptionExpiresAt

  const remainingDays = !isTrial && user.subscriptionExpiresAt
    ? Math.max(0, Math.ceil((new Date(user.subscriptionExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : isTrial
      ? (user.trialRemainingDays ?? 60)
      : 0

  const totalPlanDays = isTrial ? 60 : 180

  const activeDesktops = user.licenseQuotas?.activeDesktops || []
  const activeMobiles = user.licenseQuotas?.activeMobileUsers || []
  const maxDesktops = user.licenseQuotas?.maxDesktops || 1
  const maxMobiles = user.licenseQuotas?.maxMobileUsers || 3

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50/60 text-slate-900 pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* ── HEADER BANNER ───────────────────────────────────────── */}
          <div className="relative rounded-[20px] bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-950 text-white border border-purple-800/40 p-6 sm:p-8 overflow-hidden shadow-xl shadow-purple-900/10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                {/* Profile Avatar with Cloudinary Integration */}
                <div className="relative group">
                  <div className="size-24 sm:size-28 rounded-full border-3 border-white/40 p-1 bg-purple-950/60 shadow-xl overflow-hidden flex items-center justify-center backdrop-blur-sm relative">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="size-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-full rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </div>
                    )}

                    {uploadAvatarMutation.isPending && (
                      <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white text-xs font-semibold gap-1.5 z-20 backdrop-blur-xs">
                        <Loader2 className="size-6 text-purple-300 animate-spin" />
                        <span className="text-[10px] text-purple-200 font-medium">Uploading...</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={uploadAvatarMutation.isPending}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1 cursor-pointer",
                      uploadAvatarMutation.isPending && "pointer-events-none opacity-0"
                    )}
                    title="Change Profile Photo"
                  >
                    <Camera className="size-5 text-purple-200" />
                    <span>Change</span>
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    disabled={uploadAvatarMutation.isPending}
                    onChange={handleAvatarFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {user.name || "Church Minister"}
                    </h1>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs px-2.5 py-0.5 capitalize backdrop-blur-sm font-semibold">
                      {user.subscriptionTier || "Trial"} Plan
                    </Badge>
                  </div>
                  <p className="text-sm text-purple-200/90 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                    <Building className="size-3.5 text-purple-300" />
                    {user.churchName || "Community Worship Center"} · {user.roleTitle || "Media Lead"}
                  </p>
                  <p className="text-xs text-purple-200/75 flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="size-3 text-purple-300" />
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {user.avatarUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAvatarDeleteModal(true)}
                    className="border-white/30 text-white hover:bg-white/15 bg-white/5 text-xs rounded-[10px] cursor-pointer backdrop-blur-sm"
                  >
                    <Trash2 className="size-3.5 mr-1 text-red-300" />
                    Remove Photo
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await refetch()
                    toast.success("Account status synced!")
                  }}
                  className="border-white/30 text-white hover:bg-white/15 bg-white/5 text-xs rounded-[10px] cursor-pointer backdrop-blur-sm"
                  title="Sync profile and subscription"
                >
                  <RefreshCw className="size-3.5 mr-1 text-purple-200" />
                  Sync
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-white/30 text-white hover:bg-white/15 bg-white/5 text-xs rounded-[10px] cursor-pointer backdrop-blur-sm"
                >
                  <LogOut className="size-3.5 mr-1 text-purple-200" />
                  Sign Out
                </Button>
                <Button
                  size="sm"
                  onClick={() => setActiveTab("subscription")}
                  className="bg-white text-purple-900 hover:bg-purple-50 font-bold text-xs rounded-[10px] shadow-lg shadow-black/10 cursor-pointer"
                >
                  <Sparkles className="size-3.5 mr-1 text-purple-700" />
                  Upgrade Plan
                </Button>
              </div>
            </div>

            {/* Subscription Expiry Alert Bar */}
            <div className="mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-purple-100">
                <Clock className="size-4 text-purple-300 shrink-0" />
                <span>
                  {isTrial ? "60-Day Free Trial" : isFree ? "Free Community Plan" : "Active 6-Month Subscription"}:{" "}
                  <strong className="text-white font-semibold">
                    {isFree ? "No expiration" : `${remainingDays} days remaining`}
                  </strong>
                  {user.subscriptionExpiresAt && (
                    <span className="text-purple-200/80 ml-1">
                      (Expires {new Date(user.subscriptionExpiresAt).toLocaleDateString()})
                    </span>
                  )}
                </span>
              </div>

              {!isFree && (
                <div className="w-full sm:w-64 bg-black/30 rounded-full h-2 overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-purple-300 to-indigo-200 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, (remainingDays / totalPlanDays) * 100))}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── TABS NAVIGATION ─────────────────────────────────────── */}
          <div className="bg-white border border-slate-200/80 p-1.5 rounded-[14px] shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: "profile", label: "Profile & Church Info", icon: User },
              { id: "subscription", label: "Subscription & Plans", icon: CreditCard },
              { id: "devices", label: "Connected Devices", icon: Laptop, badge: activeDesktops.length + activeMobiles.length },
              { id: "security", label: "Security & Password", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                    isActive
                      ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                  )}
                >
                  <Icon className={cn("size-4", isActive ? "text-purple-600" : "text-slate-400")} />
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={cn(
                      "px-1.5 py-0.2 text-[10px] rounded-full font-bold",
                      isActive
                        ? "bg-purple-200/70 text-purple-900"
                        : "bg-slate-100 text-slate-600"
                    )}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* ── TAB 1: PROFILE & CHURCH INFO ───────────────────────── */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white border-slate-200/80 text-slate-900 rounded-[16px] shadow-xs">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Personal & Ministry Details</h3>
                      <p className="text-xs text-slate-500">
                        Update your church leadership name, primary Bible translation, and communication channels.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      form="profile-form"
                      disabled={updateProfileMutation.isPending}
                      className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-[10px] gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
                    >
                      <Save className="size-3.5" />
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>

                  <form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Full Name / Pastor Name</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Pastor Are Oluwasegun"
                          className="bg-white border-slate-200 text-slate-900 text-xs rounded-[10px] focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Church / Ministry Name</label>
                        <Input
                          value={formData.churchName}
                          onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                          placeholder="e.g. Grace Sanctuary Global"
                          className="bg-white border-slate-200 text-slate-900 text-xs rounded-[10px] focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Email Address (Account ID)</label>
                        <Input
                          value={user.email}
                          disabled
                          className="bg-slate-50 border-slate-200 text-slate-500 text-xs rounded-[10px] cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 000-1234"
                          className="bg-white border-slate-200 text-slate-900 text-xs rounded-[10px] focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Role / Ministry Title</label>
                        <Input
                          value={formData.roleTitle}
                          onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                          placeholder="Senior Pastor / Media Director"
                          className="bg-white border-slate-200 text-slate-900 text-xs rounded-[10px] focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Preferred Bible Translation</label>
                        <select
                          value={formData.preferredBibleTranslation}
                          onChange={(e) => setFormData({ ...formData, preferredBibleTranslation: e.target.value })}
                          className="w-full h-9 rounded-[10px] bg-white border border-slate-200 text-slate-900 text-xs px-3 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 shadow-xs"
                        >
                          {BIBLE_TRANSLATIONS.map((trans) => (
                            <option key={trans} value={trans}>
                              {trans} Translation
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Live Stream / Broadcast Channel</label>
                        <Input
                          value={formData.channelLink}
                          onChange={(e) => setFormData({ ...formData, channelLink: e.target.value })}
                          placeholder="https://youtube.com/@yourchurch"
                          className="bg-white border-slate-200 text-slate-900 text-xs rounded-[10px] focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Ministry Bio / Mission Note</label>
                      <Textarea
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Brief note about your worship team, sanctuary size, or broadcast setup..."
                        className="bg-white border-slate-200 text-slate-900 text-xs rounded-[10px] resize-none focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>

                    {/* Notification Preferences */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900">Email & Telemetry Preferences</h4>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.emailUpdates}
                            onChange={(e) => setFormData({ ...formData, emailUpdates: e.target.checked })}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          Product & Feature Updates
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.serviceReminders}
                            onChange={(e) => setFormData({ ...formData, serviceReminders: e.target.checked })}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          Subscription & Renewal Alerts
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.weeklyDigest}
                            onChange={(e) => setFormData({ ...formData, weeklyDigest: e.target.checked })}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          Worship Tech Tips & Digest
                        </label>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── TAB 2: SUBSCRIPTION & PLANS ─────────────────────────── */}
          {activeTab === "subscription" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Current Plan Overview Card */}
              <Card className="bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/40 border border-purple-200/80 text-slate-900 rounded-[16px] shadow-xs">
                <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Crown className="size-5 text-purple-600" />
                      <span className="text-xs uppercase tracking-wider text-purple-700 font-bold">Current Active Plan</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 capitalize">
                      {user.subscriptionTier || "Trial"} Tier
                    </h2>
                    <p className="text-xs text-slate-600 max-w-xl">
                      Allows up to <strong className="text-purple-700">{maxDesktops} sanctuary desktop(s)</strong> and{" "}
                      <strong className="text-purple-700">{maxMobiles} companion stage device(s)</strong>.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="p-3 rounded-[12px] bg-white border border-purple-200/80 text-center px-5 shadow-xs">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Days Remaining</span>
                      <div className="text-xl font-bold text-purple-900 font-mono">{remainingDays} Days</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Selector & Comparison matching PricingPage layout */}
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Choose the perfect plan</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Flexible plans for individuals, growing churches, and enterprise sanctuaries.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100/90 border border-purple-200/80 text-purple-900 text-xs font-semibold self-start sm:self-auto shadow-xs">
                    <span>Simple, transparent pricing</span>
                  </div>
                </div>

                {/* ── ROW 1: 3 CARDS (Trial, Mini, Standard) ─────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                  
                  {/* ── CARD 1: 2-MONTH FREE TRIAL ───────────────────── */}
                  <div className={cn(
                    "bg-white rounded-[28px] p-7 sm:p-8 border shadow-[0_10px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.07)] transition-all flex flex-col justify-between",
                    isTrial ? "border-purple-500 ring-2 ring-purple-100" : "border-slate-100"
                  )}>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-[18px] bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-xs shrink-0">
                          <Sprout className="size-7 stroke-[2.2]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Free Trial</h3>
                            {isTrial && (
                              <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-[10px] font-bold">
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">For getting started</p>
                        </div>
                      </div>

                      <div className="space-y-1 pt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-5xl font-black text-slate-900 tracking-tight">$0</span>
                          <span className="text-sm font-semibold text-slate-500">/ 2 months</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Mini Setup included for first 60 days</p>
                      </div>

                      <div className="border-t border-slate-100 pt-6 space-y-3.5 text-xs text-slate-700 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>1 Workstation Display</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>3 Mobile Companion Seats</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Basic Countdown & Broadcast</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>PDF Viewer & Sermon Notes</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Hymn & Song Lyrics Projection</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <div className="size-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                            <X className="size-3 stroke-[2.5]" />
                          </div>
                          <span>Interval timers & PDF editor</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8">
                      <Button
                        disabled={true}
                        variant="outline"
                        className="w-full h-12 rounded-[16px] bg-slate-50/80 border-slate-200/80 text-slate-400 font-bold text-sm shadow-xs cursor-not-allowed"
                      >
                        {isTrial ? "Current Trial Plan" : "Trial Expired"}
                      </Button>
                    </div>
                  </div>

                  {/* ── CARD 2: MINI SETUP ───────────────────────────── */}
                  <div className={cn(
                    "bg-white rounded-[28px] p-7 sm:p-8 border shadow-[0_10px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.07)] transition-all flex flex-col justify-between",
                    user.subscriptionTier === "mini" ? "border-purple-500 ring-2 ring-purple-100" : "border-slate-100"
                  )}>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-[18px] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs shrink-0">
                          <Layers className="size-7 stroke-[2.2]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Mini Setup</h3>
                            {user.subscriptionTier === "mini" && (
                              <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-[10px] font-bold">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">Starter sanctuary control</p>
                        </div>
                      </div>

                      <div className="space-y-1 pt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-5xl font-black text-slate-900 tracking-tight">$2</span>
                          <span className="text-sm font-semibold text-slate-500">/ 6 months</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Affordable starter semi-annual license</p>
                      </div>

                      <div className="border-t border-slate-100 pt-6 space-y-3.5 text-xs text-slate-700 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>1 Workstation Display</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>3 Mobile Companion Seats</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Service Countdown & Broadcast</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Presentation Engine & PDF Viewer</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Song Lyrics & Scene Management</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <div className="size-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                            <X className="size-3 stroke-[2.5]" />
                          </div>
                          <span>Sessions & Audio Recording (Tier 2+)</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8">
                      <Button
                        disabled={user.subscriptionTier === "mini"}
                        onClick={() => setSelectedPlanForPayment(PLANS.find(p => p.tier === "mini"))}
                        variant="outline"
                        className={cn(
                          "w-full h-12 rounded-[16px] font-bold text-sm shadow-xs transition-all cursor-pointer",
                          user.subscriptionTier === "mini"
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                            : "bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80 text-slate-900"
                        )}
                      >
                        {user.subscriptionTier === "mini" ? "Current Plan" : "Choose Mini"}
                      </Button>
                    </div>
                  </div>

                  {/* ── CARD 3: STANDARD SETUP (GLOWING HERO CARD) ───── */}
                  <div className={cn(
                    "bg-gradient-to-b from-[#3240db] via-[#4537dc] to-[#6329db] text-white rounded-[28px] p-7 sm:p-8 border border-indigo-300/40 shadow-[0_20px_50px_rgba(67,56,202,0.38)] relative overflow-visible flex flex-col justify-between ring-2 ring-cyan-400/40",
                    user.subscriptionTier === "standard" && "ring-4 ring-cyan-400"
                  )}>
                    {/* Floating Most Popular Badge */}
                    <div className="absolute -top-3.5 right-6">
                      <div className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#1b1c6a]/90 backdrop-blur-md border border-indigo-400/50 text-white text-[11px] font-bold shadow-lg shadow-indigo-950/50">
                        <span className="text-amber-300">★</span>
                        <span>Most Popular</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-[18px] bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-inner shrink-0">
                          <Zap className="size-7 fill-white stroke-[1.5]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white tracking-tight">Standard Setup</h3>
                            {user.subscriptionTier === "standard" && (
                              <Badge className="bg-white/20 text-white border-white/40 text-[10px] font-bold">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-indigo-200 font-medium">For growing sanctuaries</p>
                        </div>
                      </div>

                      <div className="space-y-1 pt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-5xl font-black text-white tracking-tight">$3</span>
                          <span className="text-sm font-semibold text-indigo-200">/ 6 months</span>
                        </div>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-xs text-indigo-200 font-medium">Billed semi-annually</span>
                          <Badge className="bg-emerald-400/30 text-emerald-200 border border-emerald-400/40 text-[10px] font-bold px-2 py-0">
                            Best Value
                          </Badge>
                        </div>
                      </div>

                      <div className="border-t border-white/15 pt-6 space-y-3.5 text-xs text-indigo-50 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>1 Workstation Display</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>5 Mobile Companion Seats</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Sessions Archive & Audio Capture</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Interval Timers & Segment Loops</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>PDF In-App Editor & Annotator</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 backdrop-blur-xs">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Custom Timer Layouts & Skins</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8">
                      <Button
                        disabled={user.subscriptionTier === "standard"}
                        onClick={() => setSelectedPlanForPayment(PLANS.find(p => p.tier === "standard"))}
                        className={cn(
                          "w-full h-12 rounded-[16px] font-bold text-sm shadow-lg shadow-indigo-950/40 border border-white/20 transition-all cursor-pointer",
                          user.subscriptionTier === "standard"
                            ? "bg-white/20 text-indigo-200 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#7c4dff] to-[#651fff] hover:from-[#651fff] hover:to-[#5310e6] text-white"
                        )}
                      >
                        {user.subscriptionTier === "standard" ? "Current Plan" : "Choose Standard"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* ── ROW 2: 2 CARDS (Large Setup & Premium Gold Card) ─ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto">
                  
                  {/* ── CARD 4: LARGE SETUP ──────────────────────────── */}
                  <div className={cn(
                    "bg-white rounded-[28px] p-7 sm:p-8 border shadow-[0_10px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.07)] transition-all flex flex-col justify-between",
                    user.subscriptionTier === "large" ? "border-purple-500 ring-2 ring-purple-100" : "border-slate-100"
                  )}>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-[18px] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs shrink-0">
                          <Building2 className="size-7 stroke-[2.2]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Large Setup</h3>
                            {user.subscriptionTier === "large" && (
                              <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-[10px] font-bold">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">For broadcast & multi-screen</p>
                        </div>
                      </div>

                      <div className="space-y-1 pt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-5xl font-black text-slate-900 tracking-tight">$5</span>
                          <span className="text-sm font-semibold text-slate-500">/ 6 months</span>
                        </div>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-xs text-slate-400 font-medium">Billed semi-annually</span>
                          <Badge className="bg-indigo-100 text-indigo-800 border-0 text-[10px] font-bold px-2 py-0">
                            Broadcast Ready
                          </Badge>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-6 space-y-3.5 text-xs text-slate-700 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>2 Workstations (Multi-Screen Projection)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>5 Mobile Companion Seats</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Scheduled Start Timer Time</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Intro & Outro Video Bumpers</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Dynamic Animations & Transitions</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Chorus Flow, Sing Along & Read Along</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8">
                      <Button
                        disabled={user.subscriptionTier === "large"}
                        onClick={() => setSelectedPlanForPayment(PLANS.find(p => p.tier === "large"))}
                        variant="outline"
                        className={cn(
                          "w-full h-12 rounded-[16px] font-bold text-sm shadow-xs transition-all cursor-pointer",
                          user.subscriptionTier === "large"
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                            : "bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80 text-slate-900"
                        )}
                      >
                        {user.subscriptionTier === "large" ? "Current Plan" : "Choose Large"}
                      </Button>
                    </div>
                  </div>

                  {/* ── CARD 5: PREMIUM (GOLD BORDERED "LET'S CHAT!" CARD) ─ */}
                  <div className={cn(
                    "bg-gradient-to-b from-amber-500/[0.04] via-amber-500/[0.01] to-white rounded-[28px] p-7 sm:p-8 border-2 border-amber-400/90 shadow-[0_15px_45px_rgba(245,158,11,0.18)] hover:shadow-[0_20px_55px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/30 transition-all flex flex-col justify-between relative overflow-visible",
                    user.subscriptionTier === "premium" && "ring-4 ring-amber-400"
                  )}>
                    {/* Floating Top Badge */}
                    <div className="absolute -top-3.5 right-6">
                      <div className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black shadow-md shadow-amber-500/30">
                        <Crown className="size-3 fill-slate-950" />
                        <span>UNLIMITED ENTERPRISE</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-[18px] bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-700 shadow-xs shrink-0">
                          <Sparkles className="size-7 stroke-[2.2]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Premium</h3>
                            {user.subscriptionTier === "premium" && (
                              <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-bold">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-amber-800/80 font-semibold">For mega-churches & custom needs</p>
                        </div>
                      </div>

                      <div className="space-y-1 pt-2">
                        <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                          Let's chat!
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Custom tailored enterprise package</p>
                      </div>

                      <div className="border-t border-amber-200/60 pt-6 space-y-3.5 text-xs text-slate-800 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span className="font-semibold text-slate-900">Unlimited active projects</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span className="font-semibold text-slate-900">Unlimited workstations & displays</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span className="font-semibold text-slate-900">Unlimited companion users</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Unlimited documents & storage</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Full unconstrained feature bypass</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span>Dedicated 24/7 SLA priority support</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full h-12 rounded-[16px] border-amber-300 bg-amber-50/50 hover:bg-amber-100 text-amber-950 font-bold text-sm shadow-xs transition-all cursor-pointer"
                      >
                        <Link to="/support">Contact Sales / Demo</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB 3: CONNECTED DEVICES ───────────────────────────── */}
          {activeTab === "devices" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Registered Sanctuary Projection Workstations</h3>
                  <p className="text-xs text-slate-500">
                    Manage active desktop presentation apps and mobile stage controllers linked to this license.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge className="bg-purple-50 border-purple-200 text-purple-700 font-semibold">
                    Desktops: {activeDesktops.length} / {maxDesktops}
                  </Badge>
                  <Badge className="bg-purple-50 border-purple-200 text-purple-700 font-semibold">
                    Mobiles: {activeMobiles.length} / {maxMobiles}
                  </Badge>
                </div>
              </div>

              {/* Desktops List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Laptop className="size-4 text-purple-600" /> Sanctuary Desktop Computers ({activeDesktops.length})
                </h4>

                {activeDesktops.length === 0 ? (
                  <Card className="bg-white border-slate-200/80 text-center p-8 rounded-[16px] shadow-xs">
                    <Laptop className="size-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No desktop devices registered yet.</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Download and log into the OCS desktop app to register your first sanctuary workstation.
                    </p>
                    <Button asChild size="sm" className="mt-4 bg-purple-700 hover:bg-purple-800 text-white text-xs rounded-[10px] shadow-xs">
                      <Link to="/download">Download Desktop App</Link>
                    </Button>
                  </Card>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {activeDesktops.map((dev: any) => (
                      <div
                        key={dev.deviceId || dev._id}
                        className="p-4 rounded-[14px] bg-white border border-slate-200/80 flex items-start justify-between gap-3 shadow-xs hover:border-purple-200 transition-all"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="size-9 rounded-[10px] bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                            <Laptop className="size-5" />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="font-bold text-slate-900 text-xs truncate">
                              {dev.name || "Sanctuary Desktop"}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                              <span>ID: {(dev.deviceId || dev._id || "").slice(0, 12)}...</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Registered: {dev.registeredAt ? new Date(dev.registeredAt).toLocaleDateString() : "Active"}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            setDeviceToDelete({
                              id: dev.deviceId || dev._id,
                              name: dev.name || "Sanctuary Desktop",
                              platform: "Desktop Computer",
                            })
                          }
                          className="p-2 rounded-[8px] text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Deauthorize device"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobiles List */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="size-4 text-purple-600" /> Stage Mobile Controllers ({activeMobiles.length})
                </h4>

                {activeMobiles.length === 0 ? (
                  <div className="p-6 rounded-[14px] bg-white border border-slate-200/80 text-center text-xs text-slate-500 shadow-xs">
                    No mobile stage controllers connected. Scan stage QR codes in the desktop app to connect mobile rigs.
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {activeMobiles.map((dev: any) => (
                      <div
                        key={dev.deviceId || dev._id}
                        className="p-4 rounded-[14px] bg-white border border-slate-200/80 flex items-start justify-between gap-3 shadow-xs hover:border-purple-200 transition-all"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="size-9 rounded-[10px] bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                            <Smartphone className="size-5" />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="font-bold text-slate-900 text-xs truncate">
                              {dev.name || "Stage Controller"}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              ID: {(dev.deviceId || dev._id || "").slice(0, 12)}...
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Registered: {dev.registeredAt ? new Date(dev.registeredAt).toLocaleDateString() : "Active"}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            setDeviceToDelete({
                              id: dev.deviceId || dev._id,
                              name: dev.name || "Stage Controller",
                              platform: "Mobile Rig",
                            })
                          }
                          className="p-2 rounded-[8px] text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Deauthorize device"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── TAB 4: SECURITY & PASSWORD ─────────────────────────── */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white border-slate-200/80 text-slate-900 rounded-[16px] max-w-xl shadow-xs">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Change Account Password</h3>
                    <p className="text-xs text-slate-500">
                      Ensure your account is protected with a strong, multi-character password.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Current Password</label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-white border-slate-200 text-slate-900 text-xs rounded-[10px] focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">New Password</label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="bg-white border-slate-200 text-slate-900 text-xs rounded-[10px] focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Confirm New Password</label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="bg-white border-slate-200 text-slate-900 text-xs rounded-[10px] focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={changePasswordMutation.isPending}
                      className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs rounded-[10px] cursor-pointer shadow-sm"
                    >
                      <Lock className="size-3.5 mr-1" />
                      {changePasswordMutation.isPending ? "Updating Password..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

        </div>

        {/* ── MODAL: DELETE AVATAR CONFIRMATION ───────────────────── */}
        <Dialog open={showAvatarDeleteModal} onOpenChange={setShowAvatarDeleteModal}>
          <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-md shadow-2xl rounded-[16px]">
            <DialogHeader>
              <div className="size-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-2">
                <Trash2 className="size-5" />
              </div>
              <DialogTitle className="text-base font-bold text-slate-900">Remove Profile Photo</DialogTitle>
              <DialogDescription className="text-slate-600 text-xs">
                Are you sure you want to remove your profile picture? It will be purged from Cloudinary storage.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowAvatarDeleteModal(false)}
                className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs rounded-[8px] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                disabled={deleteAvatarMutation.isPending}
                onClick={handleConfirmDeleteAvatar}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-[8px] cursor-pointer shadow-xs"
              >
                {deleteAvatarMutation.isPending ? "Removing..." : "Remove Photo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── MODAL: DEAUTHORIZE DEVICE CONFIRMATION ──────────────── */}
        <Dialog open={!!deviceToDelete} onOpenChange={() => setDeviceToDelete(null)}>
          <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-md shadow-2xl rounded-[16px]">
            <DialogHeader>
              <div className="size-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-2">
                <Laptop className="size-5" />
              </div>
              <DialogTitle className="text-base font-bold text-slate-900">Deauthorize Device</DialogTitle>
              <DialogDescription className="text-slate-600 text-xs">
                Are you sure you want to remove <strong className="text-slate-900">"{deviceToDelete?.name}"</strong> ({deviceToDelete?.platform})? It will be logged out immediately.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeviceToDelete(null)}
                className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs rounded-[8px] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                disabled={removeDeviceMutation.isPending}
                onClick={handleConfirmDeleteDevice}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-[8px] cursor-pointer shadow-xs"
              >
                {removeDeviceMutation.isPending ? "Removing..." : "Deauthorize Device"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── MODAL: SUBSCRIPTION PAYMENT CHECKOUT ─────────────────── */}
        <Dialog open={!!selectedPlanForPayment} onOpenChange={() => setSelectedPlanForPayment(null)}>
          <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-lg shadow-2xl rounded-[16px]">
            <DialogHeader>
              <div className="size-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                <CreditCard className="size-5" />
              </div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Activate {selectedPlanForPayment?.name}
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-xs">
                Confirm your subscription and payment method to unlock full church presentation features.
              </DialogDescription>
            </DialogHeader>

            {selectedPlanForPayment && (
              <div className="space-y-4 py-2 text-xs">
                <div className="p-4 rounded-[12px] bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{selectedPlanForPayment.name}</span>
                    <span className="text-purple-700 font-bold font-mono text-sm">
                      {selectedPlanForPayment.price} {selectedPlanForPayment.billingPeriod}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">{selectedPlanForPayment.description}</p>
                  <div className="text-[10px] text-slate-400 font-medium">Billed semi-annually (180 days sanctuary access)</div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Payment Channel</label>
                  <div className="p-3 rounded-[10px] bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <CreditCard className="size-4 text-purple-600" />
                      <span>Card / Paystack Live Checkout</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-semibold">
                      Instant Activation
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedPlanForPayment(null)}
                className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs rounded-[8px] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                disabled={paymentProcessing}
                onClick={handleProcessPayment}
                className="bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs rounded-[8px] gap-1.5 cursor-pointer shadow-xs"
              >
                <Lock className="size-3" />
                {paymentProcessing ? "Authorizing Payment..." : "Confirm & Pay"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  )
}
