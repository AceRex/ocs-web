import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search, Shield, User as UserIcon, UserPlus,
  CheckCircle2, AlertCircle, Sparkles
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUsersQuery, useCreateUserMutation } from "@/lib/queries"
import { cn } from "@/lib/utils"

type Role = "super_admin" | "church_admin" | "user"

interface UserRecord {
  id: string
  name: string
  email: string
  church: string
  role: Role
  desktopsQuota?: string
  mobileQuota?: string
  lastLogin: string
  joined: string
}

const mockUsers: UserRecord[] = [
  { id: "1", name: "WaveIO Master Admin", email: "waveio@ocs.app", church: "WaveIO In-House HQ", role: "super_admin", lastLogin: "Active Now", joined: "2026-08-22", desktopsQuota: "Unlimited", mobileQuota: "Unlimited" },
  { id: "2", name: "Pastor James A.", email: "pastor@redeemed.ng", church: "Redeemed Church", role: "church_admin", lastLogin: "2026-08-22", joined: "2025-06-14", desktopsQuota: "2 / 2", mobileQuota: "4 / 5" },
  { id: "3", name: "Sarah M.", email: "sarah@grace.org", church: "Grace Community", role: "church_admin", lastLogin: "2026-08-21", joined: "2025-08-01", desktopsQuota: "1 / 2", mobileQuota: "3 / 5" },
  { id: "4", name: "Elder David K.", email: "david@cityh.org", church: "City Harvest", role: "church_admin", lastLogin: "2026-08-20", joined: "2025-07-22", desktopsQuota: "2 / 2", mobileQuota: "5 / 5" },
  { id: "5", name: "Tech Team A.", email: "tech@harvestng.org", church: "Harvest City", role: "user", lastLogin: "2026-08-19", joined: "2025-09-05", desktopsQuota: "-", mobileQuota: "-" },
]

const roleConfig: Record<Role, { badge: string; label: string; icon: any }> = {
  super_admin: {
    badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    label: "In-House Super Admin",
    icon: Shield,
  },
  church_admin: {
    badge: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    label: "Church Admin (2 Desktops · 5 Mobile)",
    icon: UserPlus,
  },
  user: {
    badge: "bg-slate-700/30 text-slate-400 border-slate-700",
    label: "Team Member",
    icon: UserIcon,
  },
}

