import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Key, Plus, Check, Shield, Sliders,
  Search, RefreshCw, Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  usePermissionsQuery,
  useTogglePermissionTierMutation,
  useCreatePermissionMutation,
  useDeletePermissionMutation,
} from "@/lib/queries"
import type { PermissionItem } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const TIERS = [
  { id: "trial", label: "2-Month Trial", tag: "60 Days Free", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { id: "free", label: "Free Mode", tag: "Fallback", color: "text-slate-400 border-slate-700 bg-slate-800" },
  { id: "mini", label: "Mini Setup", tag: "$2 / 6mo", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { id: "standard", label: "Standard Setup", tag: "$3 / 6mo", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  { id: "large", label: "Large Setup", tag: "$5 / 6mo", color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
  { id: "premium", label: "Premium", tag: "Contact Support", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
]

const CATEGORIES = [
  { id: "all", label: "All Permissions" },
  { id: "timer", label: "Timer & Clock" },
  { id: "broadcast", label: "Broadcast & Outputs" },
  { id: "documents", label: "PDF & Documents" },
  { id: "presentation", label: "Presentations & Scenes" },
  { id: "worship", label: "Worship & Lyrics" },
  { id: "system", label: "System & Core" },
  { id: "custom", label: "Custom / Extra" },
]

export default function AdminPermissions() {
  const [selectedTier, setSelectedTier] = useState<string>("standard")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [search, setSearch] = useState<string>("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [permToDelete, setPermToDelete] = useState<PermissionItem | null>(null)

  // Create form state
  const [newKey, setNewKey] = useState("")
  const [newName, setNewName] = useState("")
  const [newCategory, setNewCategory] = useState("custom")
  const [newDesc, setNewDesc] = useState("")
  const [newEnabledTiers, setNewEnabledTiers] = useState<string[]>(["standard", "large", "premium"])

  const { data, isLoading, refetch, isRefetching } = usePermissionsQuery()
  const toggleMutation = useTogglePermissionTierMutation()
  const createMutation = useCreatePermissionMutation()
  const deleteMutation = useDeletePermissionMutation()

  const permissionsList = data?.permissions || []

  const filteredPermissions = useMemo(() => {
    return permissionsList.filter((p) => {
      const matchCat = categoryFilter === "all" || p.category === categoryFilter
      const query = search.toLowerCase().trim()
      const matchSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.key.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      return matchCat && matchSearch
    })
  }, [permissionsList, categoryFilter, search])

  // Count stats
  const activeCountForTier = useMemo(() => {
    return permissionsList.filter((p) => p.enabledTiers.includes(selectedTier)).length
  }, [permissionsList, selectedTier])

  const handleToggle = (key: string, currentEnabled: boolean, permName: string) => {
    const nextState = !currentEnabled
    toggleMutation.mutate(
      { key, tier: selectedTier, enabled: nextState },
      {
        onSuccess: () => {
          toast.success(
            nextState
              ? `Enabled "${permName}" for ${selectedTier.toUpperCase()}`
              : `Disabled "${permName}" for ${selectedTier.toUpperCase()}`,
            {
              description: `Desktop and mobile companions will reflect this change immediately.`,
            }
          )
        },
        onError: (err: any) => {
          toast.error("Failed to update permission", {
            description: err?.message || "An unexpected error occurred",
          })
        },
      }
    )
  }

  const handleCreatePermission = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKey.trim() || !newName.trim()) {
      toast.error("Please fill in key and display name")
      return
    }

    createMutation.mutate(
      {
        key: newKey.trim(),
        name: newName.trim(),
        category: newCategory,
        description: newDesc.trim(),
        enabledTiers: newEnabledTiers,
      },
      {
        onSuccess: () => {
          toast.success(`Permission "${newName}" created successfully!`)
          setIsCreateOpen(false)
          setNewKey("")
          setNewName("")
          setNewDesc("")
          setNewCategory("custom")
          setNewEnabledTiers(["standard", "large", "premium"])
        },
        onError: (err: any) => {
          toast.error("Failed to create permission", {
            description: err?.message || "Permission key may already exist",
          })
        },
      }
    )
  }

  const handleDeletePermission = (perm: PermissionItem) => {
    deleteMutation.mutate(perm.key, {
      onSuccess: () => {
        toast.success(`Deleted permission "${perm.name}"`)
        setPermToDelete(null)
      },
      onError: (err: any) => {
        toast.error("Failed to delete permission", {
          description: err?.message || "System permissions cannot be deleted",
        })
      },
    })
  }

  const toggleTierInCreation = (tierId: string) => {
    if (newEnabledTiers.includes(tierId)) {
      setNewEnabledTiers(newEnabledTiers.filter((t) => t !== tierId))
    } else {
      setNewEnabledTiers([...newEnabledTiers, tierId])
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Subscription Permissions & Entitlements
            </h1>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
              Live Control Hub
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Toggle features on or off for specific subscription tiers, create custom permission keys, and enforce desktop access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs gap-1.5 rounded-[10px]"
          >
            <RefreshCw className={cn("size-3.5", isRefetching && "animate-spin text-purple-400")} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs gap-1.5 shadow-lg shadow-purple-900/20 rounded-[10px]"
          >
            <Plus className="size-3.5" />
            Create Permission
          </Button>
        </div>
      </div>

      {/* ── Tier Selection Bar ─────────────────────────────── */}
      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="size-4 text-purple-400" />
              <CardTitle className="text-sm font-bold text-slate-200">
                1. Select Target Subscription Plan
              </CardTitle>
            </div>
            <div className="text-xs text-slate-400">
              <span className="font-bold text-purple-400">{activeCountForTier}</span> of {permissionsList.length} features active for this tier
            </div>
          </div>
          <CardDescription className="text-xs text-slate-400">
            Click any plan below to inspect and toggle permissions configured for that specific subscription tier.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {TIERS.map((t) => {
              const isSelected = selectedTier === t.id
              const count = permissionsList.filter((p) => p.enabledTiers.includes(t.id)).length
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTier(t.id)}
                  className={cn(
                    "p-3 rounded-[12px] border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[76px]",
                    isSelected
                      ? "bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20 shadow-lg shadow-purple-950/40"
                      : "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className={cn("text-xs font-bold", isSelected ? "text-white" : "text-slate-300")}>
                      {t.label}
                    </span>
                    <Badge className={cn("text-[9px] px-1.5 py-0 border", t.color)}>
                      {t.tag}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 mt-2">
                    <span>Active Features</span>
                    <span className={cn("font-mono font-bold", isSelected ? "text-purple-300" : "text-slate-300")}>
                      {count}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Filters & Search ────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-[10px] font-medium transition-all shrink-0 cursor-pointer border text-xs",
                categoryFilter === cat.id
                  ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30"
                  : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative shrink-0 md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
          <Input
            placeholder="Search permissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 bg-slate-900/70 border-slate-800 text-slate-300 text-xs placeholder:text-slate-600 focus-visible:ring-purple-600 rounded-[10px]"
          />
        </div>
      </div>

      {/* ── Permissions Matrix Grid ─────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">2. Configure Feature Permissions</span>
            <span>—</span>
            <span>Toggling changes access for the <strong className="text-purple-300">{selectedTier.toUpperCase()}</strong> tier in real-time</span>
          </div>
          <div>Showing {filteredPermissions.length} permissions</div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-[12px] bg-slate-900/40 border border-slate-800 animate-pulse p-4 space-y-2" />
            ))}
          </div>
        ) : filteredPermissions.length === 0 ? (
          <Card className="border-slate-800 bg-slate-900/30 text-center py-12">
            <CardContent className="space-y-3">
              <Key className="size-8 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">No permissions found</div>
              <div className="text-xs text-slate-500">
                {search ? `No permissions matching "${search}"` : "Create a new permission to get started."}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPermissions.map((perm) => {
              const isEnabled = perm.enabledTiers.includes(selectedTier)
              const isPending = toggleMutation.isPending && toggleMutation.variables?.key === perm.key

              return (
                <motion.div
                  key={perm.key}
                  layout
                  className={cn(
                    "p-4 rounded-[14px] border transition-all flex flex-col justify-between space-y-3 relative",
                    isEnabled
                      ? "bg-slate-900/80 border-slate-700/80 shadow-md shadow-purple-950/10"
                      : "bg-slate-950/60 border-slate-800/80 opacity-75 hover:opacity-95"
                  )}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          {perm.name}
                          {perm.isSystem && (
                            <span title="Built-in System Permission" className="text-slate-500">
                              <Shield className="size-3" />
                            </span>
                          )}
                        </div>
                        <code className="text-[10px] font-mono text-purple-400/90 mt-0.5 block">
                          {perm.key}
                        </code>
                      </div>

                      {/* Enabled / Disabled Badge */}
                      <Badge
                        className={cn(
                          "text-[10px] px-2 py-0.5 font-semibold shrink-0 border",
                          isEnabled
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : "bg-slate-800/80 text-slate-500 border-slate-700/60"
                        )}
                      >
                        {isEnabled ? "Enabled" : "Locked"}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed min-h-[28px]">
                      {perm.description || "No description provided."}
                    </p>
                  </div>

                  {/* Footer & Toggle Action */}
                  <div className="pt-2.5 border-t border-slate-800/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 overflow-x-auto">
                      <span className="text-[9px] text-slate-500 font-semibold uppercase">Active on:</span>
                      {perm.enabledTiers.map((t) => (
                        <span
                          key={t}
                          className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded font-mono",
                            t === selectedTier
                              ? "bg-purple-500/30 text-purple-200 font-bold border border-purple-500/40"
                              : "bg-slate-800 text-slate-400"
                          )}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!perm.isSystem && (
                        <button
                          onClick={() => setPermToDelete(perm)}
                          title="Delete Custom Permission"
                          className="size-7 rounded-[8px] bg-slate-800/60 hover:bg-red-500/20 text-slate-500 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      )}

                      <Button
                        size="sm"
                        variant={isEnabled ? "default" : "outline"}
                        disabled={isPending}
                        onClick={() => handleToggle(perm.key, isEnabled, perm.name)}
                        className={cn(
                          "h-7 text-[11px] px-3 font-semibold rounded-[8px] transition-all gap-1",
                          isEnabled
                            ? "bg-purple-600 hover:bg-purple-500 text-white shadow-sm shadow-purple-900/30"
                            : "border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                        )}
                      >
                        {isPending ? (
                          <RefreshCw className="size-3 animate-spin" />
                        ) : isEnabled ? (
                          <>
                            <Check className="size-3 stroke-[3]" /> Turn Off
                          </>
                        ) : (
                          <>
                            <Plus className="size-3" /> Turn On
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── CREATE PERMISSION MODAL ─────────────────────────── */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200 sm:max-w-md rounded-[16px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400">
                <Plus className="size-4" />
              </div>
              <DialogTitle className="text-base font-bold text-white">Create New Permission</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-400">
              Define a new capability key and assign it to any subscription tiers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePermission} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Permission Key *</Label>
              <Input
                placeholder="e.g. multistream.ndi"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="bg-slate-800 border-slate-700 font-mono text-xs text-slate-200 placeholder:text-slate-600 rounded-[10px]"
                required
              />
              <p className="text-[10px] text-slate-500">Unique identifier used by desktop apps (e.g. feature.capability)</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Display Name *</Label>
              <Input
                placeholder="e.g. NDI Video Stream Output"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-slate-800 border-slate-700 text-xs text-slate-200 placeholder:text-slate-600 rounded-[10px]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Category</Label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full h-9 rounded-[10px] bg-slate-800 border border-slate-700 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="timer">Timer & Clock</option>
                <option value="broadcast">Broadcast & Outputs</option>
                <option value="documents">PDF & Documents</option>
                <option value="presentation">Presentations & Scenes</option>
                <option value="worship">Worship & Lyrics</option>
                <option value="custom">Custom / Extra</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Description</Label>
              <Textarea
                placeholder="Explain what this feature unlocks for the user..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="bg-slate-800 border-slate-700 text-xs text-slate-200 placeholder:text-slate-600 min-h-[64px] rounded-[10px]"
              />
            </div>

            <div className="space-y-2 pt-1">
              <Label className="text-xs font-semibold text-slate-300">Enable Immediately on Tiers:</Label>
              <div className="grid grid-cols-3 gap-2">
                {TIERS.map((t) => {
                  const checked = newEnabledTiers.includes(t.id)
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => toggleTierInCreation(t.id)}
                      className={cn(
                        "p-2 rounded-[8px] border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer",
                        checked
                          ? "bg-purple-600/20 border-purple-500 text-purple-300"
                          : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800"
                      )}
                    >
                      <span>{t.label}</span>
                      {checked && <Check className="size-3 text-purple-400 stroke-[3]" />}
                    </button>
                  )
                })}
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white rounded-[10px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={createMutation.isPending}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-[10px]"
              >
                {createMutation.isPending ? "Creating..." : "Save Permission"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── DELETE CONFIRMATION MODAL ──────────────────────── */}
      <Dialog open={!!permToDelete} onOpenChange={() => setPermToDelete(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200 sm:max-w-md rounded-[16px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                <Trash2 className="size-4" />
              </div>
              <DialogTitle className="text-base font-bold text-white">Delete Permission</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-400">
              Are you sure you want to permanently delete permission{" "}
              <strong className="text-white">"{permToDelete?.name}"</strong> ({permToDelete?.key})?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPermToDelete(null)}
              className="text-slate-400 hover:text-white rounded-[10px]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => permToDelete && handleDeletePermission(permToDelete)}
              className="text-xs font-semibold rounded-[10px]"
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
