import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-white hover:shadow-glow hover:scale-105 rounded-pill",
        secondary: "bg-gradient-secondary text-white hover:shadow-pill hover:scale-105 rounded-pill",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-pill",
        outline: "border-2 border-primary bg-white text-primary hover:bg-primary hover:text-white rounded-pill",
        ghost: "hover:bg-primary-light hover:text-primary rounded-pill",
        link: "text-primary underline-offset-4 hover:underline font-semibold",
        pill: "bg-gradient-primary text-white hover:shadow-glow hover:scale-105 rounded-pill shadow-pill",
        soft: "bg-primary-light text-primary hover:bg-primary hover:text-white rounded-pill",
        warm: "bg-gradient-warm text-primary hover:shadow-soft hover:scale-105 rounded-pill",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-10 py-5 text-lg",
        icon: "h-11 w-11",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