export default function AdminUsers() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    churchName: "",
    role: "church_admin",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const { data: remoteUsers } = useUsersQuery()
  const createUserMutation = useCreateUserMutation()

  const allUsers: UserRecord[] = remoteUsers && remoteUsers.length > 0
    ? remoteUsers.map((u: any, i: number) => {
        const rawRole = u.role || "church_admin"
        const role: Role = (rawRole === "super_admin" || rawRole === "admin")
          ? "super_admin"
          : (rawRole === "church_admin" ? "church_admin" : "user")

        return {
          id: u.id || u._id || `u-${i}`,
          name: u.name || u.email?.split("@")[0] || "User",
          email: u.email || "",
          church: u.church || u.churchName || "Community Church",
          role,
          desktopsQuota: role === "super_admin" ? "Unlimited" : (role === "church_admin" ? `${u.licenseQuotas?.activeDesktops?.length || 1} / 2` : "-"),
          mobileQuota: role === "super_admin" ? "Unlimited" : (role === "church_admin" ? `${u.licenseQuotas?.activeMobileUsers?.length || 2} / 5` : "-"),
          lastLogin: u.lastLogin || "Active",
          joined: u.joined || (u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "2026-08-22"),
        }
      })
    : mockUsers

  const filtered = allUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.church.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "all" || u.role === roleFilter
    return matchSearch && matchRole
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password.trim() || !form.churchName.trim()) return

    setErrorMessage("")
    try {
      await createUserMutation.mutateAsync({
        name: form.name.trim() || form.email.split("@")[0],
        email: form.email.trim(),
        password: form.password.trim(),
        churchName: form.churchName.trim(),
        role: form.role,
      })
      setSuccessMessage("Account created successfully!")
      setForm({ name: "", email: "", password: "", churchName: "", role: "church_admin" })
      setTimeout(() => {
        setIsCreateOpen(false)
        setSuccessMessage("")
      }, 1200)
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create user. Please check email uniqueness.")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Users & Team Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage in-house console admins, registered church admins (2 desktops / 5 mobile), and ministry team members.
          </p>
        </div>

        {/* Create User Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2 rounded-[12px] font-semibold shadow-lg shadow-purple-900/30">
              <UserPlus className="size-4" />
              Create New User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="size-5 text-purple-400" />
                Create User / Church Account
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                Register a church admin (2 desktop / 5 mobile limit), team member, or in-house console administrator.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              {successMessage && (
                <div className="p-3 rounded-[8px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-[8px] bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="u-name" className="text-xs text-slate-300 font-semibold">
                    Full Name
                  </Label>
                  <Input
                    id="u-name"
                    placeholder="e.g. Pastor James"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="u-email" className="text-xs text-slate-300 font-semibold">
                    Email Address *
                  </Label>
                  <Input
                    id="u-email"
                    type="email"
                    placeholder="pastor@church.org"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="bg-slate-950 border-slate-800 text-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="u-church" className="text-xs text-slate-300 font-semibold">
                  Church / Organization *
                </Label>
                <Input
                  id="u-church"
                  placeholder="e.g. Redeemed Christian Church"
                  value={form.churchName}
                  onChange={(e) => setForm({ ...form, churchName: e.target.value })}
                  required
                  className="bg-slate-950 border-slate-800 text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="u-role" className="text-xs text-slate-300 font-semibold">
                  Account Role & License Type
                </Label>
                <select
                  id="u-role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full h-10 px-3 rounded-[8px] bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="church_admin">Church Admin (2 Desktops · 5 Mobile Users Quota)</option>
                  <option value="user">Team Member (Mobile / Desktop Station)</option>
                  <option value="super_admin">In-House Super Admin (Dashboard Console)</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  {form.role === "church_admin" && "Church Admins appear in the Desktop Settings as organization license owners with 2 desktop & 5 mobile sharing seats."}
                  {form.role === "super_admin" && "Super Admins have full in-house access to all dashboard management consoles."}
                  {form.role === "user" && "Team Members access the desktop or mobile companion under their church's shared quota."}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="u-password" className="text-xs text-slate-300 font-semibold">
                  Initial Password *
                </Label>
                <Input
                  id="u-password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="bg-slate-950 border-slate-800 text-white text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="border-slate-800 text-slate-300 hover:bg-slate-800 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
                >
                  {createUserMutation.isPending ? "Creating..." : "Save Account"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Registered Accounts", value: allUsers.length, icon: UserIcon, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Church Admins (Org Licenses)", value: allUsers.filter((u) => u.role === "church_admin").length, icon: UserPlus, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "In-House Super Admins", value: allUsers.filter((u) => u.role === "super_admin").length, icon: Shield, color: "text-purple-400", bg: "bg-purple-500/10" },
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

      {/* Table */}
      <Card className="bg-slate-900 shadow-lg shadow-black/20 rounded-[12px]">
        <CardHeader className="p-5 pb-4 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-white">Accounts & Device Quotas</CardTitle>
              <CardDescription className="text-slate-500 text-xs mt-0.5">
                {filtered.length} of {allUsers.length} users shown
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Role filter */}
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { id: "all", label: "All" },
                  { id: "church_admin", label: "Church Admins" },
                  { id: "super_admin", label: "Super Admins" },
                  { id: "user", label: "Team Members" },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRoleFilter(r.id as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-[12px] text-xs font-medium transition-all cursor-pointer",
                      roleFilter === r.id
                        ? "bg-purple-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
                <Input
                  placeholder="Search accounts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 w-44 bg-slate-800 border-slate-700 text-slate-300 text-xs placeholder:text-slate-600 focus-visible:ring-purple-600 rounded-[12px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-500 pl-5">User</TableHead>
                <TableHead className="text-slate-500">Church / Organization</TableHead>
                <TableHead className="text-slate-500">Role</TableHead>
                <TableHead className="text-slate-500">Desktops (Max 2)</TableHead>
                <TableHead className="text-slate-500">Mobile (Max 5)</TableHead>
                <TableHead className="text-slate-500 pr-5">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => {
                const conf = roleConfig[u.role] || roleConfig.user
                return (
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
                    <TableCell className="py-3 text-xs text-slate-400 font-medium">{u.church}</TableCell>
                    <TableCell className="py-3">
                      <Badge className={cn("text-[10px] border px-2 py-0.5 flex items-center gap-1 w-fit", conf.badge)}>
                        <conf.icon className="size-3" />
                        {conf.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-xs font-mono text-slate-300">
                      {u.desktopsQuota}
                    </TableCell>
                    <TableCell className="py-3 text-xs font-mono text-slate-300">
                      {u.mobileQuota}
                    </TableCell>
                    <TableCell className="py-3 pr-5 text-xs text-slate-600">{u.joined}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}

