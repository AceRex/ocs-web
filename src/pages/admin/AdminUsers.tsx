import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Shield, User as UserIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type Role = "admin" | "user"

interface UserRecord {
  id: string
  name: string
  email: string
  church: string
  role: Role
  lastLogin: string
  joined: string
}

const mockUsers: UserRecord[] = [
  { id: "1", name: "Admin User", email: "admin@church.org", church: "OCS HQ", role: "admin", lastLogin: "2026-08-22", joined: "2025-01-10" },
  { id: "2", name: "Pastor James A.", email: "pastor@redeemed.ng", church: "Redeemed Church", role: "user", lastLogin: "2026-08-22", joined: "2025-06-14" },
  { id: "3", name: "Sarah M.", email: "sarah@grace.org", church: "Grace Community", role: "user", lastLogin: "2026-08-21", joined: "2025-08-01" },
  { id: "4", name: "Elder David K.", email: "david@cityh.org", church: "City Harvest", role: "user", lastLogin: "2026-08-20", joined: "2025-07-22" },
  { id: "5", name: "Tech Team A.", email: "tech@harvestng.org", church: "Harvest City", role: "user", lastLogin: "2026-08-19", joined: "2025-09-05" },
  { id: "6", name: "Mary O.", email: "mary@mountzion.org", church: "Mount Zion", role: "user", lastLogin: "2026-08-18", joined: "2025-10-18" },
  { id: "7", name: "Daniel F.", email: "daniel@livingword.org", church: "Living Word", role: "user", lastLogin: "2026-08-17", joined: "2026-01-02" },
  { id: "8", name: "Elijah B.", email: "elijah@glorytab.org", church: "Glory Tabernacle", role: "user", lastLogin: "2026-08-15", joined: "2026-03-15" },
]

const roleConfig: Record<Role, string> = {
  admin: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  user: "bg-slate-600/15 text-slate-400 border-slate-700",
}

export default function AdminUsers() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.church.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "all" || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-extrabold text-white">Users</h1>
        <p className="text-sm text-slate-500 mt-0.5">All registered accounts and their roles.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: mockUsers.length, icon: UserIcon, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Admins", value: mockUsers.filter((u) => u.role === "admin").length, icon: Shield, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Active This Week", value: 6, icon: UserIcon, color: "text-emerald-400", bg: "bg-emerald-500/10" },
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
              <CardTitle className="text-sm font-bold text-white">All Accounts</CardTitle>
              <CardDescription className="text-slate-500 text-xs mt-0.5">
                {filtered.length} of {mockUsers.length} users shown
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* Role filter */}
              <div className="flex gap-1.5">
                {(["all", "admin", "user"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={cn(
                      "px-3 py-1.5 rounded-[12px] text-xs font-medium transition-all cursor-pointer capitalize",
                      roleFilter === r
                        ? "bg-purple-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
                <Input
                  placeholder="Search..."
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
                <TableHead className="text-slate-500">Church</TableHead>
                <TableHead className="text-slate-500">Role</TableHead>
                <TableHead className="text-slate-500">Last Login</TableHead>
                <TableHead className="text-slate-500 pr-5">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
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
                  <TableCell className="py-3 text-xs text-slate-400">{u.church}</TableCell>
                  <TableCell className="py-3">
                    <Badge className={cn("text-[10px] border px-2 py-0.5 flex items-center gap-1 w-fit", roleConfig[u.role])}>
                      {u.role === "admin" ? <Shield className="size-2.5" /> : <UserIcon className="size-2.5" />}
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-500">{u.lastLogin}</TableCell>
                  <TableCell className="py-3 pr-5 text-xs text-slate-600">{u.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
