"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { useGetCategoryByName } from "@/domains/store/hooks/query/useGetCategoryByName";

interface RestaurantIdContextType {
  restaurantId: string | null;
  isLoading: boolean;
}

const RestaurantIdContext = createContext<RestaurantIdContextType | undefined>(
  undefined
);

const RESTAURANT_ID_KEY = "restaurantId";

export function RestaurantIdProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [restaurantId, setRestaurantId] = useState<string | null>(() => {
    // Initialize from localStorage on first render
    if (typeof window !== "undefined") {
      return localStorage.getItem(RESTAURANT_ID_KEY);
    }
    return null;
  });

  // Only fetch if we don't have an ID in localStorage
  const shouldFetch = restaurantId === null;
  const { data: category, isLoading: isCategoryLoading } = useGetCategoryByName(
    shouldFetch ? "restaurant" : ""
  );

  // Update state when category is fetched
  useEffect(() => {
    if (category?.id && restaurantId === null) {
      localStorage.setItem(RESTAURANT_ID_KEY, category.id);
      setRestaurantId(category.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category?.id]);

  const value: RestaurantIdContextType = {
    restaurantId,
    isLoading: shouldFetch && isCategoryLoading,
  };

  return (
    <RestaurantIdContext.Provider value={value}>
      {children}
    </RestaurantIdContext.Provider>
  );
}

export function useRestaurantId(): RestaurantIdContextType {
  const context = useContext(RestaurantIdContext);
  if (context === undefined) {
    throw new Error(
      "useRestaurantId must be used within a RestaurantIdProvider"
    );
  }
  return context;
}
