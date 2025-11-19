import * as React from "react";

import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className={cn(
              "w-4 h-4 cursor-pointer accent-primary",
              "focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
          {label ? (
            <span className="text-sm text-foreground select-none">{label}</span>
          ) : null}
        </label>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
