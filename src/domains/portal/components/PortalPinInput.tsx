"use client";

import { Input } from "@/shared/components/Input";

interface PortalPinInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function PortalPinInput({
  id,
  value,
  onChange,
  disabled,
  autoFocus,
}: PortalPinInputProps): React.JSX.Element {
  return (
    <Input
      id={id}
      type="password"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="\d{4}"
      maxLength={4}
      placeholder="••••"
      className="h-14 rounded-xl text-center text-2xl tracking-[0.6em]"
      value={value}
      autoFocus={autoFocus}
      disabled={disabled}
      onChange={(event) => {
        onChange(event.target.value.replace(/\D/g, "").slice(0, 4));
      }}
    />
  );
}
