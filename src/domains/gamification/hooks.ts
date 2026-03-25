import { useQuery } from "@tanstack/react-query";

import type {
  LeaderboardEntry,
  PointTransaction,
  UserChallenge,
} from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  CITY_LEADERBOARD_QUERY,
  GET_CURRENT_USER_QUERY,
  MY_CHALLENGES_QUERY,
  MY_POINTS_HISTORY_QUERY,
} from "@/lib/graphql-queries";
import { useAuthStore } from "@/store/useAuthStore";

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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery<UserChallenge[]>({
    queryKey: ["myChallenges", "on-going"],
    queryFn: async () => {
      const data = await graphqlRequest<{
        myChallenges: UserChallenge[];
      }>(MY_CHALLENGES_QUERY, { status: "on-going" });
      return data.myChallenges;
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
}

export function useMyPointsHistory(limit = 200) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery<PointTransaction[]>({
    queryKey: ["myPointsHistory", limit],
    queryFn: async () => {
      const data = await graphqlRequest<{
        myPointsHistory: PointTransaction[];
      }>(MY_POINTS_HISTORY_QUERY, { limit });
      return data.myPointsHistory;
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
}

export function useMyAwardedChallenges() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery<UserChallenge[]>({
    queryKey: ["myChallenges", "awarded"],
    queryFn: async () => {
      const data = await graphqlRequest<{
        myChallenges: UserChallenge[];
      }>(MY_CHALLENGES_QUERY, { status: "awarded" });
      return data.myChallenges;
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
}

export function useLoginStreak() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery<number>({
    queryKey: ["loginStreak"],
    queryFn: async () => {
      const data = await graphqlRequest<{ me: { loginStreak?: number } }>(
        GET_CURRENT_USER_QUERY
      );
      return data.me.loginStreak ?? 0;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
