import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none active:scale-[0.97]",
  {
    variants: {
      variant: {
        // Primary: Electric Blue with Deep Navy text for WCAG AAA contrast (>7.5:1)
        default: "bg-[#00A8FF] text-[#0B1020] font-bold shadow-md shadow-[#00A8FF]/20 hover:bg-[#00A8FF]/90 active:scale-[0.97]",
        primary: "bg-[#00A8FF] text-[#0B1020] font-bold shadow-md shadow-[#00A8FF]/20 hover:bg-[#00A8FF]/90 active:scale-[0.97]",

        // Secondary: Charcoal Gray or transparent with neutral border
        secondary: "bg-[#303030] text-white hover:bg-[#3D3D3D] border border-white/10 font-semibold shadow-sm active:scale-[0.97]",
        outline: "border border-white/20 bg-transparent text-white font-semibold shadow-sm hover:bg-white/10 hover:text-white active:scale-[0.97]",
        "secondary-outline": "border border-white/20 bg-transparent text-white font-semibold shadow-sm hover:bg-white/10 hover:text-white active:scale-[0.97]",

        // Tertiary: Violet (reserved for secondary emphasis like Live Studio)
        tertiary: "bg-[#8B5CF6] text-white font-semibold shadow-md shadow-[#8B5CF6]/20 hover:bg-[#7C3AED] active:scale-[0.97]",

        // Restrained UI Utility variants conforming to the 3 families
        ghost: "hover:bg-white/10 text-slate-200 hover:text-white active:scale-[0.97]",
        link: "text-[#00A8FF] underline-offset-4 hover:underline",
        destructive: "border border-white/25 bg-[#303030] text-white font-semibold hover:bg-white/10 active:scale-[0.97]",

        // Legacy aliases mapped to the 3 brand families
        gradient: "bg-[#00A8FF] text-[#0B1020] font-bold shadow-md shadow-[#00A8FF]/20 hover:bg-[#00A8FF]/90 active:scale-[0.97]",
        "nav-cta": "bg-[#00A8FF] text-[#0B1020] font-bold shadow-md shadow-[#00A8FF]/20 hover:bg-[#00A8FF]/90 active:scale-[0.97]",
        "outline-purple": "border border-white/20 bg-transparent text-white font-semibold hover:bg-white/10 active:scale-[0.97]",
        admin: "bg-[#8B5CF6] text-white font-semibold hover:bg-[#7C3AED] shadow active:scale-[0.97]",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-[12px]",
        sm: "h-8 rounded-[12px] px-3 text-xs",
        lg: "h-11 rounded-[12px] px-8 text-base",
        xl: "h-13 rounded-[12px] px-10 text-base",
        icon: "h-9 w-9 rounded-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      loadingText,
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const [asyncLoading, setAsyncLoading] = React.useState(false)
    const isSpinning = loading !== undefined ? loading : asyncLoading
    const isDisabled = disabled || isSpinning
    const Comp = asChild ? Slot : "button"

    const handleClick = React.useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) {
          e.preventDefault()
          return
        }
        if (onClick) {
          try {
            const res: unknown = onClick(e)
            if (res && typeof (res as { then?: unknown }).then === "function") {
              setAsyncLoading(true)
              await (res as Promise<unknown>)
            }
          } finally {
            setAsyncLoading(false)
          }
        }
      },
      [isDisabled, onClick]
    )

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={isDisabled}
          onClick={onClick}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          isSpinning && "opacity-80 cursor-wait pointer-events-none"
        )}
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {isSpinning && loadingText !== undefined ? (
          <>
            <Loader2 className="size-4 animate-spin shrink-0" />
            <span>{loadingText}</span>
          </>
        ) : isSpinning && typeof children === "string" ? (
          <>
            <Loader2 className="size-4 animate-spin shrink-0" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

