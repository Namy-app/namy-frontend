import { useMutation } from "@tanstack/react-query";

import { graphqlRequest } from "@/lib/graphql-client";
import { REWARD_AD_MUTATION } from "@/lib/graphql-queries";

export function useRewardAd() {
  return useMutation({
    mutationFn: async (input: {
      adUnitId: string;
      rewardToken: string;
      deviceId?: string;
      signature?: string;
    }) => {
      const res = await graphqlRequest<{
        rewardAd: {
          canGenerateCoupon: boolean;
          remaining?: number;
          token?: string;
          adsWatched?: number;
        };
      }>(REWARD_AD_MUTATION, { input });
      return res.rewardAd;
    },
  });
}
