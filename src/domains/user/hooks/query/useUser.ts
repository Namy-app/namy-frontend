import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { type User } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import { GET_USER_BY_ID_QUERY } from "@/lib/graphql-queries";

interface UserResponse {
  user: User;
}

export function useUser(id: string): UseQueryResult<User, Error> {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const data = await graphqlRequest<UserResponse>(GET_USER_BY_ID_QUERY, {
        id,
      });
      return data.user;
    },
    enabled: !!id,
  });
}
