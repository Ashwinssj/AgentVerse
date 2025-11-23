import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none border-2 border-border",
    {
        variants: {
            variant: {
                default: "bg-primary text-black shadow-hard hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-hard-sm",
                secondary: "bg-secondary text-black shadow-hard hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-hard-sm",
                outline: "bg-background text-foreground shadow-hard hover:bg-accent hover:text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-hard-sm",
                ghost: "border-transparent shadow-none hover:bg-accent hover:text-black",
                link: "text-primary underline-offset-4 hover:underline shadow-none border-none",
                destructive: "bg-red-500 text-white shadow-hard hover:shadow-hard-sm hover:bg-red-600",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3",
                lg: "h-11 px-8",
                icon: "h-10 w-10",
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
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
