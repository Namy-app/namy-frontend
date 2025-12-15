import { useQuery } from "@tanstack/react-query";

import { graphqlRequest } from "@/lib/graphql-client";
import { GET_MY_LEVEL_QUERY } from "@/lib/graphql-queries";

export interface UserLevelInfo {
  level: number;
  levelName: string;
  discountPercentage: number;
  monthlyUsageCount: number;
  previousMonthUsageCount: number;
  totalUsageCount: number;
  usesUntilNextLevel: number | null;
  currentMonthStart: string;
  lastLevelUpdate: string;
}

export function useMyLevel() {
  return useQuery({
    queryKey: ["myLevel"],
    queryFn: async () => {
      const res = await graphqlRequest<{
        myLevel: UserLevelInfo;
      }>(GET_MY_LEVEL_QUERY);
      return res.myLevel;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
