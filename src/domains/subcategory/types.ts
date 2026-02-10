import type { Category } from "../category/types";

export interface SubCategory {
  id: string;
  name: string;
  categories?: Category[];
  createdAt: string;
}

export interface CreateSubCategoryInput {
  name: string;
  categoryId: string;
}

export interface UpdateSubCategoryInput {
  id: string;
  name?: string;
  categoryId?: string;
}

export interface SubCategoryFiltersInput {
  name?: string;
  categoryId?: string;
}
