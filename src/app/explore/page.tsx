"use client";

import { useAuthStore } from "@/store/useAuthStore";

import { BottomNavigation } from "../../components/BottomNavigation";

import { CategoryCards } from "./components/CategoryCards";
import { ExploreHeader } from "./components/ExploreHeader";
import { FeaturedCarousel } from "./components/FeaturedCarousel";
import { GamificationCard } from "./components/GamificationCard";
// import { NearbyPlaces } from "./components/NearByPlaces"; // Unused component
import { PageFooter } from "./components/PageFooter";

export default function ExplorePage(): React.JSX.Element {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      <ExploreHeader isAuthenticated={isAuthenticated} />

      <div className="pt-14 pb-16 max-w-5xl mx-auto">
        <CategoryCards />
        <FeaturedCarousel />
        {/* <NearbyPlaces /> */}
        <GamificationCard />
        <PageFooter />
      </div>

      <BottomNavigation />
    </div>
  );
}
