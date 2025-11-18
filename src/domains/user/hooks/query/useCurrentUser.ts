import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "@/lib/graphql-client";
import { GET_CURRENT_USER_QUERY } from "@/lib/graphql-queries";
import { User } from "@/lib/api-types";
import { useAuthStore } from "@/store/useAuthStore";

interface CurrentUserResponse {
  me: User;
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const data = await graphqlRequest<CurrentUserResponse>(
        GET_CURRENT_USER_QUERY
      );
      return data.me;
    },
    enabled: isAuthenticated, // Only fetch if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
