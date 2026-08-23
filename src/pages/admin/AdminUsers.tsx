import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search, Shield, UserPlus,
  CheckCircle2, AlertCircle, Building2,
  KeyRound, Users, ShieldAlert, Monitor, Smartphone,
  Trash2, AlertTriangle, Loader2, Radio, Mic, Check, Sliders
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  useUsersQuery,
  useAdminUsersQuery,
  useCreateUserMutation,
  useRegisterAdminMutation,
  useDeleteUserMutation,
  useUpdateUserTierMutation,
} from "@/lib/queries"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type Role = "super_admin" | "church_admin" | "user"
type CustomerCategory = "church" | "streamer" | "podcast"

interface UserRecord {
  id: string
  name: string
  email: string
  church: string
  customerType?: CustomerCategory
  channelLink?: string
  podcastLink?: string
  role: Role
  subscriptionTier?: string
  trialRemainingDays?: number
  isTrial?: boolean
  desktopsQuota?: string
  mobileQuota?: string
  lastLogin: string
  joined: string
}

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<"customers" | "admins">("customers")
  const [search, setSearch] = useState("")
  
  // Customer creation modal state
  const [isCustomerOpen, setIsCustomerOpen] = useState(false)
  const [customerType, setCustomerType] = useState<CustomerCategory>("church")
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    password: "",
    orgIdentifier: "",
    role: "church_admin",
  })
  const [customerSuccess, setCustomerSuccess] = useState("")
  const [customerError, setCustomerError] = useState("")

  // Admin creation modal state
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "WaveIO In-House HQ",
  })
  const [adminSuccess, setAdminSuccess] = useState("")
  const [adminError, setAdminError] = useState("")
  
  // Deletion modal state
  const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Plan override state
  const [customerToEditPlan, setCustomerToEditPlan] = useState<UserRecord | null>(null)
  const [selectedPlanTier, setSelectedPlanTier] = useState<string>("standard")
  const [extendMonths, setExtendMonths] = useState<number>(0)

  const { data: remoteCustomers, isLoading: isCustomersLoading, refetch: refetchCustomers } = useUsersQuery()
  const { data: remoteAdmins, isLoading: isAdminsLoading, refetch: refetchAdmins } = useAdminUsersQuery()
  const createUserMutation = useCreateUserMutation()
  const registerAdminMutation = useRegisterAdminMutation()
  const deleteUserMutation = useDeleteUserMutation()
  const updateUserTierMutation = useUpdateUserTierMutation()

  const customersList: UserRecord[] = (remoteCustomers || []).map((u: any, i: number) => {
    const rawRole = u.role || "church_admin"
    const role: Role = (rawRole === "super_admin" || rawRole === "admin")
      ? "super_admin"
      : (rawRole === "church_admin" ? "church_admin" : "user")

    const activeDesktops = u.licenseQuotas?.activeDesktops?.length || 0
    const activeMobiles = u.licenseQuotas?.activeMobileUsers?.length || 0
    const tier = u.subscriptionTier || u.effectiveTier || "trial"
    const remainingDays = u.trialRemainingDays ?? (u.graceExpiresAt ? Math.max(0, Math.ceil((new Date(u.graceExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 60)

    return {
      id: u.id || u._id || `c-${i}`,
      name: u.name || u.email?.split("@")[0] || "User",
      email: u.email || "",
      church: u.church || u.churchName || "Community Church",
      customerType: (u.customerType as CustomerCategory) || "church",
      channelLink: u.channelLink || "",
      podcastLink: u.podcastLink || "",
      role,
      subscriptionTier: tier,
      trialRemainingDays: remainingDays,
      isTrial: u.isTrial ?? (tier === "trial"),
      desktopsQuota: `${activeDesktops} / ${u.licenseQuotas?.maxDesktops || (tier === "large" ? 2 : 1)}`,
      mobileQuota: `${activeMobiles} / ${u.licenseQuotas?.maxMobileUsers || (tier === "standard" || tier === "large" ? 5 : 3)}`,
      lastLogin: u.lastLogin || "Active",
      joined: u.joined || (u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "2026-08-22"),
    }
  })

  const adminsList: UserRecord[] = (remoteAdmins || []).map((u: any, i: number) => {
    return {
      id: u.id || u._id || `a-${i}`,
      name: u.name || u.email?.split("@")[0] || "In-House Admin",
      email: u.email || "",
      church: u.church || u.churchName || "WaveIO In-House HQ",
      role: "super_admin",
      desktopsQuota: "Unlimited",
      mobileQuota: "Unlimited",
      lastLogin: u.lastLogin || "Active",
      joined: u.joined || (u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "2026-08-22"),
    }
  })

  const currentList = activeTab === "customers" ? customersList : adminsList

  const filtered = currentList.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.church.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  // Handle Customer Creation (POST /api/auth/users or /api/auth/register)
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerForm.email.trim() || !customerForm.password.trim() || !customerForm.orgIdentifier.trim()) return

    setCustomerError("")
    try {
      await createUserMutation.mutateAsync({
        name: customerForm.name.trim() || customerForm.email.split("@")[0],
        email: customerForm.email.trim(),
        password: customerForm.password.trim(),
        customerType,
        churchName: customerForm.orgIdentifier.trim(),
        channelLink: customerType === "streamer" ? customerForm.orgIdentifier.trim() : "",
        podcastLink: customerType === "podcast" ? customerForm.orgIdentifier.trim() : "",
        role: customerForm.role,
      })
      await refetchCustomers()
      setCustomerSuccess(`Customer ${customerType} account created successfully!`)
      toast.success("Customer account created!", {
        description: `${customerForm.orgIdentifier} (${customerForm.email}) is registered.`,
      })
      setCustomerForm({ name: "", email: "", password: "", orgIdentifier: "", role: "church_admin" })
      setTimeout(() => {
        setIsCustomerOpen(false)
        setCustomerSuccess("")
      }, 1000)
    } catch (err: any) {
      const errMsg = err.message || "Failed to create customer. Please check email uniqueness."
      setCustomerError(errMsg)
      toast.error("Failed to create customer", {
        description: errMsg,
      })
    }
  }

  // Handle In-House Admin Creation (Strictly POST /api/auth/register/admin)
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminForm.email.trim() || !adminForm.password.trim()) return

    setAdminError("")
    try {
      await registerAdminMutation.mutateAsync({
        name: adminForm.name.trim() || "In-House Admin",
        email: adminForm.email.trim(),
        password: adminForm.password.trim(),
        churchName: adminForm.department.trim() || "WaveIO In-House HQ",
      })
      await refetchAdmins()
      setAdminSuccess("In-House Super Admin created successfully!")
      toast.success("In-House Super Admin created!", {
        description: `${adminForm.email} has been provisioned console access.`,
      })
      setAdminForm({ name: "", email: "", password: "", department: "WaveIO In-House HQ" })
      setTimeout(() => {
        setIsAdminOpen(false)
        setAdminSuccess("")
      }, 1000)
    } catch (err: any) {
      const errMsg = err.message || "Failed to create admin. Please check email uniqueness."
      setAdminError(errMsg)
      toast.error("Failed to create in-house admin", {
        description: errMsg,
      })
    }
  }

  // Handle Confirm User Deletion Modal
  const handleConfirmDelete = async () => {
    if (!userToDelete) return

    setDeletingId(userToDelete.id)
    try {
      await deleteUserMutation.mutateAsync(userToDelete.id)
      toast.success("Account deleted successfully", {
        description: `${userToDelete.name} (${userToDelete.email}) was permanently deleted.`,
      })
      setUserToDelete(null)
      await Promise.all([refetchCustomers(), refetchAdmins()])
    } catch (err: any) {
      toast.error("Failed to delete account", {
        description: err.message || "An unexpected error occurred while removing the user.",
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">User & Access Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Switch between registered customer churches and internal in-house administrators.
          </p>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-[12px]">
          <button
            type="button"
            onClick={() => { setActiveTab("customers"); setSearch("") }}
            className={cn(
              "px-4 py-2 rounded-[8px] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
              activeTab === "customers"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Users className="size-3.5" />
            Customers ({customersList.length})
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("admins"); setSearch("") }}
            className={cn(
              "px-4 py-2 rounded-[8px] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
              activeTab === "admins"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Shield className="size-3.5" />
            In-House Admins ({adminsList.length})
          </button>
        </div>
      </div>

      {/* ── TAB 1: CUSTOMERS ────────────────────────────────────── */}
      {activeTab === "customers" && (
        <div className="space-y-6">
          {/* Action Row & Create Customer Modal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30 text-xs px-3 py-1 rounded-[12px]">
                Registered Accounts · 2 Desktops & 5 Mobile Licenses
              </Badge>
            </div>

            <Dialog open={isCustomerOpen} onOpenChange={setIsCustomerOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-[12px] font-semibold shadow-lg shadow-blue-900/30">
                  <UserPlus className="size-4" />
                  Create New Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <UserPlus className="size-5 text-blue-400" />
                    Register New Customer Account
                  </DialogTitle>
                  <DialogDescription className="text-slate-400 text-xs">
                    Provision a customer account for Church, Streamer, or Podcaster with desktop and mobile licenses.
                  </DialogDescription>
                </DialogHeader>

                {/* 3 Customer Selection Cards */}
                <div className="space-y-1.5 pt-1">
                  <Label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Customer Account Type:
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "church" as const, title: "Church", icon: Building2, subtitle: "Sanctuary" },
                      { id: "streamer" as const, title: "Streamer", icon: Radio, subtitle: "Live Stream" },
                      { id: "podcast" as const, title: "Podcast", icon: Mic, subtitle: "Broadcast" },
                    ].map((card) => {
                      const isSelected = customerType === card.id
                      const Icon = card.icon
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => setCustomerType(card.id)}
                          className={cn(
                            "relative flex flex-col items-center text-center p-2.5 rounded-[10px] border transition-all cursor-pointer",
                            isSelected
                              ? "bg-blue-950/60 border-blue-500 ring-1 ring-blue-500 text-white"
                              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute top-1 right-1 size-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                              <Check className="size-2 stroke-[3]" />
                            </div>
                          )}
                          <Icon className={cn("size-4 mb-1", isSelected ? "text-blue-400" : "text-slate-500")} />
                          <span className="text-xs font-bold">{card.title}</span>
                          <span className="text-[10px] text-slate-500">{card.subtitle}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <form onSubmit={handleCreateCustomer} className="space-y-3.5 mt-2">
                  {customerSuccess && (
                    <div className="p-3 rounded-[8px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                      <CheckCircle2 className="size-4 shrink-0" />
                      <span>{customerSuccess}</span>
                    </div>
                  )}

                  {customerError && (
                    <div className="p-3 rounded-[8px] bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{customerError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="c-name" className="text-xs text-slate-300 font-semibold">
                        Lead Contact Name
                      </Label>
                      <Input
                        id="c-name"
                        placeholder="e.g. Pastor David / Alex Streamer"
                        value={customerForm.name}
                        onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                        className="bg-slate-950 border-slate-800 text-white text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="c-email" className="text-xs text-slate-300 font-semibold">
                        Email Address *
                      </Label>
                      <Input
                        id="c-email"
                        type="email"
                        placeholder="contact@domain.com"
                        value={customerForm.email}
                        onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                        required
                        className="bg-slate-950 border-slate-800 text-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Dynamic Organization / Channel / Podcast Link Input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="c-org" className="text-xs text-slate-300 font-semibold">
                      {customerType === "streamer"
                        ? "Channel / Stream Link *"
                        : (customerType === "podcast"
                            ? "Podcast Show Link or Title *"
                            : "Church / Ministry Name *")}
                    </Label>
                    <Input
                      id="c-org"
                      placeholder={
                        customerType === "streamer"
                          ? "e.g. YouTube, Twitch, TikTok, Instagram, or Facebook channel URL"
                          : (customerType === "podcast"
                              ? "e.g. Spotify, Apple Podcasts, YouTube Show link or Title"
                              : "e.g. Grace Assembly Church")
                      }
                      value={customerForm.orgIdentifier}
                      onChange={(e) => setCustomerForm({ ...customerForm, orgIdentifier: e.target.value })}
                      required
                      className="bg-slate-950 border-blue-900/60 focus-visible:border-blue-500 text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="c-role" className="text-xs text-slate-300 font-semibold">
                        Customer Role
                      </Label>
                      <select
                        id="c-role"
                        value={customerForm.role}
                        onChange={(e) => setCustomerForm({ ...customerForm, role: e.target.value })}
                        className="w-full h-10 px-3 rounded-[8px] bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="church_admin">Account Owner (Full License)</option>
                        <option value="user">Team Member (Shared Seat)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="c-password" className="text-xs text-slate-300 font-semibold">
                        Initial Password *
                      </Label>
                      <Input
                        id="c-password"
                        type="password"
                        placeholder="Minimum 8 characters"
                        value={customerForm.password}
                        onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })}
                        required
                        className="bg-slate-950 border-slate-800 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsCustomerOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createUserMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      {createUserMutation.isPending ? "Creating..." : "Provision Customer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Customer KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Registered Customers", value: customersList.length, icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10" },
              { label: "Desktop Workstation Seats", value: `${customersList.length * 2} Allocated`, icon: Monitor, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Mobile Companion Seats", value: `${customersList.length * 5} Allocated`, icon: Smartphone, color: "text-purple-400", bg: "bg-purple-500/10" },
            ].map((s) => (
              <Card key={s.label} className="bg-slate-900 shadow-lg shadow-black/20 rounded-[12px]">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn("size-10 rounded-[12px] flex items-center justify-center", s.bg)}>
                    <s.icon className={cn("size-5", s.color)} />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white">{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Customers Table */}
          <Card className="bg-slate-900 shadow-lg shadow-black/20 rounded-[12px]">
            <CardHeader className="p-5 pb-4 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-white">Customer Churches & Ministries</CardTitle>
                  <CardDescription className="text-slate-500 text-xs mt-0.5">
                    {filtered.length} of {customersList.length} customer accounts shown
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
                  <Input
                    placeholder="Search customers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 w-56 bg-slate-800 border-slate-700 text-slate-300 text-xs placeholder:text-slate-600 focus-visible:ring-purple-600 rounded-[12px]"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-500 pl-5">Customer</TableHead>
                    <TableHead className="text-slate-500">Organization / Channel</TableHead>
                    <TableHead className="text-slate-500">Plan & Entitlement</TableHead>
                    <TableHead className="text-slate-500">Role</TableHead>
                    <TableHead className="text-slate-500">Desktops</TableHead>
                    <TableHead className="text-slate-500">Mobile</TableHead>
                    <TableHead className="text-slate-500">Joined</TableHead>
                    <TableHead className="text-slate-500 pr-5 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isCustomersLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i} className="border-slate-800">
                        <TableCell className="py-4 pl-5">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-slate-800 animate-pulse" />
                            <div className="space-y-1.5">
                              <div className="h-3 w-28 bg-slate-800 rounded animate-pulse" />
                              <div className="h-2.5 w-36 bg-slate-800/60 rounded animate-pulse" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><div className="h-3 w-24 bg-slate-800 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-5 w-24 bg-slate-800 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-5 w-24 bg-slate-800 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-3 w-12 bg-slate-800 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-3 w-12 bg-slate-800 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-3 w-16 bg-slate-800 rounded animate-pulse" /></TableCell>
                        <TableCell className="pr-5 text-right"><div className="h-7 w-7 ml-auto bg-slate-800 rounded animate-pulse" /></TableCell>
                      </TableRow>
                    ))
                  ) : filtered.length === 0 ? (
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableCell colSpan={8} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Building2 className="size-8 text-slate-600" />
                          <p className="text-sm font-semibold text-slate-400">No customer accounts found</p>
                          <p className="text-xs text-slate-600">Register a new customer church to get started.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((u) => (
                      <TableRow key={u.id} className="border-slate-800 hover:bg-slate-800/40 cursor-pointer">
                        <TableCell className="py-3 pl-5">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarFallback className="bg-slate-700 text-slate-300 text-xs font-bold">
                                {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-xs font-semibold text-slate-200">{u.name}</div>
                              <div className="text-[10px] text-slate-500">{u.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs text-slate-300 font-medium">
                          <div className="flex items-center gap-2">
                            {u.customerType === "streamer" ? (
                              <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-[10px] px-1.5 py-0 flex items-center gap-1 shrink-0">
                                <Radio className="size-2.5" /> Streamer
                              </Badge>
                            ) : u.customerType === "podcast" ? (
                              <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-[10px] px-1.5 py-0 flex items-center gap-1 shrink-0">
                                <Mic className="size-2.5" /> Podcast
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30 text-[10px] px-1.5 py-0 flex items-center gap-1 shrink-0">
                                <Building2 className="size-2.5" /> Church
                              </Badge>
                            )}
                            <span className="truncate max-w-[180px]">{u.church}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          {u.subscriptionTier === "trial" ? (
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] px-2 py-0.5 font-semibold">
                              Trial ({u.trialRemainingDays ?? 60}d left)
                            </Badge>
                          ) : u.subscriptionTier === "free" ? (
                            <Badge className="bg-slate-700/50 text-slate-400 border-slate-700 text-[10px] px-2 py-0.5">
                              Free Mode
                            </Badge>
                          ) : u.subscriptionTier === "standard" ? (
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] px-2 py-0.5 font-semibold">
                              Standard Setup
                            </Badge>
                          ) : u.subscriptionTier === "large" ? (
                            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px] px-2 py-0.5 font-semibold">
                              Large Setup
                            </Badge>
                          ) : u.subscriptionTier === "premium" ? (
                            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] px-2 py-0.5 font-semibold">
                              Premium
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px] px-2 py-0.5 font-semibold">
                              Mini Setup
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] px-2 py-0.5">
                            {u.role === "church_admin" ? "Account Owner" : "Team Member"}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-xs font-mono text-slate-300">
                          {u.desktopsQuota}
                        </TableCell>
                        <TableCell className="py-3 text-xs font-mono text-slate-300">
                          {u.mobileQuota}
                        </TableCell>
                        <TableCell className="py-3 text-xs text-slate-500">{u.joined}</TableCell>
                        <TableCell className="py-3 pr-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setCustomerToEditPlan(u)
                                setSelectedPlanTier(u.subscriptionTier || "standard")
                                setExtendMonths(0)
                              }}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-[8px]"
                              title={`Change Plan for ${u.name}`}
                            >
                              <Sliders className="size-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setUserToDelete(u)
                              }}
                              className="h-8 w-8 p-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-[8px]"
                              title={`Delete ${u.name}`}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TAB 2: IN-HOUSE ADMIN USERS ─────────────────────────── */}
      {activeTab === "admins" && (
        <div className="space-y-6">
          {/* Action Row & Create In-House Admin Modal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-xs px-3 py-1 rounded-[8px]">
                <ShieldAlert className="size-3.5 mr-1 inline text-purple-400" />
                Strictly In-House Platform Console Administrators
              </Badge>
            </div>

            <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2 rounded-[12px] font-semibold shadow-lg shadow-purple-900/30">
                  <Shield className="size-4" />
                  Create In-House Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <Shield className="size-5 text-purple-400" />
                    Create In-House Super Admin
                  </DialogTitle>
                  <DialogDescription className="text-slate-400 text-xs">
                    Provision internal administrative credentials with full access to the Web Console and management dashboards.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateAdmin} className="space-y-4 mt-2">
                  {adminSuccess && (
                    <div className="p-3 rounded-[8px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                      <CheckCircle2 className="size-4 shrink-0" />
                      <span>{adminSuccess}</span>
                    </div>
                  )}

                  {adminError && (
                    <div className="p-3 rounded-[8px] bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{adminError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="a-name" className="text-xs text-slate-300 font-semibold">
                        Administrator Name
                      </Label>
                      <Input
                        id="a-name"
                        placeholder="e.g. Operations Admin"
                        value={adminForm.name}
                        onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                        className="bg-slate-950 border-slate-800 text-white text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="a-email" className="text-xs text-slate-300 font-semibold">
                        Admin Email Address / Login *
                      </Label>
                      <Input
                        id="a-email"
                        type="email"
                        placeholder="admin@waveio.app"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                        required
                        className="bg-slate-950 border-slate-800 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="a-dept" className="text-xs text-slate-300 font-semibold">
                      Department / Admin Unit
                    </Label>
                    <Input
                      id="a-dept"
                      placeholder="e.g. WaveIO In-House HQ / Infrastructure"
                      value={adminForm.department}
                      onChange={(e) => setAdminForm({ ...adminForm, department: e.target.value })}
                      className="bg-slate-950 border-slate-800 text-white text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="a-password" className="text-xs text-slate-300 font-semibold">
                      Master Admin Password *
                    </Label>
                    <Input
                      id="a-password"
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      required
                      className="bg-slate-950 border-slate-800 text-white text-sm"
                    />
                  </div>

                  {/* Security Alert Box */}
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-[8px] text-xs text-purple-300 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <KeyRound className="size-3.5 text-purple-400" />
                      In-House Privilege Notice:
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Super Admins have unrestricted authority to manage all church accounts, modify platform FAQs, and access sensitive dashboard telemetry.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAdminOpen(false)}
                      className="border-slate-800 text-slate-300 hover:bg-slate-800 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createUserMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
                    >
                      {createUserMutation.isPending ? "Creating..." : "Save Admin Account"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Admin KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "In-House Super Admins", value: adminsList.length, icon: Shield, color: "text-purple-400", bg: "bg-purple-500/10" },
              { label: "Console Access Tier", value: "Full Authorization", icon: KeyRound, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Admin Security Status", value: "Strict Isolation", icon: ShieldAlert, color: "text-blue-400", bg: "bg-blue-500/10" },
            ].map((s) => (
              <Card key={s.label} className="bg-slate-900 shadow-lg shadow-black/20 rounded-[12px]">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn("size-10 rounded-[12px] flex items-center justify-center", s.bg)}>
                    <s.icon className={cn("size-5", s.color)} />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white">{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Admins Table */}
          <Card className="bg-slate-900 shadow-lg shadow-black/20 rounded-[12px]">
            <CardHeader className="p-5 pb-4 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-white">In-House Platform Administrators</CardTitle>
                  <CardDescription className="text-slate-500 text-xs mt-0.5">
                    {filtered.length} of {adminsList.length} internal admins shown
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
                  <Input
                    placeholder="Search in-house admins..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 w-56 bg-slate-800 border-slate-700 text-slate-300 text-xs placeholder:text-slate-600 focus-visible:ring-purple-600 rounded-[12px]"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-500 pl-5">Administrator</TableHead>
                    <TableHead className="text-slate-500">Department / Unit</TableHead>
                    <TableHead className="text-slate-500">Security Tier</TableHead>
                    <TableHead className="text-slate-500">Console Privileges</TableHead>
                    <TableHead className="text-slate-500">Joined</TableHead>
                    <TableHead className="text-slate-500 pr-5 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isAdminsLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <TableRow key={i} className="border-slate-800">
                        <TableCell className="py-4 pl-5">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-slate-800 animate-pulse" />
                            <div className="space-y-1.5">
                              <div className="h-3 w-28 bg-slate-800 rounded animate-pulse" />
                              <div className="h-2.5 w-36 bg-slate-800/60 rounded animate-pulse" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><div className="h-3 w-24 bg-slate-800 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-5 w-24 bg-slate-800 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-3 w-16 bg-slate-800 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-3 w-16 bg-slate-800 rounded animate-pulse" /></TableCell>
                        <TableCell className="pr-5 text-right"><div className="h-7 w-7 ml-auto bg-slate-800 rounded animate-pulse" /></TableCell>
                      </TableRow>
                    ))
                  ) : filtered.length === 0 ? (
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableCell colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Shield className="size-8 text-slate-600" />
                          <p className="text-sm font-semibold text-slate-400">No in-house admin accounts found</p>
                          <p className="text-xs text-slate-600">Create a platform super admin account.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((u) => (
                      <TableRow key={u.id} className="border-slate-800 hover:bg-slate-800/40 cursor-pointer">
                        <TableCell className="py-3 pl-5">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarFallback className="bg-purple-900/60 text-purple-300 text-xs font-bold">
                                {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-xs font-semibold text-slate-200">{u.name}</div>
                              <div className="text-[10px] text-slate-500">{u.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs text-slate-300 font-medium">{u.church}</TableCell>
                        <TableCell className="py-3">
                          <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-[10px] px-2 py-0.5 flex items-center gap-1 w-fit">
                            <Shield className="size-2.5" />
                            In-House Super Admin
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-xs text-emerald-400 font-semibold">
                          Full Platform Console
                        </TableCell>
                        <TableCell className="py-3 text-xs text-slate-500">{u.joined}</TableCell>
                        <TableCell className="py-3 pr-5 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setUserToDelete(u)
                            }}
                            className="h-8 w-8 p-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-[8px]"
                            title={`Delete ${u.name}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ─────────────────────────── */}
      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && !deletingId && setUserToDelete(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
          <DialogHeader>
            <div className="size-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
              <AlertTriangle className="size-6 text-red-400" />
            </div>
            <DialogTitle className="text-lg font-bold text-white">
              Delete User Account
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              This action is permanent and cannot be reversed. All license quotas, device bindings, and authorizations for this account will be immediately terminated.
            </DialogDescription>
          </DialogHeader>

          {userToDelete && (
            <div className="p-3.5 rounded-[10px] bg-slate-950/80 border border-slate-800/80 space-y-2 mt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Account Name:</span>
                <span className="text-xs font-semibold text-white">{userToDelete.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Email:</span>
                <span className="text-xs font-mono text-slate-300">{userToDelete.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Organization:</span>
                <span className="text-xs text-slate-300">{userToDelete.church}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Role:</span>
                <Badge className={cn("text-[10px] px-2 py-0.5", userToDelete.role === "super_admin" ? "bg-purple-500/15 text-purple-300 border-purple-500/30" : "bg-blue-500/15 text-blue-300 border-blue-500/30")}>
                  {userToDelete.role === "super_admin" ? "In-House Super Admin" : "Church Customer"}
                </Badge>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              disabled={!!deletingId}
              onClick={() => setUserToDelete(null)}
              className="border-slate-800 text-slate-300 hover:bg-slate-800 text-xs rounded-[8px]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!!deletingId}
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-[8px] gap-2 shadow-lg shadow-red-900/30"
            >
              {deletingId ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-3.5" />
                  Yes, Delete Account
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── EDIT CUSTOMER PLAN & ENTITLEMENTS MODAL ───────────── */}
      <Dialog open={!!customerToEditPlan} onOpenChange={() => setCustomerToEditPlan(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200 sm:max-w-md rounded-[16px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400">
                <Sliders className="size-4" />
              </div>
              <DialogTitle className="text-base font-bold text-white">
                Manage Subscription Plan
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-400">
              Update the subscription tier and desktop permissions for{" "}
              <strong className="text-white">{customerToEditPlan?.church}</strong>.
            </DialogDescription>
          </DialogHeader>

          {customerToEditPlan && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                updateUserTierMutation.mutate(
                  {
                    userId: customerToEditPlan.id,
                    payload: {
                      subscriptionTier: selectedPlanTier,
                      extendMonths: Number(extendMonths) || 0,
                    },
                  },
                  {
                    onSuccess: () => {
                      toast.success(
                        `Plan updated to ${selectedPlanTier.toUpperCase()} for ${customerToEditPlan.church}`
                      )
                      refetchCustomers()
                      setCustomerToEditPlan(null)
                    },
                    onError: (err: any) => {
                      toast.error("Failed to update subscription tier", {
                        description: err?.message || "Could not update user plan",
                      })
                    },
                  }
                )
              }}
              className="space-y-4 pt-2"
            >
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">Target Subscription Tier</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "trial", label: "2-Month Trial", tag: "Mini Access" },
                    { id: "free", label: "Free Mode", tag: "Basic Only" },
                    { id: "mini", label: "Mini Setup", tag: "$2 / 6mo" },
                    { id: "standard", label: "Standard Setup", tag: "$3 / 6mo" },
                    { id: "large", label: "Large Setup", tag: "$5 / 6mo" },
                    { id: "premium", label: "Premium Tier", tag: "Full Access" },
                  ].map((t) => {
                    const isSelected = selectedPlanTier === t.id
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setSelectedPlanTier(t.id)}
                        className={cn(
                          "p-2.5 rounded-[10px] border text-left text-xs transition-all flex flex-col justify-between cursor-pointer",
                          isSelected
                            ? "bg-purple-950/50 border-purple-500 text-white ring-1 ring-purple-500/30"
                            : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        )}
                      >
                        <span className="font-bold">{t.label}</span>
                        <span className="text-[10px] text-slate-400">{t.tag}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">
                  Extend Grace / Subscription Expiry
                </Label>
                <select
                  value={extendMonths}
                  onChange={(e) => setExtendMonths(Number(e.target.value))}
                  className="w-full h-9 rounded-[10px] bg-slate-800 border border-slate-700 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value={0}>Keep current expiration date</option>
                  <option value={1}>Extend by +1 Month</option>
                  <option value={2}>Extend by +2 Months (Full Trial Refresh)</option>
                  <option value={6}>Extend by +6 Months (Standard Period)</option>
                  <option value={12}>Extend by +12 Months (1 Year)</option>
                </select>
              </div>

              <DialogFooter className="pt-3 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCustomerToEditPlan(null)}
                  className="text-slate-400 hover:text-white rounded-[10px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={updateUserTierMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-[10px]"
                >
                  {updateUserTierMutation.isPending ? "Saving..." : "Apply Plan Update"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

