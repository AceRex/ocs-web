import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  HelpCircle, Plus, Search, Trash2, Tag, ChevronDown,
  Sparkles, CheckCircle2, AlertCircle, Layers, AlertTriangle, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { useFaqsQuery, useCreateFaqMutation, useDeleteFaqMutation } from "@/lib/queries"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const defaultCategories = [
  "General",
  "Account & Authentication",
  "System Requirements",
  "Licensing",
  "Updates & Maintenance",
  "AI & Offline Engine",
  "Broadcasting & NDI",
]

export default function AdminFaqs() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [faqToDelete, setFaqToDelete] = useState<{ id: string; question: string; category: string } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "General",
    order: 0,
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const { data: remoteFaqs, isLoading } = useFaqsQuery()
  const createFaqMutation = useCreateFaqMutation()
  const deleteFaqMutation = useDeleteFaqMutation()

  const faqs = remoteFaqs?.map((f: any, i: number) => ({
    id: f._id || f.id || `faq-${i}`,
    question: f.question || f.q || "Untitled Question",
    answer: f.answer || f.a || "No answer provided.",
    category: f.category || "General",
    order: f.order ?? i + 1,
  })) || []

  const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))]

  const filteredFaqs = faqs.filter((f) => {
    const matchSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
    const matchCategory =
      selectedCategory === "All" || f.category === selectedCategory
    return matchSearch && matchCategory
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.question.trim() || !form.answer.trim()) return

    setErrorMessage("")
    try {
      await createFaqMutation.mutateAsync({
        question: form.question,
        answer: form.answer,
        category: form.category,
        order: Number(form.order) || 0,
      })
      setSuccessMessage("FAQ successfully published!")
      toast.success("FAQ published successfully!", {
        description: `"${form.question.slice(0, 45)}..." was added to ${form.category}.`,
      })
      setForm({ question: "", answer: "", category: "General", order: 0 })
      setTimeout(() => {
        setIsCreateOpen(false)
        setSuccessMessage("")
      }, 1000)
    } catch (err: any) {
      const errMsg = err.message || "Failed to create FAQ. Check backend connection."
      setErrorMessage(errMsg)
      toast.error("Failed to publish FAQ", {
        description: errMsg,
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!faqToDelete) return
    setDeletingId(faqToDelete.id)
    try {
      await deleteFaqMutation.mutateAsync(faqToDelete.id)
      toast.success("FAQ deleted successfully", {
        description: `"${faqToDelete.question.slice(0, 45)}..." was removed.`,
      })
      setFaqToDelete(null)
    } catch (err: any) {
      toast.error("Failed to delete FAQ", {
        description: err.message || "An error occurred while deleting the FAQ.",
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-[12px] bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <HelpCircle className="size-5" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">FAQ Management</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Create, update, and manage frequently asked questions displayed on the website.
          </p>
        </div>

        {/* Create FAQ Modal Trigger */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2 rounded-[12px] font-semibold shadow-lg shadow-purple-900/30">
              <Plus className="size-4" />
              Add New FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="size-5 text-purple-400" />
                Create New FAQ
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                Add an official answer that will automatically appear on the download and help pages.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 mt-3">
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

              <div className="space-y-1.5">
                <Label htmlFor="faq-question" className="text-xs text-slate-300 font-semibold">
                  Question *
                </Label>
                <Input
                  id="faq-question"
                  placeholder="e.g. Do I need an internet connection to use OCS?"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  required
                  className="bg-slate-950 border-slate-800 text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="faq-answer" className="text-xs text-slate-300 font-semibold">
                  Answer *
                </Label>
                <Textarea
                  id="faq-answer"
                  placeholder="Provide a comprehensive explanation..."
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  required
                  rows={4}
                  className="bg-slate-950 border-slate-800 text-white text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="faq-category" className="text-xs text-slate-300 font-semibold">
                    Category
                  </Label>
                  <select
                    id="faq-category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-[8px] bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {defaultCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="faq-order" className="text-xs text-slate-300 font-semibold">
                    Display Order
                  </Label>
                  <Input
                    id="faq-order"
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="bg-slate-950 border-slate-800 text-white text-sm"
                  />
                </div>
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
                  disabled={createFaqMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
                >
                  {createFaqMutation.isPending ? "Publishing..." : "Save FAQ"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-[12px] bg-slate-900 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total FAQs</span>
            <HelpCircle className="size-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{faqs.length}</div>
        </div>

        <div className="p-5 rounded-[12px] bg-slate-900 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Categories</span>
            <Layers className="size-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {new Set(faqs.map((f) => f.category)).size}
          </div>
        </div>

        <div className="p-5 rounded-[12px] bg-slate-900 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Status</span>
            <CheckCircle2 className="size-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">Active Live</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search questions or answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 rounded-[12px]"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                selectedCategory === cat
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Loading FAQs from database...
          </div>
        ) : filteredFaqs.length > 0 ? (
          filteredFaqs.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-[12px] bg-slate-900 border border-slate-800/80 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 sm:p-5 gap-4">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex-1 flex items-start sm:items-center gap-3 text-left cursor-pointer"
                >
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold shrink-0">
                    #{item.order}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-white block">
                      {item.question}
                    </span>
                    <span className="text-[11px] text-purple-400 mt-0.5 inline-flex items-center gap-1">
                      <Tag className="size-3" /> {item.category}
                    </span>
                  </div>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setFaqToDelete(item)}
                    className="size-8 p-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-[8px]"
                    title="Delete FAQ"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        openFaq === i && "rotate-180"
                      )}
                    />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-800/60 bg-slate-950/50"
                  >
                    <p className="p-4 sm:p-5 text-sm text-slate-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className="p-16 text-center rounded-[12px] bg-slate-900 border border-slate-800/80 space-y-3">
            <HelpCircle className="size-10 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No FAQs Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {search
                  ? "No FAQ questions match your search keyword."
                  : "No FAQs created yet in the database."}
              </p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 text-xs rounded-[8px]"
            >
              <Plus className="size-3.5 mr-1" /> Add the First FAQ
            </Button>
          </div>
        )}
      </div>

      {/* ── FAQ DELETE CONFIRMATION MODAL ─────────────────────────── */}
      <Dialog open={!!faqToDelete} onOpenChange={(open) => !open && !deletingId && setFaqToDelete(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
          <DialogHeader>
            <div className="size-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
              <AlertTriangle className="size-6 text-red-400" />
            </div>
            <DialogTitle className="text-lg font-bold text-white">
              Delete FAQ Question
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Are you sure you want to delete this FAQ question? It will immediately disappear from all public website pages.
            </DialogDescription>
          </DialogHeader>

          {faqToDelete && (
            <div className="p-3.5 rounded-[10px] bg-slate-950/80 border border-slate-800/80 space-y-2 mt-1">
              <div className="text-xs font-semibold text-white">
                {faqToDelete.question}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Category:</span>
                <span className="text-[11px] text-purple-400 font-medium">{faqToDelete.category}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              disabled={!!deletingId}
              onClick={() => setFaqToDelete(null)}
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
                  Yes, Delete FAQ
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
