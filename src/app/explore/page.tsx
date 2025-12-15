"use client";

import { BasicLayout } from "@/layouts/BasicLayout";

import { CategoryCards } from "./components/CategoryCards";
import { FeaturedCarousel } from "./components/FeaturedCarousel";
import { PageFooter } from "./components/PageFooter";
// import { GamificationCard } from "./components/GamificationCard"; // Unused component
// import { NearbyPlaces } from "./components/NearByPlaces"; // Unused component

export default function ExplorePage(): React.JSX.Element {
  return (
    <BasicLayout className="bg-gradient-hero">
      <div className="pt-14 pb-16 max-w-5xl mx-auto">
        <CategoryCards />
        <FeaturedCarousel />
        {/* <NearbyPlaces /> */}
        {/* <GamificationCard /> */}
        <PageFooter />
      </div>
    </BasicLayout>
  );
}
