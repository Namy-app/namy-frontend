"use client";

import clsx from "clsx";
import { type PropsWithChildren } from "react";

import { ExploreHeader } from "@/app/explore/components/ExploreHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useIsPartnerMode } from "@/store/usePartnerStore";

export const BasicLayout = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  const { isAuthenticated } = useAuthStore();
  const isPartnerMode = useIsPartnerMode();

  return (
    <div
      className={clsx(
        "min-h-screen overflow-x-hidden bg-background",
        isPartnerMode ? "pb-6" : "pb-28",
        className
      )}
      style={{
        paddingTop: "var(--status-bar-height, env(safe-area-inset-top, 0px))",
      }}
    >
      <ExploreHeader isAuthenticated={isAuthenticated} />
      {children}
      <BottomNavigation />
    </div>
  );
};
