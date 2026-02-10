import type { SubCategory } from "../subcategory/types";

export interface Category {
  id: string;
  name: string;
  subcategories?: SubCategory[];
  createdAt: string;
}

export interface CreateCategoryInput {
  name: string;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
}

export interface CategoryFiltersInput {
  name?: string;
}
