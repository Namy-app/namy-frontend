import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  MuralPost,
  MuralFeedResponse,
  MuralCommentsResponse,
  MuralComment,
  MuralFeedInput,
  CreateMuralPostInput,
  CreateMuralCommentInput,
} from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  GET_MURAL_FEED_QUERY,
  GET_MY_MURAL_POSTS_QUERY,
  GET_MURAL_POST_QUERY,
  GET_MURAL_POST_COMMENTS_QUERY,
  CREATE_MURAL_POST_MUTATION,
  DELETE_MURAL_POST_MUTATION,
  LIKE_MURAL_POST_MUTATION,
  UNLIKE_MURAL_POST_MUTATION,
  CREATE_MURAL_COMMENT_MUTATION,
  DELETE_MURAL_COMMENT_MUTATION,
} from "@/lib/graphql-queries";

// ==================== Queries ====================

export function useMuralFeed(input?: MuralFeedInput) {
  return useQuery<MuralFeedResponse>({
    queryKey: ["muralFeed", input],
    queryFn: async () => {
      const data = await graphqlRequest<{ muralFeed: MuralFeedResponse }>(
        GET_MURAL_FEED_QUERY,
        { input }
      );
      return data.muralFeed;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useMyMuralPosts(page = 1, enabled = true, pageSize = 20) {
  return useQuery<MuralFeedResponse>({
    queryKey: ["myMuralPosts", page, pageSize],
    queryFn: async () => {
      const data = await graphqlRequest<{ myMuralPosts: MuralFeedResponse }>(
        GET_MY_MURAL_POSTS_QUERY,
        { page, pageSize }
      );
      return data.myMuralPosts;
    },
    enabled,
    staleTime: 1 * 60 * 1000,
  });
}

export function useMuralPost(id: string) {
  return useQuery<MuralPost>({
    queryKey: ["muralPost", id],
    queryFn: async () => {
      const data = await graphqlRequest<{ muralPost: MuralPost }>(
        GET_MURAL_POST_QUERY,
        { id }
      );
      return data.muralPost;
    },
    enabled: !!id,
  });
}

export function useMuralPostComments(postId: string, page = 1, pageSize = 20) {
  return useQuery<MuralCommentsResponse>({
    queryKey: ["muralPostComments", postId, page],
    queryFn: async () => {
      const data = await graphqlRequest<{
        muralPostComments: MuralCommentsResponse;
      }>(GET_MURAL_POST_COMMENTS_QUERY, { postId, page, pageSize });
      return data.muralPostComments;
    },
    enabled: !!postId,
  });
}

// ==================== Mutations ====================

export function useCreateMuralPost() {
  const queryClient = useQueryClient();

  return useMutation<MuralPost, Error, CreateMuralPostInput>({
    mutationFn: async (input) => {
      const data = await graphqlRequest<{ createMuralPost: MuralPost }>(
        CREATE_MURAL_POST_MUTATION,
        { input }
      );
      return data.createMuralPost;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["muralFeed"] });
    },
  });
}

export function useDeleteMuralPost() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (id) => {
      const data = await graphqlRequest<{ deleteMuralPost: boolean }>(
        DELETE_MURAL_POST_MUTATION,
        { id }
      );
      return data.deleteMuralPost;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["muralFeed"] });
    },
  });
}

export function useLikeMuralPost() {
  const queryClient = useQueryClient();

  return useMutation<Pick<MuralPost, "id" | "likes">, Error, string>({
    mutationFn: async (id) => {
      const data = await graphqlRequest<{
        likeMuralPost: Pick<MuralPost, "id" | "likes">;
      }>(LIKE_MURAL_POST_MUTATION, { id });
      return data.likeMuralPost;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["muralFeed"] });
    },
  });
}

export function useUnlikeMuralPost() {
  const queryClient = useQueryClient();

  return useMutation<Pick<MuralPost, "id" | "likes">, Error, string>({
    mutationFn: async (id) => {
      const data = await graphqlRequest<{
        unlikeMuralPost: Pick<MuralPost, "id" | "likes">;
      }>(UNLIKE_MURAL_POST_MUTATION, { id });
      return data.unlikeMuralPost;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["muralFeed"] });
    },
  });
}

export function useCreateMuralComment() {
  const queryClient = useQueryClient();

  return useMutation<MuralComment, Error, CreateMuralCommentInput>({
    mutationFn: async (input) => {
      const data = await graphqlRequest<{ createMuralComment: MuralComment }>(
        CREATE_MURAL_COMMENT_MUTATION,
        { input }
      );
      return data.createMuralComment;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ["muralPostComments", data.postId],
      });
      void queryClient.invalidateQueries({ queryKey: ["muralFeed"] });
    },
  });
}

export function useDeleteMuralComment() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { id: string; postId: string }>({
    mutationFn: async ({ id }) => {
      const data = await graphqlRequest<{ deleteMuralComment: boolean }>(
        DELETE_MURAL_COMMENT_MUTATION,
        { id }
      );
      return data.deleteMuralComment;
    },
    onSuccess: (_, { postId }) => {
      void queryClient.invalidateQueries({
        queryKey: ["muralPostComments", postId],
      });
      void queryClient.invalidateQueries({ queryKey: ["muralFeed"] });
    },
  });
}
