import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "@/lib/graphql-client";
import { UPDATE_USER_MUTATION } from "@/lib/graphql-queries";
import { User } from "@/lib/api-types";
import { useAuthStore } from "@/store/useAuthStore";

interface UpdateUserInput {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

interface UpdateUserResponse {
  updateUser: User;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      const data = await graphqlRequest<UpdateUserResponse>(
        UPDATE_USER_MUTATION,
        input
      );
      return data.updateUser;
    },
    onSuccess: (data) => {
      // Update the user in the auth store
      updateUser(data);
      // Invalidate current user query
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
