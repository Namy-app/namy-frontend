"use client";

import { AlertCircle, CheckCircle, Info } from "lucide-react";
import React from "react";

type Variant = "error" | "success" | "info";

interface Props {
  title?: string;
  message?: React.ReactNode;
  variant?: Variant;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

export const StatusCard: React.FC<Props> = ({
  title,
  message,
  variant = "info",
  primaryAction,
  secondaryAction,
}) => {
  const icon =
    variant === "error" ? (
      <AlertCircle className="w-8 h-8 text-destructive" />
    ) : variant === "success" ? (
      <CheckCircle className="w-8 h-8 text-green-600" />
    ) : (
      <Info className="w-8 h-8 text-foreground" />
    );

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      <div className="flex items-center justify-center p-4 h-screen">
        <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md animate-slide-up">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              {icon}
            </div>
            {title ? (
              <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            ) : null}
            {message ? (
              <div className="text-muted-foreground">{message}</div>
            ) : null}

            <div className="flex gap-3 mt-4 w-full">
              {secondaryAction ? (
                <button
                  onClick={secondaryAction.onClick}
                  className="flex-1 py-3 px-4 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  {secondaryAction.label}
                </button>
              ) : null}

              {primaryAction ? (
                <button
                  onClick={primaryAction.onClick}
                  className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  {primaryAction.label}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
