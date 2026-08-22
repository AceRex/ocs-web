import { Toaster as Sonner } from "sonner"

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      richColors
      closeButton
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-slate-900 group-[.toaster]:text-slate-100 group-[.toaster]:border-slate-800 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-[12px]",
          description: "group-[.toast]:text-slate-400 text-xs",
          actionButton:
            "group-[.toast]:bg-purple-600 group-[.toast]:text-white group-[.toast]:rounded-[8px] font-semibold",
          cancelButton:
            "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-300 group-[.toast]:rounded-[8px]",
        },
      }}
    />
  )
}
