"use client";

import type { LucideIcon } from "lucide-react";

interface PortalEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function PortalEmptyState({
  icon: Icon,
  title,
  description,
}: PortalEmptyStateProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-6">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <p className="font-medium text-foreground">{title}</p>
      {description ? (
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      ) : null}
    </div>
  );
}
