import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ChevronLeft, Monitor, Smartphone, Calendar, Clock,
  Shield, Building2, Mail, User, Sliders,
  CheckCircle2, AlertCircle, ArrowRight,
  RefreshCw, Radio, Mic, Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import {
  useUsersQuery,
  useUpdateUserTierMutation,
  useSubscriptionHistoryQuery,
} from "@/lib/queries"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ─── helpers ──────────────────────────────────────────────────────────────────

function planLabel(tier: string) {
  const map: Record<string, string> = {
    trial: "2-Month Trial", free: "Free Mode", mini: "Mini Setup",
    standard: "Standard Setup", large: "Large Setup", premium: "Premium",
  }
  return map[tier] || tier
}

function planColor(tier: string) {
  const map: Record<string, string> = {
    trial: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    free: "bg-slate-700/50 text-slate-400 border-slate-700",
    mini: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    standard: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    large: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    premium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  }
  return map[tier] || "bg-slate-700/50 text-slate-400 border-slate-700"
}

function fmtDate(d?: string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function fmtDateTime(d?: string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  })
}

function daysFromNow(dateStr?: string | null): number {
  if (!dateStr) return 0
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
}

// ─── component ────────────────────────────────────────────────────────────────

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: remoteCustomers, isLoading, refetch } = useUsersQuery()
  const updateTierMutation = useUpdateUserTierMutation()
  const { data: historyData, isLoading: histLoading, refetch: refetchHistory } =
    useSubscriptionHistoryQuery({ limit: 100 })

  const [planModalOpen, setPlanModalOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState("mini")
  const [extendMonths, setExtendMonths] = useState(0)

  const rawUser = (remoteCustomers || []).find(
    (u: any) => (u.id || u._id) === id
  ) as any

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80 text-slate-400">
        <Loader2 className="size-6 animate-spin mr-2" /> Loading user details...
      </div>
    )
  }

  if (!rawUser) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <AlertCircle className="size-10 text-slate-600" />
        <p className="text-slate-400 font-medium">User not found.</p>
        <Button variant="ghost" onClick={() => navigate("/admin/users")} className="text-slate-400">
          <ChevronLeft className="size-4 mr-1" /> Back to Users
        </Button>
      </div>
    )
  }

  const u = rawUser
  const tier = u.subscriptionTier || u.effectiveTier || "trial"
  const isUnlimited = tier === "premium" && !u.subscriptionExpiresAt

  let remainingDays: number
  if (isUnlimited) {
    remainingDays = 999
  } else if (u.daysRemaining !== undefined && u.daysRemaining !== null) {
    remainingDays = Math.max(0, u.daysRemaining)
  } else if (u.subscriptionExpiresAt && ["mini", "standard", "large", "premium"].includes(tier)) {
    remainingDays = daysFromNow(u.subscriptionExpiresAt)
  } else if (u.trialRemainingDays !== undefined) {
    remainingDays = Math.max(0, u.trialRemainingDays)
  } else {
    remainingDays = daysFromNow(u.trialEndsAt || u.graceExpiresAt)
  }

  const expiryDate = u.subscriptionExpiresAt || u.trialEndsAt || u.graceExpiresAt
  const activeDesktops: any[] = u.licenseQuotas?.activeDesktops || []
  const activeMobiles: any[] = u.licenseQuotas?.activeMobileUsers || []
  const maxDesktops = u.licenseQuotas?.maxDesktops || 1
  const maxMobiles = u.licenseQuotas?.maxMobileUsers || 3

  const userHistory = (historyData?.history || []).filter(
    (h: any) => h.userId === id || h.userEmail === u.email
  )

  const handlePlanUpdate = () => {
    updateTierMutation.mutate(
      {
        userId: id!,
        payload: {
          subscriptionTier: selectedTier,
          extendMonths: Number(extendMonths) || 0,
          reason: `Admin updated ${u.churchName} to ${selectedTier.toUpperCase()}`,
        },
      },
      {
        onSuccess: () => {
          toast.success(`Plan updated to ${planLabel(selectedTier)}`, {
            description: "Subscription starts from today — 6 months by default.",
          })
          setPlanModalOpen(false)
          refetch()
          refetchHistory()
        },
        onError: (err: any) => {
          toast.error("Failed to update plan", { description: err?.message || "Please try again." })
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/users")}
          className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-[8px] -ml-2">
          <ChevronLeft className="size-4 mr-1" /> All Users
        </Button>
      </div>

      {/* Profile + Right grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile card */}
        <Card className="bg-slate-900/60 border-slate-800 rounded-[14px] lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <Avatar className="size-20 ring-2 ring-slate-700">
              {u.avatarUrl && <AvatarImage src={u.avatarUrl} alt={u.name} className="object-cover" />}
              <AvatarFallback className="bg-slate-700 text-slate-200 text-xl font-bold">
                {(u.name || u.email || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold text-white">{u.name || u.email?.split("@")[0]}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
            </div>
            <div className="flex flex-col items-center gap-1.5 w-full">
              <Badge className={cn("text-xs px-3 py-1 font-semibold rounded-[8px]", planColor(tier))}>
                {planLabel(tier)}
              </Badge>
              {u.customerType === "streamer" ? (
                <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30 text-[10px] px-2 py-0.5">
                  <Radio className="size-2.5 mr-1" /> Streamer
                </Badge>
              ) : u.customerType === "podcast" ? (
                <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-[10px] px-2 py-0.5">
                  <Mic className="size-2.5 mr-1" /> Podcast
                </Badge>
              ) : (
                <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30 text-[10px] px-2 py-0.5">
                  <Building2 className="size-2.5 mr-1" /> Church
                </Badge>
              )}
            </div>

            <div className="w-full border-t border-slate-800 pt-4 space-y-2.5 text-left">
              <div className="flex items-start gap-2">
                <Building2 className="size-3.5 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Organization</p>
                  <p className="text-xs text-slate-300">{u.churchName || u.church || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="size-3.5 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Email</p>
                  <p className="text-xs text-slate-300 break-all">{u.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="size-3.5 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Role</p>
                  <p className="text-xs text-slate-300">{u.role === "church_admin" ? "Account Owner" : "Team Member"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="size-3.5 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide">Joined</p>
                  <p className="text-xs text-slate-300">{fmtDate(u.createdAt || u.joined)}</p>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-[10px] text-xs"
              onClick={() => { setSelectedTier(tier); setExtendMonths(0); setPlanModalOpen(true) }}
            >
              <Sliders className="size-3.5 mr-1.5" /> Change Subscription Plan
            </Button>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Subscription details */}
          <Card className="bg-slate-900/60 border-slate-800 rounded-[14px]">
            <CardHeader className="pb-3 px-5 pt-5">
              <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Shield className="size-4 text-purple-400" /> Subscription Details
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800/60 rounded-[10px] p-3.5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Current Plan</p>
                  <p className="text-sm font-bold text-white">{planLabel(tier)}</p>
                  <Badge className={cn("text-[9px] px-1.5 py-0 mt-1", planColor(tier))}>{tier.toUpperCase()}</Badge>
                </div>
                <div className="bg-slate-800/60 rounded-[10px] p-3.5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Days Remaining</p>
                  {isUnlimited ? (
                    <p className="text-sm font-bold text-amber-300">Unlimited ∞</p>
                  ) : (
                    <>
                      <p className={cn("text-2xl font-bold",
                        remainingDays > 60 ? "text-emerald-400" :
                        remainingDays > 14 ? "text-yellow-400" : "text-red-400"
                      )}>{remainingDays}</p>
                      <p className="text-[10px] text-slate-500">days left</p>
                    </>
                  )}
                </div>
                <div className="bg-slate-800/60 rounded-[10px] p-3.5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Expires On</p>
                  {isUnlimited ? (
                    <p className="text-sm font-bold text-amber-300">Never</p>
                  ) : (
                    <p className="text-sm font-bold text-white">{fmtDate(expiryDate)}</p>
                  )}
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {tier === "trial" ? "Trial period" : tier === "free" ? "Free window" : "Subscription"}
                  </p>
                </div>
                <div className="bg-slate-800/60 rounded-[10px] p-3.5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Started</p>
                  <p className="text-sm font-bold text-white">
                    {fmtDate(u.subscriptionStartedAt || u.trialStartedAt || u.createdAt)}
                  </p>
                </div>
                <div className="bg-slate-800/60 rounded-[10px] p-3.5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Desktop Devices</p>
                  <p className="text-sm font-bold text-white">
                    {activeDesktops.length} <span className="text-slate-500 text-xs font-normal">/ {maxDesktops}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">active</p>
                </div>
                <div className="bg-slate-800/60 rounded-[10px] p-3.5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Mobile Users</p>
                  <p className="text-sm font-bold text-white">
                    {activeMobiles.length} <span className="text-slate-500 text-xs font-normal">/ {maxMobiles}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">connected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Devices */}
          <Card className="bg-slate-900/60 border-slate-800 rounded-[14px]">
            <CardHeader className="pb-3 px-5 pt-5">
              <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Monitor className="size-4 text-blue-400" /> Active Login Devices
                <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-[10px] ml-auto">
                  {activeDesktops.length + activeMobiles.length} total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              {activeDesktops.length === 0 && activeMobiles.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No active devices registered.</p>
              ) : (
                <>
                  {activeDesktops.map((d: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-[10px] border border-slate-700/50">
                      <div className="p-1.5 bg-blue-500/10 rounded-[8px]"><Monitor className="size-3.5 text-blue-400" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">{d.deviceName || d.name || `Desktop ${i + 1}`}</p>
                        <p className="text-[10px] text-slate-500 truncate">{d.deviceId || d.id || "—"}{d.platform ? ` · ${d.platform}` : ""}</p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] px-1.5 py-0">Desktop</Badge>
                    </div>
                  ))}
                  {activeMobiles.map((d: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-[10px] border border-slate-700/50">
                      <div className="p-1.5 bg-purple-500/10 rounded-[8px]"><Smartphone className="size-3.5 text-purple-400" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">{d.deviceName || d.name || `Mobile ${i + 1}`}</p>
                        <p className="text-[10px] text-slate-500 truncate">{d.deviceId || d.id || "—"}{d.platform ? ` · ${d.platform}` : ""}</p>
                      </div>
                      <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[9px] px-1.5 py-0">Mobile</Badge>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Subscription history */}
      <Card className="bg-slate-900/60 border-slate-800 rounded-[14px]">
        <CardHeader className="pb-3 px-5 pt-5">
          <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Clock className="size-4 text-slate-400" /> Subscription History
            <Button variant="ghost" size="sm" onClick={() => refetchHistory()}
              className="ml-auto h-7 w-7 p-0 text-slate-500 hover:text-white rounded-[8px]">
              <RefreshCw className="size-3.5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {histLoading ? (
            <div className="flex items-center justify-center py-8 text-slate-500">
              <Loader2 className="size-4 animate-spin mr-2" /> Loading history...
            </div>
          ) : userHistory.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No subscription changes recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {userHistory.map((h: any, i: number) => (
                <div key={h._id || i} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-[10px] border border-slate-700/40">
                  <div className={cn(
                    "mt-1 size-2 rounded-full shrink-0 ring-2 ring-offset-2 ring-offset-slate-900",
                    i === 0 ? "bg-emerald-400 ring-emerald-400/30" : "bg-slate-600 ring-slate-700"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge className={cn("text-[10px] px-2 py-0.5", planColor(h.previousPlan))}>{planLabel(h.previousPlan)}</Badge>
                      <ArrowRight className="size-3 text-slate-500 shrink-0" />
                      <Badge className={cn("text-[10px] px-2 py-0.5 font-semibold", planColor(h.newPlan))}>{planLabel(h.newPlan)}</Badge>
                      {i === 0 && (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] px-1.5 py-0 ml-1">Latest</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 mt-2">
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-wide">Upgraded On</p>
                        <p className="text-[11px] text-slate-300">{fmtDateTime(h.upgradedAt)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-wide">Duration</p>
                        <p className="text-[11px] text-slate-300">{h.durationMonths} month{h.durationMonths !== 1 ? "s" : ""}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-wide">Expiry Date</p>
                        <p className="text-[11px] text-slate-300">{fmtDate(h.newExpiryDate)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-wide">Days at Change</p>
                        <p className="text-[11px] text-slate-300">
                          {h.newPlan === "premium" && h.daysRemaining >= 999 ? "Unlimited" : `${h.daysRemaining}d`}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {h.changedBy?.name && (
                        <span className="text-[10px] text-slate-500">
                          Changed by: <span className="text-slate-400">{h.changedBy.name} ({h.changedBy.role})</span>
                        </span>
                      )}
                      {h.reason && <span className="text-[10px] text-slate-500">· {h.reason}</span>}
                      {h.transactionReference && (
                        <span className="text-[10px] font-mono text-slate-600">· {h.transactionReference}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan modal */}
      <Dialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 rounded-[16px] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white">Change Subscription Plan</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Days remaining restart from today. Paid plans default to 6 months (180 days).
              Premium has no expiry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-[10px] border border-slate-700/50">
              <Avatar className="size-9">
                {u.avatarUrl && <AvatarImage src={u.avatarUrl} className="object-cover" />}
                <AvatarFallback className="bg-slate-700 text-slate-300 text-xs font-bold">
                  {(u.name || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-semibold text-slate-200">{u.name || u.email}</p>
                <p className="text-[10px] text-slate-500">{u.churchName || u.church}</p>
              </div>
              <Badge className={cn("ml-auto text-[10px] px-2", planColor(tier))}>{planLabel(tier)}</Badge>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">New Subscription Tier</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "trial", label: "2-Month Trial", tag: "60 days" },
                  { id: "free", label: "Free Mode", tag: "30 days" },
                  { id: "mini", label: "Mini Setup", tag: "6 months" },
                  { id: "standard", label: "Standard Setup", tag: "6 months" },
                  { id: "large", label: "Large Setup", tag: "6 months" },
                  { id: "premium", label: "Premium", tag: "Unlimited" },
                ].map((t) => (
                  <button type="button" key={t.id} onClick={() => setSelectedTier(t.id)}
                    className={cn(
                      "p-2.5 rounded-[10px] border text-left text-xs transition-all flex flex-col justify-between cursor-pointer",
                      selectedTier === t.id
                        ? "bg-purple-950/50 border-purple-500 text-white ring-1 ring-purple-500/30"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    )}>
                    <span className="font-bold">{t.label}</span>
                    <span className="text-[10px] text-slate-400">{t.tag} from today</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">
                Override Duration <span className="text-slate-500 font-normal">(optional)</span>
              </Label>
              <select value={extendMonths} onChange={(e) => setExtendMonths(Number(e.target.value))}
                className="w-full h-9 rounded-[10px] bg-slate-800 border border-slate-700 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option value={0}>Default (6mo paid / 2mo trial / 1mo free)</option>
                <option value={1}>1 Month (30 days)</option>
                <option value={2}>2 Months (60 days)</option>
                <option value={3}>3 Months (90 days)</option>
                <option value={6}>6 Months (180 days)</option>
                <option value={12}>12 Months (1 Year)</option>
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="ghost" onClick={() => setPlanModalOpen(false)}
              className="text-slate-400 hover:text-white rounded-[10px]">Cancel</Button>
            <Button onClick={handlePlanUpdate} disabled={updateTierMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-[10px]">
              {updateTierMutation.isPending ? (
                <><Loader2 className="size-3.5 animate-spin mr-1.5" /> Updating...</>
              ) : (
                <><CheckCircle2 className="size-3.5 mr-1.5" /> Apply Plan Change</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
