"use client";

import { useClosestStores } from "@/domains/store/hooks/query/useClosestStores";
import { useStores } from "@/domains/store/hooks/query/useStores";
import { useMyLevel } from "@/domains/user/hooks/query/useMyLevel";
import { BasicLayout } from "@/layouts/BasicLayout";

import { CategoryCards } from "./components/CategoryCards";
import { FeaturedCarousel } from "./components/FeaturedCarousel";
import { NearbyPlaces } from "./components/NearByPlaces";
import { PageFooter } from "./components/PageFooter";
// import { GamificationCard } from "./components/GamificationCard"; // Unused component

export default function ExplorePage(): React.JSX.Element {
  const { data: closestStores, isLoading: isLoadingClosestStores } =
    useClosestStores();
  const { data: storesResult, isLoading: isLoadingStores } = useStores();
  const { data: myLevel } = useMyLevel();

  return (
    <BasicLayout className="bg-gradient-hero">
      <div className="pt-14 pb-16 max-w-5xl mx-auto">
        <CategoryCards />
        <FeaturedCarousel
          stores={storesResult?.data}
          discountPercentage={myLevel?.discountPercentage}
          isLoading={isLoadingStores}
        />
        <NearbyPlaces
          closestStores={closestStores?.data}
          isLoading={isLoadingClosestStores}
          discountPercentage={myLevel?.discountPercentage}
        />
        {/* <GamificationCard /> */}
        <PageFooter />
      </div>
    </BasicLayout>
  );
}
