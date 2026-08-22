import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[90px] w-full rounded-[12px] border border-slate-300 bg-white px-3.5 py-2.5 text-base text-black font-semibold shadow-sm placeholder:text-slate-500 placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
