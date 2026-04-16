"use client";

import { useClosestStores } from "@/domains/store/hooks/query/useClosestStores";
import { useStores } from "@/domains/store/hooks/query/useStores";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { BasicLayout } from "@/layouts/BasicLayout";
import { useAuthStore } from "@/store/useAuthStore";

import { ActiveChallenges } from "./components/ActiveChallenges";
import { CategoryCards } from "./components/CategoryCards";
import { FeaturedCarousel } from "./components/FeaturedCarousel";
import { PageFooter } from "./components/PageFooter";
import { UserLevelBanner } from "./components/UserLevelBanner";
// import { GamificationCard } from "./components/GamificationCard"; // Unused component

export default function ExplorePage(): React.JSX.Element {
  const { user } = useAuthStore();
  const { data: closestStores, isLoading: isLoadingClosestStores } =
    useClosestStores(undefined, { page: 1, first: 10 });
  const { data: storesResult, isLoading: isLoadingStores } = useStores(
    {},
    { page: 1, first: 7 }
  );
  const { data: myLevel } = useMyLevel();

  // For guests, show 0% discount (no user-specific discounts)
  const discountPercentage =
    (user?.isPremium ? 15 : myLevel?.discountPercentage) ?? 10;

  return (
    <BasicLayout className="bg-gradient-hero">
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
        {/* <NearbyPlaces
          closestStores={closestStores?.data}
          isLoading={isLoadingClosestStores}
          discountPercentage={discountPercentage}
        /> */}
        {/* <GamificationCard /> */}
        <ActiveChallenges />
        <PageFooter />
      </div>
    </BasicLayout>
  );
}
