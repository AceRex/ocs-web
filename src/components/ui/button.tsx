import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-[0.97]",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.97]",
        outline: "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white active:scale-[0.97]",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-[0.97]",
        ghost: "hover:bg-accent hover:text-accent-foreground text-slate-800 dark:text-slate-200 active:scale-[0.97]",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "btn-gradient text-white font-semibold active:scale-[0.97]",
        "outline-purple": "border border-purple-300 text-purple-950 font-semibold bg-purple-50/80 hover:bg-purple-100 hover:border-purple-400 active:scale-[0.97]",
        "nav-cta": "bg-white text-purple-900 font-semibold shadow-sm hover:bg-purple-50 active:scale-[0.97]",
        admin: "bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.97] shadow",
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

