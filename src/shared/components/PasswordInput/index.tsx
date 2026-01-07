import * as React from "react";

import { cn } from "@/lib/utils";

import { Input } from "../Input";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [strength, setStrength] = React.useState(0);

    const calculateStrength = (password: string): number => {
      let score = 0;
      if (!password) {
        return score;
      }

      // Length check
      if (password.length >= 8) {
        score += 1;
      }
      if (password.length >= 12) {
        score += 1;
      }

      // Contains lowercase
      if (/[a-z]/.test(password)) {
        score += 1;
      }

      // Contains uppercase
      if (/[A-Z]/.test(password)) {
        score += 1;
      }

      // Contains numbers
      if (/\d/.test(password)) {
        score += 1;
      }

      // Contains special characters
      if (/[^A-Za-z0-9]/.test(password)) {
        score += 1;
      }

      return Math.min(score, 4); // Max score of 4
    };

    const getStrengthColor = (strength: number): string => {
      if (strength === 0) {
        return "bg-muted";
      }
      if (strength === 1) {
        return "bg-red-500";
      }
      if (strength === 2) {
        return "bg-orange-500";
      }
      if (strength === 3) {
        return "bg-yellow-500";
      }
      return "bg-green-500";
    };

    const getStrengthText = (strength: number): string => {
      if (strength === 0) {
        return "";
      }
      if (strength === 1) {
        return "Weak";
      }
      if (strength === 2) {
        return "Fair";
      }
      if (strength === 3) {
        return "Good";
      }
      return "Strong";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (showStrength) {
        setStrength(calculateStrength(e.target.value));
      }
      onChange?.(e);
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
            ref={ref}
            onChange={handleChange}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>

        {showStrength && props.value ? (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    i < strength ? getStrengthColor(strength) : "bg-muted"
                  )}
                />
              ))}
            </div>
            {strength > 0 && (
              <p className="text-xs text-muted-foreground">
                Password strength: {getStrengthText(strength)}
              </p>
            )}
          </div>
        ) : null}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
