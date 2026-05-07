import * as React from "react";

import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onFocus, ...props }, ref) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
      onFocus?.(e);
      // On Capacitor native (Android/iOS), the keyboard shrinks the body but not 100vh.
      // Scroll the input into view after the keyboard animation completes.
      if (globalThis.window !== undefined) {
        const html = document.documentElement;
        if (
          html.classList.contains("capacitor-android") ||
          html.classList.contains("capacitor-ios")
        ) {
          const target = e.target;
          setTimeout(() => {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 350);
        }
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onFocus={handleFocus}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
