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
  CheckCircle2,
  AlertTriangle,
  Lock,
  LogOut,
  Save,
  Sparkles,
  RefreshCw,
  Crown,
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
    tier: "free",
    name: "Free Community",
    priceMonthly: "$0",
    priceAnnual: "$0",
    description: "Basic timer & live broadcast overlay for small home cells.",
    desktops: 1,
    mobiles: 1,
    features: ["Standard timer overlay", "Basic OBS/vMix broadcast output", "Community Discord support"],
  },
  {
    tier: "mini",
    name: "Mini Setup",
    priceMonthly: "$9",
    priceAnnual: "$89",
    description: "Essential presentation, PDF viewing, and song projection.",
    desktops: 1,
    mobiles: 3,
    features: [
      "Presentation & Scene controls",
      "PDF & Scripture viewer",
      "Song library & basic chorus flow",
      "Up to 3 mobile stage controllers",
    ],
  },
  {
    tier: "standard",
    name: "Standard Church",
    popular: true,
    priceMonthly: "$24",
    priceAnnual: "$239",
    description: "Full dual-screen projector, slide builder, and stage timing.",
    desktops: 1,
    mobiles: 5,
    features: [
      "Dual screen multi-monitor output",
      "Interval timers & dynamic view changes",
      "PDF annotation & Slide editor",
      "Up to 5 mobile stage controllers",
      "Priority email & ticket support",
    ],
  },
  {
    tier: "large",
    name: "Large Sanctuary",
    priceMonthly: "$49",
    priceAnnual: "$489",
    description: "Advanced scene animations, transitions, and sing-along lyrics.",
    desktops: 2,
    mobiles: 5,
    features: [
      "2 Sanctuary projection workstations",
      "Scene transitions & dynamic animation engine",
      "Sing-Along & Read-Along lyric cues",
      "Scheduled timer automations",
      "Dedicated account manager",
    ],
  },
  {
    tier: "premium",
    name: "Enterprise Multi-Campus",
    priceMonthly: "$99",
    priceAnnual: "$980",
    description: "Unlimited projection rigs, companion stage devices, and full access.",
    desktops: "Unlimited",
    mobiles: "Unlimited",
    features: [
      "Unlimited Sanctuary desktops",
      "Unlimited stage companion phones/tablets",
      "Multi-Campus cloud sync",
      "Custom branding & white-labeling",
      "24/7 dedicated telephone support",
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

  const { data: userData, isLoading, isError } = useCurrentUserQuery()
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
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly")
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
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      })
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
      toast.success(`Removed ${deviceToDelete.name}`)
      setDeviceToDelete(null)
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
        billingCycle,
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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 text-purple-500 animate-spin" />
          <p className="text-sm text-slate-400">Loading your profile & subscription...</p>
        </div>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pt-20">
        <Card className="max-w-md bg-slate-900 border-slate-800 text-white text-center p-6 space-y-4">
          <AlertTriangle className="size-10 text-amber-400 mx-auto" />
          <h2 className="text-lg font-bold">Session Expired or Invalid</h2>
          <p className="text-xs text-slate-400">Please log in again to access your account dashboard.</p>
          <Button onClick={() => navigate("/login")} className="w-full bg-purple-600 hover:bg-purple-700">
            Go to Login
          </Button>
        </Card>
      </div>
    )
  }

  // Days left calculation
  const isTrial = user.isTrial
  const remainingDays = user.trialRemainingDays ?? (
    user.subscriptionExpiresAt
      ? Math.max(0, Math.ceil((new Date(user.subscriptionExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : isTrial ? 60 : 0
  )

  const activeDesktops = user.licenseQuotas?.activeDesktops || []
  const activeMobiles = user.licenseQuotas?.activeMobileUsers || []
  const maxDesktops = user.licenseQuotas?.maxDesktops || 1
  const maxMobiles = user.licenseQuotas?.maxMobileUsers || 3

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── HEADER BANNER ───────────────────────────────────────── */}
        <div className="relative rounded-[20px] bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-900/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              {/* Profile Avatar with Cloudinary Integration */}
              <div className="relative group">
                <div className="size-24 sm:size-28 rounded-full border-2 border-purple-500/40 p-1 bg-slate-900 shadow-xl overflow-hidden flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="size-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-full rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-black">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1 cursor-pointer"
                  title="Change Profile Photo"
                >
                  <Camera className="size-5 text-purple-300" />
                  <span>Change</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
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
                  <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/40 text-xs px-2.5 py-0.5 capitalize">
                    {user.subscriptionTier || "Trial"} Plan
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <Building className="size-3.5 text-purple-400" />
                  {user.churchName || "Community Worship Center"} · {user.roleTitle || "Media Lead"}
                </p>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="size-3 text-slate-500" />
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
                  className="border-red-900/40 text-red-400 hover:bg-red-950/40 text-xs rounded-[10px] cursor-pointer"
                >
                  <Trash2 className="size-3.5 mr-1" />
                  Remove Photo
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-slate-800 text-slate-300 hover:bg-slate-900 text-xs rounded-[10px] cursor-pointer"
              >
                <LogOut className="size-3.5 mr-1 text-slate-400" />
                Sign Out
              </Button>
              <Button
                size="sm"
                onClick={() => setActiveTab("subscription")}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-[10px] shadow-lg shadow-purple-900/20 cursor-pointer"
              >
                <Sparkles className="size-3.5 mr-1" />
                Upgrade Plan
              </Button>
            </div>
          </div>

          {/* Subscription Expiry Alert Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="size-4 text-purple-400 shrink-0" />
              <span>
                {isTrial ? "60-Day Free Trial" : "Active Subscription"}:{" "}
                <strong className="text-white font-semibold">
                  {remainingDays} days remaining
                </strong>
                {user.subscriptionExpiresAt && (
                  <span className="text-slate-400 ml-1">
                    (Renews {new Date(user.subscriptionExpiresAt).toLocaleDateString()})
                  </span>
                )}
              </span>
            </div>

            <div className="w-full sm:w-64 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, (remainingDays / 60) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── TABS NAVIGATION ─────────────────────────────────────── */}
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2 scrollbar-none">
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
                  "flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                  isActive
                    ? "bg-purple-600/15 text-purple-300 border border-purple-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                )}
              >
                <Icon className={cn("size-4", isActive ? "text-purple-400" : "text-slate-500")} />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-purple-300 border border-slate-700">
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
            <Card className="bg-slate-900/90 border-slate-800 text-white rounded-[16px]">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Personal & Ministry Details</h3>
                    <p className="text-xs text-slate-400">
                      Update your church leadership name, primary Bible translation, and communication channels.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    form="profile-form"
                    disabled={updateProfileMutation.isPending}
                    className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-[10px] gap-1.5 cursor-pointer"
                  >
                    <Save className="size-3.5" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>

                <form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Full Name / Pastor Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Pastor Are Oluwasegun"
                        className="bg-slate-950 border-slate-800 text-white text-xs rounded-[10px]"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Church / Ministry Name</label>
                      <Input
                        value={formData.churchName}
                        onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                        placeholder="e.g. Grace Sanctuary Global"
                        className="bg-slate-950 border-slate-800 text-white text-xs rounded-[10px]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Email Address (Account ID)</label>
                      <Input
                        value={user.email}
                        disabled
                        className="bg-slate-950/50 border-slate-800 text-slate-400 text-xs rounded-[10px] cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Phone Number</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-1234"
                        className="bg-slate-950 border-slate-800 text-white text-xs rounded-[10px]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Role / Ministry Title</label>
                      <Input
                        value={formData.roleTitle}
                        onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                        placeholder="Senior Pastor / Media Director"
                        className="bg-slate-950 border-slate-800 text-white text-xs rounded-[10px]"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Preferred Bible Translation</label>
                      <select
                        value={formData.preferredBibleTranslation}
                        onChange={(e) => setFormData({ ...formData, preferredBibleTranslation: e.target.value })}
                        className="w-full h-9 rounded-[10px] bg-slate-950 border border-slate-800 text-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        {BIBLE_TRANSLATIONS.map((trans) => (
                          <option key={trans} value={trans}>
                            {trans} Translation
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Live Stream / Broadcast Channel</label>
                      <Input
                        value={formData.channelLink}
                        onChange={(e) => setFormData({ ...formData, channelLink: e.target.value })}
                        placeholder="https://youtube.com/@yourchurch"
                        className="bg-slate-950 border-slate-800 text-white text-xs rounded-[10px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Ministry Bio / Mission Note</label>
                    <Textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Brief note about your worship team, sanctuary size, or broadcast setup..."
                      className="bg-slate-950 border-slate-800 text-white text-xs rounded-[10px] resize-none"
                    />
                  </div>

                  {/* Notification Preferences */}
                  <div className="pt-4 border-t border-slate-800/80 space-y-3">
                    <h4 className="text-xs font-bold text-slate-300">Email & Telemetry Preferences</h4>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.emailUpdates}
                          onChange={(e) => setFormData({ ...formData, emailUpdates: e.target.checked })}
                          className="rounded border-slate-800 text-purple-600 focus:ring-purple-500"
                        />
                        Product & Feature Updates
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.serviceReminders}
                          onChange={(e) => setFormData({ ...formData, serviceReminders: e.target.checked })}
                          className="rounded border-slate-800 text-purple-600 focus:ring-purple-500"
                        />
                        Subscription & Renewal Alerts
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.weeklyDigest}
                          onChange={(e) => setFormData({ ...formData, weeklyDigest: e.target.checked })}
                          className="rounded border-slate-800 text-purple-600 focus:ring-purple-500"
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
            <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border-slate-800 text-white rounded-[16px]">
              <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Crown className="size-5 text-purple-400" />
                    <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">Current Active Plan</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white capitalize">
                    {user.subscriptionTier || "Trial"} Tier
                  </h2>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Allows up to <strong className="text-purple-300">{maxDesktops} sanctuary desktop(s)</strong> and{" "}
                    <strong className="text-purple-300">{maxMobiles} companion stage device(s)</strong>.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="p-3 rounded-[12px] bg-slate-950/80 border border-slate-800 text-center px-5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Days Remaining</span>
                    <div className="text-xl font-bold text-white font-mono">{remainingDays} Days</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan Selector & Comparison */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">Upgrade or Downgrade Plan</h3>
                  <p className="text-xs text-slate-400">
                    Switch tiers anytime. Instant license quota adjustments across all sanctuary desktops.
                  </p>
                </div>

                {/* Monthly / Annual Billing Toggle */}
                <div className="flex items-center bg-slate-900 p-1 rounded-[10px] border border-slate-800 self-start sm:self-auto">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-[8px] transition-colors cursor-pointer",
                      billingCycle === "monthly" ? "bg-purple-700 text-white" : "text-slate-400 hover:text-white"
                    )}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("annually")}
                    className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-[8px] transition-colors flex items-center gap-1 cursor-pointer",
                      billingCycle === "annually" ? "bg-purple-700 text-white" : "text-slate-400 hover:text-white"
                    )}
                  >
                    Annual <span className="text-[9px] text-emerald-400 font-bold font-mono">Save 20%</span>
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {PLANS.filter((p) => p.tier !== "free").map((plan) => {
                  const isCurrent = user.subscriptionTier === plan.tier
                  const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceAnnual
                  const period = billingCycle === "monthly" ? "/mo" : "/yr"

                  return (
                    <Card
                      key={plan.tier}
                      className={cn(
                        "bg-slate-900/90 border text-white rounded-[16px] flex flex-col justify-between transition-all",
                        isCurrent
                          ? "border-purple-500/60 shadow-lg shadow-purple-900/10 ring-1 ring-purple-500/30"
                          : "border-slate-800 hover:border-slate-700"
                      )}
                    >
                      <CardContent className="p-6 space-y-5">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-white text-base">{plan.name}</h4>
                            {plan.popular && (
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px]">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-white font-mono">{price}</span>
                            <span className="text-xs text-slate-400">{period}</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{plan.description}</p>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-slate-800/80">
                          <div className="text-[11px] font-semibold text-purple-300">
                            {plan.desktops} Desktop(s) · {plan.mobiles} Mobile Stage Rigs
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {plan.features.map((f, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                                <span className="line-clamp-1">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          disabled={isCurrent}
                          onClick={() => setSelectedPlanForPayment(plan)}
                          className={cn(
                            "w-full rounded-[10px] text-xs font-semibold cursor-pointer",
                            isCurrent
                              ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                              : "bg-purple-700 hover:bg-purple-800 text-white"
                          )}
                        >
                          {isCurrent ? "Current Plan" : "Choose & Pay"}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
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
                <h3 className="text-base font-bold text-white">Registered Sanctuary Projection Workstations</h3>
                <p className="text-xs text-slate-400">
                  Manage active desktop presentation apps and mobile stage controllers linked to this license.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Badge className="bg-slate-900 border-slate-800 text-slate-300">
                  Desktops: {activeDesktops.length} / {maxDesktops}
                </Badge>
                <Badge className="bg-slate-900 border-slate-800 text-slate-300">
                  Mobiles: {activeMobiles.length} / {maxMobiles}
                </Badge>
              </div>
            </div>

            {/* Desktops List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Laptop className="size-4 text-purple-400" /> Sanctuary Desktop Computers ({activeDesktops.length})
              </h4>

              {activeDesktops.length === 0 ? (
                <Card className="bg-slate-900/60 border-slate-800 text-center p-8 rounded-[16px]">
                  <Laptop className="size-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No desktop devices registered yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Download and log into the OCS desktop app to register your first sanctuary workstation.
                  </p>
                  <Button asChild size="sm" className="mt-4 bg-purple-700 hover:bg-purple-800 text-xs rounded-[10px]">
                    <Link to="/download">Download Desktop App</Link>
                  </Button>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {activeDesktops.map((dev: any) => (
                    <div
                      key={dev.deviceId || dev._id}
                      className="p-4 rounded-[14px] bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 shadow-md"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="size-9 rounded-[10px] bg-purple-950/60 border border-purple-800/40 text-purple-300 flex items-center justify-center shrink-0">
                          <Laptop className="size-5" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="font-bold text-white text-xs truncate">
                            {dev.name || "Sanctuary Desktop"}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                            <span>ID: {(dev.deviceId || dev._id || "").slice(0, 12)}...</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
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
                        className="p-2 rounded-[8px] text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
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
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="size-4 text-purple-400" /> Stage Mobile Controllers ({activeMobiles.length})
              </h4>

              {activeMobiles.length === 0 ? (
                <div className="p-6 rounded-[14px] bg-slate-900/40 border border-slate-800/80 text-center text-xs text-slate-500">
                  No mobile stage controllers connected. Scan stage QR codes in the desktop app to connect mobile rigs.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {activeMobiles.map((dev: any) => (
                    <div
                      key={dev.deviceId || dev._id}
                      className="p-4 rounded-[14px] bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 shadow-md"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="size-9 rounded-[10px] bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 flex items-center justify-center shrink-0">
                          <Smartphone className="size-5" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="font-bold text-white text-xs truncate">
                            {dev.name || "Stage Controller"}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            ID: {(dev.deviceId || dev._id || "").slice(0, 12)}...
                          </div>
                          <div className="text-[10px] text-slate-500">
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
                        className="p-2 rounded-[8px] text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
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
            <Card className="bg-slate-900/90 border-slate-800 text-white rounded-[16px] max-w-xl">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white">Change Account Password</h3>
                  <p className="text-xs text-slate-400">
                    Ensure your account is protected with a strong, multi-character password.
                  </p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Current Password</label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-slate-950 border-slate-800 text-white text-xs rounded-[10px]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">New Password</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="bg-slate-950 border-slate-800 text-white text-xs rounded-[10px]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Confirm New Password</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="bg-slate-950 border-slate-800 text-white text-xs rounded-[10px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs rounded-[10px] cursor-pointer"
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
        <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-2">
              <Trash2 className="size-5" />
            </div>
            <DialogTitle className="text-base font-bold text-white">Remove Profile Photo</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Are you sure you want to remove your profile picture? It will be purged from Cloudinary storage.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowAvatarDeleteModal(false)}
              className="border-slate-800 text-slate-300 hover:bg-slate-900 text-xs rounded-[8px] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              disabled={deleteAvatarMutation.isPending}
              onClick={handleConfirmDeleteAvatar}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-[8px] cursor-pointer"
            >
              {deleteAvatarMutation.isPending ? "Removing..." : "Remove Photo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── MODAL: DEAUTHORIZE DEVICE CONFIRMATION ──────────────── */}
      <Dialog open={!!deviceToDelete} onOpenChange={() => setDeviceToDelete(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-2">
              <Laptop className="size-5" />
            </div>
            <DialogTitle className="text-base font-bold text-white">Deauthorize Device</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Are you sure you want to remove <strong className="text-white">"{deviceToDelete?.name}"</strong> ({deviceToDelete?.platform})? It will be logged out immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeviceToDelete(null)}
              className="border-slate-800 text-slate-300 hover:bg-slate-900 text-xs rounded-[8px] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              disabled={removeDeviceMutation.isPending}
              onClick={handleConfirmDeleteDevice}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-[8px] cursor-pointer"
            >
              {removeDeviceMutation.isPending ? "Removing..." : "Deauthorize Device"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── MODAL: SUBSCRIPTION PAYMENT CHECKOUT ─────────────────── */}
      <Dialog open={!!selectedPlanForPayment} onOpenChange={() => setSelectedPlanForPayment(null)}>
        <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-lg">
          <DialogHeader>
            <div className="size-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
              <CreditCard className="size-5" />
            </div>
            <DialogTitle className="text-base font-bold text-white">
              Activate {selectedPlanForPayment?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Confirm your subscription and payment method to unlock full church presentation features.
            </DialogDescription>
          </DialogHeader>

          {selectedPlanForPayment && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-4 rounded-[12px] bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{selectedPlanForPayment.name}</span>
                  <span className="text-purple-400 font-bold font-mono text-sm">
                    {billingCycle === "monthly"
                      ? `${selectedPlanForPayment.priceMonthly}/month`
                      : `${selectedPlanForPayment.priceAnnual}/year`}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">{selectedPlanForPayment.description}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Payment Channel</label>
                <div className="p-3 rounded-[10px] bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4 text-purple-400" />
                    <span>Card / Paystack Live Checkout</span>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
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
              className="border-slate-800 text-slate-300 hover:bg-slate-900 text-xs rounded-[8px] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              disabled={paymentProcessing}
              onClick={handleProcessPayment}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-[8px] gap-1.5 cursor-pointer"
            >
              <Lock className="size-3" />
              {paymentProcessing ? "Authorizing Payment..." : "Confirm & Pay"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
