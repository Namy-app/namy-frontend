import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { graphqlClient } from "@/lib/graphql-client";

import {
  GET_CATEGORIES,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "./graphql";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryFiltersInput,
} from "./types";

export function useCategories(filters?: CategoryFiltersInput) {
  return useQuery<Category[]>({
    queryKey: ["categories", filters],
    queryFn: async () => {
      const data = await graphqlClient.request<{ categories: Category[] }>(
        GET_CATEGORIES,
        { filters }
      );
      return data.categories;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, CreateCategoryInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{ createCategory: Category }>(
        CREATE_CATEGORY,
        { input }
      );
      return data.createCategory;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, UpdateCategoryInput>({
    mutationFn: async ({ id, ...input }) => {
      const data = await graphqlClient.request<{ updateCategory: Category }>(
        UPDATE_CATEGORY,
        { id, input }
      );
      return data.updateCategory;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (id) => {
      const data = await graphqlClient.request<{ deleteCategory: boolean }>(
        DELETE_CATEGORY,
        { id }
      );
      return data.deleteCategory;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
