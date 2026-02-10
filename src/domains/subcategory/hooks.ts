import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { graphqlClient } from "@/lib/graphql-client";

import {
  GET_SUBCATEGORIES,
  GET_SUBCATEGORY,
  CREATE_SUBCATEGORY,
  UPDATE_SUBCATEGORY,
  DELETE_SUBCATEGORY,
} from "./graphql";
import type {
  SubCategory,
  CreateSubCategoryInput,
  UpdateSubCategoryInput,
  SubCategoryFiltersInput,
} from "./types";

export function useSubCategories(filters?: SubCategoryFiltersInput) {
  return useQuery<SubCategory[]>({
    queryKey: ["subcategories", filters],
    queryFn: async () => {
      const data = await graphqlClient.request<{
        subCategories: SubCategory[];
      }>(GET_SUBCATEGORIES, { filters });
      return data.subCategories;
    },
  });
}

export function useSubCategory(id: string) {
  return useQuery<SubCategory>({
    queryKey: ["subcategory", id],
    queryFn: async () => {
      const data = await graphqlClient.request<{ subCategory: SubCategory }>(
        GET_SUBCATEGORY,
        { id }
      );
      return data.subCategory;
    },
    enabled: !!id,
  });
}

export function useCreateSubCategory() {
  const queryClient = useQueryClient();
  return useMutation<SubCategory, Error, CreateSubCategoryInput>({
    mutationFn: async (input) => {
      const data = await graphqlClient.request<{
        createSubCategory: SubCategory;
      }>(CREATE_SUBCATEGORY, { input });
      return data.createSubCategory;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateSubCategory() {
  const queryClient = useQueryClient();
  return useMutation<SubCategory, Error, UpdateSubCategoryInput>({
    mutationFn: async ({ id, ...input }) => {
      const data = await graphqlClient.request<{
        updateSubCategory: SubCategory;
      }>(UPDATE_SUBCATEGORY, { id, input });
      return data.updateSubCategory;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteSubCategory() {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (id) => {
      const data = await graphqlClient.request<{ deleteSubCategory: boolean }>(
        DELETE_SUBCATEGORY,
        { id }
      );
      return data.deleteSubCategory;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
