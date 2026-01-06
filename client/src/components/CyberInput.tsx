import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const CyberInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            type={type}
            className={cn(
              "flex h-10 w-full bg-background/50 border-b-2 border-border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 font-mono transition-colors duration-300",
              className
            )}
            ref={ref}
            {...props}
          />
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-focus-within:w-full shadow-[0_0_10px_hsl(var(--primary))]"></div>
        </div>
      </div>
    );
  }
);

CyberInput.displayName = "CyberInput";
