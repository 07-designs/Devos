import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, children, variant = "primary", isLoading, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-primary/10 text-primary border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)]",
      secondary: "bg-secondary/10 text-secondary border-secondary hover:bg-secondary hover:text-secondary-foreground hover:shadow-[0_0_20px_hsl(var(--secondary)/0.5)]",
      danger: "bg-destructive/10 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground hover:shadow-[0_0_20px_hsl(var(--destructive)/0.5)]",
      ghost: "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          "relative px-6 py-2 font-mono text-sm uppercase tracking-wider border transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed clip-path-cyber",
          variants[variant],
          className
        )}
        style={{
          clipPath: variant !== "ghost" ? "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" : undefined
        }}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />}
        {children}
      </button>
    );
  }
);

CyberButton.displayName = "CyberButton";
