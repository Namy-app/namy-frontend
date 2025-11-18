import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "@/lib/graphql-client";
import { GET_USER_BY_ID_QUERY } from "@/lib/graphql-queries";
import { User } from "@/lib/api-types";

interface UserResponse {
  user: User;
}

export function useUser(id: string) {
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
