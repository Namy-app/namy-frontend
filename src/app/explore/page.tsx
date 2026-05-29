"use client";

import { useClosestStores } from "@/domains/store/hooks/query/useClosestStores";
import { useStores } from "@/domains/store/hooks/query/useStores";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { usePromoRecovery } from "@/hooks/usePromoRecovery";
import { BasicLayout } from "@/layouts/BasicLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { usePromoStore } from "@/store/usePromoStore";

import { ActiveChallenges } from "./components/ActiveChallenges";
import { CategoryCards } from "./components/CategoryCards";
import { FeaturedCarousel } from "./components/FeaturedCarousel";
import { PageFooter } from "./components/PageFooter";
import { PromoBanner } from "./components/PromoBanner";
import { UserLevelBanner } from "./components/UserLevelBanner";

export default function ExplorePage(): React.JSX.Element {
  const { user } = useAuthStore();
  const { activePromo, dismissPromo } = usePromoStore();
  usePromoRecovery();
  const { data: closestStores, isLoading: isLoadingClosestStores } =
    useClosestStores(undefined, { page: 1, first: 10 });
  const { data: storesResult, isLoading: isLoadingStores } = useStores(
    {},
    { page: 1, first: 7 }
  );
  const { data: myLevel } = useMyLevel();

  const discountPercentage =
    (user?.isPremium ? 15 : myLevel?.discountPercentage) ?? 10;

  return (
    <BasicLayout className="bg-gradient-hero">
      {activePromo ? (
        <PromoBanner promo={activePromo} onClose={() => void dismissPromo()} />
      ) : null}
      <div
        className="mx-auto mt-10 w-full min-w-0 max-w-5xl pb-16"
        style={{
          paddingTop:
            "calc(3.5rem + var(--status-bar-height, env(safe-area-inset-top, 0px)))",
        }}
      >
        <UserLevelBanner />
        <CategoryCards />
        <FeaturedCarousel
          stores={closestStores?.data ?? storesResult?.data}
          discountPercentage={discountPercentage}
          isLoading={isLoadingClosestStores ? isLoadingStores : undefined}
        />
        <ActiveChallenges />
        <PageFooter />
      </div>
    </BasicLayout>
  );
}
