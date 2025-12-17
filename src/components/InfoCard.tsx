import type { LucideIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/shared/components/Card";

interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  summary?: string;
  icon?: LucideIcon;
  iconClassName?: string;
}

const InfoCard = React.forwardRef<HTMLDivElement, InfoCardProps>(
  ({ className, title, summary, icon: Icon, iconClassName, ...props }, ref) => (
    <Card ref={ref} className={cn("shadow-sm", className)} {...props}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-3 text-center">
          {Icon ? (
            <div className={cn("text-muted-foreground", iconClassName)}>
              <Icon size={48} />
            </div>
          ) : null}
          <div className="space-y-2">
            <h3 className="text-xl font-bold leading-none tracking-tight text-gray-900">
              {title}
            </h3>
            {summary ? (
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {summary}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
);

InfoCard.displayName = "InfoCard";

export { InfoCard };
export type { InfoCardProps };
