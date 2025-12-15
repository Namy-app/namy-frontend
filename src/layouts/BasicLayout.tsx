import type { PropsWithChildren } from "react";

import { ExploreHeader } from "@/app/explore/components/ExploreHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuthStore } from "@/store/useAuthStore";

export const BasicLayout = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-background pb-20">
      <ExploreHeader isAuthenticated={isAuthenticated} />
      {children}
      <BottomNavigation />
    </div>
  );
};
