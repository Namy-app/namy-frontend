import { useQuery } from "@tanstack/react-query";

import type { LeaderboardEntry, UserChallenge } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  CITY_LEADERBOARD_QUERY,
  MY_CHALLENGES_QUERY,
} from "@/lib/graphql-queries";

export function useCityLeaderboard(limit = 20) {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["cityLeaderboard", limit],
    queryFn: async () => {
      const data = await graphqlRequest<{
        cityLeaderboard: LeaderboardEntry[];
      }>(CITY_LEADERBOARD_QUERY, { limit });
      return data.cityLeaderboard;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useMyActiveChallenges() {
  return useQuery<UserChallenge[]>({
    queryKey: ["myChallenges", "on-going"],
    queryFn: async () => {
      const data = await graphqlRequest<{
        myChallenges: UserChallenge[];
      }>(MY_CHALLENGES_QUERY, { status: "on-going" });
      return data.myChallenges;
    },
    staleTime: 30 * 1000,
  });
}
