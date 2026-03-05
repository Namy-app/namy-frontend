import { useQuery } from "@tanstack/react-query";

import type {
  LeaderboardEntry,
  PointTransaction,
  UserChallenge,
} from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  CITY_LEADERBOARD_QUERY,
  MY_CHALLENGES_QUERY,
  MY_POINTS_HISTORY_QUERY,
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

export function useMyPointsHistory(limit = 200) {
  return useQuery<PointTransaction[]>({
    queryKey: ["myPointsHistory", limit],
    queryFn: async () => {
      const data = await graphqlRequest<{
        myPointsHistory: PointTransaction[];
      }>(MY_POINTS_HISTORY_QUERY, { limit });
      return data.myPointsHistory;
    },
    staleTime: 30 * 1000,
  });
}

export function useMyAwardedChallenges() {
  return useQuery<UserChallenge[]>({
    queryKey: ["myChallenges", "awarded"],
    queryFn: async () => {
      const data = await graphqlRequest<{
        myChallenges: UserChallenge[];
      }>(MY_CHALLENGES_QUERY, { status: "awarded" });
      return data.myChallenges;
    },
    staleTime: 30 * 1000,
  });
}

export function useLoginStreak() {
  return useQuery<number>({
    queryKey: ["loginStreak"],
    queryFn: async () => {
      const data = await graphqlRequest<{
        myChallenges: UserChallenge[];
      }>(MY_CHALLENGES_QUERY, { status: "on-going" });
      const streakChallenge = data.myChallenges.find(
        (c) => c.challenge?.entityType === "login_streaks"
      );
      return streakChallenge?.count ?? 0;
    },
    staleTime: 60 * 1000,
  });
}
